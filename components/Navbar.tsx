'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, X, Bell, Upload, TrendingUp, User, Hash, Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SUGGESTIONS = [
  { type: 'trending', label: '#AIArt', icon: Hash },
  { type: 'trending', label: '#ViralClips', icon: TrendingUp },
  { type: 'creator', label: '@creativestudio', icon: User },
  { type: 'topic', label: 'Cinematic Videos', icon: Zap },
  { type: 'topic', label: 'Nature Timelapse', icon: Zap },
  { type: 'creator', label: '@beatmaker_pro', icon: User },
  { type: 'trending', label: '#LoFiMusic', icon: Hash },
  { type: 'topic', label: '4K Drone Footage', icon: Zap },
];

const NOTIFICATIONS = [
  { id: 1, avatar: 'A', name: 'Alex Chen', action: 'liked your video', time: '2m ago', color: '#EC4899' },
  { id: 2, avatar: 'S', name: 'Sarah K', action: 'started following you', time: '15m ago', color: '#06B6D4' },
  { id: 3, avatar: 'M', name: 'MusicProd', action: 'commented on your reel', time: '1h ago', color: '#8B5CF6' },
  { id: 4, avatar: 'J', name: 'Jake L', action: 'shared your photo', time: '3h ago', color: '#F97316' },
  { id: 5, avatar: 'R', name: 'ReactDev', action: 'mentioned you in a post', time: '5h ago', color: '#10B981' },
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [recent] = useState(['#ocean4k', 'lofi beats', 'drone footage']);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = query
    ? SUGGESTIONS.filter(s => s.label.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS.slice(0, 6);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(5,5,16,0.85)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '12px 24px',
      display: 'flex', alignItems: 'center', gap: '16px',
    }}>
      {/* Search */}
      <div ref={searchRef} style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${searchOpen ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: '14px', padding: '10px 16px',
          transition: 'all 0.2s',
          boxShadow: searchOpen ? '0 0 0 3px rgba(139,92,246,0.1)' : 'none',
        }}>
          <Search size={16} color={searchOpen ? '#A78BFA' : '#64748B'} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search anything — video, audio, creator, hashtag..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#F8FAFC', fontSize: '14px', fontFamily: 'Inter, sans-serif',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <X size={14} color="#64748B" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {searchOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
            background: 'rgba(10,10,26,0.98)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            animation: 'scaleIn 0.15s ease-out',
          }}>
            {!query && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#475569', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Recent
                </div>
                {recent.map((r, i) => (
                  <button key={i} onClick={() => setQuery(r)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                      padding: '8px', borderRadius: '10px', background: 'none', border: 'none',
                      color: '#94A3B8', cursor: 'pointer', textAlign: 'left', fontSize: '14px',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <Clock size={14} color="#475569" />
                    {r}
                  </button>
                ))}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#475569', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Suggested
                </div>
              </div>
            )}
            {filtered.map((s, i) => (
              <button key={i} onClick={() => { setQuery(s.label); setSearchOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                  padding: '10px', borderRadius: '10px', background: 'none', border: 'none',
                  color: '#F8FAFC', cursor: 'pointer', textAlign: 'left', fontSize: '14px',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: s.type === 'trending' ? 'rgba(236,72,153,0.15)' : s.type === 'creator' ? 'rgba(6,182,212,0.15)' : 'rgba(139,92,246,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <s.icon size={15} color={s.type === 'trending' ? '#EC4899' : s.type === 'creator' ? '#06B6D4' : '#8B5CF6'} />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{s.type}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Upload button */}
        <Link href="/upload" style={{ textDecoration: 'none' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
            color: 'white', border: 'none', borderRadius: '12px',
            padding: '9px 16px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(139,92,246,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(139,92,246,0.3)'; }}
          >
            <Upload size={15} />
            <span>Upload</span>
          </button>
        </Link>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: notifOpen ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${notifOpen ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
            }}
          >
            <Bell size={18} color={notifOpen ? '#A78BFA' : '#94A3B8'} />
            <div style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '8px', height: '8px',
              background: '#EC4899', borderRadius: '50%',
              border: '2px solid #050510',
            }} />
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: '340px',
              background: 'rgba(10,10,26,0.98)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              animation: 'scaleIn 0.15s ease-out',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px' }}>Notifications</h3>
                <button style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Mark all read
                </button>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px', borderRadius: '12px', marginBottom: '4px',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg,${n.color}40,${n.color}20)`,
                    border: `2px solid ${n.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '14px', color: n.color,
                    fontFamily: 'Outfit, sans-serif',
                  }}>{n.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600 }}>{n.name}</span>
                      <span style={{ color: '#94A3B8' }}> {n.action}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{n.time}</div>
                  </div>
                  <div style={{ width: '8px', height: '8px', background: '#8B5CF6', borderRadius: '50%', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <Link href="/profile">
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            fontWeight: 700, fontSize: '16px', color: 'white',
            boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
          >J</div>
        </Link>
      </div>
    </header>
  );
}
