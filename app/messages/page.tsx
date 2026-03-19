'use client';
import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Search, Send, Image, Smile, Paperclip, Phone, Video, MoreHorizontal, Check, CheckCheck, Circle } from 'lucide-react';

const CONTACTS = [
  { id: 1, name: 'Alex Chen', handle: '@alexchen', avatar: 'A', color: '#EC4899', online: true, lastMsg: 'That drone footage was 🔥🔥', time: '2m', unread: 3 },
  { id: 2, name: 'Sarah K', handle: '@sarah_k', avatar: 'S', color: '#06B6D4', online: true, lastMsg: 'Can you collab on next reel?', time: '15m', unread: 1 },
  { id: 3, name: 'BeatMaker', handle: '@beatmaker', avatar: 'B', color: '#F97316', online: false, lastMsg: 'Sent you the stems 🎵', time: '1h', unread: 0 },
  { id: 4, name: 'LensVision', handle: '@lensvision', avatar: 'L', color: '#8B5CF6', online: true, lastMsg: 'Check the edit I did', time: '3h', unread: 0 },
  { id: 5, name: 'DevStream', handle: '@devstream', avatar: 'D', color: '#10B981', online: false, lastMsg: 'Live stream collab next week?', time: '1d', unread: 0 },
  { id: 6, name: 'PixelMind', handle: '@pixelmind', avatar: 'P', color: '#A855F7', online: true, lastMsg: 'That AI art tutorial 😍', time: '2d', unread: 0 },
];

const INITIAL_MESSAGES: Record<number, { id: number; text: string; from: 'me' | 'them'; time: string; read?: boolean }[]> = {
  1: [
    { id: 1, text: 'Hey! Just watched your latest drone video 🎬', from: 'them', time: '10:02' },
    { id: 2, text: 'The Iceland footage was absolutely cinematic!', from: 'them', time: '10:02' },
    { id: 3, text: 'Thank you so much! That trip was insane 🙏', from: 'me', time: '10:15', read: true },
    { id: 4, text: 'Would you be interested in a collab shoot?', from: 'them', time: '10:16' },
    { id: 5, text: 'Absolutely! What did you have in mind?', from: 'me', time: '10:20', read: true },
    { id: 6, text: 'That drone footage was 🔥🔥', from: 'them', time: '10:45' },
  ],
  2: [
    { id: 1, text: 'Hey! Love your content 💜', from: 'them', time: '9:30' },
    { id: 2, text: 'Can you collab on next reel?', from: 'them', time: '9:31' },
  ],
};

const EMOJIS = ['😂', '❤️', '🔥', '👏', '😍', '🎉', '💯', '🙌', '👀', '✨', '🚀', '💪'];

export default function MessagesPage() {
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, activeContact]);

  function sendMessage() {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), text: input, from: 'me' as const, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), read: false };
    setMessages(prev => ({ ...prev, [activeContact.id]: [...(prev[activeContact.id] || []), newMsg] }));
    setInput('');
    setShowEmoji(false);
  }

  function addEmoji(emoji: string) { setInput(i => i + emoji); }

  const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(searchQ.toLowerCase()) || c.handle.includes(searchQ.toLowerCase()));
  const activeMessages = messages[activeContact.id] || [];

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
        {/* Contacts sidebar */}
        <div style={{ width: '340px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 16px 12px' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: '14px' }}>Messages</h2>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search conversations..."
                className="input-glass"
                style={{ width: '100%', padding: '10px 12px 10px 36px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(contact => (
              <div
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', cursor: 'pointer', transition: 'all 0.15s',
                  background: activeContact.id === contact.id ? 'linear-gradient(90deg,rgba(139,92,246,0.12),transparent)' : 'none',
                  borderLeft: activeContact.id === contact.id ? '2px solid #8B5CF6' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (activeContact.id !== contact.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (activeContact.id !== contact.id) e.currentTarget.style.background = 'none'; }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: `linear-gradient(135deg,${contact.color},${contact.color}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '17px', color: 'white' }}>{contact.avatar}</div>
                  {contact.online && <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '11px', height: '11px', background: '#10B981', borderRadius: '50%', border: '2px solid #050510' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.name}</span>
                    <span style={{ fontSize: '11px', color: contact.unread ? '#8B5CF6' : '#475569', flexShrink: 0 }}>{contact.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{contact.lastMsg}</span>
                    {contact.unread > 0 && <div style={{ background: '#8B5CF6', color: 'white', borderRadius: '99px', minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, padding: '0 4px', flexShrink: 0, marginLeft: '8px' }}>{contact.unread}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg,${activeContact.color},${activeContact.color}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px', color: 'white' }}>{activeContact.avatar}</div>
              {activeContact.online && <div style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', background: '#10B981', borderRadius: '50%', border: '2px solid #050510' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{activeContact.name}</div>
              <div style={{ fontSize: '12px', color: activeContact.online ? '#10B981' : '#475569' }}>{activeContact.online ? 'Online' : 'Offline'}</div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[Phone, Video, MoreHorizontal].map((Icon, i) => (
                <button key={i} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}>
                  <Icon size={16} color="#94A3B8" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeMessages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%',
                  background: msg.from === 'me'
                    ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)'
                    : 'rgba(255,255,255,0.07)',
                  border: msg.from === 'me' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  boxShadow: msg.from === 'me' ? '0 4px 15px rgba(139,92,246,0.3)' : 'none',
                }}>
                  <div style={{ fontSize: '14px', lineHeight: 1.5 }}>{msg.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', color: msg.from === 'me' ? 'rgba(255,255,255,0.5)' : '#475569' }}>{msg.time}</span>
                    {msg.from === 'me' && (
                      msg.read ? <CheckCheck size={12} color="rgba(255,255,255,0.6)" /> : <Check size={12} color="rgba(255,255,255,0.4)" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Emoji picker */}
          {showEmoji && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'rgba(5,5,16,0.95)' }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => addEmoji(e)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', transition: 'transform 0.1s' }}
                  onMouseEnter={ev => (ev.currentTarget.style.transform = 'scale(1.3)')}
                  onMouseLeave={ev => (ev.currentTarget.style.transform = 'scale(1)')}
                >{e}</button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px', alignItems: 'flex-end', flexShrink: 0 }}>
            {[Paperclip, Image].map((Icon, i) => (
              <button key={i} style={{ flexShrink: 0, width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon size={16} color="#64748B" />
              </button>
            ))}
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={`Message ${activeContact.name}...`}
                rows={1}
                className="input-glass"
                style={{ width: '100%', padding: '10px 14px', fontSize: '14px', resize: 'none', maxHeight: '120px', lineHeight: 1.5 }}
              />
            </div>
            <button onClick={() => setShowEmoji(s => !s)} style={{ flexShrink: 0, width: '38px', height: '38px', borderRadius: '10px', background: showEmoji ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Smile size={18} color={showEmoji ? '#A78BFA' : '#64748B'} />
            </button>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              style={{
                flexShrink: 0, width: '42px', height: '42px', borderRadius: '12px',
                background: input.trim() ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'rgba(255,255,255,0.07)',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                boxShadow: input.trim() ? '0 4px 15px rgba(139,92,246,0.4)' : 'none',
              }}
            >
              <Send size={17} color={input.trim() ? 'white' : '#475569'} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
