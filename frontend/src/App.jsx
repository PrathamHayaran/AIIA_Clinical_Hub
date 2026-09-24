import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { FallingAyurvedicLeaves3D } from './components/3d/FallingAyurvedicLeaves3D';
import { PatientLayout } from './components/patient/PatientLayout';

// Staff / Researcher Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TrialsPage } from './pages/TrialsPage';
import { TrialDetailPage } from './pages/TrialDetailPage';
import { RecruitmentPage } from './pages/RecruitmentPage';
import { ConsultationsPage } from './pages/ConsultationsPage';
import { SitesPage } from './pages/SitesPage';
import { SafetyPage } from './pages/SafetyPage';
import { CompliancePage } from './pages/CompliancePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AICopilotPage } from './pages/AICopilotPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

// Patient Portal Pages
import PatientDashboardPage from './pages/patient/PatientDashboardPage';
import PatientTrialPage from './pages/patient/PatientTrialPage';
import PatientVisitsPage from './pages/patient/PatientVisitsPage';
import PatientTreatmentPage from './pages/patient/PatientTreatmentPage';
import PatientSafetyPage from './pages/patient/PatientSafetyPage';
import PatientQuestionnairesPage from './pages/patient/PatientQuestionnairesPage';
import PatientDocumentsPage from './pages/patient/PatientDocumentsPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';
import PatientNotificationsPage from './pages/patient/PatientNotificationsPage';
import PatientStudyTeamPage from './pages/patient/PatientStudyTeamPage';
import PatientPrivacyPage from './pages/patient/PatientPrivacyPage';

// Sage Organic Minimalist Layout Wrapper for Staff
const StaffLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#edf2ef] text-slate-900 flex font-sans relative">
      {/* 3D Global Falling Ayurvedic Leaves */}
      <FallingAyurvedicLeaves3D count={36} />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Sage Canvas Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen bg-[#edf2ef] transition-all duration-300 relative z-10 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Navbar */}
        <Navbar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 min-w-0 bg-[#edf2ef]">
          {children}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

// Staff Route Guard
const StaffProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#edf2ef] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#608c7d] border-t-[#f4a28c] rounded-full animate-spin shadow-sm" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a Patient token is accessing staff pages, redirect to Patient Portal
  if (user?.role === 'PATIENT') {
    return <Navigate to="/patient/dashboard" replace />;
  }

  return <StaffLayout>{children}</StaffLayout>;
};

// Patient Route Guard
const PatientProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#edf2ef] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#608c7d] border-t-[#f4a28c] rounded-full animate-spin shadow-sm" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a Staff member visits patient portal, allow them to view or redirect to dashboard
  // For strict separation: if user is not PATIENT, redirect to staff dashboard
  if (user?.role !== 'PATIENT') {
    return <Navigate to="/dashboard" replace />;
  }

  return <PatientLayout>{children}</PatientLayout>;
};

// Root Index Redirector
const IndexRedirect = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#edf2ef] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#608c7d] border-t-[#f4a28c] rounded-full animate-spin shadow-sm" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'PATIENT') {
    return <Navigate to="/patient/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<IndexRedirect />} />

      {/* ========================================================================= */}
      {/* STAFF & RESEARCHER ROUTES */}
      {/* ========================================================================= */}
      <Route
        path="/dashboard"
        element={
          <StaffProtectedRoute>
            <DashboardPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/trials"
        element={
          <StaffProtectedRoute>
            <TrialsPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/trials/:id"
        element={
          <StaffProtectedRoute>
            <TrialDetailPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/recruitment"
        element={
          <StaffProtectedRoute>
            <RecruitmentPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/consultations"
        element={
          <StaffProtectedRoute>
            <ConsultationsPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/sites"
        element={
          <StaffProtectedRoute>
            <SitesPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/safety"
        element={
          <StaffProtectedRoute>
            <SafetyPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/compliance"
        element={
          <StaffProtectedRoute>
            <CompliancePage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <StaffProtectedRoute>
            <AnalyticsPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <StaffProtectedRoute>
            <AlertsPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/ai-copilot"
        element={
          <StaffProtectedRoute>
            <AICopilotPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <StaffProtectedRoute>
            <NotificationsPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <StaffProtectedRoute>
            <SettingsPage />
          </StaffProtectedRoute>
        }
      />

      {/* ========================================================================= */}
      {/* PATIENT PORTAL ROUTES */}
      {/* ========================================================================= */}
      <Route
        path="/patient/dashboard"
        element={
          <PatientProtectedRoute>
            <PatientDashboardPage />
          </PatientProtectedRoute>
        }
      />
      <Route
        path="/patient/trial"
        element={
          <PatientProtectedRoute>
            <PatientTrialPage />
          </PatientProtectedRoute>
        }
      />
      <Route
        path="/patient/visits"
        element={
          <PatientProtectedRoute>
            <PatientVisitsPage />
          </PatientProtectedRoute>
        }
      />
      <Route
        path="/patient/treatment"
        element={
          <PatientProtectedRoute>
            <PatientTreatmentPage />
          </PatientProtectedRoute>
        }
      />
      <Route
        path="/patient/safety"
        element={
          <PatientProtectedRoute>
            <PatientSafetyPage />
          </PatientProtectedRoute>
        }
      />
      <Route
        path="/patient/questionnaires"
        element={
          <PatientProtectedRoute>
            <PatientQuestionnairesPage />
          </PatientProtectedRoute>
        }
      />
      <Route
        path="/patient/documents"
        element={
          <PatientProtectedRoute>
            <PatientDocumentsPage />
          </PatientProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <PatientProtectedRoute>
            <PatientProfilePage />
          </PatientProtectedRoute>
        }
      />
      <Route
        path="/patient/notifications"
        element={
          <PatientProtectedRoute>
            <PatientNotificationsPage />
          </PatientProtectedRoute>
        }
      />
      <Route
        path="/patient/study-team"
        element={
          <PatientProtectedRoute>
            <PatientStudyTeamPage />
          </PatientProtectedRoute>
        }
      />
      <Route
        path="/patient/privacy"
        element={
          <PatientProtectedRoute>
            <PatientPrivacyPage />
          </PatientProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<IndexRedirect />} />
    </Routes>
  );
}
