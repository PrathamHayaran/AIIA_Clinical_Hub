import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const AyurvedicChakraPulse3D = ({
  className = 'w-full h-44',
  primaryColor = '#608c7d',
  accentColor = '#f4a28c',
  interactive = true,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 250;
    const height = currentMount.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const point1 = new THREE.PointLight(new THREE.Color(accentColor), 2.5, 30);
    point1.position.set(3, 3, 3);
    scene.add(point1);

    const point2 = new THREE.PointLight(new THREE.Color(primaryColor), 2.5, 30);
    point2.position.set(-3, -3, 3);
    scene.add(point2);

    const chakraGroup = new THREE.Group();
    scene.add(chakraGroup);

    // 1. Concentric Lotus Chakra Petal Rings
    const petalCount = 8;
    const innerPetalGroup = new THREE.Group();
    const outerPetalGroup = new THREE.Group();
    chakraGroup.add(innerPetalGroup);
    chakraGroup.add(outerPetalGroup);

    // Petal geometry
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.3, 0.6, 0, 1.2);
    petalShape.quadraticCurveTo(-0.3, 0.6, 0, 0);

    const petalGeo = new THREE.ShapeGeometry(petalShape);
    const petalMat1 = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(primaryColor),
      emissive: new THREE.Color(primaryColor).multiplyScalar(0.2),
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    const petalMat2 = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor).multiplyScalar(0.2),
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });

    // Inner ring (8 petals)
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo, petalMat1);
      petal.rotation.z = angle;
      petal.scale.set(0.65, 0.65, 0.65);
      innerPetalGroup.add(petal);
    }

    // Outer ring (12 petals)
    const outerPetalCount = 12;
    for (let i = 0; i < outerPetalCount; i++) {
      const angle = (i / outerPetalCount) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo, petalMat2);
      petal.rotation.z = angle;
      petal.scale.set(0.9, 0.9, 0.9);
      outerPetalGroup.add(petal);
    }

    // 2. Central Prana Core Sphere (Translucent Golden Core)
    const coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    chakraGroup.add(coreMesh);

    // 3. Orbiting Prana Rings
    const ringGeo = new THREE.TorusGeometry(1.4, 0.018, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(primaryColor),
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.5;
    chakraGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 2.5;
    chakraGroup.add(ring2);

    // 4. Prana Sparkle Particles
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const r = 1.2 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: new THREE.Color(accentColor),
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const pranaParticles = new THREE.Points(pGeo, pMat);
    chakraGroup.add(pranaParticles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      targetX = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 1.5;
      targetY = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 1.5;
    };

    if (interactive) {
      currentMount.addEventListener('mousemove', handleMouseMove);
    }

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Group Tilting
      chakraGroup.rotation.x = Math.sin(t * 0.3) * 0.2 + mouseY;
      chakraGroup.rotation.y = Math.cos(t * 0.3) * 0.2 + mouseX;

      // Counter-rotating petal rings
      innerPetalGroup.rotation.z = t * 0.4;
      outerPetalGroup.rotation.z = -t * 0.25;

      // Breathing scale
      const pulse = 1 + Math.sin(t * 2) * 0.05;
      coreMesh.scale.set(pulse, pulse, pulse);
      innerPetalGroup.scale.set(pulse, pulse, pulse);

      // Particle rotation
      pranaParticles.rotation.y = t * 0.2;

      renderer.render(scene, camera);
    };

    animate();

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
  }, [primaryColor, accentColor, interactive]);

  return (
    <div
      ref={mountRef}
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing select-none ${className}`}
      title="3D Ayurvedic Prana & Chakra Harmony Wheel"
    />
  );
};
