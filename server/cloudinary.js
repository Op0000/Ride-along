
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Validate environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing Cloudinary environment variables:', missingVars.join(', '));
  console.error('Please set these in your Replit Secrets or .env file');
  process.exit(1);
}

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  // Test the configuration
  console.log('✅ Cloudinary configured successfully');
} catch (error) {
  console.error('❌ Cloudinary configuration failed:', error.message);
  process.exit(1);
}

export default cloudinary;
