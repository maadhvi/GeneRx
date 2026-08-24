import React, { useState, useMemo } from 'react';
import { Layers, Zap, Cpu, Activity, ShieldCheck, ChevronRight, Share2, Info, Target, FlaskConical, Thermometer, AlertCircle } from 'lucide-react';

const DrugSynergy = () => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Mock drug synergy data
  const drugA_Concentrations = ['0.0', '0.1', '0.5', '1.0', '5.0', '10.0'];
  const drugB_Concentrations = ['0.0', '0.1', '0.5', '1.0', '5.0', '10.0'];
  
  // Procedural synergy heatmap data
  const matrixData = useMemo(() => {
    return drugA_Concentrations.map((ca, i) => 
      drugB_Concentrations.map((cb, j) => {
        const dist = Math.sqrt(Math.pow(i - 4, 2) + Math.pow(j - 4, 2));
        const synergy = Math.max(0, 100 - dist * 25 + Math.random() * 10);
        return {
          val: synergy,
          toxic: synergy > 85 && (i > 4 || j > 4)
        };
      })
    );
  }, []);

  const handleSynthesize = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsGenerated(true);
    }, 2000);
  };

  const getCellColor = (val, toxic) => {
    if (toxic) return 'rgba(251, 113, 133, 0.4)'; // Toxic zone (rose)
    if (val > 70) return 'rgba(45, 212, 191, 0.6)'; // High synergy (teal)
    if (val > 40) return 'rgba(125, 211, 252, 0.3)'; // Moderate (arctic)
    return 'rgba(255, 255, 255, 0.03)'; // Neutral
  };

  return (
    <div className="drug-synergy-page animate-reveal">
      <main className="layout-body" style={{ padding: 0 }}>
        {!isGenerated ? (
          /* STAGE 1: INTAKE */
          <div className="input-environment glass-panel animate-reveal" style={{ maxWidth: '900px', margin: '4rem auto', padding: '4rem' }}>
            <div className="text-center mb-12">
              <div className="inline-icon-box mb-6" style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '1.5rem', borderRadius: '24px', display: 'inline-block' }}>
                <FlaskConical size={48} color="var(--accent-emerald)" />
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>AI Drug-Synergy Optimizer</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Optimize multi-drug cocktails to overcome therapeutic resistance and reduce systemic toxicity.</p>
            </div>

            <div className="twin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div className="form-column">
                <div className="form-group mb-8">
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>Primary Inhibitor (Drug A)</label>
                  <select className="input-field" style={{ width: '100%' }}>
                    <option>Dabrafenib (BRAF-i)</option>
                    <option>Osimertinib (EGFR-i)</option>
                    <option>Trametinib (MEK-i)</option>
                    <option>Pembrolizumab (PD-1)</option>
                  </select>
                </div>
                <div className="form-group mb-8">
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>Secondary Agent (Drug B)</label>
                  <select className="input-field" style={{ width: '100%' }}>
                    <option>Trametinib (MEK-i)</option>
                    <option>Cobimetinib (MEK-i)</option>
                    <option>Everolimus (mTOR-i)</option>
                    <option>Alpelisib (PI3K-i)</option>
                  </select>
                </div>
              </div>

              <div className="form-column">
                 <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid var(--accent-emerald)' }}>
                       <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Zap size={16} color="var(--accent-emerald)" /> Loewe Additivity</h3>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>AI simulation of dose-response surfaces to detect non-linear therapeutic synergy.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid var(--status-pathogenic)' }}>
                       <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><AlertCircle size={16} color="var(--status-pathogenic)" /> Toxicity Index</h3>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Predictive modeling of adverse systemic reactions to multi-agent therapy.</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button className="submit-button" style={{ padding: '1.5rem 4rem', width: 'auto', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent-emerald) 0%, #0d9488 100%)' }} onClick={handleSynthesize} disabled={loading}>
                {loading ? 'Optimizing Combination...' : 'Run Synergy Simulation'} <ChevronRight size={18} style={{ marginLeft: '10px' }} />
              </button>
            </div>
          </div>
        ) : (
          /* STAGE 2: SYNERGY DASHBOARD */
          <div className="visualizer-grid animate-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 450px', height: 'calc(100vh - 120px)', width: '100%' }}>
            
            <div className="stage-container glass-panel" style={{ margin: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#020617', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(var(--accent-emerald) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }}></div>

              <div className="stage-header" style={{ padding: '3rem 3rem 2rem 3rem', zIndex: 10 }}>
                <div className="badge" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent-emerald)', border: '1px solid rgba(45, 212, 191, 0.3)' }}>SYNERGY OPTIMIZATION: ACTIVE</div>
                <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', fontWeight: '800' }}>Dabrafenib + Trametinib</h1>
                <p style={{ color: 'var(--text-muted)' }}>Targeting: <span style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>MAPK Circuit Dual-Inhibition</span></p>
              </div>

              {/* Interaction Matrix (Heatmap) */}
              <div className="matrix-wrapper" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                <div className="heatmap-container" style={{ position: 'relative' }}>
                  {/* Y-Axis Label */}
                  <div style={{ position: 'absolute', left: '-100px', top: '50%', transform: 'rotate(-90deg) translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Trametinib Concentration (μM)
                  </div>
                  {/* X-Axis Label */}
                  <div style={{ position: 'absolute', bottom: '-80px', left: '50%', transform: 'translateX(-50%)', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Dabrafenib Concentration (μM)
                  </div>

                  <div className="matrix-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${drugA_Concentrations.length}, 60px)`, gap: '4px' }}>
                    {matrixData.map((row, i) => 
                      row.map((cell, j) => (
                        <div 
                          key={`${i}-${j}`}
                          onMouseEnter={() => setHoveredCell({ i, j, ...cell })}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            background: getCellColor(cell.val, cell.toxic),
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            color: 'rgba(255,255,255,0.4)',
                            transform: hoveredCell?.i === i && hoveredCell?.j === j ? 'scale(1.1)' : 'scale(1)',
                            zIndex: hoveredCell?.i === i && hoveredCell?.j === j ? 20 : 1
                          }}
                        >
                          {Math.round(cell.val)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="stage-controls" style={{ padding: '2rem 3rem', display: 'flex', gap: '1.5rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--border-glass)' }}>
                 <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: 'rgba(45, 212, 191, 0.6)', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High Synergy</span>
                 </div>
                 <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: 'rgba(251, 113, 133, 0.4)', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High Toxicity</span>
                 </div>
                 <button className="glass-panel" style={{ marginLeft: 'auto', padding: '0.75rem 1.5rem', cursor: 'pointer' }} onClick={() => setIsGenerated(false)}>New Combination</button>
              </div>
            </div>

            {/* Analysis Sidebar */}
            <div className="analysis-panel glass-panel" style={{ margin: '1rem 1rem 1rem 0', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem' }}>
                <FlaskConical color="var(--accent-emerald)" size={24} />
                <h2 style={{ fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1rem' }}>Synergy Analytics</h2>
              </div>

              {hoveredCell ? (
                <div className="cell-details animate-reveal">
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Dose: {drugA_Concentrations[hoveredCell.j]}μM / {drugB_Concentrations[hoveredCell.i]}μM</div>
                   <h3 style={{ fontSize: '2rem', fontWeight: '800', color: hoveredCell.toxic ? 'var(--status-pathogenic)' : 'var(--accent-emerald)' }}>
                     {Math.round(hoveredCell.val)}%
                   </h3>
                   <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loewe Synergy Score</span>
                   <div className="mt-6" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem' }}>Cell Viability</span>
                        <span style={{ fontWeight: '700' }}>{Math.max(2, Math.round(100 - hoveredCell.val))}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem' }}>Systemic Risk</span>
                        <span style={{ fontWeight: '700', color: hoveredCell.toxic ? 'var(--status-pathogenic)' : 'var(--accent-emerald)' }}>
                          {hoveredCell.toxic ? 'CRITICAL' : 'SAFE'}
                        </span>
                      </div>
                   </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', margin: 'auto', opacity: 0.3 }}>
                   <Activity size={48} style={{ marginBottom: '1rem' }} />
                   <p>Hover over the matrix to<br/>analyze specific dose ratios.</p>
                </div>
              )}

              <div className="ai-cocktail-insight mt-auto" style={{ background: 'rgba(45, 212, 191, 0.05)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(45, 212, 191, 0.1)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                   <Cpu size={18} color="var(--accent-emerald)" />
                   <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Combination Insight</span>
                 </div>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: 0 }}>
                   The combination of BRAF and MEK inhibition significantly delays the onset of vertical resistance compared to monotherapy. Optimal synergy is achieved at a 5:1 molar ratio.
                 </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DrugSynergy;
