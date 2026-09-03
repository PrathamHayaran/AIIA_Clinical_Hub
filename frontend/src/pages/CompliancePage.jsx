import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  ExternalLink,
  CheckSquare,
} from 'lucide-react';
import { AyurvedicChakraPulse3D } from '../components/3d/AyurvedicChakraPulse3D';
import { FloatingHerbalParticles } from '../components/3d/FloatingHerbalParticles';

export const CompliancePage = () => {
  const { isComplianceOfficer, isAdmin } = useAuth();
  const { addToast, lastUpdate } = useNotification();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('ethics'); // 'ethics', 'ctri', 'gcp'

  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/compliance');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load compliance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, [lastUpdate]);

  const handleUpdateEthics = async (ethicsId, renewalRequested) => {
    try {
      const res = await api.put(`/compliance/ethics/${ethicsId}`, {
        renewalRequested: !renewalRequested,
        status: !renewalRequested ? 'Renewal_Submitted' : 'Expiring_Soon',
      });
      if (res.data.success) {
        addToast({ title: 'Ethics Status Updated', message: 'IEC renewal status updated.', type: 'success' });
        fetchComplianceData();
      }
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    }
  };

  const handleUpdateChecklist = async (recordId, currentStatus) => {
    if (!isAdmin && !isComplianceOfficer) return;
    const nextStatus = currentStatus === 'Compliant' ? 'Pending_Action' : 'Compliant';

    try {
      const res = await api.put(`/compliance/records/${recordId}`, { status: nextStatus });
      if (res.data.success) {
        addToast({ title: 'Checklist Item Verified', message: `Marked as ${nextStatus}`, type: 'success' });
        fetchComplianceData();
      }
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6 bg-[#edf2ef] p-6">
        <div className="h-8 bg-slate-200 rounded-full w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-[24px] shadow-soft-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const score = data?.score || 94;
  const rating = data?.rating || 'Excellent';
  const ethics = data?.ethics || [];
  const ctri = data?.ctri || [];
  const checklists = data?.checklists || [];
  const summary = data?.summary || {};

  return (
    <div className="space-y-6 pb-16 font-sans bg-[#edf2ef]">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[32px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Regulatory Compliance & Ethics Center
          </h1>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-mono font-bold text-white">
            ICMR / GCP
          </span>
        </div>
        <p className="text-xs sm:text-sm text-white/80 font-medium mt-1 relative z-10">
          Institutional Ethics Committee (IEC) clearances, CTRI registries, and Good Clinical Practice compliance audit logs.
        </p>
      </div>

      {/* 2. Primary Score & 4 Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 3D Sacred Chakra Score Card */}
        <div className="md:col-span-4 bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-5 flex flex-col justify-between items-center text-center">
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-display">Regulatory Vitality</span>
            <span className="text-[9px] font-bold text-[#608c7d] bg-[#f4f8f6] px-2 py-0.5 rounded-full">3D Chakra</span>
          </div>

          <div className="w-full h-32 flex items-center justify-center my-1">
            <AyurvedicChakraPulse3D className="w-full h-32" primaryColor="#608c7d" accentColor="#f4a28c" />
          </div>

          <div className="flex items-center justify-between w-full pt-2 border-t border-slate-100">
            <div className="text-left">
              <span className="text-xl font-black text-slate-900 font-display">{score}%</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase">GCP Index</p>
            </div>
            <div className="px-3 py-1 bg-[#e4ede9] text-[#2b423b] font-bold text-[11px] rounded-full">
              {rating} Status
            </div>
          </div>
        </div>

        {/* 4 Summary Tiles */}
        <div className="md:col-span-8 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-display">IEC Approvals</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">{summary.totalEthicsApprovals || 0}</p>
            <p className="text-xs text-[#f4a28c] font-bold mt-1">{summary.expiringEthics || 0} Expiring in &lt;15 days</p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-display">CTRI Updates Due</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">{summary.ctriUpdateDue || 0}</p>
            <p className="text-xs text-slate-400 mt-1">Bi-annual mandatory filing</p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-display">GCP Adherence Rate</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#608c7d] mt-1 font-display">{summary.gcpComplianceRate || '96%'}</p>
            <p className="text-xs text-slate-400 mt-1">Investigator binder audit</p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Pending Queries</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">{summary.pendingAuditQueries || 0}</p>
            <p className="text-xs text-slate-400 mt-1">Active eCRF queries</p>
          </div>
        </div>
      </div>

      {/* 3. Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('ethics')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold font-display transition-all ${
            activeTab === 'ethics' ? 'bg-[#608c7d] text-white shadow-sage-glow' : 'bg-white text-slate-700 hover:bg-[#f4f8f6]'
          }`}
        >
          IEC Approvals ({ethics.length})
        </button>

        <button
          onClick={() => setActiveTab('ctri')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold font-display transition-all ${
            activeTab === 'ctri' ? 'bg-[#608c7d] text-white shadow-sage-glow' : 'bg-white text-slate-700 hover:bg-[#f4f8f6]'
          }`}
        >
          CTRI Registry ({ctri.length})
        </button>

        <button
          onClick={() => setActiveTab('gcp')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold font-display transition-all ${
            activeTab === 'gcp' ? 'bg-[#608c7d] text-white shadow-sage-glow' : 'bg-white text-slate-700 hover:bg-[#f4f8f6]'
          }`}
        >
          GCP Audit Checklists ({checklists.length})
        </button>
      </div>

      {/* Tab 1: Ethics Approvals */}
      {activeTab === 'ethics' && (
        <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#608c7d] text-white font-display font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-5">Trial ID</th>
                  <th className="py-4 px-5 min-w-[200px]">Protocol Title</th>
                  <th className="py-4 px-5">Ethics Committee</th>
                  <th className="py-4 px-5">Approval Date</th>
                  <th className="py-4 px-5">Expiry Date</th>
                  <th className="py-4 px-5">Validity Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ethics.map((e) => (
                  <tr key={e.id} className="hover:bg-[#f4f8f6] transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-slate-900">{e.trial?.trialId}</td>
                    <td className="py-4 px-5 font-bold text-slate-900 font-display">{e.trial?.title}</td>
                    <td className="py-4 px-5 text-slate-700 font-medium">{e.committeeName}</td>
                    <td className="py-4 px-5 text-slate-500 font-mono">{new Date(e.approvalDate).toLocaleDateString()}</td>
                    <td className="py-4 px-5 text-slate-900 font-mono font-bold">{new Date(e.expiryDate).toLocaleDateString()}</td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${
                          e.daysLeft <= 5
                            ? 'bg-[#fdede8] text-[#9d442e] animate-pulse'
                            : e.daysLeft <= 15
                            ? 'bg-[#fff5e6] text-[#b45309]'
                            : 'bg-[#e4ede9] text-[#2b423b]'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {e.daysLeft <= 0 ? 'Expired' : `${e.daysLeft}d remaining`}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      {(isAdmin || isComplianceOfficer) && (
                        <button
                          onClick={() => handleUpdateEthics(e.id, e.renewalRequested)}
                          className={`px-4 py-1.5 text-xs font-bold font-display rounded-full transition-colors ${
                            e.renewalRequested
                              ? 'bg-[#e4ede9] text-[#2b423b]'
                              : 'bg-[#f4a28c] hover:bg-[#e26b4e] text-white shadow-peach-glow'
                          }`}
                        >
                          {e.renewalRequested ? '✓ Submitted' : 'Submit Renewal'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: CTRI Registrations */}
      {activeTab === 'ctri' && (
        <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#608c7d] text-white font-display font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-5">Trial ID</th>
                  <th className="py-4 px-5">CTRI Number</th>
                  <th className="py-4 px-5">Registration Date</th>
                  <th className="py-4 px-5">Last Upload</th>
                  <th className="py-4 px-5">Next Due</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ctri.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f4f8f6] transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-slate-900">{c.trial?.trialId}</td>
                    <td className="py-4 px-5 font-mono font-bold text-slate-900">{c.ctriNumber}</td>
                    <td className="py-4 px-5 text-slate-500 font-mono">{new Date(c.registrationDate).toLocaleDateString()}</td>
                    <td className="py-4 px-5 text-slate-500 font-mono">{new Date(c.lastUpdatedDate).toLocaleDateString()}</td>
                    <td className="py-4 px-5 text-slate-900 font-mono font-bold">{new Date(c.nextUpdateDue).toLocaleDateString()}</td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="px-3 py-1 bg-[#e4ede9] text-[#2b423b] rounded-full font-bold text-[10px]">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#608c7d] hover:underline text-xs"
                      >
                        <span>ctri.nic.in</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: GCP Checklists */}
      {activeTab === 'gcp' && (
        <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 space-y-3">
          <p className="text-xs text-slate-500 mb-2">
            Institutional Good Clinical Practice (GCP) quality validation checkpoints and investigator binders.
          </p>

          <div className="space-y-2.5">
            {checklists.map((item) => {
              const isCompliant = item.status === 'Compliant';

              return (
                <div
                  key={item.id}
                  onClick={() => handleUpdateChecklist(item.id, item.status)}
                  className={`p-4 rounded-2xl transition-all flex items-start justify-between cursor-pointer ${
                    isCompliant ? 'bg-[#e4ede9]/80 border border-[#a3c5b3]' : 'bg-[#fff5e6] border border-[#fcd34d]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 pr-3">
                    <CheckSquare className="w-5 h-5 shrink-0 mt-0.5 text-[#608c7d]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{item.trial?.trialId}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-white text-slate-700 rounded-md shadow-xs">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-1 font-display">{item.itemTitle}</p>
                      {item.notes && <p className="text-xs text-slate-600 mt-0.5">{item.notes}</p>}
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-slate-800 shadow-xs shrink-0">
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
