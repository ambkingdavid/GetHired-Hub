//securty packges
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// package imports
import 'express-async-errors';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session'
import cookieParser from 'cookie-parser';
import SessionStore from 'connect-mongo';
import bodyParser from "body-parser";
// files imports
import errorHandler from './middlewares/errorhandler.js';
import mongoClient from './config/db.js';
// API DOcumenATion
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
// routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js'

// dotenv config
dotenv.config();

// connect to Database
await mongoClient();

// Swagger api config
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Get Hired Hub',
      description: "A hub to land opportunities",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
      {
        url: "https://gethired-gga2.onrender.com",
      }
    ],
  },
  apis: ['./swaggerDoc/*','./routes/*.js'],
};

const spec = swaggerDoc(options);

const app = express();

//middelwares
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: SessionStore.create({
      mongoUrl: process.env.SESSION_STORAGE,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

app.use(errorHandler);

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`server running in ${process.env.MODE} mode on port ${PORT}`);
});

export default app;
