import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls, ContactShadows, Text, MeshDistortMaterial } from '@react-three/drei';
import { Activity, ShieldAlert, Cpu, Box, ChevronRight, Zap, Thermometer, Maximize2, Upload, FileText, Database, ShieldCheck } from 'lucide-react';
import * as THREE from 'three';

const ProteinModel = ({ isMutated }) => {
  const groupRef = useRef();
  const atoms = useMemo(() => {
    const data = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 2 + Math.random() * 3;
      data.push({
        position: [Math.sin(phi) * Math.cos(theta) * dist, Math.sin(phi) * Math.sin(theta) * dist, Math.cos(phi) * dist],
        size: 0.2 + Math.random() * 0.4,
        color: Math.random() > 0.8 ? (isMutated ? '#fb7185' : '#2dd4bf') : '#7dd3fc',
        isHotspot: Math.random() > 0.9
      });
    }
    return data;
  }, [isMutated]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {atoms.map((atom, i) => (
        <group key={i} position={atom.position}>
          <mesh>
            <sphereGeometry args={[atom.size, 32, 32]} />
            <meshStandardMaterial color={atom.color} emissive={atom.color} emissiveIntensity={atom.isHotspot ? 2 : 0.2} roughness={0.1} metalness={0.8} />
          </mesh>
          {atom.isHotspot && (
            <mesh><sphereGeometry args={[atom.size * 1.5, 16, 16]} /><meshStandardMaterial color={atom.color} transparent opacity={0.1} /></mesh>
          )}
        </group>
      ))}
      <mesh rotation={[0.5, 0.5, 0]}>
        <torusKnotGeometry args={[3, 0.05, 128, 16]} />
        <MeshDistortMaterial speed={2} distort={0.3} color={isMutated ? "#fb7185" : "#7dd3fc"} opacity={0.3} transparent />
      </mesh>
    </group>
  );
};

const ProteinVisualizer = () => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMutated, setIsMutated] = useState(true);
  const [formData, setFormData] = useState({
    proteinName: 'BRAF Kinase Domain',
    mutationId: 'p.V600E'
  });

  const handleSynthesize = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsGenerated(true);
    }, 2000);
  };

  return (
    <div className="protein-visualizer-page animate-reveal">
      <main className="layout-body" style={{ padding: 0 }}>
        {!isGenerated ? (
          /* INTAKE PORTAL */
          <div className="input-environment glass-panel animate-reveal" style={{ maxWidth: '900px', margin: '4rem auto', padding: '4rem' }}>
            <div className="text-center mb-12">
              <div className="inline-icon-box mb-6" style={{ background: 'rgba(125, 211, 252, 0.1)', padding: '1.5rem', borderRadius: '24px', display: 'inline-block' }}>
                <Box size={48} color="var(--accent-arctic)" />
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Structural Analysis Portal</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Upload structural coordinates (PDB/SDF) to visualize conformational impacts of mutations.</p>
            </div>

            <div className="twin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div className="form-column">
                <div className="form-group mb-8">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Protein Identifier</label>
                  <input type="text" className="input-field" style={{ width: '100%' }} value={formData.proteinName} onChange={e => setFormData({...formData, proteinName: e.target.value})} />
                </div>
                <div className="form-group mb-8">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Mutation / Residue ID</label>
                  <input type="text" className="input-field" style={{ width: '100%' }} value={formData.mutationId} onChange={e => setFormData({...formData, mutationId: e.target.value})} />
                </div>
                <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                   <div className="glass-panel" style={{ padding: '1rem 1.5rem', borderRadius: '16px', borderLeft: '3px solid var(--accent-emerald)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldCheck size={16} color="var(--accent-emerald)" /><span style={{ fontSize: '0.8rem' }}>Proprietary Encryption Active</span></div>
                   </div>
                </div>
              </div>

              <div className="form-column">
                <div className="upload-zone" style={{ border: '2px dashed var(--border-glass)', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', cursor: 'pointer' }}>
                  <Upload size={32} color="var(--accent-arctic)" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Upload Structure File</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Drag and drop .pdb, .sdf, or .mol2</p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button className="submit-button" style={{ padding: '1.5rem 4rem', width: 'auto', fontSize: '1.1rem' }} onClick={handleSynthesize} disabled={loading}>
                {loading ? 'Analyzing Structure...' : 'Visualize 3D Impact'} <Zap size={18} style={{ marginLeft: '10px' }} />
              </button>
            </div>
          </div>
        ) : (
          /* VISUALIZER DASHBOARD */
          <div className="visualizer-grid animate-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', height: 'calc(100vh - 120px)', width: '100%' }}>
            <div className="stage-container glass-panel" style={{ margin: '1rem', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.8) 100%)' }}>
              <div className="stage-overlay" style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
                <div className="badge" style={{ background: 'rgba(125, 211, 252, 0.1)', color: 'var(--accent-arctic)', border: '1px solid var(--border-glass)', backdropFilter: 'blur(10px)' }}>LIVE 3D RENDER</div>
                <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>{formData.proteinName}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Mutation: <span style={{ color: 'var(--status-pathogenic)' }}>{formData.mutationId}</span></p>
              </div>

              <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#7dd3fc" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#fb7185" />
                <Environment preset="city" />
                <PresentationControls global rotation={[0, 0.3, 0]} polar={[-Math.PI / 3, Math.PI / 3]} azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}>
                  <Float speed={2} rotationIntensity={1} floatIntensity={2}><ProteinModel isMutated={isMutated} /></Float>
                </PresentationControls>
                <ContactShadows position={[0, -8, 0]} opacity={0.4} scale={20} blur={2.5} far={10} />
              </Canvas>

              <div className="stage-controls" style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1rem', zIndex: 10 }}>
                 <button className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setIsMutated(!isMutated)}>
                   <Zap size={16} color={isMutated ? "var(--status-pathogenic)" : "var(--accent-emerald)"} />
                   <span>{isMutated ? "View Wild-Type" : "Apply Mutation"}</span>
                 </button>
                 <button className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setIsGenerated(false)}>
                   <Maximize2 size={16} />
                   <span>New Analysis</span>
                 </button>
              </div>
            </div>

            <div className="analysis-panel glass-panel" style={{ margin: '1rem 1rem 1rem 0', padding: '2.5rem' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <Box color="var(--accent-arctic)" size={20} />
                <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Structural Analysis</h2>
              </div>
              <div className="impact-metric mb-8">
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Conformational Stability</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: isMutated ? '35%' : '95%', height: '100%', background: isMutated ? 'var(--status-pathogenic)' : 'var(--accent-emerald)', transition: 'all 1s ease' }}></div>
                  </div>
                  <span style={{ fontWeight: '700', color: isMutated ? 'var(--status-pathogenic)' : 'var(--accent-emerald)' }}>{isMutated ? '-6.2 kcal/mol' : 'Stable'}</span>
                </div>
              </div>
              <div className="hotspot-list">
                 {[{ id: 'VAL-600', impact: 'Critical' }, { id: 'ASP-594', impact: 'Moderate' }].map((item, i) => (
                   <div key={i} className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem', borderLeft: '4px solid var(--status-pathogenic)', background: 'rgba(0,0,0,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600' }}>{item.id}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--status-pathogenic)', fontWeight: '700' }}>{item.impact}</span>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="ai-structural-insight mt-auto" style={{ background: 'rgba(125, 211, 252, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}><Cpu size={18} color="var(--accent-arctic)" /><span style={{ fontSize: '0.9rem', fontWeight: '600' }}>AI Insight</span></div>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: 0 }}>The substitution disrupts hydrophobic interactions, causing a constitutive shift to the active conformation.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProteinVisualizer;
