import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import {
  Bell,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const NotificationsPage = () => {
  const { addToast } = useNotification();
  const [filter, setFilter] = useState('ALL');
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: '🔴 Critical Risk Trial Alert',
      message: 'Trial AYU-002 risk score escalated to 82 (Critical) due to recruitment deficit and unresolved SAE.',
      type: 'danger',
      isRead: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      link: '/trials/AYU-002',
    },
    {
      id: 'notif-2',
      title: '🟠 Ethics Expiry Approaching',
      message: 'AYU-005 IEC clearance certificate expires in 5 days. Renewal dossier submission required.',
      type: 'warning',
      isRead: false,
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      link: '/compliance',
    },
    {
      id: 'notif-3',
      title: '🤖 AI Research Copilot Analysis Ready',
      message: 'Automated AI Risk Diagnosis generated for portfolio review.',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      link: '/ai-copilot',
    },
    {
      id: 'notif-4',
      title: '🟢 Trial AYU-007 Completed',
      message: 'AYUSH-64 multicenter registry has achieved full closeout and CSR lock.',
      type: 'success',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 3600 * 1000),
      link: '/trials/AYU-007',
    },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast({ title: 'Notifications Cleared', message: 'All items marked as read.', type: 'success' });
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'CRITICAL') return n.type === 'danger' || n.type === 'warning';
    return true;
  });

  return (
    <div className="space-y-6 pb-16 font-sans bg-[#edf2ef]">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[32px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Notification & Audit Feed
              </h1>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-mono font-bold text-white">
                {notifications.filter((n) => !n.isRead).length} UNREAD
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
              Real-time system events, investigator alerts, and regulatory milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="px-5 py-2.5 bg-white text-slate-800 rounded-full font-bold text-xs font-display hover:bg-slate-100 transition-all shadow-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>MARK ALL READ</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 text-xs font-bold font-display rounded-full transition-all ${
            filter === 'ALL' ? 'bg-[#608c7d] text-white shadow-sage-glow' : 'bg-white text-slate-700 hover:bg-[#f4f8f6]'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-4 py-2 text-xs font-bold font-display rounded-full transition-all ${
            filter === 'UNREAD' ? 'bg-[#608c7d] text-white shadow-sage-glow' : 'bg-white text-slate-700 hover:bg-[#f4f8f6]'
          }`}
        >
          Unread ({notifications.filter((n) => !n.isRead).length})
        </button>

        <button
          onClick={() => setFilter('CRITICAL')}
          className={`px-4 py-2 text-xs font-bold font-display rounded-full transition-all ${
            filter === 'CRITICAL' ? 'bg-[#608c7d] text-white shadow-sage-glow' : 'bg-white text-slate-700 hover:bg-[#f4f8f6]'
          }`}
        >
          Critical Warnings
        </button>
      </div>

      {/* 3. Notification Cards */}
      <div className="space-y-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-[26px] transition-all flex items-start justify-between gap-4 border ${
              item.isRead ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-200/80 shadow-soft-lg'
            }`}
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="p-3 bg-[#f4f8f6] rounded-2xl text-[#608c7d] shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 font-display">{item.title}</h3>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#f4a28c] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                  {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>

            {!item.isRead && (
              <button
                onClick={() => handleMarkAsRead(item.id)}
                title="Mark as Read"
                className="p-2 bg-[#f4f8f6] hover:bg-[#608c7d] hover:text-white rounded-full text-slate-500 transition-colors shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
