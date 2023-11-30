import mongoose from 'mongoose';

const mongoClient = async () => {
  try {
    const DBURL = process.env.MONGODB_URL || process.env.MONGODB_URL_LOCAL;
    const connection = await mongoose.connect(DBURL);
    console.log(`Connected to MongeDb ${mongoose.connection.host}`)
  } catch (err) {
    console.log(`DATABASE connection error: ${err}`);
  }
}

export default mongoClient;
