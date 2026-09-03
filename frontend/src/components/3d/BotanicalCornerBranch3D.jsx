import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const BotanicalCornerBranch3D = ({
  className = 'w-36 h-36',
  leafColor = '#a3c5b3',
  stemColor = '#4e7c6e',
  accentColor = '#f4a28c',
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 150;
    const height = currentMount.clientHeight || 150;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(3, 4, 3);
    scene.add(sunLight);

    const accentLight = new THREE.PointLight(new THREE.Color(accentColor), 1.5, 10);
    accentLight.position.set(-2, 2, 2);
    scene.add(accentLight);

    const branchGroup = new THREE.Group();
    scene.add(branchGroup);

    // 1. Organic Curved Main Stem (Tulsi / Neem branch)
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.2, -1.2, 0),
      new THREE.Vector3(-0.5, -0.4, 0.1),
      new THREE.Vector3(0.2, 0.3, -0.1),
      new THREE.Vector3(0.9, 1.1, 0),
    ]);

    const stemGeo = new THREE.TubeGeometry(stemCurve, 32, 0.035, 12, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(stemColor),
      roughness: 0.6,
      metalness: 0.1,
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    branchGroup.add(stemMesh);

    // 2. Leaf Geometry
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.25, 0.3, 0.15, 0.65);
    leafShape.quadraticCurveTo(0, 0.9, 0, 0.95);
    leafShape.quadraticCurveTo(-0.15, 0.65, -0.25, 0.3);
    leafShape.quadraticCurveTo(-0.1, 0.05, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(leafShape, 16);
    // Add subtle curvature to leaf
    const pos = leafGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      pos.setZ(i, -Math.sin((y / 0.95) * Math.PI) * 0.08 + (x * x) * 0.1);
    }
    leafGeo.computeVertexNormals();

    const leafMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(leafColor),
      emissive: new THREE.Color(leafColor).multiplyScalar(0.2),
      roughness: 0.25,
      metalness: 0.1,
      transmission: 0.35,
      side: THREE.DoubleSide,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    });

    const leafNodes = [
      { t: 0.25, side: 1, rotZ: -0.6, scale: 0.75 },
      { t: 0.4, side: -1, rotZ: 0.5, scale: 0.8 },
      { t: 0.6, side: 1, rotZ: -0.5, scale: 0.7 },
      { t: 0.75, side: -1, rotZ: 0.45, scale: 0.65 },
      { t: 0.92, side: 1, rotZ: -0.3, scale: 0.55 },
      { t: 1.0, side: 0, rotZ: 0.0, scale: 0.5 }, // Tip leaf
    ];

    const leafMeshes = [];

    leafNodes.forEach((node) => {
      const pt = stemCurve.getPoint(node.t);
      const leafMesh = new THREE.Mesh(leafGeo, leafMat);

      leafMesh.position.copy(pt);
      leafMesh.rotation.z = node.rotZ;
      leafMesh.rotation.y = node.side * 0.3;
      leafMesh.scale.set(node.scale, node.scale, node.scale);

      branchGroup.add(leafMesh);
      leafMeshes.push({
        mesh: leafMesh,
        baseRotZ: node.rotZ,
        phase: node.t * Math.PI * 2,
      });
    });

    // 3. Subtle floating golden pollen orbs
    const pollenCount = 6;
    const pollenGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const pollenMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.8,
    });

    const pollenMeshes = [];
    for (let i = 0; i < pollenCount; i++) {
      const p = new THREE.Mesh(pollenGeo, pollenMat);
      p.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 0.8
      );
      branchGroup.add(p);
      pollenMeshes.push({
        mesh: p,
        speedY: 0.005 + Math.random() * 0.005,
        wobble: Math.random() * Math.PI * 2,
      });
    }

    // Gentle hover interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      targetX = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 0.6;
      targetY = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 0.6;
    };

    currentMount.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Natural botanical wind swaying
      const windSway = Math.sin(t * 1.5) * 0.08;
      branchGroup.rotation.z = -0.15 + windSway + mouseX * 0.2;
      branchGroup.rotation.x = mouseY * 0.2;

      // Leaf micro fluttering
      leafMeshes.forEach(({ mesh, baseRotZ, phase }) => {
        mesh.rotation.z = baseRotZ + Math.sin(t * 2.5 + phase) * 0.06;
      });

      // Floating pollen
      pollenMeshes.forEach(({ mesh, speedY, wobble }) => {
        mesh.position.y += speedY;
        mesh.position.x += Math.sin(t * 2 + wobble) * 0.002;
        if (mesh.position.y > 1.2) {
          mesh.position.y = -1.2;
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
      currentMount.removeEventListener('mousemove', handleMouseMove);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [leafColor, stemColor, accentColor]);

  return (
    <div
      ref={mountRef}
      className={`relative overflow-hidden pointer-events-auto select-none ${className}`}
      title="3D Ayurvedic Tulsi & Botanical Branch"
    />
  );
};
