// package imports
import 'express-async-errors';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
// files imports
import errorHandler from './middlewares/errorhandler.js';
import mongoClient from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// dotenv config
dotenv.config();

// connect to Database
mongoClient();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`server running in ${process.env.MODE} mode on port ${PORT}`);
});

export default app;
