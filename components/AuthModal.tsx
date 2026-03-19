'use client';
import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Zap, Chrome, Twitter, Github } from 'lucide-react';

export default function AuthModal({ mode, onClose }: { mode: 'login' | 'register'; onClose?: () => void }) {
  const [view, setView] = useState<'login' | 'register'>(mode);
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    onClose?.();
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(25px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(10,10,26,0.98)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '28px', overflow: 'hidden',
        boxShadow: '0 30px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)',
        animation: 'scaleIn 0.2s ease-out',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 28px 20px', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          ><X size={14} color="#94A3B8" /></button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={20} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '18px', background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              MediaVerse
            </span>
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', marginBottom: '6px' }}>
            {view === 'login' ? 'Welcome back 👋' : 'Join MediaVerse ✨'}
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px' }}>
            {view === 'login' ? 'Sign in to continue sharing' : 'Create your account — it\'s free'}
          </p>
        </div>

        <div style={{ padding: '0 28px 28px' }}>
          {/* Social logins */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[
              { icon: Chrome, label: 'Google', color: '#EA4335' },
              { icon: Twitter, label: 'X', color: '#1DA1F2' },
              { icon: Github, label: 'GitHub', color: '#F0F6FC' },
            ].map(({ icon: Icon, label, color }) => (
              <button key={label} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '10px', cursor: 'pointer',
                color: '#94A3B8', fontSize: '13px', fontWeight: 500,
                transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = color + '40'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <Icon size={16} color={color} />
                {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>or continue with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {view === 'register' && (
              <div style={{ position: 'relative' }}>
                <User size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Display name"
                  className="input-glass"
                  style={{ width: '100%', padding: '12px 16px 12px 42px', fontSize: '14px' }}
                />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="input-glass"
                style={{ width: '100%', padding: '12px 16px 12px 42px', fontSize: '14px' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="input-glass"
                style={{ width: '100%', padding: '12px 42px 12px 42px', fontSize: '14px' }}
              />
              <button type="button" onClick={() => setShowPw(s => !s)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
              }}>
                {showPw ? <EyeOff size={16} color="#64748B" /> : <Eye size={16} color="#64748B" />}
              </button>
            </div>

            {view === 'login' && (
              <button type="button" style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: '#8B5CF6', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Forgot password?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
                color: 'white', border: 'none', borderRadius: '14px',
                padding: '13px', fontWeight: 700, fontSize: '15px',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'Outfit, sans-serif',
                boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                transition: 'all 0.2s',
                marginTop: '4px',
              }}
            >
              {loading ? 'Please wait...' : view === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', marginTop: '20px' }}>
            {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: '#8B5CF6', fontWeight: 600, cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
            >
              {view === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
