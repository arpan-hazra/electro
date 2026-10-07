// src/components/Workbench3D.jsx
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Play, Square, Sliders, Zap, Activity, Cpu, RotateCw, Sparkles, CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';

export const WORKBENCH_EXPERIMENTS = [
  {
    id: 'exp-ultrasonic-radar',
    title: 'Ultrasonic Sonar Radar & Collision Warning',
    components: ['Arduino Uno', 'HC-SR04 Sensor', 'RGB Alert LED', 'Piezo Buzzer'],
    defaultDistance: 45,
    description: 'Adjust distance of virtual obstacle to observe real-time sonar pinging and emergency LED braking alert trigger below 25cm.',
  },
  {
    id: 'exp-quartz-oscillator',
    title: '16MHz Quartz Crystal Frequency Synthesizer',
    components: ['16.000 MHz Quartz Crystal', 'ATmega328P', '22pF Load Caps', 'Scope Monitor'],
    defaultDistance: 80,
    description: 'Inspect the piezoelectric quartz oscillation resonance tank generating master clock ticks for the microcontroller.',
  },
  {
    id: 'exp-servo-sweep',
    title: 'SG90 Micro Servo PWM Angular Positioner',
    components: ['Arduino Uno', 'SG90 Servo', 'Potentiometer 10k', '400-pt Breadboard'],
    defaultDistance: 90,
    description: 'Map duty cycle pulse widths (1000µs to 2000µs) directly to 0°-180° mechanical servo arm rotation.',
  },
];

export default function Workbench3D() {
  const [selectedExp, setSelectedExp] = useState(WORKBENCH_EXPERIMENTS[0]);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [sensorDistance, setSensorDistance] = useState(45); // cm
  const [servoAngle, setServoAngle] = useState(90); // degrees
  const [oscillatorFreq, setOscillatorFreq] = useState(16.0); // MHz
  const [liveLog, setLiveLog] = useState([]);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animRef = useRef(null);
  const dynamicObjsRef = useRef({});

  // Add serial log entry
  const addLog = (msg) => {
    setLiveLog((prev) => [
      { time: new Date().toLocaleTimeString(), text: msg, id: Math.random() },
      ...prev.slice(0, 9),
    ]);
  };

  useEffect(() => {
    addLog(`Circuit experiment switched to: ${selectedExp.title}`);
  }, [selectedExp]);

  // Three.js interactive 3D simulation scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080e1a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Grid Floor
    const grid = new THREE.GridHelper(16, 16, 0x06b6d4, 0x1e293b);
    grid.position.y = -1.2;
    scene.add(grid);

    // Workbench Table Mat
    const matGeo = new THREE.BoxGeometry(13, 0.2, 9);
    const matMesh = new THREE.Mesh(
      matGeo,
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.2 })
    );
    matMesh.position.y = -1.3;
    matMesh.receiveShadow = true;
    scene.add(matMesh);

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 2.5, 15);
    cyanPoint.position.set(-3, 4, 3);
    scene.add(cyanPoint);

    // Interactive Model Elements
    const root = new THREE.Group();
    scene.add(root);

    // 1. Breadboard
    const bb = new THREE.Mesh(
      new THREE.BoxGeometry(6.5, 0.4, 4.2),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 })
    );
    bb.position.set(-1.5, -0.9, 0);
    bb.receiveShadow = true;
    root.add(bb);

    // 2. Arduino Board on the side
    const ard = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.2, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x007882, roughness: 0.5 })
    );
    ard.position.set(3.8, -1.0, 0);
    root.add(ard);

    // Arduino USB Connector
    const usb = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.7, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9 })
    );
    usb.position.set(5.5, -0.65, 0.7);
    root.add(usb);

    // 3. Sensor / Actuator based on experiment
    const dyn = {};
    dynamicObjsRef.current = dyn;

    // Obstacle block that moves with distance slider
    const obstacleGeo = new THREE.BoxGeometry(1.4, 2.0, 0.8);
    const obstacleMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.4 });
    const obstacleMesh = new THREE.Mesh(obstacleGeo, obstacleMat);
    obstacleMesh.position.set(-1.5, 0.2, -3.5);
    root.add(obstacleMesh);
    dyn.obstacle = obstacleMesh;

    // LED Indicator Bulb
    const ledGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x22c55e,
      emissiveIntensity: 0.8,
    });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0.8, -0.4, -1.2);
    root.add(ledMesh);
    dyn.led = ledMesh;

    // Servo Horn
    const hornGroup = new THREE.Group();
    hornGroup.position.set(-3.2, -0.4, 1.2);
    root.add(hornGroup);
    dyn.servoHorn = hornGroup;

    const hornMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.1, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
    );
    hornMesh.position.x = 0.5;
    hornGroup.add(hornMesh);

    // Quartz Crystal Can
    const qCan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 1.4, 24),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.9, roughness: 0.2 })
    );
    qCan.scale.set(1, 1, 0.4);
    qCan.position.set(-1.5, -0.1, 1.2);
    root.add(qCan);
    dyn.quartzCan = qCan;

    // Colored jumper wires connecting components
    const wireCurves = [
      [new THREE.Vector3(1.8, -0.8, 0.6), new THREE.Vector3(0.5, 0.3, 0.3), new THREE.Vector3(-0.5, -0.6, 0.8)],
      [new THREE.Vector3(1.8, -0.8, -0.6), new THREE.Vector3(0.8, 0.4, -0.4), new THREE.Vector3(0.8, -0.5, -1.0)],
      [new THREE.Vector3(1.8, -0.8, 0.0), new THREE.Vector3(-1.0, 0.5, 0.0), new THREE.Vector3(-3.0, -0.5, 1.0)],
    ];
    const wireColors = [0xef4444, 0x10b981, 0x3b82f6];

    wireCurves.forEach((pts, i) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color: wireColors[i], roughness: 0.5 });
      const wireMesh = new THREE.Mesh(tubeGeo, tubeMat);
      root.add(wireMesh);
    });

    // Orbit Mouse controls
    let isMouseDown = false;
    let prevMouse = { x: 0, y: 0 };
    let rotY = 0.2;
    let rotX = 0.4;

    const onDown = (e) => {
      isMouseDown = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      if (!isMouseDown) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };
      rotY += dx * 0.008;
      rotX = Math.max(0.1, Math.min(1.2, rotX + dy * 0.008));
    };
    const onUp = () => {
      isMouseDown = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera position based on orbital angles
      const radius = 13;
      camera.position.x = radius * Math.sin(rotY) * Math.cos(rotX);
      camera.position.y = radius * Math.sin(rotX);
      camera.position.z = radius * Math.cos(rotY) * Math.cos(rotX);
      camera.lookAt(0, 0, 0);

      // Render
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update dynamic elements when state changes
  useEffect(() => {
    const dyn = dynamicObjsRef.current;
    if (!dyn) return;

    // 1. Obstacle distance mapping (-1.5 to -5.0)
    if (dyn.obstacle) {
      // Map 10cm -> -1.5 (close) to 150cm -> -4.8 (far)
      const mappedZ = -1.5 - ((sensorDistance - 10) / 140) * 3.3;
      dyn.obstacle.position.z = mappedZ;
    }

    // 2. LED Color & Alert
    if (dyn.led) {
      if (!isPowerOn) {
        dyn.led.material.color.setHex(0x334155);
        dyn.led.material.emissive.setHex(0x000000);
      } else if (sensorDistance < 25) {
        // Red warning
        dyn.led.material.color.setHex(0xef4444);
        dyn.led.material.emissive.setHex(0xef4444);
        dyn.led.material.emissiveIntensity = 1.8;
      } else {
        // Safe green
        dyn.led.material.color.setHex(0x22c55e);
        dyn.led.material.emissive.setHex(0x22c55e);
        dyn.led.material.emissiveIntensity = 0.8;
      }
    }

    // 3. Servo Horn Angle
    if (dyn.servoHorn) {
      const angleRad = ((servoAngle - 90) * Math.PI) / 180;
      dyn.servoHorn.rotation.y = angleRad;
    }
  }, [sensorDistance, servoAngle, isPowerOn]);

  const isAlert = isPowerOn && sensorDistance < 25;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-400" />
              Interactive 3D Circuit Workbench
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">Engineered by Arpan</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            QuartzLab Virtual Hardware Sandbox
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time interactive electronic circuit simulation with 3D components, live oscilloscope telemetry, and logic feedback.
          </p>
        </div>

        {/* Experiment Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {WORKBENCH_EXPERIMENTS.map((exp) => (
            <button
              key={exp.id}
              onClick={() => setSelectedExp(exp)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedExp.id === exp.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
            >
              {exp.title.split(' ')[0]} {exp.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workbench Layout: 3D Canvas + Control Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Simulation Viewport (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner">
            {/* Viewport Top HUD */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-cyan-300 font-mono">
                <span className={`w-2 h-2 rounded-full ${isPowerOn ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                <span>VCC: {isPowerOn ? '5.04 V DC' : '0.00 V'}</span>
                <span className="text-slate-500">|</span>
                <span>CLK: {isPowerOn ? `${oscillatorFreq.toFixed(3)} MHz` : 'OFF'}</span>
              </div>

              {/* Status Alert Badge */}
              {isAlert && (
                <div className="bg-red-500/90 text-white font-mono text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-red-500/40 animate-pulse pointer-events-auto">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>PROXIMITY WARNING &lt; 25cm</span>
                </div>
              )}
            </div>

            {/* 3D Canvas Mount */}
            <div ref={mountRef} className="w-full h-[400px] cursor-grab active:cursor-grabbing" />

            {/* Viewport Bottom Overlay */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
                Rotate: Drag Mouse • Zoom: Scroll
              </span>
              <span className="text-[11px] font-mono text-cyan-400/90 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
                Quartz Arpan 3D Engine
              </span>
            </div>
          </div>

          {/* Component Badges Used in Experiment */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-mono text-slate-400">Active Circuit Nodes:</span>
            {selectedExp.components.map((comp, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 text-cyan-300 border border-slate-700/60"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Interactive Hardware Controls & Telemetry (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Power Switch & Main Status */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isPowerOn ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Circuit Power Rail (5V)</h4>
                <p className="text-xs text-slate-400 font-mono">
                  Status: {isPowerOn ? 'ENERGIZED (CLOSED CIRCUIT)' : 'STANDBY (OPEN CIRCUIT)'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const nextState = !isPowerOn;
                setIsPowerOn(nextState);
                addLog(nextState ? 'Circuit Power ON (5V DC stable)' : 'Circuit Power Switched OFF');
              }}
              className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                isPowerOn
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/30'
              }`}
            >
              {isPowerOn ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  Cut Power
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Power Up
                </>
              )}
            </button>
          </div>

          {/* Real-time Sliders & Actuators */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Live Sensor & Actuator Controls
              </span>
              <span className="text-xs text-cyan-400 font-mono">Interactive</span>
            </div>

            {/* 1. Distance Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Sonar Distance Ranging:</span>
                <span className={`font-mono font-bold ${sensorDistance < 25 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {sensorDistance} cm {sensorDistance < 25 ? '(ALERT TRIGGER)' : '(NORMAL)'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={sensorDistance}
                disabled={!isPowerOn}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSensorDistance(val);
                  if (val < 25) {
                    addLog(`[ALERT] Obstacle detected at ${val}cm! High tone buzzer triggered.`);
                  }
                }}
                className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>5cm (Near)</span>
                <span>25cm (Threshold)</span>
                <span>120cm (Far)</span>
              </div>
            </div>

            {/* 2. Servo Angle Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">SG90 Servo PWM Rotation:</span>
                <span className="font-mono font-bold text-cyan-400">{servoAngle}° ({1000 + Math.round((servoAngle / 180) * 1000)} µs pulse)</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={servoAngle}
                disabled={!isPowerOn}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setServoAngle(val);
                }}
                className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0° (Left)</span>
                <span>90° (Center)</span>
                <span>180° (Right)</span>
              </div>
            </div>

            {/* 3. Quartz Oscillator Tuning */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Quartz Crystal Clock Generator:</span>
                <span className="font-mono font-bold text-purple-400">{oscillatorFreq.toFixed(3)} MHz</span>
              </div>
              <input
                type="range"
                min="8"
                max="24"
                step="0.5"
                value={oscillatorFreq}
                disabled={!isPowerOn}
                onChange={(e) => setOscillatorFreq(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer disabled:opacity-40"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>8.0 MHz (Slow)</span>
                <span>16.0 MHz (Quartz Standard)</span>
                <span>24.0 MHz (Overclock)</span>
              </div>
            </div>
          </div>

          {/* Live Virtual Serial Telemetry Monitor */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs flex flex-col gap-2 shadow-inner">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Terminal className="w-3.5 h-3.5" />
                UART Serial Monitor (115200 Baud)
              </span>
              <span className="text-[10px] text-slate-500">Auto-logging</span>
            </div>

            <div className="h-28 overflow-y-auto flex flex-col gap-1 pr-1 text-[11px]">
              {liveLog.length === 0 ? (
                <span className="text-slate-600">Waiting for serial packets...</span>
              ) : (
                liveLog.map((log) => (
                  <div key={log.id} className="text-slate-300 flex items-start gap-2">
                    <span className="text-slate-500 text-[10px]">[{log.time}]</span>
                    <span className={log.text.includes('ALERT') ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {log.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
