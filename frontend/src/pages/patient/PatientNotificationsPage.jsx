import React, { useState, useEffect } from 'react';
import { 
  Bell, Calendar, FileText, CheckCircle2, AlertCircle, 
  Info, Check, Clock, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import patientApi from '../../services/patientApi';

export default function PatientNotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError(err.message || 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await patientApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium text-sm animate-pulse">Loading study notifications...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Notifications & Alerts</h1>
          <p className="text-stone-600 text-sm mt-1">
            Stay updated with clinic appointment reminders, questionnaires, and research updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full self-start">
            {unreadCount} Unread Notifications
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Bell className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-700 text-sm">No Notifications</h3>
            <p className="text-xs text-stone-400">You are all caught up with your study notices.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {notifications.map((n) => (
              <div 
                key={n.id}
                className={`py-4 px-3 rounded-xl transition flex items-start gap-4 ${
                  !n.isRead ? 'bg-amber-50/40 border-l-4 border-amber-500 pl-4' : 'hover:bg-stone-50'
                }`}
              >
                <div className="mt-1">
                  {n.type === 'VISIT_REMINDER' ? (
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                  ) : n.type === 'QUESTIONNAIRE' ? (
                    <div className="w-8 h-8 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                      <Info className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-stone-800 text-sm">{n.title}</h4>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{n.message}</p>

                  <div className="pt-2 flex items-center justify-between">
                    {n.link ? (
                      <Link to={n.link} className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1">
                        Go to Action <ChevronRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span></span>
                    )}

                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="text-[11px] text-stone-500 hover:text-stone-800 font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
