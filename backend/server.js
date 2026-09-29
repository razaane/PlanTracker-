import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import taskRoutes from './routes/tasks.js';
import slotRoutes from './routes/slots.js';
import jobRoutes from './routes/jobs.js';
import analyticsRoutes from './routes/analytics.js';
import aiRoutes from './routes/ai.js';
import noteRoutes from './routes/notes.js';
import projectRoutes from './routes/projects.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/projects', projectRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'PlanTracker MERN Backend',
    timestamp: new Date().toISOString()
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Serveur PlanTracker opérationnel sur http://localhost:${PORT}`);
    console.log(`📡 Endpoints API : http://localhost:${PORT}/api/...`);
  });
};

startServer();
