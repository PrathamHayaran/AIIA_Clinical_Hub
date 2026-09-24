require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { setupSocketIO } = require('./sockets/socketHandler');
const alertEngine = require('./services/alertEngine');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});  

setupSocketIO(io);
alertEngine.setSocketIO(io);

// Security & Parsing Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting on API endpoints
app.use('/api', apiLimiter);

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

// 404 Handler for undefined API routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint "${req.originalUrl}" does not exist on this server.`,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`\n========================================================`);
  console.log(`🏥 AIIA Clinical Trial Hub Server Started`);
  console.log(`🚀 REST API: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSockets: Active for real-time CTMS synchronization`);
  console.log(`🛡️ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================================\n`);

  // Run initial trial health evaluation
  try {
    const alerts = await alertEngine.evaluateAllTrials();
    console.log(`🔍 Initial trial evaluation complete: ${alerts.length} active alerts processed.`);
  } catch (err) {
    console.warn('Initial trial evaluation skipped (database may need seeding).');
  }
});

module.exports = { app, server };
