import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const AyurvedicMortar3D = ({
  className = 'w-full h-44',
  glowColor = '#f4a28c',
  baseColor = '#608c7d',
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 250;
    const height = currentMount.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(new THREE.Color(glowColor), 3, 25);
    pointLight.position.set(2, 3, 2);
    scene.add(pointLight);

    const bottomGlow = new THREE.PointLight(new THREE.Color(baseColor), 2, 20);
    bottomGlow.position.set(-2, -1, -1);
    scene.add(bottomGlow);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Ayurvedic Mortar (Kharal Bowl) Geometry
    const mortarPoints = [
      new THREE.Vector2(0.3, -0.8),
      new THREE.Vector2(0.9, -0.6),
      new THREE.Vector2(1.2, -0.1),
      new THREE.Vector2(1.3, 0.4),
      new THREE.Vector2(1.15, 0.45),
      new THREE.Vector2(1.0, 0.0),
      new THREE.Vector2(0.7, -0.4),
      new THREE.Vector2(0.0, -0.5),
    ];
    const mortarGeo = new THREE.LatheGeometry(mortarPoints, 40);
    const mortarMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(baseColor),
      metalness: 0.2,
      roughness: 0.35,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });
    const mortarMesh = new THREE.Mesh(mortarGeo, mortarMat);
    group.add(mortarMesh);

    // 2. Liquid Herbal Extract inside bowl
    const liquidGeo = new THREE.CylinderGeometry(0.95, 0.6, 0.2, 32);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(glowColor),
      emissive: new THREE.Color(glowColor).multiplyScalar(0.4),
      transmission: 0.6,
      roughness: 0.1,
      metalness: 0.1,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = -0.15;
    group.add(liquidMesh);

    // 3. Pestle (Grinder) Geometry
    const pestleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.4, 0),
      new THREE.Vector3(0.4, 0.6, 0.3),
      new THREE.Vector3(0.7, 1.3, 0.5),
    ]);
    const pestleGeo = new THREE.TubeGeometry(pestleCurve, 20, 0.16, 16, false);
    const pestleMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.5,
    });
    const pestleMesh = new THREE.Mesh(pestleGeo, pestleMat);
    group.add(pestleMesh);

    // 4. Rising Botanical Active Extract Particles
    const pCount = 60;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pVel = [];

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 1.2;
      pPos[i * 3 + 1] = -0.2 + Math.random() * 1.8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;

      pVel.push({
        y: 0.008 + Math.random() * 0.015,
        angle: Math.random() * Math.PI * 2,
        r: 0.2 + Math.random() * 0.5,
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: new THREE.Color(glowColor),
      size: 0.07,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const pSystem = new THREE.Points(pGeo, pMat);
    group.add(pSystem);

    // Animation loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Continuous gentle rotation
      group.rotation.y = t * 0.4;
      group.rotation.x = Math.sin(t * 0.3) * 0.1 + 0.15;

      // Pestle circular grinding motion
      pestleMesh.position.x = Math.cos(t * 1.5) * 0.15;
      pestleMesh.position.z = Math.sin(t * 1.5) * 0.15;
      pestleMesh.rotation.y = t * 1.5;

      // Rising alchemy particles
      const positions = pGeo.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        positions[i * 3 + 1] += pVel[i].y;
        positions[i * 3] += Math.sin(t * 2 + pVel[i].angle) * 0.005;
        positions[i * 3 + 2] += Math.cos(t * 2 + pVel[i].angle) * 0.005;

        // Reset when reaching top
        if (positions[i * 3 + 1] > 1.8) {
          positions[i * 3 + 1] = -0.2;
          positions[i * 3] = (Math.random() - 0.5) * 0.8;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

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
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [glowColor, baseColor]);

  return <div ref={mountRef} className={`relative overflow-hidden select-none ${className}`} />;
};
