'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Shield, Eye, EyeOff, Bell, Palette, Lock, Globe, Zap, ChevronRight, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: '48px', height: '26px', borderRadius: '99px', border: 'none',
        background: on ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'rgba(255,255,255,0.1)',
        cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0,
        boxShadow: on ? '0 0 12px rgba(139,92,246,0.4)' : 'none',
      }}
    >
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
        position: 'absolute', top: '3px',
        left: on ? 'calc(100% - 23px)' : '3px',
        transition: 'left 0.2s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

function SettingRow({ label, desc, value, onChange, danger }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void; danger?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ flex: 1, paddingRight: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: danger ? '#EF4444' : '#F1F5F9', marginBottom: desc ? '3px' : 0 }}>{label}</div>
        {desc && <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>{desc}</div>}
      </div>
      <Toggle on={value} onChange={onChange} />
    </div>
  );
}

function Section({ title, icon: Icon, color, children }: { title: string; icon: React.ComponentType<any>; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '22px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={color} />
        </div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '16px' }}>{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  // Content settings
  const [showExplicit, setShowExplicit] = useState(false);
  const [showAdult, setShowAdult] = useState(false);
  const [blurExplicit, setBlurExplicit] = useState(true);
  const [ageVerified, setAgeVerified] = useState(false);
  const [safeSearch, setSafeSearch] = useState(true);

  // Privacy
  const [privateProfile, setPrivateProfile] = useState(false);
  const [hideActivity, setHideActivity] = useState(false);
  const [allowDMs, setAllowDMs] = useState(true);
  const [showOnline, setShowOnline] = useState(true);

  // Notifications
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState(true);
  const [newFollower, setNewFollower] = useState(true);
  const [mentions, setMentions] = useState(true);

  // Appearance
  const [darkMode] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  function enableAdultContent() {
    const verified = typeof window !== 'undefined' && localStorage.getItem('mv_age_verified');
    if (!verified && !ageVerified) {
      alert('Please verify your age first. Visit the home page to complete age verification.');
      return;
    }
    setShowAdult(true);
    setShowExplicit(true);
    setBlurExplicit(false);
    setSafeSearch(false);
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '32px', marginBottom: '6px' }}>Settings</h1>
          <p style={{ color: '#64748B', fontSize: '14px' }}>Manage your account, content preferences, and privacy.</p>
        </div>

        {/* Content & Safety */}
        <Section title="Content & Safety" icon={Shield} color="#8B5CF6">
          <div style={{ marginBottom: '8px', marginTop: '8px' }}>
            {/* Adult content unlock */}
            <div style={{ background: showAdult ? 'rgba(239,68,68,0.06)' : 'rgba(139,92,246,0.06)', border: `1px solid ${showAdult ? 'rgba(239,68,68,0.2)' : 'rgba(139,92,246,0.15)'}`, borderRadius: '14px', padding: '14px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <AlertTriangle size={16} color={showAdult ? '#EF4444' : '#F59E0B'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: showAdult ? '#EF4444' : '#F8FAFC' }}>Explicit / Adult Content</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    {showAdult ? 'Adult content is enabled. You are responsible for compliance with local laws.' : '18+ content is hidden by default. Age verification required to unlock.'}
                  </div>
                </div>
                <Toggle on={showAdult} onChange={v => v ? enableAdultContent() : setShowAdult(false)} />
              </div>
              {!showAdult && (
                <button
                  onClick={enableAdultContent}
                  style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#EF4444,#DC2626)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 15px rgba(239,68,68,0.3)' }}
                >
                  🔞 Unlock Adult Content — I am 18+
                </button>
              )}
            </div>
          </div>

          <SettingRow label="Show Explicit Content" desc="Show explicit content in your feed without blurring" value={showExplicit} onChange={setShowExplicit} danger={showExplicit} />
          <SettingRow label="Blur Sensitive Media" desc="Show a blur overlay on potentially sensitive images and videos" value={blurExplicit} onChange={setBlurExplicit} />
          <SettingRow label="Safe Search" desc="Filter out adult and explicit content from search results" value={safeSearch} onChange={setSafeSearch} />
        </Section>

        {/* Privacy */}
        <Section title="Privacy" icon={Lock} color="#06B6D4">
          <SettingRow label="Private Profile" desc="Only approved followers can see your content" value={privateProfile} onChange={setPrivateProfile} />
          <SettingRow label="Hide Activity Status" desc="No one can see when you're active" value={hideActivity} onChange={setHideActivity} />
          <SettingRow label="Show Online Indicator" desc="Show when you're online to your followers" value={showOnline} onChange={setShowOnline} />
          <SettingRow label="Allow Direct Messages" desc="Let anyone send you messages" value={allowDMs} onChange={setAllowDMs} />
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={Bell} color="#EC4899">
          <SettingRow label="Push Notifications" desc="Receive notifications on this device" value={pushNotifs} onChange={setPushNotifs} />
          <SettingRow label="Email Notifications" desc="Receive email digests and alerts" value={emailNotifs} onChange={setEmailNotifs} />
          <SettingRow label="Live Stream Alerts" desc="Notify me when creators I follow go live" value={liveAlerts} onChange={setLiveAlerts} />
          <SettingRow label="New Followers" value={newFollower} onChange={setNewFollower} />
          <SettingRow label="Mentions & Tags" value={mentions} onChange={setMentions} />
        </Section>

        {/* Appearance */}
        <Section title="Playback & Appearance" icon={Palette} color="#F97316">
          <SettingRow label="Dark Mode" desc="Currently always on — UI engine default" value={darkMode} onChange={() => {}} />
          <SettingRow label="Autoplay Videos" desc="Videos start playing when scrolled into view" value={autoplay} onChange={setAutoplay} />
          <SettingRow label="Compact Feed View" desc="Show smaller, denser card layout in feed" value={compactView} onChange={setCompactView} />
          <SettingRow label="Reduce Animations" desc="Minimize motion for accessibility" value={reduceMotion} onChange={setReduceMotion} />
        </Section>

        {/* Danger zone */}
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '20px', padding: '22px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '16px', color: '#EF4444', marginBottom: '14px' }}>Danger Zone</h3>
          {['Deactivate Account', 'Export My Data', 'Delete Account'].map((action, i) => (
            <button key={action} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '12px 0', background: 'none', border: 'none',
              borderBottom: i < 2 ? '1px solid rgba(239,68,68,0.08)' : 'none',
              color: i === 2 ? '#EF4444' : '#94A3B8', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
              textAlign: 'left', transition: 'all 0.15s',
            }}>
              {action}
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
