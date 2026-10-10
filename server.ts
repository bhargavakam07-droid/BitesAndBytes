import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { apiRouter } from './server/routes/index.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', apiRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Continuum Health',
    timestamp: new Date().toISOString(),
  });
});

// Serve the built frontend (npm run build copies dist -> public)
const publicDir = path.resolve(process.cwd(), 'public');
app.use(express.static(publicDir));

// Fallback for frontend routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

export default app;

// Run the local server outside Vercel.
if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT || 3000);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}