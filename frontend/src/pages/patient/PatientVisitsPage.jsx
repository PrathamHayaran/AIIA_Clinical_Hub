import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, CheckCircle2, AlertCircle, FileText, 
  HelpCircle, ChevronRight, Phone, Stethoscope, Sparkles, Filter,
  AlertTriangle, ArrowRight, User, Check, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import patientApi from '../../services/patientApi';

export default function PatientVisitsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState('UPCOMING'); // UPCOMING by default!

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getVisits();
      setVisits(res.visits || res.allVisits || []);
    } catch (err) {
      console.error('Failed to load visits:', err);
      setError(err.message || 'Unable to load scheduled visits.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium text-sm animate-pulse">Loading clinic appointment schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center max-w-xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900 mb-1">Appointment Schedule Unavailable</h3>
        <p className="text-sm text-red-700 mb-4">{error}</p>
        <button onClick={fetchVisits} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl">
          Try Again
        </button>
      </div>
    );
  }

  const upcomingVisits = visits.filter(v => v.status === 'UPCOMING' || v.status === 'SCHEDULED');
  const nextVisit = upcomingVisits.find(v => v.status === 'UPCOMING') || upcomingVisits[0];
  const remainingUpcoming = upcomingVisits.filter(v => v.id !== nextVisit?.id);
  const completedVisits = visits.filter(v => v.status === 'COMPLETED');

  const filteredVisits = filter === 'UPCOMING' 
    ? upcomingVisits 
    : filter === 'COMPLETED' 
      ? completedVisits 
      : visits;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* 1. Top Header & Section Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Clinical Visits & Appointments</h1>
          </div>
          <p className="text-stone-600 text-sm mt-1">
            Review your upcoming evaluation schedule, fasting instructions, and past clinic records.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setFilter('UPCOMING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              filter === 'UPCOMING' ? 'bg-[#608c7d] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming & Pending ({upcomingVisits.length})</span>
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'ALL' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            All ({visits.length})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'COMPLETED' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Completed ({completedVisits.length})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP PROMINENT SECTION: IMMINENT NEXT VISIT HERO BANNER */}
      {/* ========================================================================= */}
      {nextVisit && (
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-sage-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-teal-700/60">
          <div className="absolute right-0 top-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-200 border border-amber-400/30 rounded-full text-xs font-bold font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  NEXT UPCOMING CLINIC VISIT
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-teal-100">
                  Visit {nextVisit.visitNumber || 5} of {visits.length}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {nextVisit.visitName}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-sm text-teal-100 font-medium pt-1">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                  <Calendar className="w-4 h-4 text-teal-300" />
                  <span className="font-bold text-white">
                    {new Date(nextVisit.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                  <Clock className="w-4 h-4 text-teal-300" />
                  <span>{nextVisit.timeSlot || '10:00 AM - 11:30 AM'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                  <MapPin className="w-4 h-4 text-teal-300" />
                  <span>{nextVisit.location || 'AIIA OPD Room 204, 2nd Floor'}</span>
                </div>
              </div>
            </div>

            {/* Preparation Checklist Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 lg:max-w-xs w-full text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-200 uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Visit Preparation
                </span>
                <span className="text-[10px] text-teal-200 font-semibold">Mandatory</span>
              </div>
              
              <ul className="space-y-1.5 text-teal-50">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                  <span><strong>Fasting required 8 hours prior</strong> for safety blood biochemistry panel.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                  <span>Bring remaining medicine bottle for pill compliance count.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                  <span>Carry AIIA participant card (`AIIA-PAT-1001`).</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Action Footer Strip */}
          <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between flex-wrap gap-3 text-xs text-teal-200">
            <span className="italic">
              Clinician: Dr. Priya Nair, MD (Ayu) • Kayachikitsa OPD
            </span>
            <div className="flex items-center gap-2">
              <Link
                to="/patient/study-team"
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold transition flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                Contact Clinic Coordinator
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PENDING & SCHEDULED UPCOMING VISITS GRID (ON TOP) */}
      {/* ========================================================================= */}
      {remainingUpcoming.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Further Scheduled Milestone Visits ({remainingUpcoming.length})
            </h3>
            <span className="text-xs text-stone-500 font-medium">Future protocol checkpoints</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remainingUpcoming.map((v, idx) => (
              <div 
                key={v.id || idx}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-100">
                      {v.visitNumber || idx + 6}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{v.visitName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        Scheduled Milestone
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-stone-700">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {new Date(v.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {v.timeSlot && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {v.timeSlot}
                    </span>
                  )}
                  {v.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {v.location}
                    </span>
                  )}
                </div>

                {v.notes && (
                  <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    "{v.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. COMPLETED VISITS HISTORY SECTION (BELOW UPCOMING) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Completed Clinical Visits History ({completedVisits.length})
            </h3>
            <p className="text-xs text-stone-500">Verified clinical milestone check-ins recorded in your electronic trial history</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {Math.round((completedVisits.length / visits.length) * 100)}% Protocol Progress
          </span>
        </div>

        {completedVisits.length === 0 ? (
          <p className="text-sm text-stone-500 py-4 text-center">No completed visits recorded yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {completedVisits.map((v, idx) => (
              <div key={v.id || idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-800 text-sm">{v.visitName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Verified Complete
                      </span>
                    </div>
                    {v.notes && (
                      <p className="text-xs text-stone-500 mt-0.5 italic">"{v.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-stone-500 self-end sm:self-center font-medium">
                  <span className="flex items-center gap-1 text-stone-700">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {new Date(v.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span>{v.location || 'OPD 204'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Help Footer */}
      <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-teal-600 shrink-0" />
          <p>Need to reschedule an upcoming appointment? Please contact your study coordinator at least 24 hours in advance.</p>
        </div>
        <Link to="/patient/study-team" className="text-teal-700 hover:text-teal-900 font-bold shrink-0">
          Message Study Team →
        </Link>
      </div>

    </div>
  );
}
