// src/components/ThreeModelViewer.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Maximize2, Layers, Sun, Sparkles, HelpCircle, Compass } from 'lucide-react';

export default function ThreeModelViewer({
  modelType = 'arduino',
  title = '3D Component Model',
  height = '480px',
  interactive = true,
  autoRotateDefault = true,
  showControls = true,
}) {
  const mountRef = useRef(null);
  const [isAutoRotate, setIsAutoRotate] = useState(autoRotateDefault);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [lightPreset, setLightPreset] = useState('studio'); // 'studio', 'cyber', 'bright'
  const [inspectedPin, setInspectedPin] = useState(null);

  // References to keep between renders
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelGroupRef = useRef(null);
  const explodedPartsRef = useRef([]);
  const animFrameRef = useRef(null);
  const controlsStateRef = useRef({
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    rotation: { x: 0.4, y: 0.6 },
    zoom: 1.0,
  });

  // Dynamic animation references (e.g. servo horn, ultrasonic wave, wheels)
  const dynamicPartsRef = useRef({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 500;
    const heightNum = container.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c1220); // Deep cyber dark
    scene.fog = new THREE.FogExp2(0x0c1220, 0.02);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightNum, 0.1, 1000);
    camera.position.set(0, 5, 12);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightNum);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clean container and append canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Ground Grid & Reflection Disc
    const gridHelper = new THREE.GridHelper(20, 20, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = -2.5;
    scene.add(gridHelper);

    const platformGeo = new THREE.CylinderGeometry(6, 6.2, 0.2, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.7,
      roughness: 0.4,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -2.6;
    platform.receiveShadow = true;
    scene.add(platform);

    // Platform glow ring
    const ringGeo = new THREE.RingGeometry(5.9, 6.1, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -2.48;
    scene.add(ring);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(8, 14, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    fillLight.position.set(-10, 6, -8);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xa855f7, 2.0, 20);
    rimLight.position.set(0, 4, -8);
    scene.add(rimLight);

    // Store lights for preset switcher
    scene.userData.lights = { ambientLight, keyLight, fillLight, rimLight };

    // 6. Model Root Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;
    explodedPartsRef.current = [];
    dynamicPartsRef.current = {};

    // 7. Procedural Model Construction
    buildProceduralModel(modelType, modelGroup, explodedPartsRef.current, dynamicPartsRef.current);

    // 8. Mouse & Touch Orbit Controls Handling
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };

      controlsStateRef.current.rotation.y += deltaX * 0.008;
      controlsStateRef.current.rotation.x += deltaY * 0.008;
      // Clamp vertical pitch
      controlsStateRef.current.rotation.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, controlsStateRef.current.rotation.x)
      );
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.0015;
      controlsStateRef.current.zoom = Math.max(0.4, Math.min(2.5, controlsStateRef.current.zoom + zoomDelta));
    };

    // Enhanced Touch controls for mobile phones and tablets
    let prevTouchDist = null;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        prevTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && isDragging) {
        if (e.cancelable) e.preventDefault();
        const deltaX = e.touches[0].clientX - prevMouse.x;
        const deltaY = e.touches[0].clientY - prevMouse.y;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        controlsStateRef.current.rotation.y += deltaX * 0.008;
        controlsStateRef.current.rotation.x += deltaY * 0.008;
      } else if (e.touches.length === 2 && prevTouchDist) {
        if (e.cancelable) e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = (prevTouchDist - dist) * 0.006;
        controlsStateRef.current.zoom = Math.max(0.4, Math.min(2.5, controlsStateRef.current.zoom + delta));
        prevTouchDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      prevTouchDist = null;
    };

    const dom = renderer.domElement;
    dom.style.touchAction = 'none';
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: false });
    dom.addEventListener('touchmove', onTouchMove, { passive: false });
    dom.addEventListener('touchend', onTouchEnd);

    // 9. Resize observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto-rotation when not user-dragging
      if (isAutoRotate && !isDragging) {
        controlsStateRef.current.rotation.y += 0.006;
      }

      // Smooth model orientation
      if (modelGroup) {
        modelGroup.rotation.y = controlsStateRef.current.rotation.y;
        modelGroup.rotation.x = controlsStateRef.current.rotation.x;
      }

      // Camera distance zoom
      const baseDistance = 12;
      camera.position.z = baseDistance * controlsStateRef.current.zoom;

      // Dynamic animations based on model type
      const dyn = dynamicPartsRef.current;
      if (modelType === 'servo' && dyn.servoHorn) {
        dyn.servoHorn.rotation.y = Math.sin(elapsedTime * 3) * (Math.PI / 3);
      }

      if (modelType === 'ultrasonic' && dyn.pingRings) {
        dyn.pingRings.forEach((ringMesh, idx) => {
          const scale = 1 + ((elapsedTime * 1.5 + idx * 0.6) % 2.5);
          ringMesh.scale.set(scale, scale, 1);
          ringMesh.material.opacity = Math.max(0, 1 - scale / 3.5);
          ringMesh.position.z = 1.2 + scale * 0.8;
        });
      }

      if (modelType === 'quartz' && dyn.auraGlow) {
        const pulse = 1 + Math.sin(elapsedTime * 6) * 0.08;
        dyn.auraGlow.scale.set(pulse, pulse, pulse);
      }

      if (modelType === 'robot_rover') {
        if (dyn.turretHead) {
          dyn.turretHead.rotation.y = Math.sin(elapsedTime * 2) * (Math.PI / 4);
        }
        if (dyn.wheels) {
          dyn.wheels.forEach((wheel) => {
            wheel.rotation.x += 0.04;
          });
        }
      }

      if (modelType === 'robot_arm') {
        if (dyn.basePivot) dyn.basePivot.rotation.y = Math.sin(elapsedTime * 0.8) * 0.7;
        if (dyn.shoulderPivot) dyn.shoulderPivot.rotation.z = Math.sin(elapsedTime * 1.2) * 0.25;
        if (dyn.elbowPivot) dyn.elbowPivot.rotation.z = -0.4 + Math.cos(elapsedTime * 1.2) * 0.3;
        if (dyn.gripperLeft && dyn.gripperRight) {
          const grip = Math.abs(Math.sin(elapsedTime * 1.5)) * 0.25;
          dyn.gripperLeft.position.x = -0.15 - grip;
          dyn.gripperRight.position.x = 0.15 + grip;
        }
      }

      if (modelType === 'robot_hexapod' && dyn.spiderLegs) {
        dyn.spiderLegs.forEach((leg, i) => {
          // Tripod walking gait phase
          const phase = (i % 2 === 0 ? 0 : Math.PI) + elapsedTime * 4;
          leg.rotation.z = Math.sin(phase) * 0.15;
          leg.position.y = 0.2 + Math.max(0, Math.sin(phase)) * 0.25;
        });
      }

      if (modelType === 'robot_humanoid') {
        if (dyn.humanoidHead) {
          dyn.humanoidHead.rotation.y = Math.sin(elapsedTime * 1.2) * 0.45;
          dyn.humanoidHead.rotation.x = Math.sin(elapsedTime * 2.0) * 0.12;
        }
      }

      if (modelType === 'robot_drone' && dyn.propellers) {
        dyn.propellers.forEach((prop, i) => {
          prop.rotation.y += (i % 2 === 0 ? 0.45 : -0.45);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelType]);

  // Handle wireframe changes
  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => (mat.wireframe = isWireframe));
        } else {
          child.material.wireframe = isWireframe;
        }
      }
    });
  }, [isWireframe]);

  // Handle exploded view changes
  useEffect(() => {
    explodedPartsRef.current.forEach(({ mesh, originalPos, explodeOffset }) => {
      if (isExploded) {
        mesh.position.set(
          originalPos.x + explodeOffset.x,
          originalPos.y + explodeOffset.y,
          originalPos.z + explodeOffset.z
        );
      } else {
        mesh.position.copy(originalPos);
      }
    });
  }, [isExploded]);

  // Handle lighting preset changes
  useEffect(() => {
    if (!sceneRef.current || !sceneRef.current.userData.lights) return;
    const { ambientLight, keyLight, fillLight, rimLight } = sceneRef.current.userData.lights;

    if (lightPreset === 'studio') {
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 0.9;
      keyLight.color.setHex(0xffffff);
      fillLight.color.setHex(0x38bdf8);
      rimLight.color.setHex(0xa855f7);
    } else if (lightPreset === 'cyber') {
      ambientLight.color.setHex(0x0a192f);
      ambientLight.intensity = 0.5;
      keyLight.color.setHex(0x06b6d4); // Cyan
      fillLight.color.setHex(0xec4899); // Magenta
      rimLight.color.setHex(0x3b82f6);
    } else if (lightPreset === 'bright') {
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 1.6;
      keyLight.color.setHex(0xfff7ed);
      fillLight.color.setHex(0xffffff);
      rimLight.color.setHex(0xffffff);
    }
  }, [lightPreset]);

  const handleResetCamera = () => {
    controlsStateRef.current = {
      isDragging: false,
      prevMousePos: { x: 0, y: 0 },
      rotation: { x: 0.4, y: 0.6 },
      zoom: 1.0,
    };
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-2xl flex flex-col group">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-cyan-300">
            Interactive 3D WebGL
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">• {title}</span>
        </div>

        {/* Creator Mark */}
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md border border-cyan-500/20 px-2.5 py-1 rounded-full text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 shadow-lg">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Quartz Arpan Model</span>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing relative"
      />

      {/* Overlay Instructions Badge */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden md:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-[11px] text-slate-300">
        <Compass className="w-3.5 h-3.5 text-cyan-400" />
        <span>Drag to rotate 360° • Scroll to zoom</span>
      </div>

      {/* Control Buttons Toolbar */}
      {showControls && (
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 p-1.5 rounded-xl shadow-xl">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title={isAutoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              isAutoRotate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            title="Toggle Wireframe CAD Mode"
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              isWireframe ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExploded(!isExploded)}
            title="Toggle Exploded Assembly View"
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              isExploded ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const presets = ['studio', 'cyber', 'bright'];
              const next = presets[(presets.indexOf(lightPreset) + 1) % presets.length];
              setLightPreset(next);
            }}
            title={`Lighting: ${lightPreset.toUpperCase()}`}
            className="p-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Sun className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset Perspective"
            className="p-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-mono"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// PROCEDURAL 3D ELECTRONIC & ROBOTIC MODELS BUILDER
// -------------------------------------------------------------
function buildProceduralModel(type, rootGroup, explodedList, dynParts) {
  // Common material definitions
  const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.85, roughness: 0.3 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95, roughness: 0.15 });
  const darkPlasticMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.2, roughness: 0.6 });
  const blackChipMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.4, roughness: 0.5 });
  const pinMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });

  const registerExplode = (mesh, offset) => {
    explodedList.push({
      mesh,
      originalPos: mesh.position.clone(),
      explodeOffset: offset,
    });
  };

  switch (type) {
    case 'arduino': {
      // 1. PCB Board (Arduino Teal/Blue)
      const pcbGeo = new THREE.BoxGeometry(6.8, 0.2, 5.3);
      const pcbMat = new THREE.MeshStandardMaterial({ color: 0x007882, roughness: 0.5, metalness: 0.2 });
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      pcb.castShadow = true;
      pcb.receiveShadow = true;
      rootGroup.add(pcb);
      registerExplode(pcb, new THREE.Vector3(0, -0.6, 0));

      // 2. USB Type-B Port Box
      const usbGeo = new THREE.BoxGeometry(1.6, 1.1, 1.2);
      const usb = new THREE.Mesh(usbGeo, silverMat);
      usb.position.set(-2.8, 0.65, 1.4);
      usb.castShadow = true;
      rootGroup.add(usb);
      registerExplode(usb, new THREE.Vector3(-1.2, 0.8, 0));

      // 3. DC Power Barrel Jack
      const dcGeo = new THREE.BoxGeometry(1.5, 1.1, 1.0);
      const dcJack = new THREE.Mesh(dcGeo, darkPlasticMat);
      dcJack.position.set(-2.8, 0.65, -1.6);
      dcJack.castShadow = true;
      rootGroup.add(dcJack);
      registerExplode(dcJack, new THREE.Vector3(-1.2, 0.8, -0.5));

      // 4. ATmega328P DIP IC
      const icGeo = new THREE.BoxGeometry(3.2, 0.4, 0.9);
      const ic = new THREE.Mesh(icGeo, blackChipMat);
      ic.position.set(0.8, 0.3, -0.3);
      ic.castShadow = true;
      rootGroup.add(ic);
      registerExplode(ic, new THREE.Vector3(0, 1.2, 0));

      // DIP IC Pins
      for (let i = 0; i < 14; i++) {
        const xPos = -1.3 + i * 0.2;
        const pinA = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.15), pinMat);
        pinA.position.set(xPos, 0.2, -0.85);
        rootGroup.add(pinA);

        const pinB = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.15), pinMat);
        pinB.position.set(xPos, 0.2, 0.25);
        rootGroup.add(pinB);
      }

      // 5. 16MHz Quartz Crystal (HC-49/U Metal Can on Arduino)
      const xtalGeo = new THREE.BoxGeometry(0.9, 0.35, 0.4);
      const xtal = new THREE.Mesh(xtalGeo, silverMat);
      xtal.position.set(-0.8, 0.27, -0.3);
      xtal.castShadow = true;
      rootGroup.add(xtal);

      // 6. Header Socket Strips (Top & Bottom Digital/Analog Banks)
      const topHeaderGeo = new THREE.BoxGeometry(4.8, 0.8, 0.3);
      const topHeader = new THREE.Mesh(topHeaderGeo, darkPlasticMat);
      topHeader.position.set(0.6, 0.5, 2.3);
      rootGroup.add(topHeader);
      registerExplode(topHeader, new THREE.Vector3(0, 1.0, 1.0));

      const bottomHeaderGeo = new THREE.BoxGeometry(3.6, 0.8, 0.3);
      const bottomHeader = new THREE.Mesh(bottomHeaderGeo, darkPlasticMat);
      bottomHeader.position.set(0.8, 0.5, -2.3);
      rootGroup.add(bottomHeader);
      registerExplode(bottomHeader, new THREE.Vector3(0, 1.0, -1.0));

      // 7. Glowing Power LED
      const ledGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
      const pwrLed = new THREE.Mesh(ledGeo, ledMat);
      pwrLed.position.set(-0.6, 0.18, 1.8);
      rootGroup.add(pwrLed);

      // Yellow TX/RX LEDs
      const txLedMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const txLed = new THREE.Mesh(ledGeo, txLedMat);
      txLed.position.set(-0.2, 0.18, 1.8);
      rootGroup.add(txLed);
      break;
    }

    case 'ultrasonic': {
      // HC-SR04 Sensor
      // 1. Blue PCB Base
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, 2.0, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 })
      );
      pcb.castShadow = true;
      rootGroup.add(pcb);
      registerExplode(pcb, new THREE.Vector3(0, 0, -1.0));

      // 2. Dual Aluminum Transducer Barrels ("T" and "R")
      const barrelGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.2, 32);
      barrelGeo.rotateX(Math.PI / 2);

      const barrelLeft = new THREE.Mesh(barrelGeo, silverMat);
      barrelLeft.position.set(-1.25, 0.1, 0.7);
      barrelLeft.castShadow = true;
      rootGroup.add(barrelLeft);
      registerExplode(barrelLeft, new THREE.Vector3(-0.8, 0, 1.2));

      const barrelRight = new THREE.Mesh(barrelGeo, silverMat);
      barrelRight.position.set(1.25, 0.1, 0.7);
      barrelRight.castShadow = true;
      rootGroup.add(barrelRight);
      registerExplode(barrelRight, new THREE.Vector3(0.8, 0, 1.2));

      // Mesh Grilles
      const grillGeo = new THREE.CircleGeometry(0.7, 24);
      const grillMat = new THREE.MeshStandardMaterial({ color: 0x334155, wireframe: true });
      const grillL = new THREE.Mesh(grillGeo, grillMat);
      grillL.position.set(-1.25, 0.1, 1.31);
      rootGroup.add(grillL);

      const grillR = new THREE.Mesh(grillGeo, grillMat);
      grillR.position.set(1.25, 0.1, 1.31);
      rootGroup.add(grillR);

      // 3. Quartz Resonator Metal Can in Center
      const qCan = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.25), silverMat);
      qCan.position.set(0, 0.35, 0.2);
      rootGroup.add(qCan);

      // 4. 4 Golden Header Pins (VCC, Trig, Echo, GND)
      const pinStripGeo = new THREE.BoxGeometry(1.2, 0.2, 0.2);
      const pinStrip = new THREE.Mesh(pinStripGeo, darkPlasticMat);
      pinStrip.position.set(0, -0.85, 0.2);
      rootGroup.add(pinStrip);

      for (let i = 0; i < 4; i++) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12), goldMat);
        pin.position.set(-0.45 + i * 0.3, -1.3, 0.2);
        rootGroup.add(pin);
      }

      // 5. Dynamic Acoustic Sonar Wave Rings
      const pingRings = [];
      for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.RingGeometry(0.9, 1.05, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const waveMesh = new THREE.Mesh(ringGeo, ringMat);
        waveMesh.position.set(0, 0.1, 1.5 + i * 0.7);
        rootGroup.add(waveMesh);
        pingRings.push(waveMesh);
      }
      dynParts.pingRings = pingRings;
      break;
    }

    case 'quartz': {
      // 16.000 MHz Quartz Crystal (HC-49/U Can) - Arpan's Signature!
      const canHeight = 3.6;
      const canGeo = new THREE.CylinderGeometry(1.2, 1.2, canHeight, 32);
      canGeo.scale(1.0, 1.0, 0.45); // Elliptical flattened can cross-section

      const polishedSilver = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        metalness: 0.98,
        roughness: 0.1,
      });
      const quartzCan = new THREE.Mesh(canGeo, polishedSilver);
      quartzCan.castShadow = true;
      rootGroup.add(quartzCan);
      registerExplode(quartzCan, new THREE.Vector3(0, 1.2, 0));

      // Insulator Base Flange
      const flangeGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.2, 32);
      flangeGeo.scale(1.0, 1.0, 0.45);
      const flange = new THREE.Mesh(flangeGeo, darkPlasticMat);
      flange.position.y = -canHeight / 2;
      rootGroup.add(flange);

      // Two Metallic Lead Pins
      const pin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.5, 16), pinMat);
      pin1.position.set(-0.6, -canHeight / 2 - 1.75, 0);
      rootGroup.add(pin1);
      registerExplode(pin1, new THREE.Vector3(-0.4, -1.0, 0));

      const pin2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.5, 16), pinMat);
      pin2.position.set(0.6, -canHeight / 2 - 1.75, 0);
      rootGroup.add(pin2);
      registerExplode(pin2, new THREE.Vector3(0.4, -1.0, 0));

      // Frequency Mark Ribbon
      const stampGeo = new THREE.PlaneGeometry(1.5, 0.6);
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('16.000 MHz', 128, 50);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('QUARTZ ARPAN', 128, 90);
      const texture = new THREE.CanvasTexture(canvas);

      const stampMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const stamp = new THREE.Mesh(stampGeo, stampMat);
      stamp.position.set(0, 0.2, 0.56);
      rootGroup.add(stamp);

      // Electromagnetic Crystal Aura
      const auraGeo = new THREE.SphereGeometry(2.2, 24, 24);
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      rootGroup.add(aura);
      dynParts.auraGlow = aura;
      break;
    }

    case 'servo': {
      // SG90 Micro Servo Motor
      // 1. Translucent Blue Enclosure
      const bodyGeo = new THREE.BoxGeometry(2.3, 2.3, 1.2);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.88,
        roughness: 0.3,
        metalness: 0.2,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      rootGroup.add(body);
      registerExplode(body, new THREE.Vector3(0, -0.6, 0));

      // Mounting Flange Tabs
      const flangeGeo = new THREE.BoxGeometry(3.3, 0.2, 1.2);
      const flange = new THREE.Mesh(flangeGeo, bodyMat);
      flange.position.y = 0.4;
      rootGroup.add(flange);

      // Output Tower
      const towerGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.8, 24);
      const tower = new THREE.Mesh(towerGeo, bodyMat);
      tower.position.set(0.5, 1.4, 0);
      rootGroup.add(tower);

      // Gear Spline
      const splineGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
      const spline = new THREE.Mesh(splineGeo, silverMat);
      spline.position.set(0.5, 1.85, 0);
      rootGroup.add(spline);

      // Dynamic Rotating Servo Horn Arm
      const hornGroup = new THREE.Group();
      hornGroup.position.set(0.5, 2.0, 0);
      rootGroup.add(hornGroup);
      dynParts.servoHorn = hornGroup;

      const hornMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
      const hornArm = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 0.45), hornMat);
      hornArm.position.x = 0.6;
      hornGroup.add(hornArm);

      const hornCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16), hornMat);
      hornGroup.add(hornCenter);

      // 3-Color Ribbon Wire Cable
      const wireColors = [0x78350f, 0xdc2626, 0xf97316]; // Brown, Red, Orange
      wireColors.forEach((color, i) => {
        const wire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 2.5, 12),
          new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
        );
        wire.position.set(-0.8 + i * 0.15, -1.8, -0.6);
        rootGroup.add(wire);
      });
      break;
    }

    case 'breadboard': {
      // 400-Point Solderless Breadboard
      const bbGeo = new THREE.BoxGeometry(8.2, 0.7, 5.5);
      const bbMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 });
      const bb = new THREE.Mesh(bbGeo, bbMat);
      bb.castShadow = true;
      bb.receiveShadow = true;
      rootGroup.add(bb);

      // Red and Blue Power Rail Strips
      const redRail = new THREE.Mesh(
        new THREE.BoxGeometry(7.6, 0.02, 0.15),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      redRail.position.set(0, 0.36, 2.2);
      rootGroup.add(redRail);

      const blueRail = new THREE.Mesh(
        new THREE.BoxGeometry(7.6, 0.02, 0.15),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
      );
      blueRail.position.set(0, 0.36, 1.85);
      rootGroup.add(blueRail);

      const redRailB = redRail.clone();
      redRailB.position.z = -1.85;
      rootGroup.add(redRailB);

      const blueRailB = blueRail.clone();
      blueRailB.position.z = -2.2;
      rootGroup.add(blueRailB);

      // Center Divider Trough
      const trough = new THREE.Mesh(
        new THREE.BoxGeometry(7.6, 0.15, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.8 })
      );
      trough.position.set(0, 0.32, 0);
      rootGroup.add(trough);

      // Breadboard Pin Holes Grid Simulation
      const holeMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
      for (let x = -3.2; x <= 3.2; x += 0.45) {
        for (let z of [0.6, 0.9, 1.2, -0.6, -0.9, -1.2]) {
          const hole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.12), holeMat);
          hole.position.set(x, 0.36, z);
          rootGroup.add(hole);
        }
      }
      break;
    }

    case 'resistor': {
      // Precision 220 Ohm Resistor
      const bodyGeo = new THREE.CylinderGeometry(0.65, 0.65, 2.4, 24);
      bodyGeo.rotateZ(Math.PI / 2);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3, roughness: 0.6 }); // Wheat ceramic
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      rootGroup.add(body);
      registerExplode(body, new THREE.Vector3(0, 0.5, 0));

      // Color Bands: Red (2), Red (2), Brown (x10 = 220 Ohm), Gold (5%)
      const bandPositions = [-0.65, -0.2, 0.25, 0.75];
      const bandColors = [0xdc2626, 0xdc2626, 0x854d0e, 0xd4af37];
      bandPositions.forEach((pos, idx) => {
        const bandGeo = new THREE.CylinderGeometry(0.67, 0.67, 0.18, 24);
        bandGeo.rotateZ(Math.PI / 2);
        const band = new THREE.Mesh(
          bandGeo,
          new THREE.MeshStandardMaterial({ color: bandColors[idx], roughness: 0.4 })
        );
        band.position.x = pos;
        rootGroup.add(band);
      });

      // Axial Wire Leads
      const leadGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 16);
      leadGeo.rotateZ(Math.PI / 2);
      const leadL = new THREE.Mesh(leadGeo, silverMat);
      leadL.position.x = -2.6;
      rootGroup.add(leadL);
      registerExplode(leadL, new THREE.Vector3(-1.2, 0, 0));

      const leadR = new THREE.Mesh(leadGeo, silverMat);
      leadR.position.x = 2.6;
      rootGroup.add(leadR);
      registerExplode(leadR, new THREE.Vector3(1.2, 0, 0));
      break;
    }

    case 'capacitor': {
      // Electrolytic Radial Capacitor 100uF
      const canHeight = 3.2;
      const canGeo = new THREE.CylinderGeometry(1.2, 1.2, canHeight, 32);
      const sleeveMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.4 });
      const can = new THREE.Mesh(canGeo, sleeveMat);
      can.castShadow = true;
      rootGroup.add(can);
      registerExplode(can, new THREE.Vector3(0, 1.0, 0));

      // Silver Embossed Aluminum Top Vent
      const topGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.1, 32);
      const topVent = new THREE.Mesh(topGeo, silverMat);
      topVent.position.y = canHeight / 2 + 0.05;
      rootGroup.add(topVent);

      // White Negative Polarity Stripe
      const stripeGeo = new THREE.CylinderGeometry(1.21, 1.21, canHeight, 32, 1, false, 0, 0.6);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc, side: THREE.DoubleSide });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      rootGroup.add(stripe);

      // Lead Wires
      const lead1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5, 12), pinMat);
      lead1.position.set(-0.4, -canHeight / 2 - 1.25, 0);
      rootGroup.add(lead1);

      const lead2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 12), pinMat); // Anode (longer)
      lead2.position.set(0.4, -canHeight / 2 - 1.6, 0);
      rootGroup.add(lead2);
      break;
    }

    case 'l298n': {
      // L298N Dual Motor Driver
      // Red Board
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(5.0, 0.2, 4.5),
        new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 })
      );
      rootGroup.add(pcb);
      registerExplode(pcb, new THREE.Vector3(0, -0.6, 0));

      // Heavy Aluminum Fin Heatsink
      const hsGeo = new THREE.BoxGeometry(3.6, 2.2, 1.2);
      const hsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 });
      const heatsink = new THREE.Mesh(hsGeo, hsMat);
      heatsink.position.set(0, 1.2, -0.5);
      heatsink.castShadow = true;
      rootGroup.add(heatsink);
      registerExplode(heatsink, new THREE.Vector3(0, 1.2, 0));

      // Heatsink Vertical Cooling Fins
      for (let i = -1.5; i <= 1.5; i += 0.5) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.2, 0.4), hsMat);
        fin.position.set(i, 1.2, 0.2);
        rootGroup.add(fin);
      }

      // Blue Screw Terminals
      const terminalGeo = new THREE.BoxGeometry(1.6, 1.1, 1.1);
      const termMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });
      const term1 = new THREE.Mesh(terminalGeo, termMat);
      term1.position.set(-1.8, 0.6, 1.4);
      rootGroup.add(term1);

      const term2 = new THREE.Mesh(terminalGeo, termMat);
      term2.position.set(1.8, 0.6, 1.4);
      rootGroup.add(term2);
      break;
    }

    case 'esp32': {
      // ESP32 Dev Board
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(5.5, 0.18, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
      );
      rootGroup.add(pcb);

      // Metal RF Shield Can (ESP-WROOM-32)
      const rfShield = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.35, 2.0),
        new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95, roughness: 0.2 })
      );
      rfShield.position.set(0.6, 0.25, 0);
      rootGroup.add(rfShield);

      // Micro-USB Port
      const usb = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.45, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
      );
      usb.position.set(-2.4, 0.3, 0);
      rootGroup.add(usb);

      // Dual Pin Headers
      for (let i = -2.2; i <= 2.2; i += 0.3) {
        const pTop = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), goldMat);
        pTop.position.set(i, -0.4, 1.4);
        rootGroup.add(pTop);

        const pBot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), goldMat);
        pBot.position.set(i, -0.4, -1.4);
        rootGroup.add(pBot);
      }
      break;
    }

    case 'robot_rover': {
      // Quartz Arpan Autonomous Explorer Rover (Realistic Rocker-Bogie & Carbon-Fiber Chassis)
      const carbonMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        metalness: 0.8,
        roughness: 0.25,
      });
      const anodizedCyanMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        metalness: 0.9,
        roughness: 0.2,
      });
      const highGripTireMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.95,
      });
      const goldWheelRimMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.15,
      });

      // 1. Double Deck CNC Chassis with bevelled profile
      const lowerDeck = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.22, 4.2), carbonMat);
      lowerDeck.position.y = -0.3;
      lowerDeck.castShadow = true;
      rootGroup.add(lowerDeck);
      registerExplode(lowerDeck, new THREE.Vector3(0, -0.8, 0));

      const upperDeck = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.2, 3.8), carbonMat);
      upperDeck.position.y = 1.3;
      upperDeck.castShadow = true;
      rootGroup.add(upperDeck);
      registerExplode(upperDeck, new THREE.Vector3(0, 1.2, 0));

      // Side Impact Aluminum Bumpers
      const bumperL = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.4, 0.2), anodizedCyanMat);
      bumperL.position.set(0, 0.5, 2.2);
      rootGroup.add(bumperL);
      const bumperR = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.4, 0.2), anodizedCyanMat);
      bumperR.position.set(0, 0.5, -2.2);
      rootGroup.add(bumperR);

      // Brass Standoff Columns with hex nuts
      const standoffs = [
        [-2.7, 0.5, -1.7],
        [-2.7, 0.5, 1.7],
        [2.7, 0.5, -1.7],
        [2.7, 0.5, 1.7],
        [0, 0.5, -1.7],
        [0, 0.5, 1.7],
      ];
      standoffs.forEach(([x, y, z]) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.6, 12), goldMat);
        post.position.set(x, y, z);
        rootGroup.add(post);
      });

      // 2. High-Detail Heavy All-Terrain Wheels with Deep Tread Spikes & Hubcaps
      const wheels = [];
      const wheelPositions = [
        [-2.6, -0.4, -2.6],
        [-2.6, -0.4, 2.6],
        [2.6, -0.4, -2.6],
        [2.6, -0.4, 2.6],
      ];

      wheelPositions.forEach(([x, y, z]) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(x, y, z);

        // Suspension Rocker Arm link
        const suspLink = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 1.2, 12),
          silverMat
        );
        suspLink.position.set(0, 0.4, (z > 0 ? -0.4 : 0.4));
        suspLink.rotation.x = z > 0 ? 0.35 : -0.35;
        rootGroup.add(suspLink);

        // Heavy Tread Tire
        const tireGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.9, 32);
        tireGeo.rotateZ(Math.PI / 2);
        const tire = new THREE.Mesh(tireGeo, highGripTireMat);
        tire.castShadow = true;
        wheelGroup.add(tire);

        // Tread lugs around circumference
        for (let t = 0; t < 12; t++) {
          const angle = (t / 12) * Math.PI * 2;
          const lug = new THREE.Mesh(
            new THREE.BoxGeometry(0.85, 0.16, 0.28),
            highGripTireMat
          );
          lug.position.set(0, Math.sin(angle) * 1.3, Math.cos(angle) * 1.3);
          lug.rotation.x = angle;
          wheelGroup.add(lug);
        }

        // Golden Spoked Aluminum Rim
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.92, 16), goldWheelRimMat);
        rim.rotateZ(Math.PI / 2);
        wheelGroup.add(rim);

        // Center Chrome Hub Nut
        const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.0, 6), silverMat);
        nut.rotateZ(Math.PI / 2);
        wheelGroup.add(nut);

        rootGroup.add(wheelGroup);
        wheels.push(wheelGroup);
      });
      dynParts.wheels = wheels;

      // 3. Realistic 360-degree LiDAR Radar Scanner Turret
      const turretGroup = new THREE.Group();
      turretGroup.position.set(2.4, 1.4, 0);
      rootGroup.add(turretGroup);
      dynParts.turretHead = turretGroup;

      // Servo base motor
      const servoBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.9, 0.7),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5 })
      );
      turretGroup.add(servoBody);

      // LiDAR Dome
      const lidarDome = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.75, 0.6, 24),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 })
      );
      lidarDome.position.y = 0.7;
      turretGroup.add(lidarDome);

      // LiDAR Optics Sensor Eye (Emissive Cyan Glass)
      const lidarLens = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.2, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 2.0 })
      );
      lidarLens.position.set(0.35, 0.7, 0);
      turretGroup.add(lidarLens);

      // Dual Ultrasonic Transducers on Turret
      const sonarBack = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 1.8), anodizedCyanMat);
      sonarBack.position.set(0.4, 1.2, 0);
      turretGroup.add(sonarBack);

      const eyeL = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.45, 16), silverMat);
      eyeL.rotateZ(Math.PI / 2);
      eyeL.position.set(0.6, 1.2, -0.5);
      turretGroup.add(eyeL);

      const eyeR = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.45, 16), silverMat);
      eyeR.rotateZ(Math.PI / 2);
      eyeR.position.set(0.6, 1.2, 0.5);
      turretGroup.add(eyeR);

      // 4. Onboard Arduino Mega Electronics & High-Capacity 3S LiPo Battery
      const lipoPack = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.9, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 })
      );
      lipoPack.position.set(-1.8, 0.35, 0);
      lipoPack.castShadow = true;
      rootGroup.add(lipoPack);

      const arduinoBoard = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.15, 2.6),
        new THREE.MeshStandardMaterial({ color: 0x007882, roughness: 0.3 })
      );
      arduinoBoard.position.set(-0.2, 1.48, 0);
      rootGroup.add(arduinoBoard);

      // Main ATmega2560 IC
      const mainCpu = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.15, 1.0),
        blackChipMat
      );
      mainCpu.position.set(-0.3, 1.58, 0);
      rootGroup.add(mainCpu);

      // Quartz 16MHz Crystal Oscillator on Rover MCU
      const roverCrystal = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.22, 0.25),
        silverMat
      );
      roverCrystal.position.set(0.6, 1.6, 0.5);
      rootGroup.add(roverCrystal);

      // High-Gain 2.4GHz Telemetry Rubber Duck Antenna
      const antMount = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.4, 12), goldMat);
      antMount.position.set(-2.5, 1.5, 1.5);
      rootGroup.add(antMount);

      const antennaMast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.4, 12), blackChipMat);
      antennaMast.position.set(-2.5, 2.7, 1.5);
      rootGroup.add(antennaMast);
      break;
    }

    case 'robot_arm': {
      // Quartz Arpan 4-DOF Bionic Articulated Robot Arm (Metal-Gear Servos & Carbon Kinematic Chain)
      const armMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        metalness: 0.85,
        roughness: 0.2,
      });
      const jointMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.7,
        roughness: 0.3,
      });

      // 1. Heavy CNC Anodized Ground Base with Mounting Screw Holes
      const baseGeo = new THREE.CylinderGeometry(2.4, 2.8, 0.6, 32);
      const base = new THREE.Mesh(baseGeo, jointMat);
      base.position.y = -1.8;
      base.castShadow = true;
      rootGroup.add(base);

      // Base Mounting Holes
      for (let h = 0; h < 4; h++) {
        const a = (h / 4) * Math.PI * 2;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.65, 8), silverMat);
        bolt.position.set(Math.sin(a) * 2.2, -1.5, Math.cos(a) * 2.2);
        rootGroup.add(bolt);
      }

      // Azimuth Turntable Ring
      const basePivot = new THREE.Group();
      basePivot.position.set(0, -1.4, 0);
      rootGroup.add(basePivot);
      dynParts.basePivot = basePivot;

      const ringTurret = new THREE.Mesh(
        new THREE.CylinderGeometry(2.0, 2.0, 0.45, 32),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 })
      );
      basePivot.add(ringTurret);

      // Dual Servo Mount Shoulder Bracket
      const shoulderBracket = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.4, 1.4),
        jointMat
      );
      shoulderBracket.position.y = 0.8;
      basePivot.add(shoulderBracket);

      // Shoulder Pivot
      const shoulderPivot = new THREE.Group();
      shoulderPivot.position.set(0, 1.2, 0);
      basePivot.add(shoulderPivot);
      dynParts.shoulderPivot = shoulderPivot;

      // Shoulder High-Torque Servo Horn
      const shoulderServo = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 1.6, 24),
        silverMat
      );
      shoulderServo.rotateX(Math.PI / 2);
      shoulderPivot.add(shoulderServo);

      // Lower Arm Dual Beams (Skeletal Lightweight Design)
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.4, 0.45), armMat);
      b1.position.set(-0.6, 1.7, 0);
      shoulderPivot.add(b1);
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.4, 0.45), armMat);
      b2.position.set(0.6, 1.7, 0);
      shoulderPivot.add(b2);

      // Elbow Joint
      const elbowPivot = new THREE.Group();
      elbowPivot.position.set(0, 3.4, 0);
      shoulderPivot.add(elbowPivot);
      dynParts.elbowPivot = elbowPivot;

      const elbowServo = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 1.4, 24),
        silverMat
      );
      elbowServo.rotateX(Math.PI / 2);
      elbowPivot.add(elbowServo);

      // Forearm Tapered Carbon Beam
      const forearm = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 2.8, 0.4),
        armMat
      );
      forearm.position.set(0, 1.4, 0);
      elbowPivot.add(forearm);

      // Wrist Tilt Gimbal
      const wrist = new THREE.Group();
      wrist.position.set(0, 2.8, 0);
      elbowPivot.add(wrist);

      const wristServo = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.4, 0.8),
        jointMat
      );
      wrist.add(wristServo);

      // Mechanical Dual-Finger Gripper
      const clawGeo = new THREE.BoxGeometry(0.15, 1.2, 0.35);
      const clawMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.15 });

      const clawL = new THREE.Mesh(clawGeo, clawMat);
      clawL.position.set(-0.25, 0.8, 0);
      wrist.add(clawL);
      dynParts.gripperLeft = clawL;

      const clawR = new THREE.Mesh(clawGeo, clawMat);
      clawR.position.set(0.25, 0.8, 0);
      wrist.add(clawR);
      dynParts.gripperRight = clawR;

      // Gripper Silicone Touch Pads
      const padL = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.8, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.9 })
      );
      padL.position.set(0.1, 0, 0);
      clawL.add(padL);

      const padR = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.8, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.9 })
      );
      padR.position.set(-0.1, 0, 0);
      clawR.add(padR);
      break;
    }

    case 'robot_hexapod': {
      // Quartz Arachno-Spider Hexapod (6 Biomimetic Multi-Joint Walking Legs)
      const carbonHexMat = new THREE.MeshStandardMaterial({
        color: 0x09090b,
        metalness: 0.85,
        roughness: 0.3,
      });
      const purpleAccentMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        metalness: 0.9,
        roughness: 0.15,
      });

      // Main Hexagonal Chassis Body
      const hexBody = new THREE.Mesh(
        new THREE.CylinderGeometry(2.4, 2.4, 0.7, 6),
        carbonHexMat
      );
      hexBody.position.y = 0.2;
      hexBody.castShadow = true;
      rootGroup.add(hexBody);
      registerExplode(hexBody, new THREE.Vector3(0, 0.5, 0));

      // Glowing Hexagonal Reactor Core / Battery Cover
      const coreLight = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 0.2, 6),
        new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0xa855f7, emissiveIntensity: 1.5 })
      );
      coreLight.position.y = 0.6;
      rootGroup.add(coreLight);

      // Glowing Arachnid Sonar Eyes
      const eyeL = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 2.0 })
      );
      eyeL.position.set(1.9, 0.4, -0.6);
      rootGroup.add(eyeL);

      const eyeR = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 2.0 })
      );
      eyeR.position.set(1.9, 0.4, 0.6);
      rootGroup.add(eyeR);

      // 6 Articulated Spider Legs (Coxa, Femur, Tibia)
      const spiderLegs = [];
      for (let i = 0; i < 6; i++) {
        const legGroup = new THREE.Group();
        const angle = (i / 6) * Math.PI * 2;
        legGroup.position.set(Math.cos(angle) * 2.2, 0.2, Math.sin(angle) * 2.2);
        legGroup.rotation.y = -angle;

        // Coxa Joint
        const coxa = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.5), purpleAccentMat);
        coxa.position.x = 0.45;
        legGroup.add(coxa);

        // Femur Upper Leg (Angled Upwards)
        const femur = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 0.35), carbonHexMat);
        femur.position.set(1.4, 0.5, 0);
        femur.rotation.z = 0.5;
        legGroup.add(femur);

        // Tibia Lower Leg (Angled Down to Floor)
        const tibia = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.25), silverMat);
        tibia.position.set(2.4, -0.6, 0);
        tibia.rotation.z = -1.1;
        legGroup.add(tibia);

        // Rubber Foot Tip
        const foot = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.9 })
        );
        foot.position.set(3.0, -1.8, 0);
        legGroup.add(foot);

        rootGroup.add(legGroup);
        spiderLegs.push(legGroup);
      }
      dynParts.spiderLegs = spiderLegs;
      break;
    }

    case 'robot_humanoid': {
      // Quartz Sentinel Humanoid Upper-Torso (Stereoscopic OLED Eyes & Bionic Gimbals)
      const whiteArmorMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        metalness: 0.2,
        roughness: 0.15,
      });
      const cyberJointMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.25,
      });

      // Pedestal Base
      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(1.8, 2.2, 0.8, 32),
        cyberJointMat
      );
      stand.position.y = -2.2;
      rootGroup.add(stand);

      // Spine Column
      const spine = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.45, 1.8, 16),
        silverMat
      );
      spine.position.y = -1.0;
      rootGroup.add(spine);

      // Chest & Upper Torso Armor Shell
      const chestArmor = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 2.2, 1.8),
        whiteArmorMat
      );
      chestArmor.position.y = 0.2;
      chestArmor.castShadow = true;
      rootGroup.add(chestArmor);

      // Glowing Arc Reactor Heart on Chest
      const arcHeart = new THREE.Mesh(
        new THREE.RingGeometry(0.3, 0.6, 24),
        new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x06b6d4,
          emissiveIntensity: 2.5,
          side: THREE.DoubleSide,
        })
      );
      arcHeart.position.set(0, 0.3, 0.92);
      rootGroup.add(arcHeart);

      // Shoulder Joint Spheres
      const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 24), cyberJointMat);
      shoulderL.position.set(-2.2, 0.8, 0);
      rootGroup.add(shoulderL);

      const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 24), cyberJointMat);
      shoulderR.position.set(2.2, 0.8, 0);
      rootGroup.add(shoulderR);

      // Neck 2-Axis Gimbal
      const neckGroup = new THREE.Group();
      neckGroup.position.set(0, 1.4, 0);
      rootGroup.add(neckGroup);
      dynParts.humanoidHead = neckGroup;

      const neckPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16), silverMat);
      neckGroup.add(neckPillar);

      // Humanoid Cyber Head Helmet
      const headShell = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 1.9, 1.8),
        whiteArmorMat
      );
      headShell.position.set(0, 1.0, 0);
      neckGroup.add(headShell);

      // Black Glass Visor Faceplate
      const visor = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.8, 0.3),
        new THREE.MeshStandardMaterial({
          color: 0x000000,
          roughness: 0.1,
          metalness: 0.9,
        })
      );
      visor.position.set(0, 1.1, 0.9);
      neckGroup.add(visor);

      // Dual Expressive Cyan OLED Eyes
      const eyeL = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.25, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 3.0 })
      );
      eyeL.position.set(-0.4, 1.1, 1.05);
      neckGroup.add(eyeL);

      const eyeR = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.25, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 3.0 })
      );
      eyeR.position.set(0.4, 1.1, 1.05);
      neckGroup.add(eyeR);
      break;
    }

    case 'robot_drone': {
      // Quartz SkyViper High-Speed Quadcopter Drone (Carbon Arms & Spinning Propellers)
      const carbonDroneMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        metalness: 0.9,
        roughness: 0.2,
      });
      const propMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.75,
        roughness: 0.3,
      });

      // Central Aero Fuselage Body
      const fuselage = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.6, 2.4),
        carbonDroneMat
      );
      fuselage.position.y = 0;
      rootGroup.add(fuselage);

      // 4 Carbon Arms Extending to Rotors
      const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
      const propellers = [];

      armAngles.forEach((angle) => {
        const arm = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 3.6, 12),
          carbonDroneMat
        );
        arm.rotateZ(Math.PI / 2);
        arm.rotation.y = angle;
        rootGroup.add(arm);

        // Brushless Motor Bell
        const motorPos = new THREE.Vector3(
          Math.cos(angle) * 2.8,
          0.3,
          Math.sin(angle) * 2.8
        );
        const motor = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45, 0.45, 0.5, 16),
          silverMat
        );
        motor.position.copy(motorPos);
        rootGroup.add(motor);

        // Tri-Blade Propeller
        const propGroup = new THREE.Group();
        propGroup.position.set(motorPos.x, motorPos.y + 0.35, motorPos.z);
        rootGroup.add(propGroup);

        for (let b = 0; b < 3; b++) {
          const blade = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.05, 0.22),
            propMat
          );
          blade.rotation.y = (b / 3) * Math.PI * 2;
          blade.position.set(Math.cos(blade.rotation.y) * 0.7, 0, Math.sin(blade.rotation.y) * 0.7);
          propGroup.add(blade);
        }

        propellers.push(propGroup);
      });
      dynParts.propellers = propellers;

      // Under-Chassis 2-Axis Camera Gimbal
      const gimbalCam = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        blackChipMat
      );
      gimbalCam.position.set(0, -0.6, 0.4);
      rootGroup.add(gimbalCam);

      const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.2, 16),
        silverMat
      );
      lens.rotateX(Math.PI / 2);
      lens.position.set(0, -0.6, 0.8);
      rootGroup.add(lens);
      break;
    }

    case 'diode': {
      // 1N4007 High-Voltage Silicon Rectifier Diode (Cylindrical Black DO-41 Package with Silver Cathode Band)
      const diodeBodyGeo = new THREE.CylinderGeometry(0.55, 0.55, 2.2, 24);
      diodeBodyGeo.rotateZ(Math.PI / 2);
      const diodeBody = new THREE.Mesh(diodeBodyGeo, blackChipMat);
      diodeBody.castShadow = true;
      rootGroup.add(diodeBody);
      registerExplode(diodeBody, new THREE.Vector3(0, 0.6, 0));

      // Silver Cathode Polarity Band (Marks Cathode Terminal - Current Flows Anode -> Cathode)
      const cathodeBandGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.35, 24);
      cathodeBandGeo.rotateZ(Math.PI / 2);
      const cathodeBand = new THREE.Mesh(cathodeBandGeo, silverMat);
      cathodeBand.position.x = 0.65;
      rootGroup.add(cathodeBand);

      // Part Number Label "1N4007"
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 256;
      labelCanvas.height = 64;
      const lctx = labelCanvas.getContext('2d');
      lctx.fillStyle = '#111827';
      lctx.fillRect(0, 0, 256, 64);
      lctx.fillStyle = '#e2e8f0';
      lctx.font = 'bold 24px monospace';
      lctx.fillText('1N4007 RECTIFIER', 10, 42);
      const labelTex = new THREE.CanvasTexture(labelCanvas);
      const labelPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 0.3),
        new THREE.MeshBasicMaterial({ map: labelTex, side: THREE.DoubleSide })
      );
      labelPlane.position.set(-0.25, 0, 0.57);
      rootGroup.add(labelPlane);

      // Axial Tinned-Copper Terminal Leads (Anode on left, Cathode on right)
      const leadGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 16);
      leadGeo.rotateZ(Math.PI / 2);

      const anodeLead = new THREE.Mesh(leadGeo, silverMat);
      anodeLead.position.x = -2.6;
      rootGroup.add(anodeLead);
      registerExplode(anodeLead, new THREE.Vector3(-1.2, 0, 0));

      const cathodeLead = new THREE.Mesh(leadGeo, silverMat);
      cathodeLead.position.x = 2.6;
      rootGroup.add(cathodeLead);
      registerExplode(cathodeLead, new THREE.Vector3(1.2, 0, 0));
      break;
    }

    case 'inductor': {
      // High-Frequency Toroidal Power Inductor (Ferrite Core with Enamelled Copper Coils)
      // Toroid Ferrite Core (Dark Slate Grey)
      const ferriteMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.8,
        metalness: 0.3,
      });
      const toroidGeo = new THREE.TorusGeometry(1.6, 0.65, 24, 48);
      const toroid = new THREE.Mesh(toroidGeo, ferriteMat);
      toroid.castShadow = true;
      rootGroup.add(toroid);
      registerExplode(toroid, new THREE.Vector3(0, 0, -1.0));

      // Real Wounded Enamelled Copper Wire Coils (32 Radial Loop Windings)
      const copperWireMat = new THREE.MeshStandardMaterial({
        color: 0xb45309, // Rich copper luster
        metalness: 0.95,
        roughness: 0.2,
      });

      const numTurns = 24;
      for (let i = 0; i < numTurns; i++) {
        const theta = (i / numTurns) * Math.PI * 2;
        const coilTurnGeo = new THREE.TorusGeometry(0.72, 0.09, 12, 24);
        const coilTurn = new THREE.Mesh(coilTurnGeo, copperWireMat);
        coilTurn.position.set(Math.cos(theta) * 1.6, Math.sin(theta) * 1.6, 0);
        coilTurn.rotation.z = theta;
        coilTurn.rotation.y = Math.PI / 2;
        rootGroup.add(coilTurn);
      }

      // PCB Mounting Base Header Plinth
      const basePlinth = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.4, 1.4),
        blackChipMat
      );
      basePlinth.position.set(0, -2.1, 0);
      rootGroup.add(basePlinth);

      // Solder Terminal Pins
      const pinL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 12), silverMat);
      pinL.position.set(-0.8, -2.7, 0);
      rootGroup.add(pinL);

      const pinR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 12), silverMat);
      pinR.position.set(0.8, -2.7, 0);
      rootGroup.add(pinR);
      break;
    }

    case 'oled': {
      // 0.96-inch I2C 128x64 Blue OLED Display Module
      // Blue Glass-Fiber PCB
      const oledPcb = new THREE.Mesh(
        new THREE.BoxGeometry(4.8, 4.8, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 })
      );
      oledPcb.castShadow = true;
      rootGroup.add(oledPcb);
      registerExplode(oledPcb, new THREE.Vector3(0, 0, -0.8));

      // OLED Screen Glass Bezel
      const glassBezel = new THREE.Mesh(
        new THREE.BoxGeometry(4.0, 2.5, 0.15),
        blackChipMat
      );
      glassBezel.position.set(0, -0.4, 0.18);
      rootGroup.add(glassBezel);

      // Active Glowing OLED Matrix Screen (With Animated Graphics)
      const screenCanvas = document.createElement('canvas');
      screenCanvas.width = 256;
      screenCanvas.height = 128;
      const sctx = screenCanvas.getContext('2d');
      sctx.fillStyle = '#020617';
      sctx.fillRect(0, 0, 256, 128);
      // Graphic UI on Screen
      sctx.strokeStyle = '#38bdf8';
      sctx.lineWidth = 3;
      sctx.strokeRect(4, 4, 248, 120);
      sctx.fillStyle = '#38bdf8';
      sctx.font = 'bold 20px monospace';
      sctx.fillText('QUARTZ ARPAN 3D', 20, 36);
      sctx.font = '16px monospace';
      sctx.fillText('SYS: OK | 16MHz CLK', 20, 68);
      sctx.fillText('VOLTS: 5.02V | 24C', 20, 98);

      const screenTex = new THREE.CanvasTexture(screenCanvas);
      const activeScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 2.1),
        new THREE.MeshBasicMaterial({ map: screenTex, side: THREE.DoubleSide })
      );
      activeScreen.position.set(0, -0.4, 0.27);
      rootGroup.add(activeScreen);

      // 4-Pin Header (GND, VCC, SCL, SDA)
      const pinHeaderBar = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.35, 0.35),
        darkPlasticMat
      );
      pinHeaderBar.position.set(0, 2.0, 0.25);
      rootGroup.add(pinHeaderBar);

      for (let i = 0; i < 4; i++) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12), goldMat);
        pin.position.set(-0.6 + i * 0.4, 2.5, 0.25);
        rootGroup.add(pin);
      }
      break;
    }

    case 'dht11': {
      // DHT11 Temperature & Relative Humidity Sensor Module
      // Slotted Blue Case
      const dhtCase = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 3.8, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 })
      );
      dhtCase.castShadow = true;
      rootGroup.add(dhtCase);
      registerExplode(dhtCase, new THREE.Vector3(0, 0, 1.0));

      // Air Intake Vents / Slots on Front Face
      const ventMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a });
      for (let y = -0.8; y <= 1.0; y += 0.45) {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.05), ventMat);
        vent.position.set(0, y, 0.72);
        rootGroup.add(vent);
      }

      // Internal Thermistor & Polymer Capacitor Simulation
      const insideSensor = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1.4, 0.4),
        silverMat
      );
      insideSensor.position.set(0, 0.2, 0);
      rootGroup.add(insideSensor);

      // 4 Header Terminal Pins (VCC, DATA, NC, GND)
      for (let i = 0; i < 4; i++) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 12), silverMat);
        pin.position.set(-0.6 + i * 0.4, -2.4, 0);
        rootGroup.add(pin);
      }
      break;
    }

    case 'ic': {
      // NE555 Precision Timer IC (8-Pin DIP Package)
      const dipBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.7, 1.6),
        blackChipMat
      );
      dipBody.castShadow = true;
      rootGroup.add(dipBody);
      registerExplode(dipBody, new THREE.Vector3(0, 0.8, 0));

      // Pin 1 Index Notch / Dimple
      const notch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16),
        new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.8 })
      );
      notch.position.set(-1.25, 0.3, 0);
      rootGroup.add(notch);

      // IC Laser Etching "NE555P"
      const icCanvas = document.createElement('canvas');
      icCanvas.width = 128;
      icCanvas.height = 64;
      const ictx = icCanvas.getContext('2d');
      ictx.fillStyle = '#111827';
      ictx.fillRect(0, 0, 128, 64);
      ictx.fillStyle = '#94a3b8';
      ictx.font = 'bold 22px monospace';
      ictx.fillText('NE555P', 20, 42);
      const icTex = new THREE.CanvasTexture(icCanvas);
      const icEtch = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 0.7),
        new THREE.MeshBasicMaterial({ map: icTex, side: THREE.DoubleSide })
      );
      icEtch.rotation.x = -Math.PI / 2;
      icEtch.position.set(0, 0.36, 0);
      rootGroup.add(icEtch);

      // 8 Gull-Wing Terminal Lead Pins (4 on each side)
      for (let i = 0; i < 4; i++) {
        const xPos = -0.9 + i * 0.6;
        // Side 1
        const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.4), silverMat);
        p1.position.set(xPos, -0.4, 0.95);
        rootGroup.add(p1);

        // Side 2
        const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.4), silverMat);
        p2.position.set(xPos, -0.4, -0.95);
        rootGroup.add(p2);
      }
      break;
    }

    default: {
      // Default IC Chip Package
      const defaultGeo = new THREE.BoxGeometry(3.0, 0.6, 2.0);
      const defaultMesh = new THREE.Mesh(defaultGeo, blackChipMat);
      rootGroup.add(defaultMesh);
      break;

    }
  }
}
