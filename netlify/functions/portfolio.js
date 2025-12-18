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

// Helper function untuk normalisasi data dari database
const normalizeData = (data) => {
  if (!data) return null;

  // Migrasi 'music' ke 'soundtrack' jika belum dilakukan
  if (data.music && !data.soundtrack) {
    data.soundtrack = Array.isArray(data.music) ? data.music : [data.music];
    delete data.music;
  }

  // Pastikan soundtrack adalah array
  if (data.soundtrack && !Array.isArray(data.soundtrack)) {
    data.soundtrack = [data.soundtrack];
  }

  // Pastikan semua field yang dibutuhkan ada dengan default values
  const normalized = {
    home: data.home || { logoName: "Author", headline: "The Journey Begins", subtitle: "Welcome." },
    profile: data.profile || { about: "", avatarUrl: "" },
    soundtrack: data.soundtrack || [],
    skills: data.skills || [],
    projects: data.projects || [],
    experience: data.experience || [],
    contact: data.contact || { email: "", linkedin: "", github: "", instagram: "", twitter: "" }
  };

  // Pastikan contact memiliki semua field
  normalized.contact = {
    email: normalized.contact.email || "",
    linkedin: normalized.contact.linkedin || "",
    github: normalized.contact.github || "",
    instagram: normalized.contact.instagram || "",
    twitter: normalized.contact.twitter || ""
  };

  // Pastikan home memiliki semua field
  normalized.home = {
    logoName: normalized.home.logoName || "Author",
    headline: normalized.home.headline || "The Journey Begins",
    subtitle: normalized.home.subtitle || "Welcome."
  };

  // Pastikan profile memiliki semua field
  normalized.profile = {
    about: normalized.profile.about || "",
    avatarUrl: normalized.profile.avatarUrl || ""
  };

  // === NORMALISASI PROJECTS DENGAN TECHNOLOGIES ===
  // Pastikan setiap project memiliki field technologies (array)
  if (normalized.projects && Array.isArray(normalized.projects)) {
    normalized.projects = normalized.projects.map(project => ({
      name: project.name || "",
      description: project.description || "",
      image: project.image || "",
      link: project.link || "",
      technologies: Array.isArray(project.technologies) ? project.technologies : []
    }));
  }

  return normalized;
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

    // GET: Public Read - dengan normalisasi data
    if (event.httpMethod === 'GET') {
      console.log('📖 GET: Fetching portfolio data...');
      
      let doc = await PortfolioModel.findOne({ identifier: 'main_portfolio' });
      
      if (!doc) {
        console.log('⚠️ No data found in database, creating default data...');
        // Data Dummy Awal (dengan technologies)
        doc = await PortfolioModel.create({
          identifier: 'main_portfolio',
          data: {
            home: { logoName: "Author", headline: "The Journey Begins", subtitle: "Welcome." },
            profile: { about: "", avatarUrl: "" },
            soundtrack: [],
            skills: [], 
            projects: [], 
            experience: [],
            contact: { email: "", linkedin: "", github: "", instagram: "", twitter: "" }
          }
        });
        console.log('✅ Default data created');
      } else {
        console.log('✅ Data found in database');
        console.log('Raw data structure:', Object.keys(doc.data));
      }

      // Normalisasi data sebelum dikirim ke frontend
      const normalizedData = normalizeData(doc.data);
      console.log('✅ Data normalized and ready to send');
      console.log('Normalized structure:', Object.keys(normalizedData));
      
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify(normalizedData) 
      };
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
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ message: "Unauthorized: Invalid credentials" }) 
        };
      }

      // Password valid, lanjutkan update
      console.log('✅ Valid credentials, updating data...');
      const newData = JSON.parse(event.body);

      // Normalisasi data sebelum disimpan
      const normalizedData = normalizeData(newData);
      console.log('Data to save:', Object.keys(normalizedData));
      console.log('Projects count:', normalizedData.projects?.length || 0);
      
      // Log technologies untuk debugging
      if (normalizedData.projects && normalizedData.projects.length > 0) {
        normalizedData.projects.forEach((proj, idx) => {
          console.log(`Project ${idx} technologies:`, proj.technologies || []);
        });
      }

      const updated = await PortfolioModel.findOneAndUpdate(
        { identifier: 'main_portfolio' },
        { data: normalizedData },
        { new: true, upsert: true }
      );
      
      console.log('✅ Data updated successfully');
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify(normalizedData) 
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
      body: JSON.stringify({ error: error.message, stack: error.stack }) 
    };
  }
};