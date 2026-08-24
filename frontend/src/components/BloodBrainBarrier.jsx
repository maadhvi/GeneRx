import React, { useState, useEffect, useMemo } from 'react';
import { Brain, Droplets, Activity, ChevronRight, Info, ShieldAlert, ShieldCheck } from 'lucide-react';

const BloodBrainBarrier = () => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Custom user inputs
  const [formData, setFormData] = useState({
    indication: 'Non-Small Cell Lung Cancer (Brain Mets)',
    drugA: 'Osimertinib',
    drugB: 'Crizotinib'
  });

  // Toggle between the two drugs on the dashboard
  const [activeDrugIndex, setActiveDrugIndex] = useState('A'); // 'A' or 'B'

  const [profiles, setProfiles] = useState({ A: null, B: null });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSynthesize = async () => {
    if (!formData.drugA || !formData.drugB || !formData.indication) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const token = localStorage.getItem('generx_token');
      const res = await fetch('/api/bbb', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          indication: formData.indication,
          drugA: formData.drugA,
          drugB: formData.drugB
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'API Error');
      
      setProfiles({
        A: data.drugA,
        B: data.drugB
      });
      
      setIsGenerated(true);
      setActiveDrugIndex('A');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentDrug = profiles[activeDrugIndex];

  return (
    <div className="bbb-model-page animate-reveal">
      <main className="layout-body" style={{ padding: 0 }}>
        {!isGenerated ? (
          /* STAGE 1: DRUG INTAKE */
          <div className="input-environment glass-panel animate-reveal" style={{ maxWidth: '900px', margin: '4rem auto', padding: '4rem' }}>
            <div className="text-center mb-12">
              <div className="inline-icon-box mb-6" style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '1.5rem', borderRadius: '24px', display: 'inline-block' }}>
                <Brain size={48} color="var(--accent-emerald)" />
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>BBB Penetration Simulator</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Simulate molecular transport dynamics across the Blood-Brain Barrier for your custom agents.</p>
            </div>

            <div className="twin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div className="form-column">
                
                <div className="form-group mb-6">
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>Disease / Indication</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ width: '100%', padding: '1rem' }} 
                    placeholder="e.g. Brain Metastasis"
                    value={formData.indication} 
                    onChange={e => setFormData({...formData, indication: e.target.value})}
                  />
                </div>

                <div className="form-group mb-6">
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-emerald)', marginBottom: '0.75rem', display: 'block' }}>Primary Drug (Drug A)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ width: '100%', padding: '1rem', border: '1px solid rgba(45, 212, 191, 0.3)' }} 
                    placeholder="Enter drug name..."
                    value={formData.drugA} 
                    onChange={e => setFormData({...formData, drugA: e.target.value})}
                  />
                </div>

                <div className="form-group mb-6">
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--status-warning)', marginBottom: '0.75rem', display: 'block' }}>Comparator Drug (Drug B)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ width: '100%', padding: '1rem', border: '1px solid rgba(250, 204, 21, 0.3)' }} 
                    placeholder="Enter comparator drug..."
                    value={formData.drugB} 
                    onChange={e => setFormData({...formData, drugB: e.target.value})}
                  />
                </div>

              </div>

              <div className="form-column">
                 <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid var(--accent-arctic)' }}>
                       <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Droplets size={16} color="var(--accent-arctic)" /> Lipophilicity Analysis</h3>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Evaluation of molecular weight and lipid solubility affecting passive diffusion.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid var(--status-warning)' }}>
                       <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity size={16} color="var(--status-warning)" /> P-glycoprotein Efflux</h3>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Simulation of active transport pumps restricting intracranial drug concentration.</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              {errorMessage && (
                <div style={{ color: 'var(--status-pathogenic)', marginBottom: '1rem', padding: '1rem', background: 'rgba(251, 113, 133, 0.1)', borderRadius: '8px', border: '1px solid rgba(251, 113, 133, 0.2)' }}>
                  <ShieldAlert size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                  {errorMessage}
                </div>
              )}
              <button 
                className="submit-button" 
                style={{ padding: '1.5rem 4rem', width: 'auto', fontSize: '1.1rem', opacity: (!formData.drugA || !formData.drugB || !formData.indication) ? 0.5 : 1 }} 
                onClick={handleSynthesize} 
                disabled={loading || !formData.drugA || !formData.drugB || !formData.indication}
              >
                {loading ? 'Simulating Transport...' : 'Run Custom BBB Simulation'} <ChevronRight size={18} style={{ marginLeft: '10px' }} />
              </button>
            </div>
          </div>
        ) : (
          /* STAGE 2: LIVE SIMULATION DASHBOARD */
          <div className="visualizer-grid animate-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', margin: '2rem', height: 'calc(100vh - 150px)' }}>
            
            {/* Left Panel: SVG Animated Environment */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: '#020617' }}>
              
              <div className="stage-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(2,6,23,0.9), transparent)' }}>
                <div className="badge" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent-emerald)', border: '1px solid rgba(45, 212, 191, 0.3)' }}>
                  INDICATION: {formData.indication.toUpperCase()}
                </div>
                <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem', fontWeight: '800' }}>{currentDrug.name} Dynamics</h2>
              </div>

              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                 <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                    <defs>
                       <filter id="glow-brain" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feMerge>
                             <feMergeNode in="blur" />
                             <feMergeNode in="SourceGraphic" />
                          </feMerge>
                       </filter>
                       <linearGradient id="bloodstream" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#1e1b4b" />
                          <stop offset="100%" stopColor="#31112c" />
                       </linearGradient>
                       <linearGradient id="braintissue" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#064e3b" />
                          <stop offset="100%" stopColor="#022c22" />
                       </linearGradient>
                    </defs>

                    {/* Brain Tissue Area (Top) */}
                    <rect x="0" y="0" width="100%" height="250" fill="url(#braintissue)" opacity="0.3" />
                    <text x="40" y="60" fill="rgba(255,255,255,0.2)" fontSize="24" fontWeight="800" letterSpacing="5">CNS / BRAIN TISSUE</text>

                    {/* Bloodstream Area (Bottom) */}
                    <rect x="0" y="350" width="100%" height="250" fill="url(#bloodstream)" opacity="0.4" />
                    <text x="40" y="560" fill="rgba(255,255,255,0.2)" fontSize="24" fontWeight="800" letterSpacing="5">SYSTEMIC CIRCULATION</text>

                    {/* The Barrier (Endothelial Cells) */}
                    <g transform="translate(0, 250)">
                       {/* Top membrane line */}
                       <line x1="0" y1="0" x2="800" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                       {/* Bottom membrane line */}
                       <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                       
                       {/* Endothelial Cell Blocks */}
                       {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                         <g key={`cell-${i}`} transform={`translate(${i * 100 + 10}, 10)`}>
                            <rect width="80" height="80" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
                            {/* Nucleus */}
                            <ellipse cx="40" cy="40" rx="20" ry="10" fill="rgba(125, 211, 252, 0.1)" />
                            {/* Tight Junctions (the gaps between cells) */}
                            {i < 7 && <line x1="85" y1="0" x2="85" y2="80" stroke="var(--status-warning)" strokeWidth="2" opacity="0.5" strokeDasharray="4,4" />}
                         </g>
                       ))}
                       <text x="40" y="55" fill="rgba(255,255,255,0.3)" fontSize="12" letterSpacing="2">ENDOTHELIAL TIGHT JUNCTIONS</text>
                    </g>

                    {/* Drug Particles Animation */}
                    {Array.from({ length: currentDrug.particles }).map((_, i) => {
                       const startX = 50 + Math.random() * 700;
                       const delay = Math.random() * 5;
                       const dur = 4 + Math.random() * 2;
                       
                       // For low penetration, particles move up, hit the barrier (y=300), and bounce down.
                       // For high penetration, particles move straight up through the barrier (y=100).
                       
                       const pathHigh = `M ${startX} 550 L ${startX} 100`;
                       const pathLow = `M ${startX} 550 L ${startX} 320 L ${startX + (Math.random() > 0.5 ? 50 : -50)} 550`;
                       
                       return (
                         <g key={`particle-${activeDrugIndex}-${i}`}>
                            <circle r="6" fill={currentDrug.color} filter="url(#glow-brain)">
                               <animateMotion 
                                  path={currentDrug.penetration === 'high' ? pathHigh : pathLow}
                                  dur={`${dur}s`}
                                  begin={`${delay}s`}
                                  repeatCount="indefinite"
                               />
                               {currentDrug.penetration === 'low' && (
                                  <animate attributeName="opacity" values="1;1;0.2;1" keyTimes="0;0.5;0.6;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                               )}
                            </circle>
                         </g>
                       );
                    })}

                    {/* P-gp Pumps (Visible if low penetration to show WHY it bounces) */}
                    {currentDrug.penetration === 'low' && [1, 3, 5].map(i => (
                       <g key={`pump-${activeDrugIndex}-${i}`} transform={`translate(${i * 100 + 40}, 330)`}>
                          <path d="M 0 0 L -10 20 L 10 20 Z" fill="var(--status-warning)" opacity="0.8">
                             <animate attributeName="transform" type="translate" values="0,0; 0,10; 0,0" dur="2s" repeatCount="indefinite" />
                          </path>
                          <text x="-15" y="35" fill="var(--status-warning)" fontSize="10">P-gp Efflux</text>
                       </g>
                    ))}
                 </svg>
              </div>

              <div className="stage-controls" style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', gap: '1rem', zIndex: 10 }}>
                 <button 
                   className="glass-panel" 
                   style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '600', border: activeDrugIndex === 'A' ? '1px solid var(--accent-emerald)' : 'none' }} 
                   onClick={() => setActiveDrugIndex('A')}
                 >
                   Simulate Drug A: {formData.drugA}
                 </button>
                 <button 
                   className="glass-panel" 
                   style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '600', border: activeDrugIndex === 'B' ? '1px solid var(--status-warning)' : 'none' }} 
                   onClick={() => setActiveDrugIndex('B')}
                 >
                   Simulate Drug B: {formData.drugB}
                 </button>
              </div>
            </div>

            {/* Right Panel: Analytics */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem', overflowY: 'auto' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Activity color="var(--accent-arctic)" size={24} />
                    <h2 style={{ fontSize: '1.2rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1rem' }}>Pharmacokinetics</h2>
                  </div>
                  <button className="icon-btn" onClick={() => setIsGenerated(false)} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                     Restart
                  </button>
                </div>
              </div>

              <div className="data-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 
                 <div className="data-item">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Molecular Weight</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{currentDrug.mw} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>g/mol</span></h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Smaller molecules (&lt; 400-500 g/mol) generally exhibit superior passive diffusion through tight junctions.</p>
                 </div>

                 <div className="data-item">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lipophilicity (logP)</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{currentDrug.logP}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Optimal lipid solubility is required to cross the hydrophobic core of endothelial cell membranes.</p>
                 </div>

                 <div className="data-item">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Efflux Status</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: currentDrug.penetration === 'low' ? 'var(--status-warning)' : 'white' }}>{currentDrug.efflux}</h3>
                 </div>

              </div>

              <div className="mt-auto" style={{ padding: '1.5rem', background: currentDrug.penetration === 'high' ? 'rgba(45, 212, 191, 0.1)' : 'rgba(251, 113, 133, 0.1)', border: `1px solid ${currentDrug.penetration === 'high' ? 'var(--accent-emerald)' : 'var(--status-pathogenic)'}`, borderRadius: '16px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                    {currentDrug.penetration === 'high' ? <ShieldCheck size={20} color="var(--accent-emerald)" /> : <ShieldAlert size={20} color="var(--status-pathogenic)" />}
                    <span style={{ fontWeight: '700', color: currentDrug.color }}>Clinical Verdict</span>
                 </div>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: 0 }}>
                    {currentDrug.status}
                 </p>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default BloodBrainBarrier;
