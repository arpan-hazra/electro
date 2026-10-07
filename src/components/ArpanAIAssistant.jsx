// src/components/ArpanAIAssistant.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Zap, 
  Cpu, 
  Box, 
  Radio, 
  ExternalLink,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { QUARTZ_ARPAN_PROJECTS } from '../data/projectsData';
import { ROBOT_GALLERY } from '../data/robotGalleryData';

// Knowledge Base Engine for Quartz Arpan Electronics & Robotics AI
function generateAIAnswer(query, history = []) {
  const q = query.trim().toLowerCase();

  // 1. Resistor questions
  if (q.includes('resistor') || q.includes('ohm') || q.includes('color code')) {
    const comp = ELECTRONIC_COMPONENTS.find(c => c.id === 'resistor-carbon-film');
    return {
      text: `**Resistors & Current Limiting (Quartz Arpan Lab)**\n\n` +
        `• **How it works:** A resistor impedes electric current according to Ohm's Law ($V = I \\times R$) and dissipates excess electrical energy as heat.\n` +
        `• **Color Code System (4-Band):**\n` +
        `  - Band 1 & 2: Significant digits (e.g., Red = 2, Red = 2)\n` +
        `  - Band 3: Multiplier (Brown = $\\times 10^1 = 220\\Omega$)\n` +
        `  - Band 4: Tolerance (Gold = $\\pm 5\\%$, Silver = $\\pm 10\\%$)\n` +
        `• **Where used:** LED ballasts (220$\\Omega$), I2C pull-ups (4.7k$\\Omega$), button pull-down (10k$\\Omega$).\n` +
        `• **Formula:** $R = \\frac{V_{source} - V_{LED}}{I_{LED}}$`,
      suggestedComponent: comp,
      quickActions: ['How to calculate LED resistor?', 'Show 3D Resistor Model', 'What is a Diode?']
    };
  }

  // 2. Diode questions
  if (q.includes('diode') || q.includes('1n4007') || q.includes('rectifier') || q.includes('p-n')) {
    const comp = ELECTRONIC_COMPONENTS.find(c => c.id === 'diode-1n4007-rectifier');
    return {
      text: `**Diodes & One-Way Current Flow (Quartz Arpan Lab)**\n\n` +
        `• **How it works:** Built with a P-N semiconductor silicon junction. Allows electricity to flow freely from **Anode to Cathode** once forward voltage passes ~0.7V. Reverse current is blocked up to 1000V in the 1N4007.\n` +
        `• **Terminal Identification:** The silver/white printed ring on the cylindrical body marks the **Cathode (-)** terminal.\n` +
        `• **Crucial Use in Robotics:** Used as a **Flyback / Snubber Diode** across inductive DC motor coils and relay solenoids to quench back-EMF inductive voltage spikes that destroy Arduino/ESP32 transistors.`,
      suggestedComponent: comp,
      quickActions: ['What is Flyback Protection?', 'Show 3D Diode Model', 'What is an Inductor?']
    };
  }

  // 3. Inductor & Induction questions
  if (q.includes('inductor') || q.includes('induction') || q.includes('toroid') || q.includes('coil') || q.includes('henry')) {
    const comp = ELECTRONIC_COMPONENTS.find(c => c.id === 'toroidal-power-inductor');
    return {
      text: `**Inductors & Electromagnetic Induction (Quartz Arpan Lab)**\n\n` +
        `• **How it works:** Based on Faraday's Law and Lenz's Law ($V = L \\frac{di}{dt}$). When electric current flows through its enamelled copper coil turns, it generates a magnetic flux in the toroidal ferrite ring core.\n` +
        `• **Physics Rule:** Inductors store energy in their magnetic field and oppose sudden changes in electric current.\n` +
        `• **Where used:** Switch-mode DC-DC buck/boost converters, high-frequency LC low-pass filters for robot motor isolation, and EMI noise chokes.\n` +
        `• **How to make:** Winding high-gauge enamelled copper magnet wire around an MnZn iron-powder toroidal ferrite donut ring.`,
      suggestedComponent: comp,
      quickActions: ['Show 3D Toroidal Inductor', 'What is a Capacitor?', 'Show Robot Gallery']
    };
  }

  // 4. Capacitor questions
  if (q.includes('capacitor') || q.includes('farad') || q.includes('decoupling') || q.includes('filtering')) {
    const comp = ELECTRONIC_COMPONENTS.find(c => c.id === 'electrolytic-capacitor');
    return {
      text: `**Capacitors & Energy Storage (Quartz Arpan Lab)**\n\n` +
        `• **How it works:** Stores electrical charge in an electrostatic field between two conductive aluminum foil plates separated by an electrolyte dielectric ($Q = C \\times V$).\n` +
        `• **Polarity Warning:** In electrolytic capacitors, the **long lead is Positive (Anode)** and the short lead with the printed white stripe is **Negative (Cathode)**.\n` +
        `• **Robotics Application:** Smooths ripple voltages and prevents microcontrollers from rebooting (brownouts) when high-torque geared motors draw peak starting current.`,
      suggestedComponent: comp,
      quickActions: ['Show 3D Capacitor Model', 'How to prevent brownouts?', 'What is a 555 timer?']
    };
  }

  // 5. Quartz Crystal / Quartz Arpan questions
  if (q.includes('quartz') || q.includes('16mhz') || q.includes('oscillator') || q.includes('crystal') || q.includes('heartbeat')) {
    const comp = ELECTRONIC_COMPONENTS.find(c => c.id === 'quartz-crystal-16mhz');
    return {
      text: `**Quartz 16.000 MHz Piezoelectric Resonator (Arpan's Signature)**\n\n` +
        `• **How it works:** Leverages the Piezoelectric Effect. A sub-micron sliced synthetic quartz crystal wafer vibrates precisely 16,000,000 times per second when energized with voltage.\n` +
        `• **Why it's essential:** Serves as the central clock heartbeat for Arpan's ATmega328P and STM32 robotics microcontrollers, ensuring microsecond execution timing and glitch-free UART/I2C communication.`,
      suggestedComponent: comp,
      quickActions: ['Show 3D Quartz Model', 'How does Arduino use it?', 'Explore Arpan Projects']
    };
  }

  // 6. Arduino questions
  if (q.includes('arduino') || q.includes('atmega') || q.includes('microcontroller') || q.includes('uno')) {
    const comp = ELECTRONIC_COMPONENTS.find(c => c.id === 'arduino-uno-r3');
    return {
      text: `**Arduino Uno R3 Microcontroller Board**\n\n` +
        `• **Processor:** ATmega328P 8-bit AVR RISC running at 16MHz Quartz clock.\n` +
        `• **I/O Ports:** 14 Digital I/O (6 PWM pins: 3, 5, 6, 9, 10, 11) + 6 Analog Inputs (A0-A5, 10-bit ADC).\n` +
        `• **How to Program:** Write code in the Arduino IDE in C/C++, connect via USB, and compile. The onboard Optiboot bootloader loads firmware into 32KB flash memory.`,
      suggestedComponent: comp,
      quickActions: ['Show 3D Arduino Model', 'How to wire a Servo?', 'Launch 3D Workbench']
    };
  }

  // 7. Servo Motor questions
  if (q.includes('servo') || q.includes('sg90') || q.includes('motor') || q.includes('pwm')) {
    const comp = ELECTRONIC_COMPONENTS.find(c => c.id === 'sg90-micro-servo');
    return {
      text: `**SG90 9g Micro Servo Motor & Angular PWM Control**\n\n` +
        `• **How it works:** Receives a 50Hz (20ms period) PWM signal. Pulse duration dictates the angular position:\n` +
        `  - $1.0\\text{ ms} = 0^\\circ$\n` +
        `  - $1.5\\text{ ms} = 90^\\circ$ (Center neutral)\n` +
        `  - $2.0\\text{ ms} = 180^\\circ$\n` +
        `• **Wiring Pinout:** Brown = GND, Red = +5V VCC, Orange = PWM Signal.\n` +
        `• **Used in:** Robot arm joints, rover sonar radar turrets, and pan-tilt gimbals.`,
      suggestedComponent: comp,
      quickActions: ['Show 3D Servo Model', 'Test Servo in 3D Workbench', 'Show 4-DOF Bionic Arm']
    };
  }

  // 8. Ultrasonic Sensor questions
  if (q.includes('ultrasonic') || q.includes('sonar') || q.includes('distance') || q.includes('hc-sr04')) {
    const comp = ELECTRONIC_COMPONENTS.find(c => c.id === 'hc-sr04-ultrasonic');
    return {
      text: `**HC-SR04 Ultrasonic Sonar Distance Sensor**\n\n` +
        `• **Operating Principle:** Emits a 40 kHz acoustic burst upon receiving a 10µs pulse on the Trigger pin. When the echo bounces back from an obstacle, the Echo pin outputs a high pulse duration.\n` +
        `• **Formula:** $\\text{Distance (cm)} = \\frac{\\text{Echo Time (}\\mu\\text{s)} \\times 0.0343}{2}$\n` +
        `• **Range:** 2 cm to 400 cm with 0.3 cm resolution.`,
      suggestedComponent: comp,
      quickActions: ['Show 3D Ultrasonic Model', 'Test in 3D Workbench', 'Show Obstacle Rover']
    };
  }

  // 9. Robot Questions (Rover, Arm, Hexapod, Humanoid, Drone)
  if (q.includes('robot') || q.includes('rover') || q.includes('arm') || q.includes('hexapod') || q.includes('humanoid') || q.includes('drone')) {
    return {
      text: `**Quartz Arpan Robotics Fleet**\n\n` +
        `Arpan has engineered 5 autonomous and kinematic robotic systems:\n\n` +
        `1. **Mark-IV Explorer Rover:** Rocker-bogie suspension, 4WD high-traction rubber wheels, rotating LiDAR radar turret, and LiPo pack.\n` +
        `2. **TitanClaw 4-DOF Bionic Arm:** Inverse kinematics dual-beam joints, turntable base, and silicone-padded mechanical claw gripper.\n` +
        `3. **HexaViper Biomimetic Spider Bot:** 6 articulated legs walking with a biological tripod gait.\n` +
        `4. **Sentinel Humanoid Research Platform:** Cyber torso, Arc Reactor heart, and dual expressive cyan OLED eyes.\n` +
        `5. **SkyViper Quadcopter Drone:** Carbon-fiber frame with 4 high-speed spinning tri-blade propellers.\n\n` +
        `You can inspect all 5 models in interactive 3D in the **Robot Gallery**!`,
      quickActions: ['View Mark-IV Rover in 3D', 'View TitanClaw Arm in 3D', 'View Hexapod Spider in 3D']
    };
  }

  // 10. Who is Arpan / Creator questions
  if (q.includes('arpan') || q.includes('creator') || q.includes('who made') || q.includes('who are you') || q.includes('author')) {
    return {
      text: `**About Arpan & QuartzLab 3D**\n\n` +
        `• **Creator & Robotics Architect:** **Arpan** is the engineer, hardware designer, and developer of **QuartzLab 3D**.\n` +
        `• **Specialization:** Embedded firmware (Arduino / ESP32 / STM32), 16MHz Quartz crystal synchronization, 3D CAD modeling, autonomous robotics (rovers, kinematic arms, hexapods), and interactive WebGL circuit simulation.\n` +
        `• **Mission:** Making real electronics and robotics accessible in high-precision 3D with full circuit theory, wiring schematics, and open-source firmware.`,
      quickActions: ['View Arpan Profile', 'Explore Quartz Projects', 'Ask about Circuit Workbench']
    };
  }

  // 11. Projects & Workbench questions
  if (q.includes('project') || q.includes('workbench') || q.includes('code') || q.includes('schematic') || q.includes('breadboard')) {
    return {
      text: `**Quartz Arpan Projects & 3D Interactive Workbench**\n\n` +
        `• **Virtual 3D Workbench:** You can test electronic circuits in real-time right on the website! Turn on the DC power rail, adjust the distance slider for the ultrasonic sensor, drag the PWM slider to sweep the servo horn, and read live UART telemetry.\n` +
        `• **Quartz Arpan Project Suite:**\n` +
        `  1. *Obstacle-Avoiding Ultrasonic Rover*\n` +
        `  2. *Precision 16MHz Quartz Clock*\n` +
        `  3. *4-DOF Bionic Servo Robotic Arm*\n` +
        `  4. *Smart IoT ESP32 Weather Station*\n\n` +
        `Every project comes with full Bill of Materials (BOM), step-by-step wiring, and copyable Arduino C++ source code!`,
      quickActions: ['Open 3D Workbench', 'View Rover Project Code', 'View 4-DOF Arm Code']
    };
  }

  // 12. General fallback with high-intelligence electronic engineering overview
  return {
    text: `**Quartz Arpan AI Knowledge Engine**\n\n` +
      `I am the AI assistant built into QuartzLab 3D by **Arpan** to help you master electronics, 3D CAD models, and robotics!\n\n` +
      `I can explain:\n` +
      `• **Electronic Components:** Resistors, Diodes, Inductors, Capacitors, Quartz Crystals, Transistors, ICs, and Servos.\n` +
      `• **Physics & Silicon Working Principles:** P-N junctions, Faraday's induction, Ohm's law, and piezoelectric resonance.\n` +
      `• **Robotics Architecture:** Rovers, 4-DOF Bionic Arms, Hexapod spiders, Humanoid robots, and Drones.\n` +
      `• **Circuit Schematics & Firmware:** Arduino C++ code, pinout mappings, and UART serial telemetry.\n\n` +
      `What component or circuit would you like to explore?`,
    quickActions: ['How does a Diode work?', 'Explain Inductor vs Capacitor', 'Show 3D Robot Models', 'How to wire Arduino Uno?']
  };
}

export default function ArpanAIAssistant({ onSelectComponent, onSelectProject, onSelectRobot, onOpenSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello! I am **Quartz AI**, created by **Arpan** for this electronics & robotics platform.\n\nAsk me anything about electronic components (how resistors, diodes, or inductors work), how they are manufactured, which projects use them, or how our 3D robots are engineered!`,
      timestamp: 'Just now',
      quickActions: ['How does a Diode work?', 'Explain Inductors', 'Show 3D Robot Models', 'How does Quartz 16MHz work?']
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking and generating answer
    setTimeout(() => {
      const response = generateAIAnswer(query, messages);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.text,
        suggestedComponent: response.suggestedComponent,
        quickActions: response.quickActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (actionText) => {
    if (actionText.includes('Diode')) {
      handleSendMessage('How does a Diode work and what is 1N4007 used for?');
    } else if (actionText.includes('Inductor')) {
      handleSendMessage('How does a Toroidal Inductor work and where is it used?');
    } else if (actionText.includes('Robot') || actionText.includes('Rover') || actionText.includes('Arm')) {
      handleSendMessage('Tell me about the 3D robots and how they work');
    } else if (actionText.includes('Quartz')) {
      handleSendMessage('How does a 16MHz Quartz crystal oscillator work?');
    } else if (actionText.includes('Workbench')) {
      if (onOpenSection) onOpenSection('workbench');
      handleSendMessage('How do I use the 3D interactive workbench?');
    } else {
      handleSendMessage(actionText);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-20 lg:bottom-6 right-5 z-40 group flex items-center gap-3 p-2.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
          title="Ask Quartz AI Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-slate-950/80 flex items-center justify-center text-cyan-400 border border-cyan-400/40">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-extrabold text-white leading-none">Quartz AI</span>
            <span className="text-[10px] font-mono text-cyan-200">Ask Any Question</span>
          </div>
        </button>
      )}

      {/* Main AI Chatbot Window */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 flex flex-col ${
            isMinimized 
              ? 'bottom-20 lg:bottom-6 right-5 w-72 h-14 bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden'
              : 'bottom-20 lg:bottom-6 right-4 sm:right-6 w-[94vw] sm:w-[440px] max-w-lg h-[560px] max-h-[82vh] bg-slate-950/95 backdrop-blur-xl border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-cyan-500/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
                  <Bot className="w-5 h-5 text-slate-950" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">Quartz AI Expert</h3>
                  <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    Engineered by Arpan
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Answers all Electronics & 3D Robot questions</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-sm shadow-md'
                          : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-md'
                      }`}
                    >
                      {/* Markdown-friendly rendering */}
                      <div className="space-y-2 whitespace-pre-line">
                        {msg.text.split('\n\n').map((para, i) => (
                          <p key={i}>
                            {para.split('**').map((chunk, j) =>
                              j % 2 === 1 ? <strong key={j} className="text-white font-bold">{chunk}</strong> : chunk
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Attached 3D Component Card in AI reply */}
                      {msg.suggestedComponent && (
                        <div 
                          onClick={() => onSelectComponent && onSelectComponent(msg.suggestedComponent)}
                          className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between gap-2 group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                              <Box className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <span className="text-[11px] font-bold text-white block truncate group-hover:text-cyan-300">
                                {msg.suggestedComponent.name}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400">
                                Click to Inspect in Interactive 3D CAD
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                      )}

                      {/* Quick Action Buttons */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                          {msg.quickActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(action)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/25 transition-all text-left flex items-center gap-1"
                            >
                              <Sparkles className="w-2.5 h-2.5 shrink-0" />
                              <span>{action}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-cyan-400 p-2 text-xs font-mono">
                    <Bot className="w-4 h-4 animate-spin" />
                    <span className="animate-pulse">Quartz AI is analyzing circuit schematics...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-cyan-500/50 rounded-2xl p-1.5 transition-colors">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about resistors, diodes, robots, code..."
                    className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim()}
                    className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
                    title="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-1.5 flex items-center justify-between px-2 text-[10px] font-mono text-slate-500">
                  <span>Powered by Quartz Arpan Intelligence</span>
                  <span>Instant answers & 3D links</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
