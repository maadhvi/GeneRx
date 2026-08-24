import React, { useState, useEffect } from 'react';
import { User, Save, Shield, Mail, Calendar, Camera, Key, AlertTriangle, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '', role: 'Primary Investigator', joined: 'August 2026' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('generx_user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setProfile(prev => ({ 
          ...prev, 
          name: userData.name || '', 
          email: userData.email || '' 
        }));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      localStorage.setItem('generx_user', JSON.stringify({ name: profile.name, email: profile.email }));
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="animate-reveal" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h2>Account Profile</h2>
        <p className="subtitle">Manage your personal information and clinical access credentials.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Left Column: Identity Card */}
        <div className="glass-panel" style={{ flex: '1 1 300px', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '130px', height: '130px', borderRadius: '50%', 
              background: 'linear-gradient(145deg, rgba(14,165,233,0.1) 0%, rgba(15,23,42,0.8) 100%)', 
              border: '2px solid var(--accent-arctic)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(14, 165, 233, 0.15)'
            }}>
              <User size={64} color="var(--accent-arctic)" opacity={0.8} />
            </div>
          </div>
          
          <h3 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '0.5px' }}>{profile.name || 'Clinical User'}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 2rem 0', fontSize: '0.95rem' }}>{profile.email}</p>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid var(--border-glass)', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={16} color="var(--accent-emerald)"/> Clearance Level</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Tier 1 (Admin)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16}/> Member Since</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{profile.joined}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editor Sections */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Personal Information */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
              <User size={20} color="var(--accent-arctic)" /> Personal Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})} 
                  style={{ padding: '0.8rem 1rem' }}
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Official Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    className="input-field" 
                    value={profile.email} 
                    disabled 
                    style={{ padding: '0.8rem 1rem 0.8rem 38px', opacity: 0.6, cursor: 'not-allowed', background: 'rgba(0,0,0,0.2)' }} 
                  />
                </div>
                <small style={{ color: 'var(--text-muted)', marginTop: '8px', display: 'block', fontSize: '0.75rem' }}>Primary credential cannot be modified directly.</small>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Professional Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={profile.role} 
                  onChange={e => setProfile({...profile, role: e.target.value})} 
                  style={{ padding: '0.8rem 1rem' }}
                />
              </div>
            </div>
            
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ color: 'var(--status-benign)', opacity: saveSuccess ? 1 : 0, transition: 'opacity 0.3s', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} /> Profile synchronized
              </span>
              <button className="submit-button" onClick={handleSave} disabled={isSaving} style={{ padding: '0.8rem 2rem', width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSaving ? (
                  <><span className="pulse-dot" style={{ backgroundColor: 'white', width: '10px', height: '10px', boxShadow: 'none' }}></span> Saving...</>
                ) : (
                  <><Save size={18} /> Save Changes</>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;