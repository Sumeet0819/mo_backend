import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import searchRoutes from './routes/search.routes';
import streamRoutes from './routes/stream.routes';
import downloadRoutes from './routes/download.routes';
import libraryRoutes from './routes/library.routes';
import youtubeRoutes from './routes/youtube.routes';
import { requestLogger } from './middleware/logger.middleware';

import exploreRoutes from './routes/explore.routes';

const app = express();

// Middleware
app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => res.send('Mo Backend API is running'));
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/explore', exploreRoutes);
app.use('/api/v1/stream', streamRoutes);
app.use('/api/v1/downloads', downloadRoutes);
app.use('/api/v1/library', libraryRoutes);
app.use('/api/v1/youtube', youtubeRoutes);

// Error Handling (basic)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;
