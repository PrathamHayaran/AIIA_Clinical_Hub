import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to AIIA Real-Time CTMS Stream:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.warn('⚠️ Real-time WebSocket connection notice:', err.message);
    });
  }
  return socket;
};

export default getSocket;
