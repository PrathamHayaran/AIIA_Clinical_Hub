let ioInstance = null;

function setupSocketIO(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Real-Time CTMS Stream: ${socket.id}`);

    // Heartbeat for live telemetry & latency measurement
    socket.on('heartbeat', (clientTimestamp, callback) => {
      if (typeof callback === 'function') {
        callback({
          serverTime: Date.now(),
          status: 'healthy',
          connectedClients: io.engine ? io.engine.clientsCount : 1,
        });
      }
    });

    socket.on('join_trial', (trialId) => {
      socket.join(`trial_${trialId}`);
      console.log(`Client ${socket.id} joined room trial_${trialId}`);
    });

    socket.on('leave_trial', (trialId) => {
      socket.leave(`trial_${trialId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected (${reason}): ${socket.id}`);
    });
  });
}

function getSocketIO() {
  return ioInstance;
}

function broadcastEvent(eventName, payload) {
  if (ioInstance) {
    ioInstance.emit(eventName, payload);
  }
}

module.exports = {
  setupSocketIO,
  getSocketIO,
  broadcastEvent,
};
