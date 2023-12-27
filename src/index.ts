import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import medicationRoutes from './routes/medication.route';
import reminderRoutes from './routes/reminder.route';
import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
import swaggerUi from 'swagger-ui-express';
import { startReminderScheduler } from './utils/reminderScheduler';
import errorHandler from './middlewares/error';
import morgan from 'morgan';
import cors from 'cors';


dotenv.config({ path: "./config/config.env" });
require("./db");

const app = express();
const serverPort = process.env.PORT || 2700;
const testPort = 4000;

// Middleware
app.use(express.json());

// Start the reminder scheduler
startReminderScheduler();

// Routes
app.use("/api/v1/medications", medicationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/reminders", reminderRoutes) 

app.use(errorHandler);

const port = process.env.NODE_ENV === "test" ? testPort : serverPort;

const server = app.listen(port, () => {
  console.log(`🛡  Server listening on port: ${port} 🛡`);
});

export { app, server };