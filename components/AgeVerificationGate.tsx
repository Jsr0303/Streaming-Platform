'use client';
import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, X, Lock } from 'lucide-react';

export default function AgeVerificationGate({ onVerified }: { onVerified: () => void }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [declined, setDeclined] = useState(false);

  function verify() {
    const d = parseInt(day), m = parseInt(month), y = parseInt(year);
    if (!d || !m || !y || y < 1900 || y > 2025) {
      setError('Please enter a valid date of birth.');
      return;
    }
    const dob = new Date(y, m - 1, d);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) {
      setDeclined(true);
      return;
    }
    localStorage.setItem('mv_age_verified', 'true');
    onVerified();
  }

  if (declined) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#050510',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center', padding: '40px',
      }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <X size={36} color="#EF4444" />
        </div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '28px', marginBottom: '12px' }}>Access Denied</h2>
        <p style={{ color: '#64748B', fontSize: '16px', maxWidth: '360px' }}>
          You must be 18 or older to access this content. This platform complies with all applicable age-restriction laws.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(30px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(236,72,153,0.06),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: '480px',
        background: 'rgba(10,10,26,0.98)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '32px', overflow: 'hidden',
        boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
        animation: 'scaleIn 0.3s ease-out',
      }}>
        {/* Top gradient band */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg,#8B5CF6,#06B6D4,#EC4899)' }} />

        <div style={{ padding: '36px' }}>
          {/* Icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.1))',
              border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(139,92,246,0.2)',
            }}>
              <Shield size={38} color="#A78BFA" />
            </div>
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>
            Age Verification Required
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px', textAlign: 'center', lineHeight: 1.6, marginBottom: '32px' }}>
            This platform contains content intended for adults only. Confirm your age to continue.
          </p>

          {/* Warning */}
          <div style={{
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '12px', padding: '12px 16px', display: 'flex', gap: '10px',
            alignItems: 'flex-start', marginBottom: '28px',
          }}>
            <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '13px', color: '#A16207', lineHeight: 1.5 }}>
              Providing a false date of birth is unauthorized and may violate local laws.
            </p>
          </div>

          {/* DOB inputs */}
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '10px', textAlign: 'center' }}>
            Enter your date of birth
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { placeholder: 'DD', value: day, setter: setDay, max: 2 },
              { placeholder: 'MM', value: month, setter: setMonth, max: 2 },
              { placeholder: 'YYYY', value: year, setter: setYear, max: 4 },
            ].map(({ placeholder, value, setter, max }) => (
              <input
                key={placeholder}
                type="number"
                placeholder={placeholder}
                maxLength={max}
                value={value}
                onChange={e => setter(e.target.value.slice(0, max))}
                className="input-glass"
                style={{
                  padding: '14px', textAlign: 'center', fontSize: '18px',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                  letterSpacing: '2px', width: '100%',
                }}
              />
            ))}
          </div>

          {error && (
            <p style={{ color: '#EF4444', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{error}</p>
          )}

          {/* Verify button */}
          <button
            onClick={verify}
            style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
              color: 'white', border: 'none', borderRadius: '16px',
              fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '16px',
              cursor: 'pointer', marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(139,92,246,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(139,92,246,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.5)'; }}
          >
            <CheckCircle2 size={18} />
            I am 18 or older — Continue
          </button>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Lock size={12} color="#475569" />
            <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center' }}>
              We never store your date of birth. Local verification only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
