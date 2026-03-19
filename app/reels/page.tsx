'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX,
  ChevronUp, ChevronDown, Play, Pause, MoreHorizontal, Info
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const REELS = [
  { id: 1, creator: 'PixelMind', handle: '@pixelmind', avatar: 'P', color: '#EC4899', title: 'AI art timelapse from blank canvas to masterpiece 🎨', likes: 2100000, comments: 89000, saves: 340000, tags: ['#AIArt', '#Timelapse', '#Digital'], audio: 'Original Sound — PixelMind', duration: 45 },
  { id: 2, creator: 'CraftMaster', handle: '@craftmaster', avatar: 'C', color: '#F97316', title: 'The most satisfying wood split you\'ll ever watch 🪵', likes: 5400000, comments: 234000, saves: 890000, tags: ['#Woodworking', '#Satisfying', '#ASMR'], audio: 'ASMR Sounds Mix', duration: 32 },
  { id: 3, creator: 'NeonDancer', handle: '@neondancer', avatar: 'N', color: '#8B5CF6', title: 'This 3D holographic dance is not CGI 🕺✨', likes: 8900000, comments: 412000, saves: 1200000, tags: ['#Dance', '#Hologram', '#Future'], audio: 'Future Bass — Synthetic', duration: 58 },
  { id: 4, creator: 'SoundWave', handle: '@soundwave', avatar: 'S', color: '#06B6D4', title: 'Made this beat in 60 seconds using only my phone 🔥', likes: 3200000, comments: 156000, saves: 567000, tags: ['#Music', '#BeatMaking', '#Quick'], audio: 'Original Beat — SoundWave', duration: 60 },
  { id: 5, creator: 'SpaceVid', handle: '@spacevid', avatar: 'SV', color: '#6366F1', title: 'ISS timelapse: Earth from 400km up 🌍', likes: 12000000, comments: 678000, saves: 2100000, tags: ['#Space', '#ISS', '#Earth'], audio: 'Ambient Space — NASA', duration: 44 },
];

const GRADIENT_BG = [
  'linear-gradient(180deg,#1a0535 0%,#050510 50%,#0d1535 100%)',
  'linear-gradient(180deg,#2a0d0d 0%,#050510 50%,#1a0d2a 100%)',
  'linear-gradient(180deg,#0d1a35 0%,#050510 50%,#1a350d 100%)',
  'linear-gradient(180deg,#0d2a2a 0%,#050510 50%,#350d2a 100%)',
  'linear-gradient(180deg,#1a1a00 0%,#050510 50%,#001a2a 100%)',
];

function formatNum(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function ReelItem({ reel, index, isActive }: { reel: typeof REELS[0]; index: number; isActive: boolean }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.likes);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!isActive) { setPlaying(false); return; }
    setPlaying(true);
  }, [isActive]);

  useEffect(() => {
    if (!playing || !isActive) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 0;
        return p + (100 / (reel.duration * 10));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing, isActive, reel.duration]);

  function handleLike() {
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
  }

  return (
    <div
      className="reel-item"
      style={{
        position: 'relative', overflow: 'hidden',
        background: GRADIENT_BG[index % GRADIENT_BG.length],
      }}
    >
      {/* Background art */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '200px', opacity: 0.06, fontFamily: 'Outfit, sans-serif', fontWeight: 900,
        color: reel.color, userSelect: 'none', pointerEvents: 'none',
      }}>
        {reel.avatar}
      </div>

      {/* Glow effect */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${reel.color}20 0%, transparent 70%)`,
      }} />

      {/* Play overlay on pause */}
      {!playing && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5, background: 'rgba(0,0,0,0.3)',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Play size={32} color="white" fill="white" />
          </div>
        </div>
      )}

      {/* Tap area */}
      <div
        style={{ position: 'absolute', inset: 0, zIndex: 3 }}
        onClick={() => setPlaying(p => !p)}
      />

      {/* Progress bar (top) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)' }}>
          <div style={{ height: '100%', background: 'white', width: `${progress}%`, transition: 'none' }} />
        </div>
      </div>

      {/* Top controls */}
      <div style={{ position: 'absolute', top: '20px', left: 0, right: 0, padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <button onClick={() => setMuted(m => !m)} style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {muted ? <VolumeX size={16} color="white" /> : <Volume2 size={16} color="white" />}
        </button>
        <button onClick={() => setShowInfo(s => !s)} style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <MoreHorizontal size={16} color="white" />
        </button>
      </div>

      {/* Bottom info */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '80px 16px 24px', zIndex: 10, background: 'linear-gradient(to top,rgba(0,0,0,0.8),transparent)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          {/* Left: creator + caption */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg,${reel.color},${reel.color}60)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '14px', color: 'white',
                border: `2px solid ${reel.color}80`,
              }}>{reel.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{reel.creator}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{reel.handle}</div>
              </div>
              <button style={{
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: 'white',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>Follow</button>
            </div>

            <p style={{ fontSize: '14px', marginBottom: '8px', lineHeight: 1.4, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{reel.title}</p>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {reel.tags.map(t => (
                <span key={t} style={{ fontSize: '12px', fontWeight: 600, color: reel.color, textShadow: `0 0 12px ${reel.color}60` }}>{t}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              <span>♪</span> {reel.audio}
            </div>
          </div>

          {/* Right: action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <button onClick={handleLike} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#EC4899' : 'white' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: liked ? 'rgba(236,72,153,0.2)' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', transform: liked ? 'scale(1.1)' : 'scale(1)' }}>
                <Heart size={22} fill={liked ? '#EC4899' : 'none'} color={liked ? '#EC4899' : 'white'} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{formatNum(likeCount)}</span>
            </button>

            <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={22} color="white" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{formatNum(reel.comments)}</span>
            </button>

            <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Share2 size={22} color="white" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Share</span>
            </button>

            <button onClick={() => setSaved(s => !s)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: saved ? '#F59E0B' : 'white' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: saved ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <Bookmark size={22} fill={saved ? '#F59E0B' : 'none'} color={saved ? '#F59E0B' : 'white'} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{formatNum(reel.saves)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReelsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    if (!containerRef.current) return;
    const idx = Math.round(containerRef.current.scrollTop / window.innerHeight);
    setActiveIndex(idx);
  }

  function goNext() {
    containerRef.current?.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }
  function goPrev() {
    containerRef.current?.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#050510', position: 'fixed', inset: 0, zIndex: 100 }}>
      {/* Header bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '20px', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Reels
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {REELS.map((_, i) => (
            <div key={i} style={{ width: i === activeIndex ? '20px' : '6px', height: '6px', borderRadius: '99px', background: i === activeIndex ? '#8B5CF6' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="reel-snap"
        style={{ height: '100vh', width: '100%' }}
      >
        {REELS.map((reel, i) => (
          <ReelItem key={reel.id} reel={reel} index={i} isActive={i === activeIndex} />
        ))}
      </div>

      {/* Nav arrows */}
      <button onClick={goPrev} style={{ position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-80px)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20 }}>
        <ChevronUp size={20} color="white" />
      </button>
      <button onClick={goNext} style={{ position: 'fixed', right: '20px', top: '50%', transform: 'translateY(40px)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20 }}>
        <ChevronDown size={20} color="white" />
      </button>
    </div>
  );
}
