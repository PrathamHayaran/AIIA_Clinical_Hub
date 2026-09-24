import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, Phone, Mail, Clock, MapPin, 
  ShieldCheck, AlertTriangle, User, CheckCircle2, AlertCircle
} from 'lucide-react';
import patientApi from '../../services/patientApi';

export default function PatientStudyTeamPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getMessages();
      setMessages(res.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError(err.message || 'Unable to load study messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await patientApi.sendMessage(newMessage.trim());
      setNewMessage('');
      // Refresh messages
      const res = await patientApi.getMessages();
      setMessages(res.messages || []);
    } catch (err) {
      alert('Error sending message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium text-sm animate-pulse">Loading study team communications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Study Team & Clinical Communication</h1>
        <p className="text-stone-600 text-sm mt-1">
          Directly consult with your Clinical Research Coordinator and Principal Investigator regarding your study participation.
        </p>
      </div>

      {/* Grid: Contacts on Left, Chat Thread on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Contact Profiles & Site Desk */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
            <h3 className="font-bold text-stone-800 text-base">Key Study Personnel</h3>

            {/* PI */}
            <div className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center font-bold text-sm">
                  PN
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Dr. Priya Nair, MD (Ayu)</h4>
                  <p className="text-xs text-stone-500">Principal Investigator</p>
                </div>
              </div>
              <p className="text-[11px] text-stone-600">Head, Department of Kayachikitsa & Clinical Investigation, AIIA</p>
            </div>

            {/* CRC */}
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                  SV
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Nurse Sunita Verma</h4>
                  <p className="text-xs text-stone-500">Clinical Research Coordinator</p>
                </div>
              </div>
              <p className="text-[11px] text-teal-800 font-medium">Primary point of contact for dose questions & appointments</p>
            </div>

            {/* Site Info */}
            <div className="pt-2 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Room 204, Clinical Trial OPD, AIIA New Delhi</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Monday – Saturday: 09:00 AM – 04:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <a href="tel:+911126950401" className="text-teal-700 font-bold hover:underline">
                  +91-11-26950401 (Ext. 304)
                </a>
              </div>
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
            <h4 className="font-bold flex items-center gap-1 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Non-Emergency Messaging Notice
            </h4>
            <p className="leading-relaxed">
              In-app messages are reviewed during regular clinic hours. In acute emergencies, do not wait for a chat response; call <strong>112</strong> or visit the nearest emergency room immediately.
            </p>
          </div>

        </div>

        {/* Right 2 Cols: Two-Way Message Conversation */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          
          {/* Thread Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50 to-teal-50/50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Study Consultation Channel</h3>
                <p className="text-xs text-stone-500">Secure, encrypted communications with AIIA clinical team</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ● Online Support
            </span>
          </div>

          {/* Message History List */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-stone-50/30">
            {messages.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-xs">
                No previous messages. Start a conversation with your research coordinator below.
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderRole === 'PATIENT';

                return (
                  <div 
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-1 px-1">
                      <span className="font-bold text-stone-700">{m.senderName}</span>
                      <span>•</span>
                      <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed shadow-xs ${
                      isMe 
                        ? 'bg-teal-700 text-white rounded-tr-xs' 
                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs'
                    }`}>
                      {m.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Compose Box */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-stone-200 flex items-center gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your question for the study coordinator..."
              className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
