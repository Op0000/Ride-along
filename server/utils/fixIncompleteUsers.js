import mongoose from 'mongoose';
import User from '../models/User.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixIncompleteUsers = async () => {
  try {
    // Find users without email
    const usersWithoutEmail = await User.find({ 
      $or: [
        { email: { $exists: false } },
        { email: null },
        { email: '' },
        { email: 'user@example.com' }
      ]
    });

    console.log(`📋 Found ${usersWithoutEmail.length} users with incomplete email data:`);
    
    if (usersWithoutEmail.length === 0) {
      console.log('✅ All users have valid emails!');
      return;
    }

    usersWithoutEmail.forEach((user, index) => {
      console.log(`${index + 1}. UID: ${user.uid} | Name: ${user.name} | Email: ${user.email || 'MISSING'}`);
    });

    console.log('\n🔧 Fix options:');
    console.log('1. Delete these incomplete user records (recommended for placeholder data)');
    console.log('2. Keep them and require users to re-register with proper emails');
    
    console.log('\n⚠️  These users will not be able to upload documents until they have valid emails.');
    console.log('   Consider deleting records with placeholder emails and keeping only real user data.');

    return usersWithoutEmail;
  } catch (error) {
    console.error('❌ Error finding incomplete users:', error);
  }
};

const deleteIncompleteUsers = async () => {
  try {
    const result = await User.deleteMany({ 
      $or: [
        { email: 'user@example.com' },
        { email: { $exists: false } },
        { email: null },
        { email: '' }
      ]
    });

    console.log(`🗑️  Deleted ${result.deletedCount} incomplete user records`);
    return result.deletedCount;
  } catch (error) {
    console.error('❌ Error deleting incomplete users:', error);
  }
};

const main = async () => {
  await connectDB();
  
  console.log('🔍 Checking for users with incomplete data...\n');
  const incompleteUsers = await fixIncompleteUsers();
  
  if (incompleteUsers && incompleteUsers.length > 0) {
    console.log('\n❓ Would you like to delete users with placeholder emails? (y/N)');
    console.log('   This will only delete users with "user@example.com" or missing emails.');
    
    // In a real environment, you'd want to prompt for confirmation
    // For now, just show what would be deleted
    const placeholderUsers = incompleteUsers.filter(u => 
      !u.email || u.email === '' || u.email === 'user@example.com'
    );
    
    if (placeholderUsers.length > 0) {
      console.log(`\n🗑️  ${placeholderUsers.length} users would be deleted (placeholder data)`);
      console.log('   To delete them, uncomment the deleteIncompleteUsers() call below');
      // await deleteIncompleteUsers();
    }
  }
  
  await mongoose.connection.close();
  console.log('\n✅ Database check completed');
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fixIncompleteUsers, deleteIncompleteUsers };