import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Thermometer, Droplets, FlaskConical, User, Upload, FileText, Zap, ShieldCheck, Database, Heart, Cpu } from 'lucide-react';

const DigitalTwin = () => {
  const { gene, mutation } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: 'PT-2026-X8',
    patientAge: '54, Female',
    clinicalHistory: '',
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState('');
  const [simData, setSimData] = useState(null);
  const [availableDrugs, setAvailableDrugs] = useState([]);

  useEffect(() => {
    const drugsMap = {
      'ALK': ['Lorlatinib', 'Brigatinib', 'Crizotinib'],
      'BRAF': ['Vemurafenib', 'Dabrafenib'],
      'RET': ['Selpercatinib', 'Pralsetinib']
    };
    const drugs = drugsMap[gene?.toUpperCase()] || ['Osimertinib', 'Standard Chemotherapy'];
    setAvailableDrugs(drugs);
    setSelectedDrug(drugs[0]);
  }, [gene]);

  const runSimulation = () => {
    if (!selectedDrug) return;
    setLoading(true);
    setSimData(null);
    
    // Connect to WebSocket
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/simulate');
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ 
        gene: gene || 'EGFR', 
        mutation: mutation || 'L858R', 
        drug: selectedDrug 
      }));
    };
    
    let trajectory = [];
    
    ws.onmessage = (event) => {
      setLoading(false); // Once we get data, we are streaming
      const data = JSON.parse(event.data);
      
      if (data.type === 'metadata') {
        setSimData(prev => ({
          ...prev,
          patient_id: data.patient_id,
          side_effects: data.side_effects,
          risk_meters: data.risk_meters || { hepatic_stress: 0, cardiac_strain: 0, immune_response: 0 },
          trajectory: []
        }));
      } else if (data.type === 'data_point') {
        trajectory = [...trajectory, data.point];
        setSimData(prev => ({
          ...prev,
          trajectory: trajectory
        }));
      } else if (data.type === 'complete') {
        ws.close();
      }
    };
    
    ws.onerror = (err) => {
      console.error("WebSocket Error: ", err);
      setLoading(false);
    };
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      runSimulation();
      setIsGenerated(true);
    }, 1500);
  };

  useEffect(() => {
    if (isGenerated && selectedDrug) {
      runSimulation();
    }
  }, [selectedDrug]);

  return (
    <div className="digital-twin-page animate-reveal">
      <main className="twin-main">
        {!isGenerated ? (
          /* INPUT STAGE */
          <div className="input-environment glass-panel animate-reveal" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem' }}>
            <div className="text-center mb-12">
              <div className="inline-icon-box mb-6" style={{ background: 'rgba(125, 211, 252, 0.1)', padding: '1.5rem', borderRadius: '24px', display: 'inline-block' }}>
                <Activity size={48} color="var(--accent-arctic)" />
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Initialize Digital Twin</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Synthesize a virtual biological model from patient data and genomic sequences.</p>
            </div>

            <div className="twin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div className="form-column">
                <div className="form-group mb-8">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}><User size={14} /> Patient Identifier</label>
                  <input type="text" className="input-field" style={{ width: '100%' }} value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                </div>
                <div className="form-group mb-8">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Demographic Profile</label>
                  <input type="text" className="input-field" style={{ width: '100%' }} value={formData.patientAge} onChange={e => setFormData({...formData, patientAge: e.target.value})} />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}><FileText size={14} /> Clinical Context</label>
                  <textarea className="input-field" style={{ width: '100%', minHeight: '120px', resize: 'none' }} value={formData.clinicalHistory} onChange={e => setFormData({...formData, clinicalHistory: e.target.value})} />
                </div>
              </div>

              <div className="form-column">
                <div className="upload-zone" style={{ border: '2px dashed var(--border-glass)', borderRadius: '24px', padding: '3.5rem 2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', cursor: 'pointer' }}>
                  <Upload size={32} color="var(--accent-arctic)" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Upload Sequences</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>VCF, FASTQ, or EHR records</p>
                </div>
                <div className="info-cards mt-8" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div className="glass-panel" style={{ padding: '1rem 1.5rem', borderRadius: '16px', borderLeft: '3px solid var(--accent-emerald)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldCheck size={16} color="var(--accent-emerald)" /><span style={{ fontSize: '0.8rem' }}>HIPAA Secure Encryption</span></div>
                  </div>
                  <div className="glass-panel" style={{ padding: '1rem 1.5rem', borderRadius: '16px', borderLeft: '3px solid var(--accent-arctic)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Database size={16} color="var(--accent-arctic)" /><span style={{ fontSize: '0.8rem' }}>Real-time Genomic Sync</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button className="submit-button" style={{ padding: '1.5rem 4rem', width: 'auto', fontSize: '1.1rem' }} onClick={handleGenerate} disabled={loading}>
                {loading ? 'Synthesizing Model...' : 'Generate Virtual Bio-Model'} <Zap size={18} style={{ marginLeft: '10px' }} />
              </button>
            </div>
          </div>
        ) : (
          /* RESULT STAGE */
          <div className="twin-result-dashboard animate-reveal">
            <div className="twin-grid" style={{ display: 'grid', gridTemplateColumns: '350px 1fr 350px', gap: '2rem' }}>
              
              {/* Left: Bio Status */}
              <div className="status-panel glass-panel card-3d" style={{ padding: '2.5rem' }}>
                <div className="panel-header" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                  <Heart color="var(--accent-arctic)" size={20} />
                  <h2 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Bio-System Profile</h2>
                </div>
                <div className="patient-id-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{formData.patientName}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formData.patientAge}</p>
                </div>
                <div className="vitals-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {['BPM: 72', 'Temp: 36.8°C', 'SpO2: 98%'].map(v => (
                     <div key={v} className="vital-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-arctic)' }}>{v.split(': ')[0]}</span>
                        <span style={{ fontWeight: '600' }}>{v.split(': ')[1]}</span>
                     </div>
                   ))}
                </div>
                <div className="drug-selection" style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                   <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>Active Therapy Selection</label>
                   <input type="text" value={selectedDrug} onChange={(e) => setSelectedDrug(e.target.value)} className="input-field" style={{ width: '100%', borderRadius: '12px' }} placeholder="Enter drug name..." />
                   <button className="submit-button mt-2" style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }} onClick={runSimulation}>Simulate</button>
                </div>
                <button className="submit-button mt-4" style={{ width: '100%', background: 'var(--bg-obsidian)', color: 'var(--text-muted)', border: '1px solid var(--border-glass)' }} onClick={() => setIsGenerated(false)}>New Intake</button>
              </div>

              {/* Center: Charts */}
              <div className="simulation-lab glass-panel card-3d" style={{ padding: '2.5rem' }}>
                <div className="panel-header" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                  <FlaskConical color="var(--accent-emerald)" size={20} />
                  <h2 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Simulation Environment</h2>
                </div>
                <div className="chart-container">
                   <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Tumor Volume Projection (%)</h3>
                   {simData ? (
                     <ResponsiveContainer width="100%" height={300}>
                       <AreaChart data={simData.trajectory}>
                         <defs>
                           <linearGradient id="colorTumor" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--accent-emerald)" stopOpacity={0.2}/><stop offset="95%" stopColor="var(--accent-emerald)" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                         <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                         <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                         <Tooltip contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', border: '1px solid var(--border-glass)', borderRadius: '12px' }} />
                         <Area type="monotone" dataKey="tumor_volume" stroke="var(--accent-emerald)" fillOpacity={1} fill="url(#colorTumor)" strokeWidth={3} />
                       </AreaChart>
                     </ResponsiveContainer>
                   ) : <div className="loading-state">Processing...</div>}
                </div>
                <div className="chart-container" style={{ marginTop: '3rem' }}>
                   <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Toxicity Analysis</h3>
                   {simData ? (
                     <ResponsiveContainer width="100%" height={120}>
                       <LineChart data={simData.trajectory}>
                         <Line type="monotone" dataKey="toxicity" stroke="var(--status-pathogenic)" strokeWidth={2} dot={false} />
                       </LineChart>
                     </ResponsiveContainer>
                   ) : null}
                </div>
              </div>

              {/* Right: Risks */}
              <div className="risk-panel glass-panel card-3d" style={{ padding: '2.5rem' }}>
                <div className="panel-header" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                  <Activity color="var(--status-pathogenic)" size={20} />
                  <h2 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Systemic Risk Assessment</h2>
                </div>
                <div className="side-effects-list">
                   <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Observed Stress Indicators</h3>
                   {simData?.side_effects.map((se, i) => (
                     <div key={i} className="effect-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: 'rgba(251, 113, 133, 0.05)', borderRadius: '12px', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--status-pathogenic)', border: '1px solid rgba(251, 113, 133, 0.1)' }}>
                       <Droplets size={14} /><span>{se}</span>
                     </div>
                   ))}
                </div>
                <div className="risk-meters" style={{ marginTop: 'auto' }}>
                   {[
                     { label: 'Hepatic Stress', value: simData?.risk_meters?.hepatic_stress || 0 },
                     { label: 'Cardiac Strain', value: simData?.risk_meters?.cardiac_strain || 0 },
                     { label: 'Immune Response', value: simData?.risk_meters?.immune_response || 0 }
                   ].map((meter, i) => (
                     <div key={i} className="meter-group" style={{ marginBottom: '1.25rem' }}>
                        <div className="meter-label" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                           <span>{meter.label}</span>
                           <span style={{ color: 'var(--accent-arctic)' }}>{meter.value}%</span>
                        </div>
                        <div className="meter-bar" style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                           <div className="fill" style={{ width: `${meter.value}%`, height: '100%', background: 'var(--accent-arctic)' }}></div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DigitalTwin;
