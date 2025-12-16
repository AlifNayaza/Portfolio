const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

const PortfolioSchema = new mongoose.Schema({
  identifier: { type: String, default: 'main_portfolio' },
  data: { type: Object, required: true }
});

let PortfolioModel;
try { 
  PortfolioModel = mongoose.model('Portfolio'); 
} catch (e) { 
  PortfolioModel = mongoose.model('Portfolio', PortfolioSchema); 
}

let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI);
  isConnected = true;
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    await connectToDatabase();

    // Extract query parameter for action
    const queryParams = event.queryStringParameters || {};
    const action = queryParams.action;

    // ENDPOINT VERIFY - untuk validasi password tanpa update data
    if (action === 'verify' && event.httpMethod === 'POST') {
      const clientSecret = event.headers.authorization || event.headers.Authorization;
      
      if (!clientSecret) {
        console.log('❌ Verify: No authorization header');
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ authenticated: false, message: "No credentials provided" }) 
        };
      }

      if (!ADMIN_SECRET) {
        console.error('⚠️ ADMIN_SECRET is not set!');
        return { 
          statusCode: 500, 
          headers, 
          body: JSON.stringify({ authenticated: false, message: "Server configuration error" }) 
        };
      }

      if (clientSecret !== ADMIN_SECRET) {
        console.log('❌ Verify: Invalid password');
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ authenticated: false, message: "Invalid credentials" }) 
        };
      }

      console.log('✅ Verify: Password valid');
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify({ authenticated: true, message: "Valid credentials" }) 
      };
    }

    // GET: Public Read
    if (event.httpMethod === 'GET') {
      let doc = await PortfolioModel.findOne({ identifier: 'main_portfolio' });
      if (!doc) {
        // Data Dummy Awal
        doc = await PortfolioModel.create({
          identifier: 'main_portfolio',
          data: {
            home: { logoName: "Author", headline: "The Journey Begins", subtitle: "Welcome." },
            profile: { about: "", avatarUrl: "" },
            soundtrack: [],
            skills: [], 
            projects: [], 
            experience: [],
            contact: { email: "" }
          }
        });
      }
      return { statusCode: 200, headers, body: JSON.stringify(doc.data) };
    }

    // POST: Admin Write (DENGAN VALIDASI PASSWORD)
    if (event.httpMethod === 'POST') {
      const clientSecret = event.headers.authorization || event.headers.Authorization;
      
      // CRITICAL: Validasi password
      if (!clientSecret) {
        console.log('❌ No authorization header provided');
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ message: "Unauthorized: No credentials provided" }) 
        };
      }

      if (!ADMIN_SECRET) {
        console.error('⚠️ ADMIN_SECRET is not set in environment variables!');
        return { 
          statusCode: 500, 
          headers, 
          body: JSON.stringify({ message: "Server configuration error" }) 
        };
      }

      if (clientSecret !== ADMIN_SECRET) {
        console.log('❌ Invalid password attempt');
        console.log('Received:', clientSecret.substring(0, 5) + '...');
        console.log('Expected:', ADMIN_SECRET.substring(0, 5) + '...');
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ message: "Unauthorized: Invalid credentials" }) 
        };
      }

      // Password valid, lanjutkan update
      console.log('✅ Valid credentials, updating data...');
      const newData = JSON.parse(event.body);

      // Migrasi data 'music' ke 'soundtrack' (backward compatibility)
      if (newData.music && typeof newData.music === 'object' && newData.music.url) {
        if (!newData.soundtrack || newData.soundtrack.length === 0) {
          newData.soundtrack = [newData.music];
        }
        delete newData.music;
      }

      const updated = await PortfolioModel.findOneAndUpdate(
        { identifier: 'main_portfolio' },
        { data: newData },
        { new: true, upsert: true }
      );
      
      console.log('✅ Data updated successfully');
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify(updated.data) 
      };
    }

    // Method not allowed
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Method not allowed" })
    };

  } catch (error) {
    console.error('❌ Server error:', error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};