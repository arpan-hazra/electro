// src/data/componentLearningData.js

export const COMPONENT_THEORY_CATEGORIES = [
  { id: 'all', label: 'All Knowledge Modules' },
  { id: 'resistors', label: 'Resistor Varieties' },
  { id: 'diodes', label: 'Diode Varieties' },
  { id: 'inductors', label: 'Inductors & Induction' },
  { id: 'capacitors', label: 'Capacitors' },
  { id: 'active', label: 'Transistors & ICs' },
];

export const COMPONENT_LEARNING_MODULES = [
  {
    id: 'learn-resistors-all-types',
    category: 'resistors',
    title: 'Complete Guide to Resistors: Every Type & Color Codes',
    subtitle: 'Carbon Film, Metal Film, Wirewound, SMD, Potentiometer, LDR & Thermistors',
    badge: 'Fundamental Passive',
    youtubeVideoId: 'Gc1wVdbV0zs', // Classic electronics tutorial
    youtubeTitle: 'Resistors Explained - Working Principle, Types & Applications',
    channel: 'The Engineering Mindset',
    duration: '11:24',
    thumbnail: 'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=800&q=80',
    model3dType: 'resistor',
    typesDetailed: [
      {
        name: 'Carbon Film Resistor',
        desc: 'Most common general-purpose resistor made by depositing a carbon film on an insulating ceramic rod. Standard ±5% tolerance.',
        applications: 'Breadboard prototyping, LED current limiting, pull-up/down resistors.',
      },
      {
        name: 'Metal Film Resistor',
        desc: 'Constructed by depositing a thin metal layer (like Nichrome) on a ceramic substrate. Offers superior ±1% precision, low temperature coefficient, and low thermal noise.',
        applications: 'Audio amplifiers, high-accuracy sensor voltage dividers, DAC circuits.',
      },
      {
        name: 'Wirewound Power Resistor',
        desc: 'High-resistance wire (Nichrome) wound around an insulating ceramic core, often enclosed in a cement or aluminum heatsink block.',
        applications: 'High current motor drivers, power supply dummy loads, braking resistors.',
      },
      {
        name: 'SMD (Surface Mount Device) Resistor',
        desc: 'Miniature rectangular chip resistors (e.g. 0805, 0603, 0402 package) soldered directly onto PCB surface copper pads without through-holes.',
        applications: 'Modern PCB electronics, smartphones, ESP32 and Arduino SMD boards.',
      },
      {
        name: 'Potentiometer & Trimpot (Variable)',
        desc: 'Three-terminal resistor with a sliding or rotating contact (wiper) forming an adjustable voltage divider.',
        applications: 'Volume knobs, manual robotic joint position calibration, robot speed trim.',
      },
      {
        name: 'LDR (Light Dependent Resistor / Photoresistor)',
        desc: 'Cadmium sulfide (CdS) semiconductor cell whose resistance drops dramatically (from megaohms in dark to hundreds of ohms in light).',
        applications: 'Automatic night lights, solar tracking rovers, optical beam tripwires.',
      },
      {
        name: 'Thermistor (NTC & PTC)',
        desc: 'Temperature-sensitive semiconductor resistor. NTC (Negative Temperature Coeff) drops resistance as heat rises; PTC rises resistance.',
        applications: '3D printer hotend temp sensing, battery overheat cutoff, inrush surge limiters.',
      },
    ],
    theoryFormulas: [
      { formula: "V = I · R", name: "Ohm's Law", desc: "Voltage equals Current multiplied by Resistance" },
      { formula: "P = I² · R = V² / R", name: "Joule's Power Law", desc: "Thermal heat dissipation in Watts" },
      { formula: "R_total = R1 + R2 + ...", name: "Series Resistance", desc: "Sum of individual resistances" },
      { formula: "1/R_total = 1/R1 + 1/R2", name: "Parallel Resistance", desc: "Reciprocal sum in parallel" },
    ],
    colorCodeGuide: [
      { color: 'Black', digit: 0, multiplier: '1 Ω' },
      { color: 'Brown', digit: 1, multiplier: '10 Ω' },
      { color: 'Red', digit: 2, multiplier: '100 Ω' },
      { color: 'Orange', digit: 3, multiplier: '1 kΩ' },
      { color: 'Yellow', digit: 4, multiplier: '10 kΩ' },
      { color: 'Green', digit: 5, multiplier: '100 kΩ' },
      { color: 'Blue', digit: 6, multiplier: '1 MΩ' },
      { color: 'Gold (Tol)', digit: '-', multiplier: '±5% Tolerance' },
    ],
  },
  {
    id: 'learn-diodes-all-types',
    category: 'diodes',
    title: 'Complete Diode Masterclass: Rectifiers, Zeners, Schottky & LEDs',
    subtitle: '1N4007, 1N4148, Zener Regulators, Low-Drop Schottky, and Flyback Diodes',
    badge: 'One-Way Valve',
    youtubeVideoId: 'Fwj_d3uO5g8', // Classic Diode explanation
    youtubeTitle: 'Diodes Explained - How Diodes Work & All Diode Types',
    channel: 'The Engineering Mindset',
    duration: '14:48',
    thumbnail: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    model3dType: 'ic',
    typesDetailed: [
      {
        name: '1N4007 PN-Junction Silicon Rectifier',
        desc: 'Heavy-duty 1A / 1000V standard silicon rectifier diode. Conducts electricity in forward bias with a ~0.7V forward voltage drop, blocks reverse current.',
        applications: 'AC to DC full-bridge rectifiers, reverse-polarity battery protection for robot chassis.',
      },
      {
        name: 'Zener Diode (1N4733A, etc.)',
        desc: 'Specialized heavily doped diode designed to conduct in reverse breakdown (Zener voltage Vz, e.g. 5.1V, 3.3V) without damage.',
        applications: 'Simple voltage reference stabilizers, over-voltage clamping on microcontroller ADC pins.',
      },
      {
        name: 'Schottky Barrier Diode (1N5819, BAT54)',
        desc: 'Metal-semiconductor junction diode with an ultra-low forward voltage drop (~0.2V to 0.3V) and nanosecond-fast recovery switching speeds.',
        applications: 'Solar panel blocking diodes, high-efficiency DC-DC buck converters, switch-mode power supplies.',
      },
      {
        name: '1N4148 Small Signal Fast Switching Diode',
        desc: 'Ultra-fast silicon epitaxial planar diode (4ns reverse recovery time) for low-power signal processing.',
        applications: 'Digital logic gates, wave shaping, demodulation, matrix keyboard anti-ghosting.',
      },
      {
        name: 'Light Emitting Diode (LED - 5mm & SMD)',
        desc: 'Electroluminescent semiconductor that emits photons when electrons recombine with holes across the forward-biased bandgap.',
        applications: 'Status indicators, displays, robot headlights, optical sensors.',
      },
      {
        name: 'Flyback / Free-Wheeling Diode',
        desc: 'A diode connected in antiparallel across an inductive coil (like a motor or relay coil) to safely dissipate inductive back-EMF spikes.',
        applications: 'Essential for protecting L298N motor drivers and Arduino MOSFETs from destructive inductive voltage spikes.',
      },
      {
        name: 'Photodiode',
        desc: 'Operates in reverse bias; incoming photons create electron-hole pairs, generating a tiny reverse photocurrent proportional to light intensity.',
        applications: 'High-speed optical fiber receivers, infrared remote control detectors, solar pulse counters.',
      },
    ],
    theoryFormulas: [
      { formula: "V_forward ≈ 0.7V (Silicon), 0.3V (Schottky)", name: "Forward Drop", desc: "Overcomes internal depletion barrier" },
      { formula: "R_LED = (V_supply - V_LED) / I_LED", name: "LED Ballast Resistor", desc: "Calculates protective current limit resistor" },
      { formula: "V_backEMF = -L · (di/dt)", name: "Inductive Flyback Voltage", desc: "Shows why flyback diodes prevent circuit destruction" },
    ],
  },
  {
    id: 'learn-inductors-induction',
    category: 'inductors',
    title: 'Inductors & Electromagnetic Induction Explained',
    subtitle: 'Toroids, Drum Chokes, Transformers, Solenoids & Quartz Resonant Tanks',
    badge: 'Magnetic Energy',
    youtubeVideoId: 'KSylo01n5FY', // Inductor breakdown
    youtubeTitle: 'Inductors Explained - How do Inductors Work & All Types',
    channel: 'The Engineering Mindset',
    duration: '10:18',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    model3dType: 'quartz',
    typesDetailed: [
      {
        name: 'Toroidal Ferrite Core Inductor',
        desc: 'Insulated copper wire wound around a circular donut-shaped ferrite ring. Contains the magnetic flux entirely inside the core ring, minimizing electromagnetic radiation (EMI).',
        applications: 'DC-DC step-down buck regulators, high-power audio amplifiers, power line noise chokes.',
      },
      {
        name: 'Drum Core Power Choke',
        desc: 'Cylindrical bobbin inductor wound with heavy enameled copper wire, often shielded in a ferrite sleeve.',
        applications: 'Switching power supplies, robotics high-current battery ripple filters.',
      },
      {
        name: 'Air Core RF Inductor',
        desc: 'Coil wound with no magnetic core (air center). Zero core saturation losses and stable inductance at very high radio frequencies (VHF/UHF).',
        applications: 'FM transmitters, Quartz crystal oscillator filtering, RF resonant antennas.',
      },
      {
        name: 'Step-Down & Isolation Transformer',
        desc: 'Two or more mutually coupled inductive windings (primary and secondary) sharing a laminated iron or ferrite core.',
        applications: 'Mains AC voltage reduction (220V to 12V), galvanic isolation, audio impedance matching.',
      },
      {
        name: 'Electromagnetic Solenoid & Relay Coil',
        desc: 'A linear cylindrical coil that generates a powerful magnetic pulling force when energized, moving an iron armature.',
        applications: 'Electric door strikes, robot claw actuators, high-voltage switching relays.',
      },
      {
        name: 'Quartz Crystal LC Resonant Tank',
        desc: 'The piezoelectric quartz crystal acts mechanically and electrically as an ultra-high Q inductor in series and parallel resonance.',
        applications: 'Microcontroller clock generation (16MHz Quartz on Arduino and ESP32).',
      },
    ],
    theoryFormulas: [
      { formula: "V_L = L · (di / dt)", name: "Faraday-Lenz Inductance Law", desc: "Induced voltage opposes the change in electric current" },
      { formula: "E = ½ · L · I²", name: "Magnetic Energy Storage", desc: "Energy stored in Joules inside magnetic field" },
      { formula: "X_L = 2π · f · L", name: "Inductive Reactance", desc: "Impedance of inductor in Ohms at frequency f" },
      { formula: "f_0 = 1 / (2π · √(L · C))", name: "Resonant Frequency", desc: "Natural oscillation frequency of LC/Quartz tank" },
    ],
  },
  {
    id: 'learn-capacitors-all-types',
    category: 'capacitors',
    title: 'Capacitors: Electrolytic, Ceramic, Tantalum & Supercaps',
    subtitle: 'Dielectric Physics, Farad Ratings, Power Decoupling & Ripple Smoothing',
    badge: 'Electrostatic Storage',
    youtubeVideoId: 'f_MZNsEqyQw', // Capacitor breakdown
    youtubeTitle: 'Capacitors Explained - How do Capacitors Work & Applications',
    channel: 'The Engineering Mindset',
    duration: '11:42',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    model3dType: 'capacitor',
    typesDetailed: [
      {
        name: 'Aluminum Electrolytic Capacitor',
        desc: 'High-capacitance polarized capacitor using liquid or gel electrolyte and an aluminum oxide dielectric. Must be connected with correct polarity (+/-).',
        applications: 'Power supply rail smoothing, motor kickback transient absorption, low-frequency audio coupling.',
      },
      {
        name: 'Multilayer Ceramic Capacitor (MLCC)',
        desc: 'Non-polarized tiny capacitors (C0G/NP0, X7R) made of alternating ceramic dielectric and metal electrode layers. Ultra-low equivalent series resistance (ESR).',
        applications: 'High-frequency decoupling next to IC VCC pins, 22pF quartz crystal load capacitors.',
      },
      {
        name: 'Tantalum Capacitor',
        desc: 'Polarized capacitor using tantalum metal anode providing high capacitance density in a very small package.',
        applications: 'Precision avionics, military robotics, tight space power rails.',
      },
      {
        name: 'Supercapacitor (Electric Double-Layer)',
        desc: 'Enormous capacitance (1 Farad to 500 Farads) bridging the gap between batteries and standard capacitors.',
        applications: 'Robot backup memory power, regenerative braking energy harvesting.',
      },
    ],
    theoryFormulas: [
      { formula: "Q = C · V", name: "Charge Formula", desc: "Coulombs of charge equals Capacitance times Voltage" },
      { formula: "X_C = 1 / (2π · f · C)", name: "Capacitive Reactance", desc: "Blocks DC (f=0) and passes high-frequency AC ripples" },
      { formula: "τ = R · C", name: "RC Time Constant", desc: "Time to charge to 63.2% of supply voltage" },
    ],
  },
];
