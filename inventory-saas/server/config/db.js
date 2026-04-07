import mongoose from 'mongoose';

/**
 * Connect to MongoDB Database
 * Uses Mongoose ORM for database operations
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB with modern connection options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
