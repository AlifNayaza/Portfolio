import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

let ContactMessageModel;
try {
  ContactMessageModel = mongoose.model('ContactMessage');
} catch (e) {
  ContactMessageModel = mongoose.model('ContactMessage', ContactMessageSchema);
}

let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing on Netlify environment settings");
  }
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
  isConnected = true;
};

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    await connectToDatabase();

    // GET METHOD (Admin retrieves messages)
    if (event.httpMethod === 'GET') {
      const clientSecret = event.headers.authorization || event.headers.Authorization;
      
      if (!clientSecret || clientSecret !== ADMIN_SECRET) {
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ message: "Unauthorized" }) 
        };
      }

      const messages = await ContactMessageModel.find().sort({ createdAt: -1 });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(messages)
      };
    }

    // POST METHOD (Public submits message)
    if (event.httpMethod === 'POST') {
      let parsed;
      try {
        parsed = JSON.parse(event.body || '{}');
      } catch {
        return { statusCode: 400, headers, body: JSON.stringify({ message: "Invalid request body." }) };
      }

      const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
      const name = clean(parsed.name, 80);
      const email = clean(parsed.email, 120);
      const subject = clean(parsed.subject, 140);
      const message = clean(parsed.message, 4000);

      if (!name || !email || !message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Name, email, and message are required." })
        };
      }

      if (!/^[^s@]+@[^s@]+.[^s@]{2,}$/.test(email)) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: "Please provide a valid email address." }) };
      }

      await ContactMessageModel.create({ name, email, subject, message });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: "Message sent successfully!" })
      };
    }

    // DELETE METHOD (Admin deletes message)
    if (event.httpMethod === 'DELETE') {
      const clientSecret = event.headers.authorization || event.headers.Authorization;
      
      if (!clientSecret || clientSecret !== ADMIN_SECRET) {
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ message: "Unauthorized" }) 
        };
      }

      const queryParams = event.queryStringParameters || {};
      const messageId = queryParams.id;

      if (!messageId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Message ID is required." })
        };
      }

      await ContactMessageModel.findByIdAndDelete(messageId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Message deleted successfully." })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Method not allowed" })
    };

  } catch (error) {
    console.error('❌ Server error:', error);
    // Don't leak internals (connection strings, stack details) to the public
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: "Internal server error" }) 
    };
  }
};
