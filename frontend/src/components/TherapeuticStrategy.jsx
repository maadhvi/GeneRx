import React, { useState, useEffect } from 'react';
import { Stethoscope, Activity, ShieldAlert, ChevronRight, CheckCircle2, XCircle, AlertTriangle, TrendingUp, Info } from 'lucide-react';

const TherapeuticStrategy = () => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    indication: 'Metastatic Melanoma (Stage IV)',
    variant: 'BRAF V600E'
  });

  const [strategyData, setStrategyData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSynthesize = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const token = localStorage.getItem('generx_token');
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ indication: formData.indication, variant: formData.variant })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'API Error');
      setStrategyData(data);
      setIsGenerated(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="therapeutic-strategy-page animate-reveal">
      <main className="layout-body" style={{ padding: 0 }}>
        {!isGenerated ? (
          /* STAGE 1: CLINICAL INTAKE */
          <div className="input-environment glass-panel animate-reveal" style={{ maxWidth: '900px', margin: '4rem auto', padding: '4rem' }}>
            <div className="text-center mb-12">
              <div className="inline-icon-box mb-6" style={{ background: 'rgba(125, 211, 252, 0.1)', padding: '1.5rem', borderRadius: '24px', display: 'inline-block' }}>
                <Stethoscope size={48} color="var(--accent-arctic)" />
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Clinical Strategy Engine</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Predict disease aggressiveness and formulate an evidence-based treatment blueprint.</p>
            </div>

            <div className="twin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div className="form-column">
                <div className="form-group mb-8">
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>Clinical Indication</label>
                  <input type="text" className="input-field" style={{ width: '100%' }} value={formData.indication} onChange={e => setFormData({...formData, indication: e.target.value})} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>Primary Variant / Mutation</label>
                  <input type="text" className="input-field" style={{ width: '100%' }} value={formData.variant} onChange={e => setFormData({...formData, variant: e.target.value})} />
                </div>
              </div>

              <div className="form-column">
                 <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid var(--accent-arctic)' }}>
                       <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity size={16} color="var(--accent-arctic)" /> Risk Stratification</h3>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>AI-driven analysis of tumor aggressiveness and metastatic potential.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid var(--accent-emerald)' }}>
                       <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldAlert size={16} color="var(--accent-emerald)" /> Therapeutic Blueprint</h3>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Algorithmic prioritization of first-line, off-label, and contraindicated drugs.</p>
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
                {loading ? 'Synthesizing Strategy...' : 'Generate Clinical Blueprint'} <ChevronRight size={18} style={{ marginLeft: '10px' }} />
              </button>
            </div>
          </div>
        ) : (
          /* STAGE 2: RESULTS DASHBOARD */
          <div className="visualizer-grid animate-reveal" style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', margin: '2rem', height: 'calc(100vh - 150px)' }}>
            
            {/* Left Panel: Risk Stratification */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '2.5rem' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <Activity color="var(--status-warning)" size={24} />
                <h2 style={{ fontSize: '1.2rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1rem' }}>Risk Stratification</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Profile: {formData.variant}</p>
              </div>

              <div className="risk-metrics" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Aggressiveness Gauge */}
                <div className="metric-box">
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Tumor Aggressiveness</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--status-warning)' }}>{strategyData?.aggressiveness}</span>
                   </div>
                   <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: strategyData?.aggressiveness === 'High' ? '85%' : strategyData?.aggressiveness === 'Moderate' ? '50%' : '20%', background: 'linear-gradient(90deg, var(--accent-emerald) 0%, var(--status-warning) 50%, var(--status-pathogenic) 100%)' }}></div>
                   </div>
                </div>

                {/* Metastasis Risk */}
                <div className="metric-box">
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Metastatic Potential</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--status-pathogenic)' }}>{strategyData?.metastatic_potential}</span>
                   </div>
                   <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: strategyData?.metastatic_potential === 'Critical' ? '95%' : strategyData?.metastatic_potential === 'Elevated' ? '65%' : '30%', background: 'var(--status-pathogenic)' }}></div>
                   </div>
                </div>

                {/* Growth Rate */}
                <div className="metric-box glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(0,0,0,0.2)', borderLeft: '4px solid var(--accent-arctic)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                     <TrendingUp size={20} color="var(--accent-arctic)" />
                     <span style={{ fontWeight: '700' }}>Ki-67 Proliferation Index</span>
                   </div>
                   <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>{strategyData?.ki67_index}</div>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Predicted proliferative state driven by the provided variant.</p>
                </div>
              </div>

              <button className="glass-panel mt-auto" style={{ padding: '1rem', cursor: 'pointer', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)' }} onClick={() => setIsGenerated(false)}>
                Recalculate Profile
              </button>
            </div>

            {/* Right Panel: Therapeutic Blueprint */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '3rem', overflowY: 'auto' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <Stethoscope color="var(--accent-emerald)" size={28} />
                <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em', marginTop: '1rem', fontWeight: '800' }}>Therapeutic Blueprint</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>AI-generated clinical pathways for {formData.indication}</p>
              </div>

              <div className="treatment-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* First Line Therapy */}
                <div className="treatment-card" style={{ padding: '2rem', background: 'rgba(45, 212, 191, 0.05)', border: '1px solid rgba(45, 212, 191, 0.2)', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                   <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', background: 'var(--accent-emerald)' }}></div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <div className="badge" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent-emerald)', display: 'inline-block', marginBottom: '0.5rem' }}>PRIMARY INDICATION</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{strategyData?.primary_therapy?.name}</h3>
                      </div>
                      <CheckCircle2 size={32} color="var(--accent-emerald)" />
                   </div>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                     {strategyData?.primary_therapy?.rationale}
                   </p>
                   {(strategyData?.primary_therapy?.expected_response || strategyData?.primary_therapy?.resistance_timeline) && (
                     <div style={{ display: 'flex', gap: '1rem' }}>
                       {strategyData?.primary_therapy?.expected_response && <span style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>Expected Response: <strong style={{ color: 'var(--accent-emerald)' }}>{strategyData?.primary_therapy?.expected_response}</strong></span>}
                       {strategyData?.primary_therapy?.resistance_timeline && <span style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>Resistance Timeline: <strong>{strategyData?.primary_therapy?.resistance_timeline}</strong></span>}
                     </div>
                   )}
                </div>

                {/* Off-Label / Clinical Trial */}
                <div className="treatment-card" style={{ padding: '2rem', background: 'rgba(125, 211, 252, 0.05)', border: '1px solid rgba(125, 211, 252, 0.2)', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                   <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', background: 'var(--accent-arctic)' }}></div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <div className="badge" style={{ background: 'rgba(125, 211, 252, 0.1)', color: 'var(--accent-arctic)', display: 'inline-block', marginBottom: '0.5rem' }}>CLINICAL TRIAL / ALTERNATIVE</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{strategyData?.alternative_therapy?.name}</h3>
                      </div>
                      <Info size={32} color="var(--accent-arctic)" />
                   </div>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                     {strategyData?.alternative_therapy?.rationale}
                   </p>
                </div>

                {/* Contraindicated */}
                <div className="treatment-card" style={{ padding: '2rem', background: 'rgba(251, 113, 133, 0.05)', border: '1px solid rgba(251, 113, 133, 0.2)', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                   <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', background: 'var(--status-pathogenic)' }}></div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <div className="badge" style={{ background: 'rgba(251, 113, 133, 0.1)', color: 'var(--status-pathogenic)', display: 'inline-block', marginBottom: '0.5rem' }}>CONTRAINDICATED</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{strategyData?.contraindicated?.name}</h3>
                      </div>
                      <XCircle size={32} color="var(--status-pathogenic)" />
                   </div>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                     {strategyData?.contraindicated?.rationale}
                   </p>
                </div>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default TherapeuticStrategy;
