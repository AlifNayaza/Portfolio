import mongoose from 'mongoose';

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
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing on Netlify environment settings");
  }
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
  isConnected = true;
};

// Normalisasi data dari database
const normalizeData = (data) => {
  if (!data) return null;

  // Migrasi 'music' ke 'soundtrack'
  if (data.music && !data.soundtrack) {
    data.soundtrack = Array.isArray(data.music) ? data.music : [data.music];
    delete data.music;
  }

  // Pastikan soundtrack adalah array
  if (data.soundtrack && !Array.isArray(data.soundtrack)) {
    data.soundtrack = [data.soundtrack];
  }

  // Migrasi avatarUrl ke images array untuk multiple profile images
  if (data.profile) {
    // Jika ada avatarUrl lama, pindahkan ke images array
    if (data.profile.avatarUrl && !data.profile.images) {
      data.profile.images = [data.profile.avatarUrl];
      delete data.profile.avatarUrl;
    }
    // Pastikan images adalah array
    if (data.profile.images && !Array.isArray(data.profile.images)) {
      data.profile.images = [data.profile.images];
    }
    // Jika tidak ada images, buat array kosong
    if (!data.profile.images) {
      data.profile.images = [];
    }
  }

  // Default values dengan aboutPage
  const normalized = {
    home: data.home || { logoName: "Author", headline: "The Journey Begins", subtitle: "Welcome." },
    profile: data.profile || { 
      about: "", 
      images: [], // Ganti avatarUrl dengan images array
      socialLinks: data.profile?.socialLinks || {}
    },
    aboutPage: data.aboutPage || {  
      location: "Remote • Worldwide",
      specialization: "Full-Stack Development",
      availability: "Available for work",
      availabilityStatus: "open",
      coreValues: [
        { title: "Problem Solving", desc: "Breaking down complex challenges", icon: "🔍" },
        { title: "Clean Code", desc: "Writing maintainable code", icon: "✨" },
        { title: "Continuous Learning", desc: "Staying updated", icon: "📚" },
        { title: "User Focus", desc: "Building user-first", icon: "🎯" }
      ],
      strengths: ["Project Leadership", "Technical Strategy", "Team Collaboration", "Agile Development"]
    },
    soundtrack: data.soundtrack || [],
    skills: data.skills || [],
    projects: data.projects || [],
    experience: data.experience || [],
    contact: data.contact || { email: "", linkedin: "", github: "", instagram: "", twitter: "" }
  };

  // Pastikan semua nested objects lengkap
  normalized.contact = {
    email: normalized.contact.email || "",
    linkedin: normalized.contact.linkedin || "",
    github: normalized.contact.github || "",
    instagram: normalized.contact.instagram || "",
    twitter: normalized.contact.twitter || ""
  };

  normalized.home = {
    logoName: normalized.home.logoName || "Author",
    headline: normalized.home.headline || "The Journey Begins",
    subtitle: normalized.home.subtitle || "Welcome."
  };

  // Normalisasi profile dengan images array
  normalized.profile = {
    about: normalized.profile.about || "",
    images: Array.isArray(normalized.profile.images) ? normalized.profile.images : [],
    socialLinks: normalized.profile.socialLinks || {}
  };

  // Validasi aboutPage
  normalized.aboutPage = {
    location: normalized.aboutPage.location || "Remote • Worldwide",
    specialization: normalized.aboutPage.specialization || "Full-Stack Development",
    availability: normalized.aboutPage.availability || "Available for work",
    availabilityStatus: normalized.aboutPage.availabilityStatus || "open",
    coreValues: Array.isArray(normalized.aboutPage.coreValues) ? normalized.aboutPage.coreValues : [],
    strengths: Array.isArray(normalized.aboutPage.strengths) ? normalized.aboutPage.strengths : []
  };

  // Normalisasi projects dengan technologies
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

export const handler = async (event) => {
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

    const queryParams = event.queryStringParameters || {};
    const action = queryParams.action;

    // VERIFY ENDPOINT
    if (action === 'verify' && event.httpMethod === 'POST') {
      const clientSecret = event.headers.authorization || event.headers.Authorization;
      
      if (!clientSecret) {
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ authenticated: false, message: "No credentials provided" }) 
        };
      }

      if (!ADMIN_SECRET) {
        return { 
          statusCode: 500, 
          headers, 
          body: JSON.stringify({ authenticated: false, message: "Server configuration error" }) 
        };
      }

      if (clientSecret !== ADMIN_SECRET) {
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ authenticated: false, message: "Invalid credentials" }) 
        };
      }

      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify({ authenticated: true, message: "Valid credentials" }) 
      };
    }

    // GET ENDPOINT
    if (event.httpMethod === 'GET') {
      console.log('📖 Fetching portfolio data...');
      
      let doc = await PortfolioModel.findOne({ identifier: 'main_portfolio' });
      
      if (!doc) {
        console.log('⚠️ Creating default data...');
        doc = await PortfolioModel.create({
          identifier: 'main_portfolio',
          data: {
            home: { logoName: "Author", headline: "The Journey Begins", subtitle: "Welcome." },
            profile: { about: "", images: [] }, // Default images array
            aboutPage: {
              location: "Remote • Worldwide",
              specialization: "Full-Stack Development",
              availability: "Available for work",
              availabilityStatus: "open",
              coreValues: [],
              strengths: []
            },
            soundtrack: [],
            skills: [], 
            projects: [], 
            experience: [],
            contact: { email: "", linkedin: "", github: "", instagram: "", twitter: "" }
          }
        });
      }

      const normalizedData = normalizeData(doc.data);
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify(normalizedData) 
      };
    }

    // POST ENDPOINT
    if (event.httpMethod === 'POST') {
      const clientSecret = event.headers.authorization || event.headers.Authorization;
      
      if (!clientSecret) {
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ message: "Unauthorized: No credentials provided" }) 
        };
      }

      if (!ADMIN_SECRET) {
        return { 
          statusCode: 500, 
          headers, 
          body: JSON.stringify({ message: "Server configuration error" }) 
        };
      }

      if (clientSecret !== ADMIN_SECRET) {
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ message: "Unauthorized: Invalid credentials" }) 
        };
      }

      const newData = JSON.parse(event.body);
      const normalizedData = normalizeData(newData);
      
      const updated = await PortfolioModel.findOneAndUpdate(
        { identifier: 'main_portfolio' },
        { data: normalizedData },
        { new: true, upsert: true }
      );
      
      console.log('✅ Data saved successfully');
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify(normalizedData) 
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