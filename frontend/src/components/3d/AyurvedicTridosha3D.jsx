import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const AyurvedicTridosha3D = ({
  className = 'w-full h-48',
  interactive = true,
  activeDosha = 'Tridoshic',
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene, Camera & Renderer
    const width = currentMount.clientWidth || 300;
    const height = currentMount.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xf4a28c, 2.5, 50); // Peach/Pitta
    pointLight1.position.set(4, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x608c7d, 2.5, 50); // Sage/Kapha
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xa3c5b3, 2, 50); // Ethereal/Vata
    pointLight3.position.set(0, 4, -2);
    scene.add(pointLight3);

    // 3. Central Tridosha Core Group
    const tridoshaGroup = new THREE.Group();
    scene.add(tridoshaGroup);

    // Central Sacred Core (Glassy Torus Knot)
    const coreGeo = new THREE.TorusKnotGeometry(0.8, 0.22, 100, 16, 2, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x608c7d,
      emissive: 0x224433,
      emissiveIntensity: 0.3,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.6,
      thickness: 1.2,
      reflectivity: 0.9,
      clearcoat: 1.0,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    tridoshaGroup.add(coreMesh);

    // Outer Orbit Rings (Sacred Ayurvedic Geometry)
    const ringGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xf4a28c, transparent: true, opacity: 0.45 });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x608c7d, transparent: true, opacity: 0.45 });
    
    const ring1 = new THREE.Mesh(ringGeo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    tridoshaGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 4;
    tridoshaGroup.add(ring2);

    // 3 Celestial Dosha Nodes
    // Vata Node (Air/Ether - Light Aqua)
    const nodeGeo = new THREE.SphereGeometry(0.22, 32, 32);
    const vataMat = new THREE.MeshStandardMaterial({
      color: 0x86efac,
      emissive: 0x22c55e,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.4,
    });
    const vataNode = new THREE.Mesh(nodeGeo, vataMat);
    tridoshaGroup.add(vataNode);

    // Pitta Node (Fire/Water - Warm Terracotta/Peach)
    const pittaMat = new THREE.MeshStandardMaterial({
      color: 0xf4a28c,
      emissive: 0xe11d48,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.4,
    });
    const pittaNode = new THREE.Mesh(nodeGeo, pittaMat);
    tridoshaGroup.add(pittaNode);

    // Kapha Node (Earth/Water - Deep Sage Green)
    const kaphaMat = new THREE.MeshStandardMaterial({
      color: 0x4e7c6e,
      emissive: 0x14532d,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.4,
    });
    const kaphaNode = new THREE.Mesh(nodeGeo, kaphaMat);
    tridoshaGroup.add(kaphaNode);

    // 4. Botanical Herbal Dust Particle Cloud
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.4 + Math.random() * 1.6;

      particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = r * Math.cos(phi);

      particleScales[i] = Math.random();
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xa3c5b3,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    tridoshaGroup.add(particleSystem);

    // 5. Mouse Interaction Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = currentMount.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 1.5;
      targetY = (y / rect.height) * 1.5;
    };

    if (interactive) {
      currentMount.addEventListener('mousemove', handleMouseMove);
    }

    // 6. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Group rotation with gentle continuous float
      tridoshaGroup.rotation.y = elapsedTime * 0.35 + mouseX;
      tridoshaGroup.rotation.x = Math.sin(elapsedTime * 0.25) * 0.2 + mouseY;

      // Core pulsating breathing
      const breathe = 1 + Math.sin(elapsedTime * 1.5) * 0.04;
      coreMesh.scale.set(breathe, breathe, breathe);

      // Celestial Dosha Nodes Orbit
      const orbitR = 1.6;
      // Vata (Top orbiting)
      vataNode.position.x = Math.cos(elapsedTime * 0.8) * orbitR;
      vataNode.position.y = Math.sin(elapsedTime * 0.8) * orbitR;
      vataNode.position.z = Math.sin(elapsedTime * 0.4) * 0.8;

      // Pitta (Offset orbit)
      pittaNode.position.x = Math.cos(elapsedTime * 0.8 + (Math.PI * 2) / 3) * orbitR;
      pittaNode.position.y = Math.sin(elapsedTime * 0.8 + (Math.PI * 2) / 3) * orbitR;
      pittaNode.position.z = Math.cos(elapsedTime * 0.5) * 0.8;

      // Kapha (Offset orbit)
      kaphaNode.position.x = Math.cos(elapsedTime * 0.8 + (Math.PI * 4) / 3) * orbitR;
      kaphaNode.position.y = Math.sin(elapsedTime * 0.8 + (Math.PI * 4) / 3) * orbitR;
      kaphaNode.position.z = Math.sin(elapsedTime * 0.6) * 0.8;

      // Particle cloud counter-rotation
      particleSystem.rotation.y = -elapsedTime * 0.15;
      particleSystem.rotation.z = elapsedTime * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      if (newWidth && newHeight) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        currentMount.removeEventListener('mousemove', handleMouseMove);
      }
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive, activeDosha]);

  return (
    <div
      ref={mountRef}
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing select-none ${className}`}
      title="3D Interactive Tridosha Balance Orbit (Drag/Hover to Rotate)"
    />
  );
};
