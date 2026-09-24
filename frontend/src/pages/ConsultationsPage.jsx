import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  MessageSquare, Send, Search, User, Filter, CheckCircle2, 
  Clock, ShieldAlert, Pill, Calendar, Phone, Sparkles, AlertCircle,
  RefreshCw, ChevronRight, Stethoscope, HeartPulse, CheckCheck, Info,
  Flame, Wind, Droplets
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import consultationApi from '../services/consultationApi';

export const ConsultationsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get('patientId');

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || null);
  const [threadData, setThreadData] = useState(null);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // ALL, UNREAD, AYU001
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchPatientsList();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      fetchPatientThread(selectedPatientId);
    }
  }, [selectedPatientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadData?.messages]);

  const fetchPatientsList = async () => {
    try {
      setLoadingPatients(true);
      const data = await consultationApi.getPatients();
      const list = data || [];
      setPatients(list);
      
      // Auto-select first patient if none selected or if previously selected is invalid
      if (list.length > 0 && (!selectedPatientId || !list.find(p => p.id === selectedPatientId))) {
        setSelectedPatientId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load consultation patients:', err);
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchPatientThread = async (patientId) => {
    try {
      setLoadingThread(true);
      const data = await consultationApi.getPatientThread(patientId);
      setThreadData(data);
      
      // Update unread count in patients list locally
      setPatients(prev => prev.map(p => p.id === patientId ? { ...p, unreadCount: 0 } : p));
    } catch (err) {
      console.error('Failed to load thread:', err);
    } finally {
      setLoadingThread(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !selectedPatientId) return;

    try {
      setSending(true);
      const res = await consultationApi.sendMessage(selectedPatientId, newMessage.trim());
      setNewMessage('');
      
      // Append message to active thread
      if (threadData) {
        setThreadData(prev => ({
          ...prev,
          messages: [...(prev?.messages || []), res.data || res],
        }));
      }

      // Update patient's lastMessage in sidebar list
      setPatients(prev => prev.map(p => {
        if (p.id === selectedPatientId) {
          return {
            ...p,
            lastMessage: {
              text: newMessage.trim(),
              senderRole: 'STUDY_TEAM',
              senderName: user?.name || 'Study Doctor',
              createdAt: new Date().toISOString(),
            },
          };
        }
        return p;
      }));
    } catch (err) {
      alert('Error delivering message: ' + (err.message || 'Network error'));
    } finally {
      setSending(false);
    }
  };

  const handleApplyPreset = (text) => {
    setNewMessage(text);
  };

  // Filtered patients list
  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.syntheticPatientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientDisplayId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.trial?.trialId?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'UNREAD') return p.unreadCount > 0 || p.totalMessages > 0;
    if (filterMode === 'AYU001') return p.trial?.trialId === 'AYU-001';

    return true;
  });

  const selectedPatientSummary = patients.find(p => p.id === selectedPatientId);
  const activePatient = threadData?.patient || selectedPatientSummary;

  const quickPresets = [
    "📅 Reminder: Your scheduled clinical visit is tomorrow at AIIA OPD Room 204. Fasting is required for 8 hours prior.",
    "💊 Medication Check: Please ensure you continue taking 1 capsule twice daily with warm milk/water post-meals.",
    "🛡️ Safety Update: Your reported symptom has been reviewed by the Principal Investigator. No adverse interaction detected; stay hydrated.",
    "📋 Questionnaire: Please complete the pending Hamilton Anxiety Scale (HAM-A) assessment in your patient portal before your visit.",
  ];

  return (
    <div className="space-y-4 animate-fadeIn max-w-7xl mx-auto flex flex-col h-[calc(100vh-120px)] min-h-[650px]">
      
      {/* 1. Header Banner (Compact & Fixed) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#608c7d]/20 text-[#608c7d] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">Participant Clinical Consultations</h1>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Two-way encrypted communication channel with enrolled trial participants across all active study cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchPatientsList();
              if (selectedPatientId) fetchPatientThread(selectedPatientId);
            }}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Refresh Feed
          </button>
        </div>
      </div>

      {/* 2. Main Two-Panel Chat Container (Strict Fixed Height) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft-xl overflow-hidden flex flex-col lg:flex-row flex-1 min-h-0">
        
        {/* Left Col: Participants Directory (Fixed Width with internal scroll) */}
        <div className="w-full lg:w-96 lg:min-w-[340px] lg:max-w-[380px] border-r border-slate-200/80 flex flex-col h-full bg-[#fcfdfd] shrink-0 min-h-0">
          
          {/* Search & Filter Bar (Sticky Top) */}
          <div className="p-3.5 border-b border-slate-200/80 space-y-2.5 bg-white shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, ID, or trial..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#608c7d] focus:border-[#608c7d] outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold pb-0.5">
              <button
                onClick={() => setFilterMode('ALL')}
                className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
                  filterMode === 'ALL' ? 'bg-[#608c7d] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({patients.length})
              </button>
              <button
                onClick={() => setFilterMode('UNREAD')}
                className={`px-2.5 py-1 rounded-lg transition shrink-0 flex items-center gap-1 ${
                  filterMode === 'UNREAD' ? 'bg-amber-500 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Active Threads
                {patients.filter(p => p.unreadCount > 0 || p.totalMessages > 0).length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-amber-700 text-[10px] font-black flex items-center justify-center">
                    {patients.filter(p => p.unreadCount > 0 || p.totalMessages > 0).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilterMode('AYU001')}
                className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
                  filterMode === 'AYU001' ? 'bg-[#608c7d] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Trial AYU-001
              </button>
            </div>
          </div>

          {/* Patients List (Scrollable Area) */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100">
            {loadingPatients ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-8 h-8 border-3 border-[#608c7d]/20 border-t-[#608c7d] rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400 font-medium">Loading participants directory...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No participants found matching filter.
              </div>
            ) : (
              filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                const hasUnread = p.unreadCount > 0;
                const hasMessages = p.totalMessages > 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`p-3 transition cursor-pointer flex items-start gap-3 relative ${
                      isSelected 
                        ? 'bg-[#f4f8f6] border-l-4 border-[#608c7d]' 
                        : hasUnread 
                          ? 'bg-amber-50/50 hover:bg-amber-50/80 border-l-4 border-amber-500' 
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs text-white ${
                        hasMessages ? 'bg-gradient-to-tr from-[#608c7d] to-[#7aa898]' : 'bg-slate-400'
                      }`}>
                        {p.name?.slice(0, 2).toUpperCase() || 'P'}
                      </div>
                      {p.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                          {p.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs text-slate-900 truncate font-display">
                          {p.name}
                        </h4>
                        {p.lastMessage?.createdAt && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(p.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        <span className="text-[#608c7d] font-bold">{p.patientDisplayId}</span>
                        <span>•</span>
                        <span>{p.trial?.trialId || 'AYU-001'}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 truncate mt-0.5">
                        {p.lastMessage ? (
                          <>
                            <span className="font-semibold text-slate-700">
                              {p.lastMessage.senderRole === 'PATIENT' ? 'Patient: ' : 'You: '}
                            </span>
                            {p.lastMessage.text}
                          </>
                        ) : (
                          <span className="text-slate-400 italic">No previous messages</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Col: Consultation Conversation Pane (Flexible with internal scroll) */}
        <div className="flex-1 min-w-0 flex flex-col h-full bg-white relative min-h-0">
          
          {selectedPatientId ? (
            <>
              {/* Active Patient Top Banner (Fixed Top) */}
              <div className="p-3.5 border-b border-slate-200/80 bg-white flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#608c7d] to-[#7aa898] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    {activePatient?.name?.slice(0, 2).toUpperCase() || 'P'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900 truncate font-display">
                        {activePatient?.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#608c7d]/10 text-[#608c7d] border border-[#608c7d]/20">
                        {activePatient?.patientDisplayId || activePatient?.syntheticPatientId}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                        Dosha: {activePatient?.doshaPrakriti || 'Vata-Pitta'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      Protocol: <strong>{threadData?.trial?.title || 'AYU-001 (Ashwagandha WS-35)'}</strong> • Site: {threadData?.site?.name || 'AIIA Main OPD'}
                    </p>
                  </div>
                </div>

                {/* Quick patient telemetry badges */}
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Adherence</span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      {activePatient?.adherenceRate || 94}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Safety Status</span>
                    <span className="text-xs font-bold text-slate-700">
                      {threadData?.safetyReportsCount > 0 ? `${threadData.safetyReportsCount} Reports` : 'Optimal (0 SAE)'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPatientDetails(!showPatientDetails)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                    title="Toggle Patient Clinical Context"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Collapsible Patient Clinical Context Strip */}
              {showPatientDetails && (
                <div className="px-4 py-2 bg-[#f4f8f6] border-b border-slate-200/80 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3 shrink-0 animate-fadeIn">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3.5 h-3.5 text-[#608c7d]" />
                      {activePatient?.age || 34} Yrs / {activePatient?.gender || 'Female'}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Pill className="w-3.5 h-3.5 text-[#608c7d]" />
                      WS-35 (500mg BID)
                    </span>
                    {threadData?.nextVisit && (
                      <span className="flex items-center gap-1 font-medium text-teal-800">
                        <Calendar className="w-3.5 h-3.5 text-[#608c7d]" />
                        Next: {new Date(threadData.nextVisit.scheduledDate).toLocaleDateString()} ({threadData.nextVisit.visitName})
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    Enrolled: {activePatient?.enrolledDate ? new Date(activePatient.enrolledDate).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              )}

              {/* Messages Thread (Scrollable Area) */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#fcfdfd]">
                {loadingThread ? (
                  <div className="p-12 text-center space-y-2">
                    <div className="w-8 h-8 border-3 border-[#608c7d]/20 border-t-[#608c7d] rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-slate-400">Retrieving secure consultation transcript...</p>
                  </div>
                ) : (threadData?.messages || []).length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-600">No previous messages with this participant.</p>
                    <p className="text-[11px]">Send clinical guidance, visit reminders, or answer patient inquiries below.</p>
                  </div>
                ) : (
                  (threadData?.messages || []).map((m) => {
                    const isStaff = m.senderRole === 'STUDY_TEAM';

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                          <span className="font-bold text-slate-700">
                            {isStaff ? `${m.senderName} (Study Team)` : `${activePatient?.name} (Participant)`}
                          </span>
                          <span>•</span>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed shadow-xs ${
                          isStaff
                            ? 'bg-[#608c7d] text-white rounded-tr-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                        }`}>
                          {m.message}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Clinical Quick Presets Row (Fixed Bottom) */}
              <div className="px-4 pt-2 pb-1 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
                <span className="text-slate-400 font-bold shrink-0 text-[10px] uppercase">Presets:</span>
                {quickPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#608c7d]/10 hover:text-[#608c7d] text-slate-600 font-medium whitespace-nowrap transition text-left shrink-0 text-[11px]"
                  >
                    {preset.slice(0, 32)}...
                  </button>
                ))}
              </div>

              {/* Message Composer Box (Fixed Bottom) */}
              <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-slate-200/80 flex items-center gap-2.5 shrink-0">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Type clinical response or instructions for ${activePatient?.name || 'patient'}...`}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#608c7d] focus:border-[#608c7d] outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2.5 bg-[#608c7d] hover:bg-[#527d6e] text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-700 text-base">Select a Trial Participant</h3>
              <p className="text-xs max-w-sm text-slate-500">
                Choose a participant from the left directory to review their consultation thread and send clinical instructions.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ConsultationsPage;
