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
      const { name, email, subject, message } = JSON.parse(event.body);

      if (!name || !email || !message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Name, email, and message are required." })
        };
      }

      const newMessage = await ContactMessageModel.create({
        name,
        email,
        subject: subject || "",
        message
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: "Message sent successfully!", data: newMessage })
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
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
