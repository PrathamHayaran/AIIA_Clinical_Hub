import React, { useState } from 'react';
import { PatientSidebar } from './PatientSidebar';
import { PatientNavbar } from './PatientNavbar';
import { ToastContainer } from '../ToastContainer';
import { FallingAyurvedicLeaves3D } from '../3d/FallingAyurvedicLeaves3D';

export const PatientLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#edf2ef] text-slate-900 flex font-sans relative">
      {/* 3D Global Falling Ayurvedic Leaves */}
      <FallingAyurvedicLeaves3D count={28} />

      {/* Patient Sidebar */}
      <PatientSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Sage Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#edf2ef] transition-all duration-300 relative z-10 lg:pl-64">
        {/* Patient Navbar */}
        <PatientNavbar setIsMobileOpen={setIsMobileOpen} />

        {/* Dynamic Patient Route Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16 min-w-0 bg-[#edf2ef] max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
