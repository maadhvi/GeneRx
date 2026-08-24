import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { 
  Activity, 
  Database, 
  History, 
  ChevronRight, 
  Menu, 
  Bell, 
  Search, 
  Settings,
  LayoutDashboard,
  Dna,
  Box,
  Pill,
  Sparkles,
  ClipboardList,
  Fingerprint,
  Cpu,
  Stethoscope,
  Brain,
  LogOut,
  Moon,
  Sun,
  User,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react'
import Tilt from 'react-parallax-tilt'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import DNAHelix from './components/DNAHelix'
import TherapeuticStrategy from './components/TherapeuticStrategy'
import BloodBrainBarrier from './components/BloodBrainBarrier'
import AuthPage from './components/AuthPage'
import ProfilePage from './components/ProfilePage'
import ChatbotWidget from './components/ChatbotWidget'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import './App.css'

function Sidebar({ onLogout }) {
  const tools = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: window.location.pathname === '/dashboard' },
    { name: 'Mutation Prediction', icon: Fingerprint, path: '/prediction', active: window.location.pathname === '/prediction' },
    { name: 'Treatment Strategy', icon: Stethoscope, path: '/strategy', active: window.location.pathname === '/strategy' },
    { name: 'BBB Penetration', icon: Brain, path: '/bbb', active: window.location.pathname === '/bbb' },
  ];

  return (
    <aside className="sidebar-nav glass-panel animate-reveal">
      <div className="sidebar-tools">
        {tools.map((tool, index) => (
          <Link 
            key={index} 
            to={tool.path} 
            className={`sidebar-item ${tool.active ? 'active' : ''}`}
          >
            <tool.icon size={20} className="sidebar-icon" />
            <span>{tool.name}</span>
          </Link>
        ))}
      </div>
      
      <div className="mt-auto sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link to="/profile" className={`sidebar-item ${window.location.pathname === '/profile' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
          <User size={18} />
          <span>Profile</span>
        </Link>
        <div className="sidebar-item" onClick={onLogout} style={{ color: 'var(--status-pathogenic)', cursor: 'pointer' }}>
          <LogOut size={18} />
          <span>Secure Logout</span>
        </div>
      </div>
    </aside>
  );
}

function MainLayout({ children, onLogout }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="main-layout-container">
      <header className="navbar animate-fade-slow">
        <div className="logo">
          <Dna color="var(--accent-arctic)" size={32} />
          <span>GENERX<span style={{color: 'var(--accent-emerald)'}}>.AI</span></span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/dashboard" className="nav-link active">Console</Link>
          <Link to="/history" className="nav-link">Archive</Link>
          <button 
            onClick={toggleTheme} 
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px',
              borderRadius: '50%', backgroundColor: 'var(--bg-surface)'
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </header>
      <div className="layout-body">
        <Sidebar onLogout={onLogout} />
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
}

const RecentActivityTable = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('All');
  const itemsPerPage = 5;

  const filteredData = filter === 'All' ? data : data.filter(d => d.tool_type === filter);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading && data.length === 0) return null;

  return (
    <div className="glass-panel animate-reveal" style={{ marginTop: '2rem', padding: '1.5rem', overflow: 'hidden', borderTop: '4px solid var(--accent-arctic)', pointerEvents: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
          <Activity size={20} color="var(--accent-arctic)" /> Recent Clinical Activity
        </h3>
        <select 
          value={filter} 
          onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
          style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', padding: '0.4rem 0.8rem', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}
        >
          <option value="All">All Tools</option>
          <option value="Mutation Prediction">Mutation Prediction</option>
          <option value="Treatment Strategy">Treatment Strategy</option>
          <option value="BBB Analysis">BBB Analysis</option>
        </select>
      </div>

      {filteredData.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No activity found for this filter.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Tool</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Subject</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Primary Result</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Detail</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, idx) => (
                <tr key={`${item.tool_type}-${item.id}`} style={{ 
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  animation: `fadeIn 0.3s ease-out ${idx * 0.1}s forwards`,
                  opacity: 0
                }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold', color: 'var(--accent-arctic)' }}>{item.tool_type}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{item.subject}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                      background: item.risk_level === 'High' || item.risk_level === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                      color: item.risk_level === 'High' || item.risk_level === 'Critical' ? 'var(--status-pathogenic)' : 'var(--status-benign)'
                    }}>
                      {item.primary_result}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>{item.detail}</td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: '0.2s' }}
            >Prev</button>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(totalPages)].map((_, i) => (
                 <button 
                   key={i} 
                   onClick={() => setCurrentPage(i + 1)}
                   style={{ background: currentPage === i + 1 ? 'var(--accent-arctic)' : 'transparent', color: currentPage === i + 1 ? '#000' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s', fontWeight: currentPage === i + 1 ? 'bold' : 'normal' }}
                 >{i + 1}</button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', transition: '0.2s' }}
            >Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

function MutationPrediction() {
  const [gene, setGene] = useState('');
  const [mutation, setMutation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [batchResults, setBatchResults] = useState(null);

  const handleAnalyze = async () => {
    if (!gene || !mutation) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('generx_token');
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gene, mutation })
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'API Error');
      }
      
      const data = await res.json();
      setBatchResults(null);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setBatchResults(null);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const token = localStorage.getItem('generx_token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'API Error');
      }
      
      const data = await res.json();
      setBatchResults(data);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error processing batch upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-main-3d">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} color="#7dd3fc" intensity={1} />
          <DNAHelix />
        </Canvas>
      </div>

      <div className="ui-overlay animate-reveal">
        <div className="dashboard-grid">
          <div className="input-panel glass-panel card-3d">
            <div>
              <h2>Prediction Engine</h2>
              <p className="subtitle">Initialize genomic sequence analysis</p>
            </div>
            
            <div className="form-group">
              <label>Sequence ID / Gene</label>
              <input type="text" placeholder="e.g. BRAF" className="input-field" value={gene} onChange={e => setGene(e.target.value)} />
            </div>
            
            <div className="form-group">
              <label>Variant / Mutation</label>
              <input type="text" placeholder="e.g. V600E" className="input-field" value={mutation} onChange={e => setMutation(e.target.value)} />
            </div>
            
            <button className="submit-button" onClick={handleAnalyze} disabled={loading}>
              {loading && !file ? 'Processing Sequence...' : 'Run Prediction'}
            </button>

            <div className="system-status mt-auto">
              <div className="floating-badge" style={{width: '100%', justifyContent: 'center'}}>
                <span className="pulse-dot" style={{backgroundColor: 'var(--accent-arctic)', boxShadow: '0 0 15px var(--accent-arctic)'}}></span>
                {result || batchResults ? 'Sequence Verified' : (loading ? 'Syncing...' : 'System Ready')}
              </div>
            </div>
          </div>

          <div className="results-panel glass-panel card-3d" style={{ overflowY: 'auto' }}>
            <div className="results-header">
              <h2>Severity Report {batchResults && `(${batchResults.length} records)`}</h2>
              {result && <span className={`badge ${result.pathogenicity.toLowerCase() === 'benign' ? 'benign' : 'pathogenic'}`}>{result.pathogenicity}</span>}
            </div>
        
            {batchResults ? (
              <div className="batch-results animate-reveal" style={{ marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.5rem' }}>Gene</th>
                      <th style={{ padding: '0.5rem' }}>Mutation</th>
                      <th style={{ padding: '0.5rem' }}>Risk</th>
                      <th style={{ padding: '0.5rem' }}>Pathogenicity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold', color: 'var(--accent-arctic)' }}>{item.gene}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{item.mutation}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                           <span style={{ color: item.risk_level === 'Critical' || item.risk_level === 'High' ? 'var(--status-pathogenic)' : 'var(--status-benign)' }}>
                             {item.risk_level}
                           </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{item.pathogenicity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : result ? (
              <div className="animate-reveal report-flex-layout">
                <div className="score-container">
                  <div className="severity-score">
                    <span className="score-value">{result.risk_level}</span>
                    <span className="score-label">Clinical Risk</span>
                  </div>
                </div>
                
                <div className="report-details">
                  <h3>AI Analysis Report</h3>
                  <p className="clinical-summary">{result.clinical_summary}</p>
                </div>
              </div>
            ) : (
              <div style={{margin: 'auto', textAlign: 'center', opacity: 0.3}}>
                <Cpu size={64} style={{marginBottom: '1.5rem'}} />
                <p>Waiting for sequence input or<br/>file upload to generate clinical report.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, critical: 0, loading: true });
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('generx_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [predRes, stratRes, bbbRes] = await Promise.all([
          fetch('/api/history/predictions', { headers }),
          fetch('/api/history/strategies', { headers }),
          fetch('/api/history/bbb', { headers })
        ]);

        let combined = [];

        if (predRes.ok) {
          const preds = await predRes.json();
          combined.push(...preds.map(p => ({
            id: p.id,
            tool_type: 'Mutation Prediction',
            subject: `${p.gene} (${p.mutation})`,
            primary_result: p.risk_level,
            risk_level: p.risk_level,
            detail: p.pathogenicity,
            created_at: p.created_at
          })));
        }

        if (stratRes.ok) {
          const strats = await stratRes.json();
          combined.push(...strats.map(s => {
            const risk = s.strategy_data?.phase_status === 'Warning' ? 'High' : 'Normal';
            return {
              id: s.id,
              tool_type: 'Treatment Strategy',
              subject: `${s.indication} - ${s.variant}`,
              primary_result: s.strategy_data?.phase_status || 'Generated',
              risk_level: risk,
              detail: s.strategy_data?.clinical_decision || 'Strategy Available',
              created_at: s.created_at
            };
          }));
        }

        if (bbbRes.ok) {
          const bbbs = await bbbRes.json();
          combined.push(...bbbs.map(b => {
            const pA = b.results?.drugA?.penetration || 'low';
            const pB = b.results?.drugB?.penetration || 'low';
            const risk = (pA.toLowerCase() === 'low' && pB.toLowerCase() === 'low') ? 'High' : 'Normal';
            return {
              id: b.id,
              tool_type: 'BBB Analysis',
              subject: `${b.drugA} vs ${b.drugB}`,
              primary_result: `${pA} / ${pB} penetration`,
              risk_level: risk,
              detail: b.indication,
              created_at: b.created_at
            };
          }));
        }

        combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setActivityData(combined);
        
        const criticalCount = combined.filter(item => item.risk_level === 'High' || item.risk_level === 'Critical').length;
        setStats({ total: combined.length, critical: criticalCount, loading: false });

      } catch(e) {
        console.error(e);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-main-3d">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} color="#7dd3fc" intensity={1} />
          <DNAHelix />
        </Canvas>
      </div>

      <div className="ui-overlay animate-reveal" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2>Clinical Dashboard</h2>
          <p className="subtitle">System overview and recent analytical activity.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem', pointerEvents: 'auto' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-arctic)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> Total Scans
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.loading ? <span className="pulse-dot" style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--accent-arctic)' }}/> : stats.total}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--status-pathogenic)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} /> Critical Findings
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--status-pathogenic)' }}>
              {stats.loading ? <span className="pulse-dot" style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--status-pathogenic)' }}/> : stats.critical}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-emerald)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} /> System Status
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-emerald)', marginTop: '0.5rem' }}>Operational</div>
          </div>
        </div>

        <RecentActivityTable data={activityData} loading={stats.loading} />
      </div>
    </div>
  );
}

function HistoryPage() {
  const [predictions, setPredictions] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('generx_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [predRes, stratRes] = await Promise.all([
          fetch('/api/history/predictions', { headers }),
          fetch('/api/history/strategies', { headers })
        ]);
        
        if (predRes.ok) setPredictions(await predRes.json());
        if (stratRes.ok) setStrategies(await stratRes.json());
      } catch (e) {
        console.error('Error fetching history:', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="history-container animate-reveal" style={{padding: '4rem', textAlign: 'center'}}>Loading archive...</div>;
  }

  return (
    <div className="history-container animate-reveal" style={{ padding: '2rem' }}>
      <main className="history-main glass-panel" style={{ padding: '2rem' }}>
        <h2>Data Archive</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your synchronized clinical history.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Predictions</h3>
            {predictions.length === 0 ? <p style={{opacity: 0.5}}>No predictions found.</p> : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {predictions.map(p => (
                  <li key={p.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '1rem' }}>
                    <strong style={{color: 'var(--accent-arctic)'}}>{p.gene} {p.mutation}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Risk: <span style={{color: p.risk_level === 'High' || p.risk_level === 'Critical' ? 'var(--status-pathogenic)' : 'var(--status-benign)'}}>{p.risk_level}</span> | Pathogenicity: {p.pathogenicity}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Strategies</h3>
            {strategies.length === 0 ? <p style={{opacity: 0.5}}>No strategies found.</p> : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {strategies.map(s => (
                  <li key={s.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '1rem' }}>
                    <strong style={{color: 'var(--accent-emerald)'}}>{s.indication} {s.variant}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Primary Therapy: {s.strategy_data?.primary_therapy?.name || 'N/A'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Protected Route Wrapper
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('generx_auth') === 'true' && localStorage.getItem('generx_token') !== null;
  });

  const handleLogin = (user) => {
    localStorage.setItem('generx_auth', 'true');
    if (user) {
      localStorage.setItem('generx_user', JSON.stringify(user));
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('generx_auth');
    localStorage.removeItem('generx_user');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage onLogin={handleLogin} />
            } 
          />
          
          {/* Redirect root to dashboard if logged in, else login */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />

          {/* Protected Console Routes */}
          <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MainLayout onLogout={handleLogout}><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/prediction" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MainLayout onLogout={handleLogout}><MutationPrediction /></MainLayout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MainLayout onLogout={handleLogout}><HistoryPage /></MainLayout></ProtectedRoute>} />
          <Route path="/strategy" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MainLayout onLogout={handleLogout}><TherapeuticStrategy /></MainLayout></ProtectedRoute>} />
          <Route path="/bbb" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MainLayout onLogout={handleLogout}><BloodBrainBarrier /></MainLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MainLayout onLogout={handleLogout}><ProfilePage /></MainLayout></ProtectedRoute>} />
          
          {/* Catch-all Route for 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ChatbotWidget />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
