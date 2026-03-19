'use client';
import { useState, useRef, useCallback } from 'react';
import {
  Upload, X, Film, Image, Music, FileText, Layers, Radio,
  CloudUpload, ChevronRight, Plus, Check
} from 'lucide-react';

const MEDIA_TYPES = [
  { id: 'video', icon: Film, label: 'Video', desc: 'MP4, MOV, AVI, MKV, WebM', color: '#8B5CF6', accept: 'video/*' },
  { id: 'reel', icon: Film, label: 'Reel/Short', desc: 'Vertical video content', color: '#EC4899', accept: 'video/*' },
  { id: 'image', icon: Image, label: 'Photo/GIF', desc: 'JPG, PNG, GIF, WebP, SVG', color: '#06B6D4', accept: 'image/*' },
  { id: 'audio', icon: Music, label: 'Audio', desc: 'MP3, WAV, FLAC, AAC, OGG', color: '#F97316', accept: 'audio/*' },
  { id: 'document', icon: FileText, label: 'Document', desc: 'PDF, DOC, PPT, XLS, TXT', color: '#10B981', accept: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt' },
  { id: '3d', icon: Layers, label: '3D / AR', desc: 'GLB, GLTF, OBJ, FBX', color: '#F59E0B', accept: '.glb,.gltf,.obj,.fbx' },
  { id: 'live', icon: Radio, label: 'Go Live', desc: 'Start a live broadcast', color: '#EF4444', accept: '' },
];

export default function UploadModal({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState<'type' | 'upload' | 'details' | 'success'>('type');
  const [selectedType, setSelectedType] = useState<typeof MEDIA_TYPES[0] | null>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setStep('details'); }
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setStep('details'); }
  }

  async function handlePublish() {
    setUploading(true);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 60));
      setUploadProgress(i);
    }
    setStep('success');
    setUploading(false);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        width: '100%', maxWidth: '680px',
        background: 'rgba(10,10,26,0.98)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '28px', overflow: 'hidden',
        boxShadow: '0 30px 100px rgba(0,0,0,0.6)',
        animation: 'scaleIn 0.2s ease-out',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', padding: '24px 28px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '22px' }}>
              {step === 'type' && 'Create Content'}
              {step === 'upload' && `Upload ${selectedType?.label}`}
              {step === 'details' && 'Add Details'}
              {step === 'success' && 'Published! 🎉'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '13px', marginTop: '2px' }}>
              {step === 'type' && 'Choose what type of content to share'}
              {step === 'upload' && `Drag & drop or browse your ${selectedType?.desc}`}
              {step === 'details' && `${file?.name || 'Your content'} · ${file ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : ''}`}
              {step === 'success' && 'Your content is live and ready to be discovered'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto', width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          ><X size={16} color="#94A3B8" /></button>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Step 1: Type selection */}
          {step === 'type' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {MEDIA_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type);
                    setStep(type.id === 'live' ? 'details' : 'upload');
                  }}
                  style={{
                    background: `${type.color}0D`,
                    border: `1px solid ${type.color}30`,
                    borderRadius: '16px', padding: '20px 14px',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${type.color}20`;
                    e.currentTarget.style.borderColor = `${type.color}60`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${type.color}0D`;
                    e.currentTarget.style.borderColor = `${type.color}30`;
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: `${type.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '12px',
                  }}>
                    <type.icon size={20} color={type.color} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>{type.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>{type.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Upload zone */}
          {step === 'upload' && selectedType && (
            <div>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${dragging ? selectedType.color : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '20px', padding: '60px 32px',
                  textAlign: 'center', cursor: 'pointer',
                  background: dragging ? `${selectedType.color}08` : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 16px',
                  background: `${selectedType.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CloudUpload size={32} color={selectedType.color} />
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>
                  Drop your {selectedType.label} here
                </h3>
                <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>
                  Supports: {selectedType.desc}
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: `linear-gradient(135deg,${selectedType.color},${selectedType.color}80)`,
                  color: 'white', padding: '10px 24px', borderRadius: '12px',
                  fontWeight: 600, fontSize: '14px',
                }}>
                  <Plus size={16} /> Browse Files
                </div>
                <input
                  ref={fileRef} type="file" accept={selectedType.accept}
                  onChange={handleFile} style={{ display: 'none' }}
                />
              </div>
              <button
                onClick={() => setStep('type')}
                style={{ marginTop: '16px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
              >← Back to type selection</button>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '8px' }}>Title *</label>
                <input
                  value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Give your content an amazing title..."
                  className="input-glass"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '15px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '8px' }}>Description</label>
                <textarea
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your content, add context..."
                  rows={3}
                  className="input-glass"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '8px' }}>Tags</label>
                <input
                  value={tags} onChange={e => setTags(e.target.value)}
                  placeholder="#viral #creative #art"
                  className="input-glass"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '14px' }}
                />
              </div>

              {uploading && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span style={{ color: '#94A3B8' }}>Publishing...</span>
                    <span style={{ color: '#8B5CF6', fontWeight: 600 }}>{uploadProgress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep('type')} className="btn-secondary" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!title || uploading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: title ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'rgba(255,255,255,0.1)',
                    color: title ? 'white' : '#475569',
                    border: 'none', borderRadius: '12px', padding: '11px 24px',
                    fontWeight: 600, fontSize: '14px', cursor: title ? 'pointer' : 'not-allowed',
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                    boxShadow: title ? '0 4px 15px rgba(139,92,246,0.3)' : 'none',
                  }}
                >
                  <Upload size={15} />
                  {uploading ? 'Publishing...' : 'Publish Now'}
                  {!uploading && <ChevronRight size={15} />}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px',
                background: 'linear-gradient(135deg,#10B981,#059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px rgba(16,185,129,0.4)',
              }}>
                <Check size={36} color="white" strokeWidth={3} />
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '24px', marginBottom: '8px' }}>
                Content Live! 🚀
              </h3>
              <p style={{ color: '#64748B', marginBottom: '28px' }}>
                &ldquo;{title}&rdquo; is now published and discoverable worldwide.
              </p>
              <button onClick={onClose} className="btn-primary" style={{ padding: '12px 32px', fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
