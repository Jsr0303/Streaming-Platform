'use client';
import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

const STORIES = [
  { id: 0, isAdd: true, label: 'Your Story', avatar: 'J', color: '#8B5CF6' },
  { id: 1, name: 'alexchen', avatar: 'A', color: '#EC4899', seen: false, type: 'video' },
  { id: 2, name: 'sarah_k', avatar: 'S', color: '#06B6D4', seen: false, type: 'image' },
  { id: 3, name: 'beatmaker', avatar: 'B', color: '#F97316', seen: true, type: 'audio' },
  { id: 4, name: 'devstudio', avatar: 'D', color: '#10B981', seen: false, type: 'video' },
  { id: 5, name: 'luna.art', avatar: 'L', color: '#F59E0B', seen: false, type: 'image' },
  { id: 6, name: 'techwave', avatar: 'T', color: '#8B5CF6', seen: true, type: 'video' },
  { id: 7, name: 'neonpulse', avatar: 'N', color: '#EC4899', seen: false, type: 'reel' },
  { id: 8, name: 'codevid', avatar: 'C', color: '#06B6D4', seen: true, type: 'doc' },
  { id: 9, name: 'musicpro', avatar: 'M', color: '#6366F1', seen: false, type: 'audio' },
];

export default function StoryBar() {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function openStory(id: number) {
    if (id === 0) return;
    setActiveStory(id);
    setProgress(0);
  }

  useEffect(() => {
    if (activeStory !== null) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(intervalRef.current!);
            setActiveStory(null);
            return 0;
          }
          return p + 2;
        });
      }, 60);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeStory]);

  const activeUser = STORIES.find(s => s.id === activeStory);

  return (
    <>
      <div style={{
        padding: '16px 0 12px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '4px',
      }}>
        <div style={{
          display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}>
          {STORIES.map((story) => (
            <div
              key={story.id}
              onClick={() => openStory(story.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', flexShrink: 0 }}
            >
              <div style={{ position: 'relative' }}>
                {/* Ring for unseen */}
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%', padding: '2px',
                  background: story.isAdd
                    ? 'rgba(255,255,255,0.08)'
                    : (!story.seen
                      ? `linear-gradient(135deg,#8B5CF6,#06B6D4,#EC4899)`
                      : 'rgba(255,255,255,0.1)'),
                  opacity: story.seen ? 0.5 : 1,
                  transition: 'all 0.2s',
                  transform: 'scale(1)',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: `linear-gradient(135deg,${story.color}40,${story.color}20)`,
                    border: '2px solid rgba(5,5,16,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', color: story.color,
                  }}>
                    {story.isAdd ? (
                      <div style={{ position: 'relative' }}>
                        <div style={{ fontWeight: 700, fontSize: '18px' }}>J</div>
                      </div>
                    ) : story.avatar}
                  </div>
                </div>
                {story.isAdd && (
                  <div style={{
                    position: 'absolute', bottom: '0', right: '0',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
                    border: '2px solid #050510',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Plus size={10} color="white" /></div>
                )}
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 500,
                color: story.seen ? '#475569' : '#94A3B8',
                maxWidth: '56px', textAlign: 'center',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {story.isAdd ? 'Add story' : story.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Story viewer modal */}
      {activeStory !== null && activeUser && !('isAdd' in activeUser) && (
        <div
          onClick={() => setActiveStory(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '380px', height: '680px', borderRadius: '24px', overflow: 'hidden',
              background: `linear-gradient(180deg,${(activeUser as any).color}30 0%,#050510 100%)`,
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
              animation: 'scaleIn 0.2s ease-out',
            }}
          >
            {/* Progress bar */}
            <div style={{ padding: '12px 12px 0', position: 'relative', zIndex: 2 }}>
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.2)', borderRadius: '99px' }}>
                <div style={{
                  height: '100%', background: 'white', borderRadius: '99px',
                  width: `${progress}%`, transition: 'none',
                }} />
              </div>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: `linear-gradient(135deg,${(activeUser as any).color},${(activeUser as any).color}80)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'white',
              }}>{(activeUser as any).avatar}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>@{(activeUser as any).name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Just now</div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
              ><X size={20} color="white" /></button>
            </div>

            {/* Story content */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '64px',
                  color: (activeUser as any).color, opacity: 0.3,
                }}>{(activeUser as any).avatar}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Story content</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
