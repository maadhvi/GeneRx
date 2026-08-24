import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function DNAHelix() {
  const groupRef = useRef();
  
  // Helix parameters
  const numBasePairs = 20;
  const radius = 2.5;
  const height = 15;
  const twists = 2; // Number of full rotations
  
  // Generate geometry data
  const basePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < numBasePairs; i++) {
      const t = i / (numBasePairs - 1);
      const y = (t - 0.5) * height;
      const angle = t * Math.PI * 2 * twists;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      pairs.push({
        position1: [x, y, z],
        position2: [-x, y, -z],
        rotation: [0, -angle, Math.PI / 2]
      });
    }
    return pairs;
  }, [numBasePairs, radius, height, twists]);

  // Rotate the entire group
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <group ref={groupRef} rotation={[0, 0, Math.PI / 8]}>
        {basePairs.map((pair, i) => (
          <group key={i}>
            {/* Backbone spheres */}
            <Sphere args={[0.3, 32, 32]} position={pair.position1}>
              <meshStandardMaterial 
                color="#7dd3fc" 
                emissive="#7dd3fc" 
                emissiveIntensity={0.3} 
                roughness={0.1} 
                metalness={0.9} 
              />
            </Sphere>
            <Sphere args={[0.3, 32, 32]} position={pair.position2}>
              <meshStandardMaterial 
                color="#2dd4bf" 
                emissive="#2dd4bf" 
                emissiveIntensity={0.3} 
                roughness={0.1} 
                metalness={0.9} 
              />
            </Sphere>
            
            {/* Connecting base pair */}
            <Cylinder 
              args={[0.08, 0.08, radius * 2, 8]} 
              position={[0, pair.position1[1], 0]} 
              rotation={pair.rotation}
            >
              <meshStandardMaterial 
                color="#94a3b8" 
                transparent 
                opacity={0.3}
                roughness={0.5}
                metalness={0.5}
              />
            </Cylinder>
          </group>
        ))}
      </group>
    </Float>
  );
}
