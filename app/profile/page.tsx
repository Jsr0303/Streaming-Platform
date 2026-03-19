'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import FeedCard from '@/components/FeedCard';
import {
  Settings, Share2, Grid, Play, Music, Image as ImageIcon, FileText, Layers,
  Star, Verified, TrendingUp, Users, Heart, Eye, Plus, Edit, Award
} from 'lucide-react';

const PROFILE_CARDS = [
  { id: 201, type: 'video' as const, title: 'My Cinematic Drone Travel Series — Episode 1: Iceland', creator: 'You', creatorAvatar: 'J', creatorColor: '#8B5CF6', thumbnail: '', likes: 45200, comments: 1840, views: '890K', duration: '18:42', tags: ['travel', 'drone', 'iceland'], time: '3 days ago', verified: true },
  { id: 202, type: 'reel' as const, title: 'Speed edit: turning a RAW photo into a banger in 60 seconds', creator: 'You', creatorAvatar: 'J', creatorColor: '#8B5CF6', thumbnail: '', likes: 89300, comments: 3200, views: '2.1M', duration: '1:02', tags: ['editing', 'photography', 'quick'], time: '1 week ago', verified: true },
  { id: 203, type: 'audio' as const, title: 'Atmospheric Piano Composition — Study & Focus Night Vibes', creator: 'You', creatorAvatar: 'J', creatorColor: '#8B5CF6', thumbnail: '', likes: 23100, comments: 640, views: '456K', duration: '5:34', tags: ['piano', 'study', 'ambient'], time: '2 weeks ago', verified: true },
  { id: 204, type: 'image' as const, title: 'Long Exposure City Street Photography Collection', creator: 'You', creatorAvatar: 'J', creatorColor: '#8B5CF6', thumbnail: '', likes: 67800, comments: 2100, views: '1.3M', tags: ['photography', 'city', 'longexposure'], time: '3 weeks ago', verified: true },
  { id: 205, type: '3d' as const, title: 'Interactive 3D Architecture Model — Future City Concept', creator: 'You', creatorAvatar: 'J', creatorColor: '#8B5CF6', thumbnail: '', likes: 18500, comments: 780, views: '234K', tags: ['3D', 'architecture', 'concept'], time: '1 month ago', verified: true },
  { id: 206, type: 'document' as const, title: 'Complete Guide to Cinematic Colour Grading — 45 Pages', creator: 'You', creatorAvatar: 'J', creatorColor: '#8B5CF6', thumbnail: '', likes: 31200, comments: 920, views: '678K', tags: ['guide', 'colorgrading', 'cinema'], time: '1 month ago', verified: true },
];

const CONTENT_TABS = [
  { id: 'all', label: 'All', icon: Grid },
  { id: 'video', label: 'Videos', icon: Play },
  { id: 'reel', label: 'Reels', icon: Play },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'image', label: 'Photos', icon: ImageIcon },
  { id: 'document', label: 'Docs', icon: FileText },
  { id: '3d', label: '3D', icon: Layers },
];

const ACHIEVEMENTS = [
  { icon: '🔥', label: 'Viral Creator', color: '#EC4899' },
  { icon: '⚡', label: 'Top Upload', color: '#F97316' },
  { icon: '🌍', label: 'Global Reach', color: '#06B6D4' },
  { icon: '💫', label: 'Verified Pro', color: '#8B5CF6' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [following, setFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(284700);

  function handleFollow() {
    setFollowing(f => !f);
    setFollowCount(c => following ? c - 1 : c + 1);
  }

  function formatNum(n: number) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  }

  const filtered = activeTab === 'all' ? PROFILE_CARDS
    : PROFILE_CARDS.filter(c => c.type === activeTab);

  return (
    <>
      <Navbar />
      <div>
        {/* Hero banner */}
        <div style={{
          height: '220px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg,rgba(139,92,246,0.3) 0%,rgba(6,182,212,0.2) 50%,rgba(236,72,153,0.2) 100%)',
        }}>
          {/* Animated orbs */}
          <div style={{ position: 'absolute', top: '-30px', left: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle,rgba(139,92,246,0.4),transparent 70%)', borderRadius: '50%', animation: 'float 5s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-30px', right: '15%', width: '180px', height: '180px', background: 'radial-gradient(circle,rgba(6,182,212,0.3),transparent 70%)', borderRadius: '50%', animation: 'float 7s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
            <button style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px 12px', color: 'white', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif' }}>
              <Share2 size={14} /> Share
            </button>
            <button style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px 12px', color: 'white', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif' }}>
              <Settings size={14} /> Settings
            </button>
          </div>
        </div>

        <div style={{ padding: '0 32px 32px', maxWidth: '1100px', margin: '0 auto' }}>
          {/* Profile info row */}
          <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-end', marginBottom: '28px', marginTop: '-60px', position: 'relative', zIndex: 2, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: '120px', height: '120px', borderRadius: '28px', flexShrink: 0,
              background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '48px', color: 'white',
              border: '4px solid #050510',
              boxShadow: '0 0 40px rgba(139,92,246,0.5), 0 8px 40px rgba(0,0,0,0.4)',
            }}>J</div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: '200px', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '28px' }}>Jai Khan</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(6,182,212,0.1))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', padding: '3px 8px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: 'white', fontWeight: 800 }}>✓</div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#A78BFA' }}>Verified Pro</span>
                </div>
              </div>
              <div style={{ color: '#64748B', fontSize: '14px', marginBottom: '8px' }}>@jaikh · Filmmaker · Creator · 3D Artist</div>
              <div style={{ fontSize: '14px', color: '#94A3B8', maxWidth: '500px', lineHeight: 1.6 }}>
                Building the future of content creation. 🎬 Cinematographer by day, coder by night. 
                Sharing everything I create — no limits, no categories.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', paddingBottom: '8px' }}>
              <button
                onClick={handleFollow}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: following ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
                  color: 'white', border: following ? '1px solid rgba(255,255,255,0.15)' : 'none',
                  borderRadius: '14px', padding: '11px 24px',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '14px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: following ? 'none' : '0 4px 20px rgba(139,92,246,0.4)',
                }}
              >
                {following ? '✓ Following' : <><Plus size={16} /> Follow</>}
              </button>
              <button style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', borderRadius: '14px', padding: '11px 20px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={14} /> Edit Profile
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Content Pieces', value: '248', icon: Grid, color: '#8B5CF6' },
              { label: 'Followers', value: formatNum(followCount), icon: Users, color: '#EC4899' },
              { label: 'Following', value: '1,204', icon: Users, color: '#06B6D4' },
              { label: 'Total Views', value: '8.4M', icon: Eye, color: '#F97316' },
              { label: 'Total Likes', value: '2.1M', icon: Heart, color: '#EF4444' },
              { label: 'Monthly Reach', value: '12M', icon: TrendingUp, color: '#10B981' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(20px)',
                border: `1px solid ${stat.color}20`, borderRadius: '16px',
                padding: '16px 20px', flex: '1', minWidth: '120px', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${stat.color}40`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${stat.color}20`; e.currentTarget.style.transform = 'none'; }}
              >
                <stat.icon size={18} color={stat.color} style={{ marginBottom: '6px' }} />
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '20px', color: '#F1F5F9' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {ACHIEVEMENTS.map(a => (
              <div key={a.label} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: `${a.color}10`, border: `1px solid ${a.color}25`,
                borderRadius: '99px', padding: '5px 14px',
              }}>
                <span style={{ fontSize: '14px' }}>{a.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: a.color }}>{a.label}</span>
              </div>
            ))}
          </div>

          {/* Content type tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {CONTENT_TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: 'none', whiteSpace: 'nowrap',
                background: activeTab === id ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'none',
                color: activeTab === id ? 'white' : '#64748B',
                fontSize: '13px', fontWeight: activeTab === id ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                boxShadow: activeTab === id ? '0 4px 15px rgba(139,92,246,0.3)' : 'none',
              }}>
                <Icon size={13} />
                {label}
                {activeTab === id && (
                  <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '99px', padding: '1px 7px', fontSize: '11px', fontWeight: 700 }}>
                    {id === 'all' ? PROFILE_CARDS.length : PROFILE_CARDS.filter(c => c.type === id).length}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Content grid */}
          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {filtered.map((card, i) => <FeedCard key={card.id} card={card} index={i} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>No content yet</div>
              <div style={{ fontSize: '14px' }}>Be the first to upload this type of content!</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
