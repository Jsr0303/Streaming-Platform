'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import StoryBar from '@/components/StoryBar';
import FeedCard from '@/components/FeedCard';
import UploadModal from '@/components/UploadModal';
import AuthModal from '@/components/AuthModal';
import {
  Filter, TrendingUp, Sparkles, Clock, Users,
  Flame, Zap, Star, Video, ChevronDown
} from 'lucide-react';

const ALL_CARDS = [
  { id: 1, type: 'video' as const, title: 'Cinematic Drone Footage of Patagonia — 4K Ultra HDR', creator: 'LensVision', creatorAvatar: 'L', creatorColor: '#8B5CF6', thumbnail: '', likes: 142800, comments: 3240, views: '2.1M', duration: '12:34', tags: ['cinematic', '4K', 'drone'], time: '2 hours ago', verified: true },
  { id: 2, type: 'reel' as const, title: 'Mind-blowing AI art timelapse from sketch to final piece', creator: 'PixelMind', creatorAvatar: 'P', creatorColor: '#EC4899', thumbnail: '', likes: 89300, comments: 1850, views: '934K', duration: '0:45', tags: ['AIart', 'digital', 'timelapse'], time: '5 hours ago', verified: true },
  { id: 3, type: 'audio' as const, title: 'Deep Focus Lofi Mix — 3 Hours Uninterrupted Study Session', creator: 'BeatCraft', creatorAvatar: 'B', creatorColor: '#F97316', thumbnail: '', likes: 67100, comments: 940, views: '1.4M', duration: '3:02:15', tags: ['lofi', 'study', 'chill'], time: '1 day ago', verified: false },
  { id: 4, type: 'image' as const, title: 'Neon Tokyo Street Photography — 35mm Film Shot Collection', creator: 'UrbanLens', creatorAvatar: 'U', creatorColor: '#06B6D4', thumbnail: '', likes: 54200, comments: 1120, views: '678K', tags: ['photography', 'tokyo', 'film'], time: '3 hours ago', verified: true },
  { id: 5, type: 'live' as const, title: 'LIVE: Full-Stack App Build with AI Tools — Watch me code in real time', creator: 'DevStream', creatorAvatar: 'D', creatorColor: '#10B981', thumbnail: '', likes: 23400, comments: 8900, views: '45K', tags: ['coding', 'AI', 'live'], time: 'Live now', verified: true },
  { id: 6, type: 'document' as const, title: 'The Ultimate Guide to Building Viral Content in 2025 — 80-Page PDF', creator: 'GrowthLab', creatorAvatar: 'G', creatorColor: '#F59E0B', thumbnail: '', likes: 31900, comments: 560, views: '289K', tags: ['guide', 'growth', 'strategy'], time: '2 days ago', verified: false },
  { id: 7, type: '3d' as const, title: 'Interactive 3D Model: SpaceStation Alpha — Explore Every Module', creator: '3DForge', creatorAvatar: '3', creatorColor: '#6366F1', thumbnail: '', likes: 18700, comments: 430, views: '156K', tags: ['3D', 'space', 'interactive'], time: '4 hours ago', verified: true },
  { id: 8, type: 'video' as const, title: 'Ocean Depths Unknown: Submarine Footage Nobody Has Seen Before', creator: 'DeepBlue', creatorAvatar: 'DB', creatorColor: '#0EA5E9', thumbnail: '', likes: 201000, comments: 7800, views: '8.3M', duration: '28:17', tags: ['ocean', 'nature', 'documentary'], time: '6 hours ago', verified: true },
  { id: 9, type: 'reel' as const, title: 'This lofi beat took me 3 minutes — created with AI + my hands', creator: 'SoundWave', creatorAvatar: 'SW', creatorColor: '#A855F7', thumbnail: '', likes: 76500, comments: 2200, views: '1.2M', duration: '0:58', tags: ['music', 'lofi', 'AI'], time: '8 hours ago', verified: false },
  { id: 10, type: 'image' as const, title: 'Milky Way timelapse stack — 400 photos merged in Lightroom', creator: 'StarGaze', creatorAvatar: 'SG', creatorColor: '#EC4899', thumbnail: '', likes: 98200, comments: 3400, views: '2.8M', tags: ['astrophoto', 'stars', 'milkyway'], time: '12 hours ago', verified: true },
  { id: 11, type: 'audio' as const, title: 'Epic Orchestral Battle Theme — Royalty Free for Creators', creator: 'OrchestraX', creatorAvatar: 'OX', creatorColor: '#EF4444', thumbnail: '', likes: 44100, comments: 820, views: '567K', duration: '4:23', tags: ['orchestral', 'epic', 'royaltyfree'], time: '1 day ago', verified: true },
  { id: 12, type: 'video' as const, title: 'How I Edited a Feature Film Entirely on Mobile — Full Breakdown', creator: 'MobilePro', creatorAvatar: 'MP', creatorColor: '#14B8A6', thumbnail: '', likes: 33400, comments: 1560, views: '423K', duration: '19:44', tags: ['editing', 'mobile', 'filmmaking'], time: '3 days ago', verified: false },
];

const FILTERS = [
  { id: 'all', label: 'All Content', icon: Zap },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'for-you', label: 'For You', icon: Sparkles },
  { id: 'following', label: 'Following', icon: Users },
  { id: 'new', label: 'Latest', icon: Clock },
  { id: 'top', label: 'Top Rated', icon: Star },
];

const CREATORS = [
  { name: 'LensVision', handle: '@lensvision', avatar: 'L', color: '#8B5CF6', followers: '2.1M', verified: true },
  { name: 'PixelMind', handle: '@pixelmind', avatar: 'P', color: '#EC4899', followers: '847K', verified: true },
  { name: 'DevStream', handle: '@devstream', avatar: 'D', color: '#10B981', followers: '1.3M', verified: true },
];

const TRENDING_TAGS = ['#AICreations', '#CinematicB-Roll', '#LofiBeats', '#StreetPhoto', '#DroneVids', '#CodeTips', '#NatureDoc', '#DigitalArt'];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [cards, setCards] = useState(ALL_CARDS);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]);

  async function loadMore() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const newCards = ALL_CARDS.map(c => ({
      ...c,
      id: c.id + page * 100,
      title: c.title,
      time: 'Just loaded',
    }));
    setCards(prev => [...prev, ...newCards.slice(0, 6)]);
    setPage(p => p + 1);
    setLoading(false);
  }

  const filteredCards = activeFilter === 'all' ? cards
    : activeFilter === 'trending' ? cards.filter(c => c.likes > 50000)
    : activeFilter === 'new' ? [...cards].sort((a, b) => a.id - b.id)
    : cards;

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        {/* Main feed */}
        <div style={{ flex: 1, minWidth: 0, padding: '20px 24px' }}>
          {/* Stories */}
          <StoryBar />

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '6px', padding: '16px 0', flexWrap: 'wrap' }}>
            {FILTERS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '99px',
                  border: activeFilter === id ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.07)',
                  background: activeFilter === id ? 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(6,182,212,0.1))' : 'rgba(255,255,255,0.04)',
                  color: activeFilter === id ? '#A78BFA' : '#64748B',
                  fontSize: '13px', fontWeight: activeFilter === id ? 600 : 500,
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
            <button style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '99px',
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.04)',
              color: '#64748B', fontSize: '13px', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}>
              <Filter size={13} /> Filter <ChevronDown size={13} />
            </button>
          </div>

          {/* Hero banner */}
          <div style={{
            borderRadius: '24px', padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg,rgba(139,92,246,0.2) 0%,rgba(6,182,212,0.15) 50%,rgba(236,72,153,0.15) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top right,rgba(6,182,212,0.15) 0%,transparent 60%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '99px', padding: '4px 12px', marginBottom: '12px' }}>
                <Zap size={12} color="#A78BFA" fill="#A78BFA" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#A78BFA' }}>No Restrictions. No Limits.</span>
              </div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', lineHeight: 1.2, marginBottom: '10px' }}>
                Share <span style={{ background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Everything.</span>
                <br />Be Discovered by Millions.
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '15px', marginBottom: '20px', maxWidth: '400px' }}>
                Videos, reels, audio, images, 3D, documents — all content types, zero categories, infinite creativity.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowUpload(true)}
                  style={{
                    background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
                    color: 'white', border: 'none', borderRadius: '14px', padding: '12px 24px',
                    fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                    boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                  }}
                >Upload Now →</button>
                <button
                  onClick={() => setShowAuth(true)}
                  style={{
                    background: 'rgba(255,255,255,0.07)', color: 'white',
                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '12px 24px',
                    fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >Get Started Free</button>
              </div>
            </div>
          </div>

          {/* Feed grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}>
            {filteredCards.map((card, i) => (
              <FeedCard key={card.id} card={card} index={i} />
            ))}
          </div>

          {/* Infinite scroll loader */}
          <div ref={loaderRef} style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
            {loading && (
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#8B5CF6', opacity: 0.6,
                    animation: `float ${0.6 + i * 0.2}s ease-in-out infinite`,
                  }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{
          width: '300px', flexShrink: 0, padding: '20px 20px 20px 0',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {/* Trending topics */}
          <div style={{
            background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TrendingUp size={16} color="#EC4899" />
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px' }}>Trending Now</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {TRENDING_TAGS.map(tag => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          </div>

          {/* Suggested creators */}
          <div style={{
            background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Users size={16} color="#8B5CF6" />
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px' }}>Top Creators</h3>
            </div>
            {CREATORS.map(c => (
              <div key={c.handle} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px', borderRadius: '12px', marginBottom: '4px',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg,${c.color},${c.color}60)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px', color: 'white',
                  border: `2px solid ${c.color}40`,
                }}>{c.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                    {c.verified && (
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: 'white', fontWeight: 800, flexShrink: 0 }}>✓</div>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{c.followers} followers</div>
                </div>
                <button style={{
                  background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
                  color: '#A78BFA', borderRadius: '8px', padding: '4px 10px',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; }}
                >Follow</button>
              </div>
            ))}
          </div>

          {/* Platform stats */}
          <div style={{
            background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(6,182,212,0.08))',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '20px', padding: '20px',
          }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '14px', marginBottom: '14px', color: '#A78BFA' }}>Platform Stats</h3>
            {[
              { label: 'Active Creators', value: '8.4M', icon: '✨' },
              { label: 'Content Pieces', value: '2.1B', icon: '🎬' },
              { label: 'Monthly Views', value: '48B', icon: '👁️' },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>{stat.icon} {stat.label}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#F1F5F9' }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {showAuth && <AuthModal mode="register" onClose={() => setShowAuth(false)} />}
    </>
  );
}
