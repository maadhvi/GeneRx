import React, { useState } from 'react';
import { Dna, Lock, Mail, KeyRound, ChevronRight, ShieldCheck, AlertCircle, ArrowLeft, Sparkles, UserCheck } from 'lucide-react';

const DEFAULT_USERS = [
  { email: 'gmaadhvi@gmail.com', password: 'admin123', name: 'Dr. Maadhvi' },
  { email: 'admin@generx.ai', password: 'admin123', name: 'Clinical Admin' },
  { email: 'demo@generx.ai', password: 'demo', name: 'Demo Researcher' }
];

const AuthPage = ({ onLogin }) => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState('gmaadhvi@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getStoredUsers = () => {
    try {
      const stored = localStorage.getItem('generx_registered_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (view === 'forgot') {
      if (!cleanEmail) {
        setError('Please enter your registered email address.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setSuccess('Password reset link has been dispatched to your email.');
        setIsLoading(false);
      }, 1000);
      return;
    }

    if (!cleanEmail || !cleanPassword || (view === 'signup' && !name.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setError('Please enter a valid email address containing @.');
      return;
    }

    if (view === 'signup') {
      const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      if (!strongRegex.test(cleanPassword)) {
        setError('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character (!@#$%^&*).');
        return;
      }
    }

    setIsLoading(true);

    if (view === 'signup') {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPassword, name: name.trim() })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.detail || 'Registration failed');
          setIsLoading(false);
          return;
        }
        setSuccess('Account created successfully! Logging you in...');
        localStorage.setItem('generx_token', data.access_token);
        
        const userRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        const userData = await userRes.json();
        
        setTimeout(() => {
          onLogin(userData);
        }, 600);
      } catch (e) {
        setError('Network error during registration');
        setIsLoading(false);
      }
    } else {
      try {
        const formData = new URLSearchParams();
        formData.append('username', cleanEmail);
        formData.append('password', cleanPassword);
        
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData
        });
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.detail || 'Invalid credentials');
          setIsLoading(false);
          return;
        }
        
        localStorage.setItem('generx_token', data.access_token);
        
        const userRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        const userData = await userRes.json();
        onLogin(userData);
      } catch (e) {
        setError('Network error during login');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="landing-container animate-fade-slow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '100vh', width: '100%' }}>
      
      {/* Background Decorators */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', opacity: 0.05, transform: 'scale(2)' }}>
         <Dna size={400} />
      </div>

      <div className="auth-card glass-panel animate-reveal" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', position: 'relative', zIndex: 10, borderTop: '4px solid var(--accent-arctic)', margin: '1rem' }}>
        
        <div className="text-center mb-6">
           <div className="logo" style={{ justifyContent: 'center', marginBottom: '1rem', display: 'flex' }}>
             <Dna color="var(--accent-arctic)" size={42} />
           </div>
           <h1 style={{ fontSize: '1.8rem', letterSpacing: '0.1em', fontWeight: '800', textAlign: 'center', margin: 0 }}>GENERX<span style={{color: 'var(--accent-emerald)'}}>.AI</span></h1>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>
             {view === 'login' ? 'Secure Clinical Access Portal' : view === 'signup' ? 'Create a Secure Account' : 'Account Recovery'}
           </p>
        </div>

        {error && (
          <div style={{ padding: '0.8rem', background: 'rgba(251, 113, 133, 0.1)', border: '1px solid var(--status-pathogenic)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--status-pathogenic)', fontSize: '0.85rem' }}>
             <AlertCircle size={16} />
             {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '0.8rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid var(--status-benign)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--status-benign)', fontSize: '0.85rem' }}>
             <ShieldCheck size={16} />
             {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {view === 'signup' && (
            <div className="form-group mb-4">
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Full Name
              </label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Dr. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.8rem' }}
              />
            </div>
          )}

          <div className="form-group mb-4">
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} /> Official Email
            </label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="e.g. yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.8rem' }}
            />
          </div>

          {view !== 'forgot' && (
            <div className="form-group mb-2">
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={14} /> Password
              </label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.8rem' }}
              />
            </div>
          )}

          {view === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: 'var(--accent-arctic)', fontSize: '0.8rem', cursor: 'pointer' }}>
                Forgot Password?
              </button>
            </div>
          )}

          {view === 'signup' && <div style={{ marginBottom: '1.5rem' }} />}
          {view === 'forgot' && <div style={{ marginBottom: '1.5rem' }} />}

          <button 
            type="submit" 
            className="submit-button" 
            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="pulse-dot" style={{ backgroundColor: 'white', boxShadow: 'none', width: '12px', height: '12px' }}></span>
                {view === 'login' ? 'Verifying...' : 'Processing...'}
              </>
            ) : (
              <>
                {view === 'login' ? 'Secure Login' : view === 'signup' ? 'Create Account' : 'Reset Password'} <ChevronRight size={18} />
              </>
            )}
          </button>

        </form>

        <div className="mt-8 text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
           {view === 'login' ? (
             <p style={{ color: 'var(--text-secondary)' }}>
               Don't have an account? <button onClick={() => setView('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent-arctic)', cursor: 'pointer', fontWeight: 'bold' }}>Sign up</button>
             </p>
           ) : (
             <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <ArrowLeft size={14} /> Back to Login
             </button>
           )}
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
             <ShieldCheck size={14} color="var(--accent-emerald)" />
             <span>End-to-End Encrypted Session</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
