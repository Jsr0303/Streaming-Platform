'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Compass, Play, Radio, Upload, User, Bell, Settings,
  ChevronRight, Flame, Star, Hash, LogIn, Moon, Sun, Zap,
  Users, MessageSquare
} from 'lucide-react';
import { useApp } from '@/app/layout';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: Play, label: 'Reels', href: '/reels' },
  { icon: Radio, label: 'Live', href: '/live' },
  { icon: Users, label: 'Community', href: '/community' },
  { icon: MessageSquare, label: 'Messages', href: '/messages', badge: 4 },
  { icon: Hash, label: 'Topics', href: '/explore?tab=topics' },
  { icon: Flame, label: 'Trending', href: '/explore?tab=trending' },
  { icon: Star, label: 'Saved', href: '/saved' },
  { icon: Upload, label: 'Upload', href: '/upload' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const { darkMode, setDarkMode, sidebarExpanded, setSidebarExpanded } = useApp();
  const pathname = usePathname();
  const [notifCount] = useState(7);

  return (
    <div
      style={{
        width: sidebarExpanded ? '260px' : '72px',
        height: '100vh',
        background: 'rgba(5,5,16,0.95)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        zIndex: 50,
      }}
      onMouseEnter={() => setSidebarExpanded(true)}
      onMouseLeave={() => setSidebarExpanded(false)}
    >
      {/* Logo */}
      <div style={{ padding: '20px 14px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
          <div style={{
            width: '42px', height: '42px', flexShrink: 0,
            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139,92,246,0.4)',
          }}>
            <Zap size={22} color="white" fill="white" />
          </div>
          {sidebarExpanded && (
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800, fontSize: '20px',
              background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
            }}>MediaVerse</span>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV_ITEMS.map(({ icon: Icon, label, href, badge }: { icon: React.ComponentType<any>; label: string; href: string; badge?: number }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href.split('?')[0]));
          const isNotif = label === 'Notifications';
          const itemBadge = isNotif ? notifCount : badge;
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ marginBottom: '2px', position: 'relative' }}
                title={!sidebarExpanded ? label : undefined}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Icon
                    size={20}
                    color={isActive ? '#A78BFA' : '#94A3B8'}
                    style={{ display: 'block' }}
                  />
                  {itemBadge && itemBadge > 0 && (
                    <div style={{
                      position: 'absolute', top: '-4px', right: '-4px',
                      width: '16px', height: '16px',
                      background: isNotif ? 'linear-gradient(135deg,#EC4899,#EF4444)' : 'linear-gradient(135deg,#06B6D4,#0891B2)',
                      borderRadius: '50%',
                      border: '2px solid #050510',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '8px', fontWeight: 800, color: 'white',
                    }}>{itemBadge}</div>
                  )}
                </div>
                {sidebarExpanded && (
                  <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 500, letterSpacing: '-0.1px' }}>
                    {label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Dark mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', marginBottom: '4px' }}
          title={!sidebarExpanded ? (darkMode ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {darkMode
            ? <Sun size={20} color="#94A3B8" />
            : <Moon size={20} color="#94A3B8" />
          }
          {sidebarExpanded && (
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Login */}
        <Link href="/login" style={{ textDecoration: 'none' }}>
          <div className="nav-item" title={!sidebarExpanded ? 'Sign In' : undefined}>
            <LogIn size={20} color="#8B5CF6" />
            {sidebarExpanded && (
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#A78BFA' }}>Sign In</span>
            )}
          </div>
        </Link>

        {/* Expand indicator */}
        {!sidebarExpanded && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px', opacity: 0.3 }}>
            <ChevronRight size={14} color="#94A3B8" />
          </div>
        )}
      </div>
    </div>
  );
}
