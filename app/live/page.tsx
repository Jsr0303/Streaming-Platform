'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Radio, Users, Eye, Heart, Share2, MessageCircle, Zap, Clock, TrendingUp } from 'lucide-react';

const LIVE_STREAMS = [
  { id: 1, creator: 'DevStream', handle: '@devstream', avatar: 'D', color: '#10B981', title: 'LIVE: Building a Full-Stack SaaS with AI Tools — Watch Me Code', viewers: 48234, likes: 12400, category: 'Tech', duration: '2h 14m', tags: ['coding', 'AI', 'saas'] },
  { id: 2, creator: 'BeatLive', handle: '@beatlive', avatar: 'B', color: '#EC4899', title: 'LIVE: Making Beats From Scratch — Drop Your Requests Below 🎵', viewers: 32800, likes: 8900, category: 'Music', duration: '45m', tags: ['music', 'beats', 'live'] },
  { id: 3, creator: 'ArtOnStream', handle: '@artonstream', avatar: 'A', color: '#8B5CF6', title: 'LIVE: Digital Painting — Creating a Fantasy Landscape in Procreate', viewers: 21600, likes: 7200, category: 'Art', duration: '1h 38m', tags: ['art', 'digital', 'procreate'] },
  { id: 4, creator: 'GameVault', handle: '@gamevault', avatar: 'GV', color: '#F97316', title: 'LIVE: First Play of Starfield DLC — No Spoilers Until Now!', viewers: 89400, likes: 34000, category: 'Gaming', duration: '3h 02m', tags: ['gaming', 'starfield', 'live'] },
  { id: 5, creator: 'FitnessNow', handle: '@fitnessnow', avatar: 'F', color: '#EF4444', title: 'LIVE: 1-Hour HIIT Workout — Train With Me! 💪', viewers: 15200, likes: 4800, category: 'Fitness', duration: '58m', tags: ['fitness', 'workout', 'live'] },
  { id: 6, creator: 'ChefCam', handle: '@chefcam', avatar: 'CC', color: '#F59E0B', title: 'LIVE: Making 3-Michelin-Star Pasta from Scratch 🍝', viewers: 27300, likes: 9100, category: 'Food', duration: '1h 12m', tags: ['cooking', 'pasta', 'michelin'] },
];

const CATEGORIES = ['All', 'Tech', 'Music', 'Art', 'Gaming', 'Fitness', 'Food', 'Education'];

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export default function LivePage() {
  const [activeCat, setActiveCat] = useState('All');
  const [watchingId, setWatchingId] = useState<number | null>(null);

  const filtered = activeCat === 'All' ? LIVE_STREAMS : LIVE_STREAMS.filter(s => s.category === activeCat);
  const watching = LIVE_STREAMS.find(s => s.id === watchingId);

  return (
    <>
      <Navbar />
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ position: 'relative' }}>
            <Radio size={24} color="#EF4444" fill="#EF4444" />
            <div style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', animation: 'ping 1s infinite' }} />
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '32px' }}>Live Now</h1>
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: 700, color: '#EF4444' }}>
            {LIVE_STREAMS.length} Streams
          </div>
        </div>
        <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '24px' }}>Real-time content, happening right now.</p>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              padding: '7px 16px', borderRadius: '99px', border: 'none', whiteSpace: 'nowrap',
              background: activeCat === cat ? 'linear-gradient(135deg,#EF4444,#DC2626)' : 'rgba(255,255,255,0.05)',
              color: activeCat === cat ? 'white' : '#64748B',
              fontSize: '13px', fontWeight: activeCat === cat ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
              boxShadow: activeCat === cat ? '0 4px 15px rgba(239,68,68,0.3)' : 'none',
            }}>{cat}</button>
          ))}
        </div>

        {/* Live streams grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filtered.map(stream => (
            <div key={stream.id} onClick={() => setWatchingId(stream.id)} style={{
              background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239,68,68,0.15)', borderRadius: '20px',
              overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Preview area */}
              <div style={{ position: 'relative', aspectRatio: '16/9', background: `linear-gradient(135deg,${stream.color}30,#050510)`, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', opacity: 0.08, fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: stream.color }}>{stream.avatar}</div>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${stream.color}20 0%, transparent 70%)` }} />
                {/* Live badge */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(135deg,#EF4444,#DC2626)', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 800, color: 'white', boxShadow: '0 0 15px rgba(239,68,68,0.5)' }}>
                  <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', animation: 'ping 1s infinite' }} />
                  LIVE
                </div>
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 600, color: 'white' }}>
                  <Clock size={10} /> {stream.duration}
                </div>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, color: 'white' }}>
                  <Eye size={12} /> {formatNum(stream.viewers)}
                </div>
                {/* Play hover overlay */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Radio size={22} color={stream.color} fill={stream.color} />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg,${stream.color},${stream.color}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '13px', color: 'white', border: `2px solid ${stream.color}40`, flexShrink: 0 }}>{stream.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{stream.creator}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{stream.handle}</div>
                  </div>
                  <div style={{ background: `${stream.color}15`, border: `1px solid ${stream.color}30`, color: stream.color, borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{stream.category}</div>
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: 1.4, marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{stream.title}</h3>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {stream.tags.map(t => <span key={t} style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#A78BFA', borderRadius: '99px', padding: '2px 8px', fontSize: '11px', fontWeight: 500 }}>#{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Watch modal */}
      {watching && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s' }}
          onClick={() => setWatchingId(null)}
        >
          <div style={{ width: '100%', maxWidth: '900px', background: 'rgba(10,10,26,0.98)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden', animation: 'scaleIn 0.2s' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ aspectRatio: '16/9', background: `linear-gradient(135deg,${watching.color}30,#050510)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ fontSize: '120px', opacity: 0.06, fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: watching.color }}>{watching.avatar}</div>
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(135deg,#EF4444,#DC2626)', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 800, color: 'white' }}>
                  <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', animation: 'ping 1s infinite' }} />
                  LIVE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.6)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: 'white', fontWeight: 600 }}>
                  <Eye size={12} /> {formatNum(watching.viewers)} watching
                </div>
              </div>
              <button onClick={() => setWatchingId(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: '18px' }}>✕</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `linear-gradient(135deg,${watching.color},${watching.color}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', color: 'white', flexShrink: 0 }}>{watching.avatar}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{watching.title}</h3>
                <div style={{ fontSize: '13px', color: '#64748B' }}>{watching.creator} · {watching.handle}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)', color: '#EC4899', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}><Heart size={14} /> Like</button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', border: 'none', color: 'white', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}><Users size={14} /> Follow</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
