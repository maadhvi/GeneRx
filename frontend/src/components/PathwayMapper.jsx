import React, { useState, useEffect } from 'react';
import { Network, Zap, Cpu, Activity, ShieldCheck, ChevronRight, Share2, Info, Target, AlertTriangle } from 'lucide-react';

const PathwayMapper = () => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  
  const [pathwayName, setPathwayName] = useState('MAPK / ERK Signaling');
  const [clinicalContext, setClinicalContext] = useState('');
  
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [riskAssessment, setRiskAssessment] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSynthesize = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/pathway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathway_name: pathwayName,
          clinical_context: clinicalContext
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate pathway");
      }
      
      setNodes(data.nodes);
      setConnections(data.connections);
      setRiskAssessment(data.risk_assessment);
      setErrorMessage(null);
      setIsGenerated(true);
      setActiveNode(null); // Reset active node on new generation
    } catch (err) {
      console.error("Failed to fetch pathway:", err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pathway-mapper-page animate-reveal">
      <main className="layout-body" style={{ padding: 0 }}>
        {!isGenerated ? (
          /* STAGE 1: INTAKE */
          <div className="input-environment glass-panel animate-reveal" style={{ maxWidth: '900px', margin: '4rem auto', padding: '4rem' }}>
            <div className="text-center mb-12">
              <div className="inline-icon-box mb-6" style={{ background: 'rgba(125, 211, 252, 0.1)', padding: '1.5rem', borderRadius: '24px', display: 'inline-block' }}>
                <Network size={48} color="var(--accent-arctic)" />
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Pathway Interaction Mapper</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Map the oncogenic signal cascade across cellular regulatory networks.</p>
            </div>

            <div className="twin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div className="form-column">
                <div className="form-group mb-8">
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>Primary Pathway</label>
                  <select className="input-field" style={{ width: '100%' }} value={pathwayName} onChange={e => setPathwayName(e.target.value)}>
                    <option>MAPK / ERK Signaling</option>
                    <option>PI3K / AKT / mTOR</option>
                    <option>Wnt / Beta-Catenin</option>
                    <option>JAK / STAT Pathway</option>
                    <option>NF-κB Signaling</option>
                    <option>TGF-β Signaling</option>
                    <option>Notch Signaling</option>
                    <option>Hedgehog Signaling</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>Clinical Context</label>
                  <textarea className="input-field" style={{ width: '100%', minHeight: '120px', resize: 'none' }} placeholder="e.g. Metastatic Melanoma, BRAF-V600E context..." value={clinicalContext} onChange={e => setClinicalContext(e.target.value)} />
                </div>
              </div>

              <div className="form-column">
                 <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid var(--accent-arctic)' }}>
                       <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Zap size={16} color="var(--accent-arctic)" /> Signal Propagation</h3>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>AI-driven prediction of downstream activation based on specific mutations.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid var(--accent-emerald)' }}>
                       <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Cpu size={16} color="var(--accent-emerald)" /> Network Topology</h3>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Real-time mapping of cross-talk between overlapping signaling circuits.</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              {errorMessage && (
                <div style={{ color: 'var(--status-pathogenic)', marginBottom: '1rem', padding: '1rem', background: 'rgba(251, 113, 133, 0.1)', borderRadius: '8px', border: '1px solid rgba(251, 113, 133, 0.2)' }}>
                  <AlertTriangle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                  {errorMessage}
                </div>
              )}
              <button className="submit-button" style={{ padding: '1.5rem 4rem', width: 'auto', fontSize: '1.1rem' }} onClick={handleSynthesize} disabled={loading}>
                {loading ? 'Simulating Cascade...' : 'Map Signaling Network'} <ChevronRight size={18} style={{ marginLeft: '10px' }} />
              </button>
            </div>
          </div>
        ) : (
          /* STAGE 2: INTERACTIVE MAP */
          <div className="visualizer-grid animate-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 450px', height: 'calc(100vh - 120px)', width: '100%' }}>
            
            <div className="stage-container glass-panel" style={{ margin: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)', position: 'relative' }}>
              {/* Background Grid */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(var(--accent-arctic) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}></div>

              <div className="stage-header" style={{ padding: '2rem 3rem 0.5rem 3rem', zIndex: 10, position: 'relative' }}>
                <div className="badge animate-reveal" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent-emerald)', border: '1px solid rgba(45, 212, 191, 0.3)', backdropFilter: 'blur(10px)', width: 'fit-content' }}>
                  NETWORK TOPOLOGY: ACTIVE
                </div>
                <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', letterSpacing: '-0.03em', fontWeight: '800' }}>{pathwayName}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Focus: <span style={{ color: 'var(--accent-arctic)', fontWeight: '600' }}>{clinicalContext || 'Global Network Status'}</span></p>
              </div>

              {/* SVG Network Graph - Now in its own container to prevent overlap */}
              <div className="svg-wrapper" style={{ flex: 1, position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 1000 600" style={{ pointerEvents: 'auto', display: 'block' }}>
                <defs>
                   <filter id="glow-heavy" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                   </filter>
                </defs>

                {/* Connections */}
                {connections.map((conn, i) => {
                  const from = nodes.find(n => n.id === conn.from);
                  const to = nodes.find(n => n.id === conn.to);
                  // Optimized vertical offset for compressed layout
                  const x1 = from.x + 100; const y1 = from.y + 20;
                  const x2 = to.x + 100; const y2 = to.y + 20;
                  const isHyper = from.status === 'hyperactive' && to.status === 'hyperactive';
                  
                  return (
                    <g key={i}>
                       <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                       {isHyper && (
                         <g>
                           <line 
                             x1={x1} y1={y1} x2={x2} y2={y2} 
                             stroke="var(--accent-arctic)" strokeWidth="4" filter="url(#glow-heavy)"
                             strokeDasharray="15, 25"
                           >
                              <animate attributeName="stroke-dashoffset" from="400" to="0" dur="4s" repeatCount="indefinite" />
                           </line>
                           <circle r="5" fill="var(--accent-arctic)">
                              <animateMotion path={`M ${x1} ${y1} L ${x2} ${y2}`} dur="1.2s" repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
                           </circle>
                         </g>
                       )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const cx = node.x + 100;
                  const cy = node.y + 20; 
                  return (
                    <g key={node.id} transform={`translate(${cx},${cy})`} style={{ cursor: 'pointer' }} onClick={() => setActiveNode(node)}>
                      <circle 
                        r={node.status === 'hyperactive' ? 28 : 20} 
                        fill={node.status === 'hyperactive' ? 'rgba(125, 211, 252, 0.15)' : 'rgba(15, 23, 42, 0.95)'}
                        stroke={node.status === 'hyperactive' ? 'var(--accent-arctic)' : 'rgba(255,255,255,0.25)'}
                        strokeWidth={node.status === 'hyperactive' ? '4' : '2'}
                        filter={node.status === 'hyperactive' ? 'url(#glow-heavy)' : ''}
                      />
                      <text 
                        x="0" y="-45" textAnchor="middle" fill={node.status === 'hyperactive' ? 'white' : 'var(--text-muted)'} 
                        fontSize="14" fontWeight="700" style={{ userSelect: 'none', fontFamily: 'Outfit' }}
                      >
                        {node.label}
                      </text>
                      {node.status === 'hyperactive' && (
                        <circle r="28" fill="transparent" stroke="var(--accent-arctic)" strokeWidth="1.5" opacity="0.6">
                           <animate attributeName="r" from="28" to="60" dur="2s" repeatCount="indefinite" />
                           <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>
              </div>

              <div className="stage-controls" style={{ position: 'absolute', bottom: '3rem', left: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 10 }}>
                 <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15, 23, 42, 0.8)', width: 'fit-content' }}>
                    <div className="pulse-dot" style={{ width: '10px', height: '10px', background: 'var(--accent-arctic)', boxShadow: '0 0 15px var(--accent-arctic)' }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em' }}>HYPER-ACTIVE CIRCUIT</span>
                 </div>
                 <button className="glass-panel" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '600', width: 'fit-content', border: '1px solid var(--border-glass)' }} onClick={() => setIsGenerated(false)}>
                   Switch Pathway
                 </button>
              </div>
            </div>

            {/* Analysis Panel */}
            <div className="analysis-panel glass-panel" style={{ margin: '1rem 1rem 1rem 0', padding: '3.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem' }}>
                <Target color="var(--accent-emerald)" size={24} />
                <h2 style={{ fontSize: '1.1rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '1rem' }}>Cellular Intelligence</h2>
              </div>

              {activeNode ? (
                <div className="node-details animate-reveal">
                   <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{activeNode.label}</h3>
                   <span className={`badge ${activeNode.status === 'hyperactive' ? 'pathogenic' : 'benign'}`} style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
                     Status: {activeNode.status.toUpperCase()}
                   </span>
                   <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                     {activeNode.status === 'hyperactive' 
                       ? "Loss of regulatory inhibition detected. This node is driving constitutive downstream signaling."
                       : "Currently maintaining normal regulatory homeostasis within the selected context."}
                   </p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', margin: 'auto', opacity: 0.3 }}>
                   <Info size={48} style={{ marginBottom: '1rem' }} />
                   <p>Select a node to analyze<br/>local network disruption.</p>
                </div>
              )}

              <div className="mt-auto">
                 <div className="risk-indicator glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid var(--status-pathogenic)', background: 'rgba(251, 113, 133, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                       <AlertTriangle size={18} color="var(--status-pathogenic)" />
                       <span style={{ fontWeight: '600', color: 'var(--status-pathogenic)' }}>Escape Pathway Risk</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                       {riskAssessment}
                    </p>
                 </div>
                 <button className="submit-button mt-6" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                   <Share2 size={18} /> Export Network Map
                 </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PathwayMapper;
