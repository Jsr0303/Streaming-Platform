'use client';
import { useState } from 'react';
import { X, DollarSign, Heart, Zap, Crown, Star, Gift, ChevronRight } from 'lucide-react';

const TIP_AMOUNTS = [1, 2, 5, 10, 20, 50];

const SUBSCRIPTION_TIERS = [
  { id: 'fan', label: 'Fan', price: '$4.99/mo', color: '#8B5CF6', perks: ['Ad-free viewing', 'HD content', 'Fan badge'], icon: Star },
  { id: 'supporter', label: 'Supporter', price: '$9.99/mo', color: '#06B6D4', perks: ['All Fan benefits', 'Exclusive reels', 'DM access', 'Early access'], icon: Heart },
  { id: 'vip', label: 'VIP', price: '$19.99/mo', color: '#F59E0B', perks: ['All Supporter benefits', 'Private livestreams', 'Custom emoji', 'Monthly call'], icon: Crown },
];

export default function MonetizationModal({ creator, onClose }: { creator: { name: string; avatar: string; color: string; handle: string }; onClose: () => void }) {
  const [tab, setTab] = useState<'tip' | 'subscribe'>('tip');
  const [customTip, setCustomTip] = useState('');
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function handlePay() {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setProcessing(false);
    setSuccess(true);
  }

  const tipValue = customTip ? parseFloat(customTip) : selectedTip;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: 'rgba(10,10,26,0.98)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 30px 100px rgba(0,0,0,0.6)', animation: 'scaleIn 0.2s' }}>
        {/* Header */}
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg,${creator.color},${creator.color}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', color: 'white' }}>{creator.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>{creator.name}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{creator.handle}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={15} color="#94A3B8" />
            </button>
          </div>

          {/* Tab switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '4px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {(['tip', 'subscribe'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '10px', borderRadius: '10px', border: 'none',
                background: tab === t ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'none',
                color: tab === t ? 'white' : '#64748B',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                boxShadow: tab === t ? '0 4px 15px rgba(139,92,246,0.3)' : 'none',
              }}>
                {t === 'tip' ? <Gift size={15} /> : <Crown size={15} />}
                {t === 'tip' ? 'Send a Tip' : 'Subscribe'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>{tab === 'tip' ? '💸' : '👑'}</div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '24px', marginBottom: '8px' }}>
                {tab === 'tip' ? `Tip Sent! 🎉` : `Subscribed! 🎉`}
              </h3>
              <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>
                {tab === 'tip' ? `You sent $${tipValue?.toFixed(2)} to ${creator.name}` : `Welcome to ${creator.name}'s community!`}
              </p>
              <button onClick={onClose} style={{ background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 28px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Done</button>
            </div>
          ) : tab === 'tip' ? (
            <>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '12px' }}>Select an amount</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
                {TIP_AMOUNTS.map(amt => (
                  <button key={amt} onClick={() => { setSelectedTip(amt); setCustomTip(''); }} style={{
                    padding: '12px', borderRadius: '12px', border: `1px solid ${selectedTip === amt ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.07)'}`,
                    background: selectedTip === amt ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                    color: selectedTip === amt ? '#A78BFA' : '#94A3B8',
                    fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>${amt}</button>
                ))}
              </div>
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: '16px', fontWeight: 700 }}>$</span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customTip}
                  onChange={e => { setCustomTip(e.target.value); setSelectedTip(null); }}
                  min="0.5"
                  className="input-glass"
                  style={{ width: '100%', padding: '12px 16px 12px 32px', fontSize: '15px' }}
                />
              </div>
              <button
                onClick={handlePay}
                disabled={!tipValue || processing}
                style={{
                  width: '100%', padding: '14px',
                  background: tipValue ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'rgba(255,255,255,0.07)',
                  color: tipValue ? 'white' : '#475569',
                  border: 'none', borderRadius: '14px',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '15px',
                  cursor: tipValue ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                  boxShadow: tipValue ? '0 4px 20px rgba(139,92,246,0.4)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <DollarSign size={16} />
                {processing ? 'Processing...' : `Send $${tipValue?.toFixed(2) || '—'} Tip`}
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {SUBSCRIPTION_TIERS.map(tier => (
                  <div key={tier.id} onClick={() => setSelectedTier(tier.id)} style={{
                    border: `1px solid ${selectedTier === tier.id ? tier.color + '60' : 'rgba(255,255,255,0.07)'}`,
                    background: selectedTier === tier.id ? `${tier.color}10` : 'rgba(255,255,255,0.02)',
                    borderRadius: '16px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${tier.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <tier.icon size={18} color={tier.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px' }}>{tier.label}</span>
                          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '14px', color: tier.color }}>{tier.price}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                          {tier.perks.map(p => (
                            <span key={p} style={{ fontSize: '11px', color: '#64748B', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', padding: '2px 6px' }}>✓ {p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handlePay}
                disabled={!selectedTier || processing}
                style={{
                  width: '100%', padding: '14px',
                  background: selectedTier ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'rgba(255,255,255,0.07)',
                  color: selectedTier ? 'white' : '#475569',
                  border: 'none', borderRadius: '14px',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '15px',
                  cursor: selectedTier ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                  boxShadow: selectedTier ? '0 4px 20px rgba(139,92,246,0.4)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <Crown size={16} />
                {processing ? 'Processing...' : 'Subscribe Now'}
                {selectedTier && !processing && <ChevronRight size={16} />}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
