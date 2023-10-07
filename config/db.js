import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected to MongoDB ${conn.connection.host}`.bgMagenta.white);
  } catch(error) {
    console.log(`Error connecting to MongoDB: ${error}`.bgRed.white);
  }
}

export default connectDB;