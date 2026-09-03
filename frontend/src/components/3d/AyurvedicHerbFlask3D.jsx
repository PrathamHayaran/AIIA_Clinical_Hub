import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const AyurvedicHerbFlask3D = ({
  className = 'w-24 h-24',
  liquidColor = '#608c7d',
  bubbleColor = '#f4a28c',
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 100;
    const height = currentMount.clientHeight || 100;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 3.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(new THREE.Color(bubbleColor), 2.5, 15);
    pointLight.position.set(0, -0.5, 2);
    scene.add(pointLight);

    const flaskGroup = new THREE.Group();
    scene.add(flaskGroup);

    // 1. Glass Erlenmeyer Flask Geometry
    const flaskPoints = [
      new THREE.Vector2(0.3, 1.0),   // Top rim
      new THREE.Vector2(0.3, 0.4),   // Neck
      new THREE.Vector2(1.0, -0.8),  // Base flare
      new THREE.Vector2(0.95, -0.9), // Base curve
      new THREE.Vector2(0.0, -0.9),  // Bottom center
    ];
    const flaskGeo = new THREE.LatheGeometry(flaskPoints, 32);
    const flaskMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1,
      thickness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const flaskMesh = new THREE.Mesh(flaskGeo, flaskMat);
    flaskGroup.add(flaskMesh);

    // 2. Liquid Ayurvedic Decoction inside
    const liquidPoints = [
      new THREE.Vector2(0.0, -0.88),
      new THREE.Vector2(0.9, -0.88),
      new THREE.Vector2(0.65, -0.1),
      new THREE.Vector2(0.0, -0.1),
    ];
    const liquidGeo = new THREE.LatheGeometry(liquidPoints, 32);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(liquidColor),
      emissive: new THREE.Color(liquidColor).multiplyScalar(0.3),
      transmission: 0.6,
      roughness: 0.15,
      metalness: 0.1,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    flaskGroup.add(liquidMesh);

    // 3. Rising Active Herbal Bubbles
    const bCount = 20;
    const bGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const bMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bubbleColor),
      emissive: new THREE.Color(bubbleColor),
      emissiveIntensity: 0.5,
      roughness: 0.2,
    });

    const bubbles = [];
    for (let i = 0; i < bCount; i++) {
      const bubble = new THREE.Mesh(bGeo, bMat);
      const scale = 0.5 + Math.random() * 0.7;
      bubble.scale.set(scale, scale, scale);
      bubble.position.set(
        (Math.random() - 0.5) * 0.7,
        -0.8 + Math.random() * 0.7,
        (Math.random() - 0.5) * 0.7
      );
      flaskGroup.add(bubble);
      bubbles.push({
        mesh: bubble,
        speed: 0.008 + Math.random() * 0.012,
        wobble: Math.random() * Math.PI * 2,
      });
    }

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gentle rocking of flask
      flaskGroup.rotation.y = Math.sin(t * 0.6) * 0.3;
      flaskGroup.rotation.z = Math.cos(t * 0.8) * 0.05;

      // Rising bubbles
      bubbles.forEach(({ mesh, speed, wobble }) => {
        mesh.position.y += speed;
        mesh.position.x += Math.sin(t * 3 + wobble) * 0.003;

        if (mesh.position.y > -0.1) {
          mesh.position.y = -0.85;
          mesh.position.x = (Math.random() - 0.5) * 0.6;
          mesh.position.z = (Math.random() - 0.5) * 0.6;
        }
      });

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
  }, [liquidColor, bubbleColor]);

  return <div ref={mountRef} className={`relative overflow-hidden select-none ${className}`} />;
};
