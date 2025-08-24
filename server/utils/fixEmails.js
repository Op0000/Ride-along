import mongoose from 'mongoose';
import User from '../models/User.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixUserEmails = async () => {
  try {
    // Find all users with the placeholder email
    const usersWithPlaceholderEmail = await User.find({ 
      email: 'user@example.com' 
    });

    console.log(`Found ${usersWithPlaceholderEmail.length} users with placeholder email`);

    if (usersWithPlaceholderEmail.length === 0) {
      console.log('✅ No users found with placeholder email. All emails are properly set.');
      return;
    }

    console.log('📋 Users with placeholder emails:');
    usersWithPlaceholderEmail.forEach(user => {
      console.log(`- UID: ${user.uid}, Name: ${user.name}, Email: ${user.email}`);
    });

    console.log('\n⚠️  These users need to be manually corrected.');
    console.log('   The system will now prevent new users from being created with placeholder emails.');
    console.log('   Existing users with placeholder emails should update their profiles with correct emails.');

    // Optionally, we could delete these incomplete user records
    // But it's safer to let admins handle this manually
    
  } catch (error) {
    console.error('❌ Error fixing user emails:', error);
  }
};

const main = async () => {
  await connectDB();
  await fixUserEmails();
  await mongoose.connection.close();
  console.log('✅ Email fix operation completed');
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fixUserEmails };