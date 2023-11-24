// package imports
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
// files imports
import mongoClient from './config/db.js';

// dotenv config
dotenv.config();

// connect to Database
mongoClient();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`server running in ${process.env.MODE} mode on port ${PORT}`);
});

export default app;
