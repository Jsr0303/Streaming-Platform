'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import FeedCard from '@/components/FeedCard';
import { TrendingUp, Hash, Film, Music, Image, FileText, Layers, Compass, Flame, Users, Zap } from 'lucide-react';

const TABS = [
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'videos', label: 'Videos', icon: Film },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'photos', label: 'Photos', icon: Image },
  { id: 'docs', label: 'Documents', icon: FileText },
  { id: '3d', label: '3D & AR', icon: Layers },
  { id: 'topics', label: 'Topics', icon: Hash },
  { id: 'creators', label: 'Creators', icon: Users },
];

const TRENDING_CONTENT = [
  { id: 101, type: 'video' as const, title: 'Breaking: AI Generates Full Feature Film in 6 Hours', creator: 'TechVision', creatorAvatar: 'T', creatorColor: '#8B5CF6', thumbnail: '', likes: 892000, comments: 45000, views: '34M', duration: '8:22', tags: ['AI', 'filmmaking', 'tech'], time: '3 hours ago', verified: true },
  { id: 102, type: 'reel' as const, title: 'The most satisfying woodworking cut you\'ll ever see', creator: 'CraftMaster', creatorAvatar: 'C', creatorColor: '#F97316', thumbnail: '', likes: 2100000, comments: 89000, views: '120M', duration: '0:32', tags: ['woodworking', 'satisfying', 'craft'], time: '1 day ago', verified: true },
  { id: 103, type: 'image' as const, title: 'James Webb captures galaxy collision 10 billion years ago', creator: 'SpacePhotos', creatorAvatar: 'SP', creatorColor: '#06B6D4', thumbnail: '', likes: 4300000, comments: 156000, views: '280M', tags: ['space', 'james-webb', 'science'], time: '6 hours ago', verified: true },
  { id: 104, type: 'audio' as const, title: 'This AI voice sounds like Billie Eilish — hear the difference', creator: 'SoundAI', creatorAvatar: 'SI', creatorColor: '#EC4899', thumbnail: '', likes: 670000, comments: 34000, views: '8.9M', duration: '3:14', tags: ['ai-voice', 'music', 'viral'], time: '5 hours ago', verified: false },
  { id: 105, type: 'video' as const, title: 'Climbing Everest Solo: Uncut Summit POV Footage', creator: 'PeakAdventures', creatorAvatar: 'PA', creatorColor: '#10B981', thumbnail: '', likes: 3400000, comments: 124000, views: '89M', duration: '45:12', tags: ['everest', 'climbing', 'adventure'], time: '12 hours ago', verified: true },
  { id: 106, type: 'document' as const, title: 'LEAKED: Apple Vision Pro 3 Full Spec Sheet — Every Detail', creator: 'TechLeaks', creatorAvatar: 'TL', creatorColor: '#6366F1', thumbnail: '', likes: 445000, comments: 78000, views: '12M', tags: ['apple', 'visionpro', 'tech'], time: '2 hours ago', verified: false },
];

const HOT_TOPICS = [
  { tag: '#AIRevolution', count: '8.2M posts', color: '#8B5CF6' },
  { tag: '#CinematicShots', count: '4.1M posts', color: '#EC4899' },
  { tag: '#SpaceExploration', count: '2.9M posts', color: '#06B6D4' },
  { tag: '#LoFiBeats', count: '1.8M posts', color: '#F97316' },
  { tag: '#DigitalArt', count: '6.3M posts', color: '#10B981' },
  { tag: '#StreetPhotography', count: '3.5M posts', color: '#F59E0B' },
  { tag: '#CodeWithMe', count: '2.1M posts', color: '#EF4444' },
  { tag: '#NatureDoc', count: '1.4M posts', color: '#A855F7' },
];

const TOP_CREATORS = [
  { rank: 1, name: 'CinemaWorld', handle: '@cinemaworld', avatar: 'CW', color: '#8B5CF6', followers: '45.2M', type: 'Video', growth: '+12%' },
  { rank: 2, name: 'BeatFactory', handle: '@beatfactory', avatar: 'BF', color: '#EC4899', followers: '38.1M', type: 'Audio', growth: '+8%' },
  { rank: 3, name: 'ArtVault', handle: '@artvault', avatar: 'AV', color: '#06B6D4', followers: '31.7M', type: 'Images', growth: '+24%' },
  { rank: 4, name: 'SpaceDocs', handle: '@spacedocs', avatar: 'SD', color: '#F97316', followers: '28.4M', type: 'Documents', growth: '+5%' },
  { rank: 5, name: '3DWorld', handle: '@3dworld', avatar: '3W', color: '#10B981', followers: '19.8M', type: '3D / AR', growth: '+41%' },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('trending');

  return (
    <>
      <Navbar />
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Compass size={24} color="#8B5CF6" />
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '32px' }}>Explore</h1>
          </div>
          <p style={{ color: '#64748B', fontSize: '15px' }}>Discover viral content across every format — unlimited, unrestricted.</p>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: '4px', padding: '6px',
          background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.05)',
          overflowX: 'auto', marginBottom: '28px',
          scrollbarWidth: 'none',
        }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                padding: '8px 16px', borderRadius: '10px', border: 'none',
                background: activeTab === id ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'none',
                color: activeTab === id ? 'white' : '#64748B',
                fontSize: '13px', fontWeight: activeTab === id ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif',
                boxShadow: activeTab === id ? '0 4px 15px rgba(139,92,246,0.3)' : 'none',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Trending tab content */}
        {activeTab === 'trending' && (
          <div>
            {/* Mega trending banner */}
            <div style={{
              borderRadius: '24px', padding: '28px', marginBottom: '28px',
              background: 'linear-gradient(135deg,rgba(236,72,153,0.15) 0%,rgba(139,92,246,0.15) 100%)',
              border: '1px solid rgba(236,72,153,0.2)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%,rgba(139,92,246,0.15),transparent 70%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Flame size={18} color="#EC4899" fill="#EC4899" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '1px' }}>Trending Right Now</span>
                </div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '28px', marginBottom: '6px' }}>
                  120M Views in 24 Hours 🔥
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>The most satisfying woodworking video is breaking records.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {TRENDING_CONTENT.map((card, i) => (
                <FeedCard key={card.id} card={card} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Topics tab */}
        {activeTab === 'topics' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {HOT_TOPICS.map(t => (
                <div key={t.tag} style={{
                  background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(20px)',
                  border: `1px solid ${t.color}30`, borderRadius: '16px',
                  padding: '20px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${t.color}10`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,15,35,0.7)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', marginBottom: '12px',
                    background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Hash size={20} color={t.color} />
                  </div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px', color: t.color, marginBottom: '4px' }}>{t.tag}</div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>{t.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creators tab */}
        {activeTab === 'creators' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TOP_CREATORS.map(c => (
                <div key={c.rank} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px 20px',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = `${c.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  <div style={{ fontSize: '24px', fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#2D3748', width: '32px', textAlign: 'center' }}>#{c.rank}</div>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg,${c.color},${c.color}60)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', color: 'white',
                    border: `3px solid ${c.color}40`,
                  }}>{c.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', fontFamily: 'Outfit, sans-serif', marginBottom: '2px' }}>{c.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>{c.handle} · {c.type} Creator</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px' }}>{c.followers}</div>
                    <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>{c.growth}</div>
                  </div>
                  <button style={{
                    background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', color: 'white',
                    border: 'none', borderRadius: '10px', padding: '8px 16px',
                    fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>Follow</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default for other tabs */}
        {!['trending', 'topics', 'creators'].includes(activeTab) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {TRENDING_CONTENT.filter(c => {
              if (activeTab === 'videos') return c.type === 'video' || c.type === 'reel';
              if (activeTab === 'audio') return c.type === 'audio';
              if (activeTab === 'photos') return c.type === 'image';
              if (activeTab === 'docs') return c.type === 'document';
              return true;
            }).map((card, i) => (
              <FeedCard key={card.id} card={card} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
