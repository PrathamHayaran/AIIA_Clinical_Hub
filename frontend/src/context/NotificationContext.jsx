import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socket';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING'); // CONNECTED, RECONNECTING, DISCONNECTED
  const [latencyMs, setLatencyMs] = useState(null);
  const [lastHeartbeat, setLastHeartbeat] = useState(null);

  const heartbeatIntervalRef = useRef(null);

  const addToast = ({ title, message, type = 'info', duration = 6000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const socket = getSocket();

    const updateConnection = (status) => {
      setConnectionStatus(status);
    };

    const measureHeartbeat = () => {
      if (socket && socket.connected) {
        const start = performance.now();
        socket.emit('heartbeat', Date.now(), () => {
          const latency = Math.round(performance.now() - start);
          setLatencyMs(Math.max(1, latency));
          setLastHeartbeat(new Date());
          setConnectionStatus('CONNECTED');
        });
      }
    };

    if (socket.connected) {
      setConnectionStatus('CONNECTED');
      measureHeartbeat();
    }

    const handleConnect = () => {
      setConnectionStatus('CONNECTED');
      measureHeartbeat();
    };

    const handleDisconnect = () => {
      setConnectionStatus('DISCONNECTED');
      setLatencyMs(null);
    };

    const handleConnectError = () => {
      setConnectionStatus('RECONNECTING');
    };

    const handleNewSafetyEvent = (event) => {
      addToast({
        title: `💊 Adverse Event Logged (${event.eventCode})`,
        message: `${event.eventType} (${event.severity}) on trial.`,
        type: event.severity === 'Serious' || event.severity === 'Severe' ? 'danger' : 'warning',
      });
      setLastUpdate(Date.now());
    };

    const handleNewAlert = (alert) => {
      addToast({
        title: `🚨 ${alert.severity.toUpperCase()} ALERT: ${alert.type}`,
        message: alert.message,
        type: alert.severity === 'High' ? 'danger' : 'warning',
      });
      setLiveAlerts((prev) => [alert, ...prev]);
      setLastUpdate(Date.now());
    };

    const handleDashboardUpdate = () => {
      setLastUpdate(Date.now());
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('reconnect_attempt', () => setConnectionStatus('RECONNECTING'));
    socket.on('reconnect', handleConnect);
    socket.on('new_safety_event', handleNewSafetyEvent);
    socket.on('new_alert', handleNewAlert);
    socket.on('dashboard_update', handleDashboardUpdate);

    // Run heartbeat every 4 seconds
    heartbeatIntervalRef.current = setInterval(measureHeartbeat, 4000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('new_safety_event', handleNewSafetyEvent);
      socket.off('new_alert', handleNewAlert);
      socket.off('dashboard_update', handleDashboardUpdate);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        liveAlerts,
        lastUpdate,
        connectionStatus,
        latencyMs,
        lastHeartbeat,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
