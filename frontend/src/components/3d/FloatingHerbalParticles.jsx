import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const FloatingHerbalParticles = ({
  className = 'absolute inset-0 pointer-events-none z-0',
  count = 60,
  colors = [0xedf2ef, 0xa3c5b3, 0xf4a28c],
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    currentMount.appendChild(renderer.domElement);

    // Floating Leaf & Herb Particle Meshes
    const leafCount = count;
    const leafGroup = new THREE.Group();
    scene.add(leafGroup);

    const leaves = [];
    const leafGeo = new THREE.PlaneGeometry(0.35, 0.18);

    for (let i = 0; i < leafCount; i++) {
      const color = colors[i % colors.length];
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25 + Math.random() * 0.35,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(leafGeo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const speed = {
        x: (Math.random() - 0.5) * 0.005,
        y: -0.004 - Math.random() * 0.006,
        rotX: (Math.random() - 0.5) * 0.015,
        rotY: (Math.random() - 0.5) * 0.015,
      };

      leafGroup.add(mesh);
      leaves.push({ mesh, speed });
    }

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      leaves.forEach(({ mesh, speed }) => {
        mesh.position.y += speed.y;
        mesh.position.x += speed.x;
        mesh.rotation.x += speed.rotX;
        mesh.rotation.y += speed.rotY;

        // Loop boundaries
        if (mesh.position.y < -6) mesh.position.y = 6;
        if (mesh.position.x < -11) mesh.position.x = 11;
        if (mesh.position.x > 11) mesh.position.x = -11;
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
  }, [count, colors]);

  return <div ref={mountRef} className={className} />;
};
