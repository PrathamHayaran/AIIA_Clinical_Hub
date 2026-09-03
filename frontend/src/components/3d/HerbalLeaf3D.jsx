import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const HerbalLeaf3D = ({
  className = 'w-24 h-24',
  color = '#608c7d',
  accentColor = '#f4a28c',
  speed = 1,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 100;
    const height = currentMount.clientHeight || 100;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(new THREE.Color(accentColor), 2, 20);
    pointLight.position.set(-2, -2, 2);
    scene.add(pointLight);

    // Herbal Leaf Geometry Group
    const leafGroup = new THREE.Group();
    scene.add(leafGroup);

    // Procedural Leaf Blade Geometry
    const shape = new THREE.Shape();
    shape.moveTo(0, -1.2);
    shape.bezierCurveTo(0.9, -0.6, 1.1, 0.6, 0, 1.4);
    shape.bezierCurveTo(-1.1, 0.6, -0.9, -0.6, 0, -1.2);

    const extrudeSettings = {
      steps: 2,
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 4,
    };

    const leafGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Add organic curvature
    const pos = leafGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      pos.setZ(i, pos.getZ(i) - (x * x) * 0.18 + Math.sin(y * 1.5) * 0.12);
    }
    leafGeo.computeVertexNormals();

    const leafMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color).multiplyScalar(0.2),
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      transmission: 0.25,
      thickness: 0.5,
      side: THREE.DoubleSide,
    });

    const leafMesh = new THREE.Mesh(leafGeo, leafMat);
    leafMesh.scale.set(0.9, 0.9, 0.9);
    leafGroup.add(leafMesh);

    // Leaf Central Vein / Stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.5, 0.02),
      new THREE.Vector3(0, 0, 0.08),
      new THREE.Vector3(0, 1.35, 0.02),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.035, 8, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x4e7c6e,
      roughness: 0.4,
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    leafGroup.add(stemMesh);

    // Orbiting Active Extract Biomolecules
    const moleculeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const moleculeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    const mol1 = new THREE.Mesh(moleculeGeo, moleculeMat);
    const mol2 = new THREE.Mesh(moleculeGeo, moleculeMat);
    leafGroup.add(mol1);
    leafGroup.add(mol2);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime() * speed;

      // Organic Floating & Tilting
      leafGroup.rotation.y = Math.sin(t * 0.8) * 0.45;
      leafGroup.rotation.x = Math.cos(t * 0.6) * 0.25 + 0.1;
      leafGroup.rotation.z = Math.sin(t * 0.5) * 0.15;
      leafGroup.position.y = Math.sin(t * 1.2) * 0.12;

      // Orbiting Active Bio-Molecules
      mol1.position.set(Math.cos(t * 1.5) * 1.1, Math.sin(t * 1.5) * 0.8, Math.sin(t * 2) * 0.5);
      mol2.position.set(Math.cos(t * 1.5 + Math.PI) * 1.1, Math.sin(t * 1.5 + Math.PI) * 0.8, -Math.sin(t * 2) * 0.5);

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
  }, [color, accentColor, speed]);

  return <div ref={mountRef} className={`relative overflow-hidden select-none ${className}`} />;
};
