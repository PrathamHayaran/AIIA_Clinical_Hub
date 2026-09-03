import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const FallingAyurvedicLeaves3D = ({
  count = 35,
  colors = [0x608c7d, 0x82b5a2, 0xf4a28c, 0xa3c5b3, 0x4e7c6e],
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    currentMount.appendChild(renderer.domElement);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 15, 10);
    scene.add(dirLight);

    // Leaf Geometry (Curved procedural Ayurvedic leaf)
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.3, 0.4, 0.15, 0.9);
    leafShape.quadraticCurveTo(0, 1.2, 0, 1.25);
    leafShape.quadraticCurveTo(-0.15, 0.9, -0.3, 0.4);
    leafShape.quadraticCurveTo(-0.1, 0.08, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(leafShape, 12);
    // Add 3D organic curve to leaf surface
    const pos = leafGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      pos.setZ(i, -Math.sin((y / 1.25) * Math.PI) * 0.12 + (x * x) * 0.15);
    }
    leafGeo.computeVertexNormals();

    // Leaf Materials
    const materials = colors.map((color) =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color).multiplyScalar(0.15),
        roughness: 0.3,
        metalness: 0.05,
        transmission: 0.4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        clearcoat: 0.5,
      })
    );

    const leavesGroup = new THREE.Group();
    scene.add(leavesGroup);

    // Calculate view bounds at z = 0
    const vFOV = (camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
    const visibleWidth = visibleHeight * camera.aspect;

    const bounds = {
      top: visibleHeight / 2 + 3,
      bottom: -visibleHeight / 2 - 3,
      left: -visibleWidth / 2 - 2,
      right: visibleWidth / 2 + 2,
    };

    const leaves = [];

    for (let i = 0; i < count; i++) {
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(leafGeo, mat);

      const scale = 0.45 + Math.random() * 0.45;
      mesh.scale.set(scale, scale, scale);

      // Random starting positions spread vertically from top to bottom
      mesh.position.set(
        (Math.random() - 0.5) * visibleWidth,
        bounds.bottom + Math.random() * (bounds.top - bounds.bottom),
        (Math.random() - 0.5) * 8
      );

      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      leavesGroup.add(mesh);

      leaves.push({
        mesh,
        baseScale: scale,
        fallSpeed: 0.02 + Math.random() * 0.025,
        driftSpeed: 0.008 + Math.random() * 0.015,
        rotSpeedX: 0.01 + Math.random() * 0.015,
        rotSpeedY: 0.012 + Math.random() * 0.018,
        rotSpeedZ: 0.008 + Math.random() * 0.012,
        wobblePhase: Math.random() * Math.PI * 2,
        driftAmplitude: 0.02 + Math.random() * 0.02,
      });
    }

    // Mouse Interaction for soft wind effect
    let mouseX = 0;
    let mouseY = 0;
    let targetWindX = 0;
    let lastMouseX = 0;

    const handleMouseMove = (e) => {
      const deltaX = (e.clientX - lastMouseX) * 0.002;
      lastMouseX = e.clientX;
      targetWindX = Math.max(-0.06, Math.min(0.06, deltaX));
      mouseX = (e.clientX / width - 0.5) * 2;
      mouseY = (e.clientY / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth decay of mouse wind
      targetWindX *= 0.95;

      leaves.forEach((leaf) => {
        const { mesh } = leaf;

        // 1. Continuous Falling motion from top to bottom
        mesh.position.y -= leaf.fallSpeed;

        // 2. Horizontal gentle sine drift + mouse wind reaction
        mesh.position.x += Math.sin(t * 1.5 + leaf.wobblePhase) * leaf.driftAmplitude + targetWindX;

        // 3. 3D Tumbling Rotations
        mesh.rotation.x += leaf.rotSpeedX;
        mesh.rotation.y += leaf.rotSpeedY;
        mesh.rotation.z += Math.sin(t * 2 + leaf.wobblePhase) * 0.015;

        // 4. Reset to top when falling past bottom edge
        if (mesh.position.y < bounds.bottom) {
          mesh.position.y = bounds.top + Math.random() * 2;
          mesh.position.x = (Math.random() - 0.5) * visibleWidth;
          mesh.position.z = (Math.random() - 0.5) * 8;
        }

        // Horizontal wrapping
        if (mesh.position.x < bounds.left) {
          mesh.position.x = bounds.right;
        } else if (mesh.position.x > bounds.right) {
          mesh.position.x = bounds.left;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      const newVHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
      const newVWidth = newVHeight * camera.aspect;
      bounds.top = newVHeight / 2 + 3;
      bounds.bottom = -newVHeight / 2 - 3;
      bounds.left = -newVWidth / 2 - 2;
      bounds.right = newVWidth / 2 + 2;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [count, colors]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-[1] select-none overflow-hidden"
      aria-hidden="true"
    />
  );
};
