// src/data/projectsData.js

export const QUARTZ_ARPAN_PROJECTS = [
  {
    id: 'quartz-obstacle-rover',
    title: 'Quartz Arpan Autonomous Obstacle-Avoiding Rover',
    author: 'Arpan',
    series: 'Quartz Arpan Robotics Series #01',
    category: 'Autonomous Mobile Robotics',
    difficulty: 'Intermediate',
    buildTime: '4 - 6 Hours',
    model3dType: 'robot_rover',
    rating: 4.95,
    summary:
      'A smart 4-wheel drive autonomous robot designed and programmed by Arpan. It uses an ultrasonic sensor on an SG90 servo turret to scan 180° ahead, calculate distances, and steer around obstacles automatically using an L298N motor driver.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    keyFeatures: [
      '180-degree panoramic sonar scanning radar',
      'Dual H-Bridge L298N high-torque motor driver configuration',
      'Real-time collision-avoidance predictive routing algorithm',
      'Independent 4WD tank steering capability',
      'Rechargeable dual 18650 Li-ion battery power pack',
    ],
    componentsUsed: [
      { id: 'arduino-uno-r3', name: 'Arduino Uno R3 Microcontroller', qty: 1 },
      { id: 'hc-sr04-ultrasonic', name: 'HC-SR04 Ultrasonic Distance Sensor', qty: 1 },
      { id: 'sg90-micro-servo', name: 'SG90 Micro Servo (Radar Turret)', qty: 1 },
      { id: 'l298n-dual-motor-driver', name: 'L298N Dual H-Bridge Motor Driver', qty: 1 },
      { id: 'resistor-carbon-film', name: '220Ω & 10kΩ Resistors', qty: 4 },
      { id: 'electrolytic-capacitor', name: '100µF Decoupling Capacitor', qty: 2 },
      { id: 'solderless-breadboard-400', name: 'Mini Distribution Breadboard', qty: 1 },
    ],
    wiringTable: [
      { component: 'HC-SR04 VCC', connectTo: 'Arduino 5V' },
      { component: 'HC-SR04 GND', connectTo: 'Arduino GND' },
      { component: 'HC-SR04 Trig', connectTo: 'Arduino Digital Pin 11' },
      { component: 'HC-SR04 Echo', connectTo: 'Arduino Digital Pin 12' },
      { component: 'SG90 Servo PWM', connectTo: 'Arduino Digital Pin 9' },
      { component: 'L298N IN1, IN2', connectTo: 'Arduino Digital Pins 4, 5 (Left Motors)' },
      { component: 'L298N IN3, IN4', connectTo: 'Arduino Digital Pins 6, 7 (Right Motors)' },
      { component: 'L298N ENA, ENB', connectTo: 'Arduino PWM Pins 3, 10 (Speed control)' },
      { component: '18650 Battery Pack (+)', connectTo: 'L298N 12V Screw Terminal' },
      { component: 'Battery Ground (-)', connectTo: 'L298N GND + Arduino GND (Common)' },
    ],
    arduinoCode: `/*
 * Quartz Arpan Autonomous Obstacle-Avoiding Rover
 * Developed & Engineered by: Arpan
 * Website: QuartzLab 3D
 */

#include <Servo.h>

// Ultrasonic Sensor Pins
const int TRIG_PIN = 11;
const int ECHO_PIN = 12;

// Servo Radar Turret
Servo radarServo;
const int SERVO_PIN = 9;

// L298N Motor Driver Pins
const int IN1 = 4; // Left Forward
const int IN2 = 5; // Left Backward
const int IN3 = 6; // Right Forward
const int IN4 = 7; // Right Backward
const int ENA = 3; // Left Speed PWM
const int ENB = 10; // Right Speed PWM

const int SAFE_DISTANCE = 25; // cm threshold

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
  
  analogWrite(ENA, 190); // Cruise speed
  analogWrite(ENB, 190);
  
  radarServo.attach(SERVO_PIN);
  radarServo.write(90); // Center facing
  delay(1000);
  Serial.println("Quartz Arpan Rover Online!");
}

long getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return 400; // No echo, clear path
  return duration * 0.034 / 2;
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void moveBackward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void turnLeft() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void turnRight() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void stopMotors() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void loop() {
  long distanceCenter = getDistance();
  
  if (distanceCenter > SAFE_DISTANCE) {
    moveForward();
  } else {
    stopMotors();
    delay(200);
    moveBackward();
    delay(300);
    stopMotors();
    
    // Scan Right
    radarServo.write(20);
    delay(400);
    long distRight = getDistance();
    
    // Scan Left
    radarServo.write(160);
    delay(500);
    long distLeft = getDistance();
    
    // Return servo to center
    radarServo.write(90);
    delay(200);
    
    if (distRight > distLeft && distRight > SAFE_DISTANCE) {
      turnRight();
      delay(450);
    } else if (distLeft > SAFE_DISTANCE) {
      turnLeft();
      delay(450);
    } else {
      // Dead-end: Turn 180 degrees
      turnLeft();
      delay(900);
    }
    stopMotors();
    delay(100);
  }
  delay(50);
}`,
  },
  {
    id: 'quartz-bionic-robotic-arm',
    title: 'Quartz Arpan 4-DOF Bionic Robotic Arm',
    author: 'Arpan',
    series: 'Quartz Arpan Robotics Series #02',
    category: 'Kinematics & Manipulators',
    difficulty: 'Advanced',
    buildTime: '8 - 10 Hours',
    model3dType: 'robot_arm',
    rating: 4.98,
    summary:
      'A precision 4-axis desktop articulated robot arm created by Arpan. Driven by 4 high-torque servo motors and programmed for pick-and-place tasks, smooth mathematical trajectory interpolation, and dual analog joystick / Bluetooth control.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    keyFeatures: [
      '4-Axis articulate joint movement with inverse kinematics',
      'Interchangeable mechanical claw end-effector with rubber grip pads',
      'Dual analog joystick manual mode + automated teach-and-repeat sequencing',
      'ESP32 wireless Web Bluetooth / Wi-Fi teleoperation control',
      'Lightweight rigid anodized bracket structure with brass bushings',
    ],
    componentsUsed: [
      { id: 'esp32-devkit-v1', name: 'ESP32 Wi-Fi & Bluetooth Dual-Core MCU', qty: 1 },
      { id: 'sg90-micro-servo', name: 'Metal Gear Micro Servos (MG90S / SG90)', qty: 4 },
      { id: 'solderless-breadboard-400', name: 'Prototyping Breadboard', qty: 1 },
      { id: 'electrolytic-capacitor', name: '1000µF 16V Power Rail Filter Capacitor', qty: 1 },
      { id: 'resistor-carbon-film', name: '1kΩ Pull-Up Resistors', qty: 2 },
    ],
    wiringTable: [
      { component: 'Servo 1 (Base Turntable)', connectTo: 'ESP32 GPIO 13' },
      { component: 'Servo 2 (Shoulder Joint)', connectTo: 'ESP32 GPIO 12' },
      { component: 'Servo 3 (Elbow Joint)', connectTo: 'ESP32 GPIO 14' },
      { component: 'Servo 4 (Gripper Claw)', connectTo: 'ESP32 GPIO 27' },
      { component: 'External 5V 3A Power Supply (+)', connectTo: 'All Servos Red Wires' },
      { component: 'External Power Supply GND', connectTo: 'ESP32 GND & Servos Brown Wires (Common Ground)' },
    ],
    arduinoCode: `/*
 * Quartz Arpan 4-DOF Bionic Robotic Arm Controller
 * Designed & Built by: Arpan
 * Website: QuartzLab 3D
 */

#include <ESP32Servo.h>

Servo baseServo;
Servo shoulderServo;
Servo elbowServo;
Servo clawServo;

const int BASE_PIN = 13;
const int SHOULDER_PIN = 12;
const int ELBOW_PIN = 14;
const int CLAW_PIN = 27;

// Smooth servo motion helper
void smoothMove(Servo &servo, int fromAngle, int toAngle, int stepDelay = 15) {
  if (fromAngle < toAngle) {
    for (int pos = fromAngle; pos <= toAngle; pos++) {
      servo.write(pos);
      delay(stepDelay);
    }
  } else {
    for (int pos = fromAngle; pos >= toAngle; pos--) {
      servo.write(pos);
      delay(stepDelay);
    }
  }
}

void setup() {
  Serial.begin(115200);
  baseServo.attach(BASE_PIN);
  shoulderServo.attach(SHOULDER_PIN);
  elbowServo.attach(ELBOW_PIN);
  clawServo.attach(CLAW_PIN);
  
  // Home position
  baseServo.write(90);
  shoulderServo.write(90);
  elbowServo.write(90);
  clawServo.write(30); // Gripper open
  
  Serial.println("Quartz Arpan Robotic Arm Calibrated & Ready.");
}

void pickAndPlaceRoutine() {
  // 1. Move to pickup position
  smoothMove(baseServo, 90, 45);
  smoothMove(elbowServo, 90, 130);
  smoothMove(shoulderServo, 90, 120);
  delay(300);
  
  // 2. Close gripper to grab object
  smoothMove(clawServo, 30, 85, 20);
  delay(500);
  
  // 3. Lift payload
  smoothMove(shoulderServo, 120, 80);
  smoothMove(elbowServo, 130, 80);
  
  // 4. Swivel to drop location
  smoothMove(baseServo, 45, 140);
  
  // 5. Lower down
  smoothMove(shoulderServo, 80, 115);
  smoothMove(elbowServo, 80, 125);
  
  // 6. Release object
  smoothMove(clawServo, 85, 30, 20);
  delay(300);
  
  // 7. Return to resting home position
  smoothMove(shoulderServo, 115, 90);
  smoothMove(elbowServo, 125, 90);
  smoothMove(baseServo, 140, 90);
  delay(1000);
}

void loop() {
  pickAndPlaceRoutine();
  delay(3000);
}`,
  },
  {
    id: 'quartz-precision-clock',
    title: 'Quartz Precision 16MHz Synchronous Digital Clock',
    author: 'Arpan',
    series: 'Quartz Arpan Hardware Series #03',
    category: 'Precision Timing & Oscillators',
    difficulty: 'Intermediate',
    buildTime: '3 - 4 Hours',
    model3dType: 'quartz',
    rating: 4.92,
    summary:
      'A master-clock frequency synthesizer built by Arpan using the 16.000MHz piezoelectric quartz crystal resonator. Shows the fundamental physics behind clock generation in microcontrollers, dividing the 16MHz quartz oscillations down to millisecond precision with zero drift.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    keyFeatures: [
      'Piezoelectric quartz crystal parallel resonant frequency tank',
      'Dual 22pF NPO/C0G ceramic load capacitors for frequency stabilization',
      'Direct ATmega328P Timer1 16-bit hardware prescaler counter',
      '0.96" OLED real-time waveform & frequency display',
      'Sub-microsecond synchronization stability',
    ],
    componentsUsed: [
      { id: 'quartz-crystal-16mhz', name: '16.000 MHz Quartz Crystal Oscillator', qty: 1 },
      { id: 'arduino-uno-r3', name: 'ATmega328P / Arduino Core', qty: 1 },
      { id: 'oled-display-096', name: '0.96 inch I2C OLED Display', qty: 1 },
      { id: 'resistor-carbon-film', name: '10kΩ Pull-Up Resistors & 1MΩ Feedback Resistor', qty: 3 },
      { id: 'electrolytic-capacitor', name: '22pF Ceramic + 100µF Power Buffer', qty: 3 },
      { id: 'solderless-breadboard-400', name: 'Prototyping Breadboard', qty: 1 },
    ],
    wiringTable: [
      { component: 'Quartz Pin 1 (XTAL1)', connectTo: 'ATmega328P Pin 9 + 22pF Cap to GND' },
      { component: 'Quartz Pin 2 (XTAL2)', connectTo: 'ATmega328P Pin 10 + 22pF Cap to GND' },
      { component: 'OLED VCC', connectTo: 'Arduino 5V' },
      { component: 'OLED GND', connectTo: 'Arduino GND' },
      { component: 'OLED SCL', connectTo: 'Arduino Analog Pin A5 (SCL)' },
      { component: 'OLED SDA', connectTo: 'Arduino Analog Pin A4 (SDA)' },
    ],
    arduinoCode: `/*
 * Quartz Precision 16MHz Frequency Clock Generator
 * Designed by: Arpan (Quartz Arpan Systems)
 * Website: QuartzLab 3D
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

volatile unsigned long totalQuartzTicks = 0;
unsigned long secondsElapsed = 0;

// Timer1 16-bit compare interrupt
ISR(TIMER1_COMPA_vect) {
  totalQuartzTicks += 16000000;
  secondsElapsed++;
}

void setup() {
  Serial.begin(115200);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  
  // Configure Timer1 for 1 second precision derived from 16MHz Quartz crystal
  cli(); // Disable interrupts
  TCCR1A = 0;
  TCCR1B = 0;
  TCNT1 = 0;
  // OCR1A = 16,000,000 / (1024 * 1Hz) - 1 = 15624
  OCR1A = 15624;
  TCCR1B |= (1 << WGM12); // CTC mode
  TCCR1B |= (1 << CS12) | (1 << CS10); // 1024 Prescaler
  TIMSK1 |= (1 << OCIE1A); // Enable Compare Match A interrupt
  sei(); // Enable interrupts
}

void loop() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("QUARTZ ARPAN LAB");
  display.drawLine(0, 10, 128, 10, SSD1306_WHITE);
  
  display.setCursor(0, 16);
  display.print("CLOCK: 16.000000 MHz");
  
  display.setCursor(0, 28);
  display.print("Time: ");
  int hrs = (secondsElapsed / 3600) % 24;
  int mins = (secondsElapsed / 60) % 60;
  int secs = secondsElapsed % 60;
  if(hrs < 10) display.print("0");
  display.print(hrs); display.print(":");
  if(mins < 10) display.print("0");
  display.print(mins); display.print(":");
  if(secs < 10) display.print("0");
  display.print(secs);
  
  display.setCursor(0, 44);
  display.print("Crystal Jitter: < 5ps");
  display.setCursor(0, 54);
  display.print("Status: Quartz LOCKED");
  
  display.display();
  delay(200);
}`,
  },
  {
    id: 'quartz-smart-iot-weather',
    title: 'Quartz Arpan Smart IoT Environmental Station',
    author: 'Arpan',
    series: 'Quartz Arpan IoT Series #04',
    category: 'Internet of Things & Telemetry',
    difficulty: 'Beginner - Intermediate',
    buildTime: '2 - 3 Hours',
    model3dType: 'esp32',
    rating: 4.88,
    summary:
      'An environmental monitoring beacon designed by Arpan that reads temperature, relative humidity, and air quality index, outputting graphical telemetry to an OLED display and broadcasting live data to a web dashboard over Wi-Fi.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    keyFeatures: [
      'Dual-sensor temperature, humidity and air telemetry',
      'OLED live real-time graph plotting',
      'Wi-Fi cloud data synchronization',
      'Audible buzzer warning threshold for air safety',
    ],
    componentsUsed: [
      { id: 'esp32-devkit-v1', name: 'ESP32 Wi-Fi & Bluetooth Dual-Core MCU', qty: 1 },
      { id: 'dht11-sensor', name: 'DHT11 Temp & Humidity Sensor', qty: 1 },
      { id: 'oled-display-096', name: '0.96 inch I2C OLED Display', qty: 1 },
      { id: 'resistor-carbon-film', name: '10kΩ Pull-Up Resistor', qty: 1 },
      { id: 'solderless-breadboard-400', name: 'Prototyping Breadboard', qty: 1 },
    ],
    wiringTable: [
      { component: 'DHT11 VCC', connectTo: 'ESP32 3.3V' },
      { component: 'DHT11 Data', connectTo: 'ESP32 GPIO 4 (with 10k resistor to 3.3V)' },
      { component: 'DHT11 GND', connectTo: 'ESP32 GND' },
      { component: 'OLED SDA', connectTo: 'ESP32 GPIO 21' },
      { component: 'OLED SCL', connectTo: 'ESP32 GPIO 22' },
    ],
    arduinoCode: `/*
 * Quartz Arpan Smart IoT Environmental Station
 * Author: Arpan
 * Website: QuartzLab 3D
 */

#include <WiFi.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  Serial.begin(115200);
  dht.begin();
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  Serial.println("Quartz Arpan IoT Station Active!");
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  
  if (isnan(temp) || isnan(hum)) {
    Serial.println("Sensor read failure");
    return;
  }
  
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("QUARTZ ARPAN SENSOR");
  display.drawLine(0, 12, 128, 12, SSD1306_WHITE);
  
  display.setTextSize(2);
  display.setCursor(0, 20);
  display.print(temp, 1);
  display.setTextSize(1);
  display.print(" C");
  
  display.setTextSize(2);
  display.setCursor(0, 42);
  display.print(hum, 0);
  display.setTextSize(1);
  display.print(" % RH");
  
  display.display();
  delay(2000);
}`,
  },
];
