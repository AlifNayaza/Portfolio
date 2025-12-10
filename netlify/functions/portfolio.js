const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

const PortfolioSchema = new mongoose.Schema({
  identifier: { type: String, default: 'main_portfolio' },
  data: { type: Object, required: true }
});

let PortfolioModel;
try { PortfolioModel = mongoose.model('Portfolio'); } 
catch (e) { PortfolioModel = mongoose.model('Portfolio', PortfolioSchema); }

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

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    await connectToDatabase();

    // GET: Public Read
    if (event.httpMethod === 'GET') {
      let doc = await PortfolioModel.findOne({ identifier: 'main_portfolio' });
      if (!doc) {
        // Initial Dummy Data
        doc = await PortfolioModel.create({
          identifier: 'main_portfolio',
          data: {
             home: { title: "Creative Developer", subtitle: "Building digital experiences." },
             profile: { about: "Hello World", avatarUrl: "" },
             skills: ["React", "Node.js"],
             projects: [],
             contact: { email: "test@example.com" }
          }
        });
      }
      return { statusCode: 200, headers, body: JSON.stringify(doc.data) };
    }

    // POST: Admin Write
    if (event.httpMethod === 'POST') {
      const clientSecret = event.headers.authorization;
      if (clientSecret !== ADMIN_SECRET) {
        return { statusCode: 401, headers, body: JSON.stringify({ message: "Unauthorized" }) };
      }

      const newData = JSON.parse(event.body);
      const updated = await PortfolioModel.findOneAndUpdate(
        { identifier: 'main_portfolio' },
        { data: newData },
        { new: true, upsert: true }
      );
      return { statusCode: 200, headers, body: JSON.stringify(updated.data) };
    }

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};