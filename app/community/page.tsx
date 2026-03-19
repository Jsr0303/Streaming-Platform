'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Users, TrendingUp, MessageSquare, Plus, Hash, Globe, Lock, Flame, Search, ChevronRight } from 'lucide-react';

const COMMUNITIES = [
  { id: 1, name: 'Cinematic Creators', handle: 'cinematic-creators', avatar: 'CC', color: '#8B5CF6', members: '248K', posts: '12.4K', category: 'Video', desc: 'For filmmakers, videographers, and cinematography enthusiasts. Share your best shots.', joined: false, coverColor: '#1a0533' },
  { id: 2, name: 'AI Art Universe', handle: 'ai-art-universe', avatar: 'AI', color: '#EC4899', members: '892K', posts: '45.2K', category: 'Art', desc: 'Explore the frontiers of AI-generated artwork. Prompts, techniques, tools, and gallery posts welcome.', joined: true, coverColor: '#2a0d1f' },
  { id: 3, name: 'Lo-Fi & Chill Beats', handle: 'lofi-chill', avatar: 'LF', color: '#F97316', members: '1.2M', posts: '89K', category: 'Music', desc: 'Drop your tracks, find study vibes, discover new lo-fi artists. All audio creators welcome.', joined: false, coverColor: '#180a00' },
  { id: 4, name: 'Street Photography', handle: 'street-photography', avatar: 'SP', color: '#06B6D4', members: '567K', posts: '34.1K', category: 'Photo', desc: 'Urban, documentary, and street photography from around the world.', joined: true, coverColor: '#001525' },
  { id: 5, name: 'Short Film Festival', handle: 'short-film-festival', avatar: 'SF', color: '#10B981', members: '189K', posts: '8.9K', category: 'Film', desc: 'Submit your short films, give and receive feedback. Monthly virtual festival events.', joined: false, coverColor: '#001a0d' },
  { id: 6, name: '18+ Creators Hub', handle: '18plus-creators', avatar: '18', color: '#EF4444', members: '340K', posts: '78K', category: 'Adult', desc: 'A private community for adult content creators. Age-verified members only. Share, learn, and grow.', joined: false, coverColor: '#1a0000', adult: true },
];

const TRENDING_TOPICS = [
  { tag: '#LoopArt', posts: '234K' }, { tag: '#DroneDay', posts: '189K' },
  { tag: '#AIGenerated', posts: '1.2M' }, { tag: '#StudioSession', posts: '445K' },
  { tag: '#FilmGrain', posts: '678K' }, { tag: '#SynthWave', posts: '234K' },
];

const DISCUSSIONS = [
  { id: 1, community: 'AI Art Universe', avatar: 'AI', color: '#EC4899', title: 'What AI model produces the best cinematic stills in 2025?', comments: 234, likes: 1890, time: '2h ago' },
  { id: 2, community: 'Cinematic Creators', avatar: 'CC', color: '#8B5CF6', title: 'Color grading tips for LOG footage — a deep dive with samples', comments: 89, likes: 765, time: '4h ago' },
  { id: 3, community: 'Lo-Fi & Chill Beats', avatar: 'LF', color: '#F97316', title: 'Show me your home studio setup! (pics welcome 📸)', comments: 445, likes: 3400, time: '6h ago' },
];

export default function CommunityPage() {
  const [communities, setCommunities] = useState(COMMUNITIES);
  const [searchQ, setSearchQ] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  function toggleJoin(id: number) {
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, joined: !c.joined } : c));
  }

  const filters = ['All', 'Video', 'Art', 'Music', 'Photo', 'Film', 'Adult'];
  const filtered = communities.filter(c =>
    (activeFilter === 'All' || c.category === activeFilter) &&
    c.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', gap: '24px', padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={24} color="#8B5CF6" />
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '28px' }}>Communities</h1>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 15px rgba(139,92,246,0.3)' }}>
                <Plus size={15} /> Create Community
              </button>
            </div>
            <p style={{ color: '#64748B', fontSize: '14px' }}>Join niche communities — every topic, every interest, no restrictions.</p>
          </div>

          {/* Search + filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={15} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search communities..." className="input-glass" style={{ width: '100%', padding: '10px 12px 10px 36px', fontSize: '13px' }} />
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} style={{
                  padding: '8px 14px', borderRadius: '99px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
                  background: activeFilter === f ? (f === 'Adult' ? 'linear-gradient(135deg,#EF4444,#DC2626)' : 'linear-gradient(135deg,#8B5CF6,#7C3AED)') : 'rgba(255,255,255,0.05)',
                  color: activeFilter === f ? 'white' : '#64748B',
                  boxShadow: activeFilter === f ? `0 4px 12px ${f === 'Adult' ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.3)'}` : 'none',
                }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Community cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(c => (
              <div key={c.id} style={{
                background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(20px)',
                border: `1px solid ${c.joined ? c.color + '30' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '20px', overflow: 'hidden', transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Cover */}
                <div style={{ height: '80px', background: `${c.coverColor}`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 50%,${c.color}30,transparent 70%)` }} />
                  {c.adult && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239,68,68,0.9)', borderRadius: '8px', padding: '3px 10px', fontSize: '11px', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={10} /> 18+ ONLY
                    </div>
                  )}
                </div>
                <div style={{ padding: '0 18px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', marginTop: '-24px', marginBottom: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `linear-gradient(135deg,${c.color},${c.color}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px', color: 'white', border: '3px solid #050510', flexShrink: 0 }}>{c.avatar}</div>
                    <div style={{ flex: 1, marginBottom: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '16px' }}>{c.name}</h3>
                        <span style={{ background: `${c.color}15`, color: c.color, borderRadius: '6px', padding: '1px 8px', fontSize: '11px', fontWeight: 600 }}>{c.category}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleJoin(c.id)} style={{
                      padding: '7px 16px', borderRadius: '10px', border: c.joined ? `1px solid ${c.color}40` : 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', flexShrink: 0, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                      background: c.joined ? `${c.color}10` : `linear-gradient(135deg,${c.color},${c.color}90)`,
                      color: c.joined ? c.color : 'white',
                      boxShadow: c.joined ? 'none' : `0 4px 15px ${c.color}40`,
                    }}>
                      {c.joined ? '✓ Joined' : '+ Join'}
                    </button>
                  </div>
                  <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '12px' }}>{c.desc}</p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748B' }}>
                      <Users size={13} color="#8B5CF6" /> <span style={{ fontWeight: 600 }}>{c.members}</span> members
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748B' }}>
                      <MessageSquare size={13} color="#06B6D4" /> <span style={{ fontWeight: 600 }}>{c.posts}</span> posts
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Trending topics */}
          <div style={{ background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Flame size={16} color="#EC4899" />
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '14px' }}>Hot Topics</h3>
            </div>
            {TRENDING_TOPICS.map(t => (
              <div key={t.tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#A78BFA' }}>{t.tag}</span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>{t.posts}</span>
              </div>
            ))}
          </div>

          {/* Trending discussions */}
          <div style={{ background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <TrendingUp size={16} color="#8B5CF6" />
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '14px' }}>Hot Discussions</h3>
            </div>
            {DISCUSSIONS.map(d => (
              <div key={d.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '5px', background: `${d.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: d.color }}>{d.avatar}</div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{d.community}</span>
                  <span style={{ fontSize: '11px', color: '#2D3748', marginLeft: 'auto' }}>{d.time}</span>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4, color: '#E2E8F0' }}>{d.title}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', color: '#64748B' }}>
                  <span>💬 {d.comments}</span>
                  <span>❤️ {d.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
