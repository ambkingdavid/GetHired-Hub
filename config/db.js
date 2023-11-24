import mongoose from 'mongoose';

const mongoClient = async () => {
  try {
    const DBURL = process.env.DATABASE_URL || process.env.DATABASE_URL_LOCAL;
    const connection = await mongoose.connect(DBURL);
    console.log(`Connected to MongeDb ${mongoose.connection.host}`)
  } catch (err) {
    console.log(`DATABASE connection error: ${err}`);
  }
}

export default mongoClient;
