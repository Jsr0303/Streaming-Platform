'use client';
import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Music, FileText, Image, Volume2, Layers, Eye, TrendingUp } from 'lucide-react';

interface FeedCardProps {
  id: number;
  type: 'video' | 'image' | 'audio' | 'document' | '3d' | 'reel' | 'live';
  title: string;
  creator: string;
  creatorAvatar: string;
  creatorColor: string;
  thumbnail: string;
  likes: number;
  comments: number;
  views: string;
  duration?: string;
  tags: string[];
  time: string;
  verified?: boolean;
}

const TYPE_CONFIG: Record<string, { icon: React.ComponentType<any>; label: string; color: string; bg: string }> = {
  video: { icon: Play, label: 'VIDEO', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
  reel: { icon: Play, label: 'REEL', color: '#EC4899', bg: 'rgba(236,72,153,0.15)' },
  image: { icon: Image, label: 'PHOTO', color: '#06B6D4', bg: 'rgba(6,182,212,0.15)' },
  audio: { icon: Music, label: 'AUDIO', color: '#F97316', bg: 'rgba(249,115,22,0.15)' },
  document: { icon: FileText, label: 'DOC', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  '3d': { icon: Layers, label: '3D', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  live: { icon: Volume2, label: 'LIVE', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
};

const THUMBNAIL_GRADIENTS = [
  'linear-gradient(135deg,#1a0533,#0d1f4a)',
  'linear-gradient(135deg,#0d1f4a,#0a2a1a)',
  'linear-gradient(135deg,#2a0d1f,#1a0533)',
  'linear-gradient(135deg,#0a2a2a,#0d1f4a)',
  'linear-gradient(135deg,#1a1a0d,#2a0d0d)',
  'linear-gradient(135deg,#0d2a1a,#1f0d2a)',
];

const OVERLAY_COLORS = [
  'rgba(139,92,246,0.3)', 'rgba(6,182,212,0.3)', 'rgba(236,72,153,0.3)',
  'rgba(249,115,22,0.3)', 'rgba(16,185,129,0.3)', 'rgba(245,158,11,0.3)',
];

export default function FeedCard({ card, index }: { card: FeedCardProps; index: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(card.likes);
  const [hovered, setHovered] = useState(false);
  const cfg = TYPE_CONFIG[card.type] || TYPE_CONFIG.video;
  const gradientIndex = index % THUMBNAIL_GRADIENTS.length;

  function handleLike() {
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
  }

  function formatNum(n: number) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(15,15,35,0.7)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1)' : '0 4px 20px rgba(0,0,0,0.2)',
        cursor: 'pointer',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <div style={{
          width: '100%', height: '100%',
          background: THUMBNAIL_GRADIENTS[gradientIndex],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.3s',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
        }}>
          {/* Overlay glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at center, ${OVERLAY_COLORS[gradientIndex]} 0%, transparent 70%)`,
          }} />
          {/* Type icon */}
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1,
            transition: 'all 0.3s',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
            boxShadow: hovered ? `0 0 20px ${cfg.color}60` : 'none',
          }}>
            <cfg.icon size={24} color={cfg.color} fill={card.type === 'video' || card.type === 'reel' ? cfg.color : 'none'} />
          </div>
          {/* Duration badge */}
          {card.duration && (
            <div style={{
              position: 'absolute', bottom: '10px', right: '10px',
              background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', padding: '2px 8px', borderRadius: '6px',
              fontSize: '11px', fontWeight: 700,
            }}>{card.duration}</div>
          )}
          {/* Type badge */}
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            background: cfg.bg, backdropFilter: 'blur(8px)',
            border: `1px solid ${cfg.color}40`,
            color: cfg.color, padding: '2px 8px', borderRadius: '6px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            {card.type === 'live' && (
              <div style={{ width: '6px', height: '6px', background: '#EF4444', borderRadius: '50%', animation: 'ping 1s infinite' }} />
            )}
            {cfg.label}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px' }}>
        {/* Creator row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg,${card.creatorColor},${card.creatorColor}80)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '13px', color: 'white',
            border: '2px solid rgba(255,255,255,0.1)',
          }}>
            {card.creatorAvatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{card.creator}</span>
              {card.verified && (
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '8px', color: 'white', fontWeight: 800,
                }}>✓</div>
              )}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{card.time}</div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '8px', color: '#475569', display: 'flex' }}>
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '15px',
          lineHeight: 1.4, marginBottom: '8px', color: '#F1F5F9',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{card.title}</h3>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {card.tags.slice(0, 3).map((tag, i) => (
            <span key={i} style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
              color: '#A78BFA', borderRadius: '99px',
              padding: '2px 10px', fontSize: '11px', fontWeight: 500,
            }}>#{tag}</span>
          ))}
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* Views */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '12px', marginRight: 'auto' }}>
            <Eye size={13} />
            <span>{card.views}</span>
          </div>

          {/* Like */}
          <button onClick={handleLike} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: liked ? 'rgba(236,72,153,0.1)' : 'none',
            border: liked ? '1px solid rgba(236,72,153,0.25)' : '1px solid transparent',
            borderRadius: '99px', padding: '5px 10px', cursor: 'pointer',
            color: liked ? '#EC4899' : '#64748B', fontSize: '12px', fontWeight: 500,
            transition: 'all 0.2s',
          }}>
            <Heart size={14} fill={liked ? '#EC4899' : 'none'} color={liked ? '#EC4899' : '#64748B'} />
            {formatNum(likeCount)}
          </button>

          {/* Comment */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'none', border: '1px solid transparent',
            borderRadius: '99px', padding: '5px 10px', cursor: 'pointer',
            color: '#64748B', fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.1)'; e.currentTarget.style.color = '#06B6D4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748B'; }}
          >
            <MessageCircle size={14} />
            {formatNum(card.comments)}
          </button>

          {/* Share */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'none', border: '1px solid transparent',
            borderRadius: '99px', padding: '5px 10px', cursor: 'pointer',
            color: '#64748B', fontSize: '12px', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.color = '#8B5CF6'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748B'; }}
          >
            <Share2 size={14} />
          </button>

          {/* Save */}
          <button onClick={() => setSaved(s => !s)} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: saved ? 'rgba(245,158,11,0.1)' : 'none',
            border: saved ? '1px solid rgba(245,158,11,0.25)' : '1px solid transparent',
            borderRadius: '99px', padding: '5px 8px', cursor: 'pointer',
            color: saved ? '#F59E0B' : '#64748B', fontSize: '12px', transition: 'all 0.2s',
          }}>
            <Bookmark size={14} fill={saved ? '#F59E0B' : 'none'} color={saved ? '#F59E0B' : '#64748B'} />
          </button>
        </div>
      </div>
    </div>
  );
}
