'use client';
import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { useState, createContext, useContext } from 'react';

export const AppContext = createContext<{
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (v: boolean) => void;
}>({
  darkMode: true,
  setDarkMode: () => {},
  sidebarExpanded: false,
  setSidebarExpanded: () => {},
});

export function useApp() { return useContext(AppContext); }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <head>
        <title>MediaVerse — Share Everything, Everywhere</title>
        <meta name="description" content="The world's most advanced unrestricted media content sharing platform. Share videos, reels, audio, images, documents, 3D content, and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ background: darkMode ? '#050510' : '#f1f5f9' }}>
        <AppContext.Provider value={{ darkMode, setDarkMode, sidebarExpanded, setSidebarExpanded }}>
          {/* Ambient background orbs */}
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            <div style={{
              position: 'absolute', top: '-20%', left: '-10%',
              width: '600px', height: '600px',
              background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
              borderRadius: '50%',
            }} />
            <div style={{
              position: 'absolute', bottom: '-20%', right: '-10%',
              width: '700px', height: '700px',
              background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)',
              borderRadius: '50%',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: '500px', height: '500px',
              transform: 'translate(-50%,-50%)',
              background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)',
              borderRadius: '50%',
            }} />
          </div>

          <div className="main-layout" style={{ position: 'relative', zIndex: 1 }}>
            {/* Sidebar */}
            <div className="sidebar-area">
              <Sidebar />
            </div>

            {/* Main content */}
            <main
              className="content-area"
              style={{ marginLeft: sidebarExpanded ? '260px' : '72px' }}
            >
              {children}
            </main>
          </div>
        </AppContext.Provider>
      </body>
    </html>
  );
}
