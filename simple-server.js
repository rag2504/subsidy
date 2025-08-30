import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.get('/api/ping', (req, res) => {
  res.json({ 
    message: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: "Subsidy API", 
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files from the built SPA
const distPath = path.join(__dirname, "dist/spa");
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
app.get('/*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  // Serve the React app for all other routes
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Simple Subsidy Server running on port ${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`🏥 Health check: http://localhost:${port}/api/ping`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});
