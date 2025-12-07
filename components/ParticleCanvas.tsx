
import React, { useRef, useEffect, useCallback } from 'react';
import { ParticleConfig, ParticleMode, Point } from '../types';

interface ParticleCanvasProps {
  config: ParticleConfig;
  supernovaTrigger: number;
}

enum AnimationState {
  NORMAL = 'NORMAL',
  GATHERING = 'GATHERING',
  EXPLODING = 'EXPLODING'
}

// Runes for Sorcerer mode
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ', '✨', '⚡', '✴️'];
const SNOWFLAKES = ['❄️', '❅', '❆', '•'];

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseColor: string;
  currentColor: string;
  friction: number;
  ease: number;
  angleOffset: number;
  char: string; // For text rendering
  rotation: number;
  
  // Custom properties
  duelTeam: 0 | 1; 
  initialX: number; 

  constructor(width: number, height: number, size: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.initialX = this.x;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.radius = Math.random() * size + 0.5;
    this.baseColor = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
    this.currentColor = this.baseColor;
    this.friction = 0.94;
    this.ease = 0.05 + Math.random() * 0.05;
    this.angleOffset = Math.random() * Math.PI * 2;
    this.duelTeam = Math.random() > 0.5 ? 0 : 1;
    this.char = '';
    this.rotation = Math.random() * 360;
  }

  // Assign a random character based on mode
  setChar(mode: ParticleMode) {
    if (mode === ParticleMode.SORCERER) {
      this.char = RUNES[Math.floor(Math.random() * RUNES.length)];
    } else if (mode === ParticleMode.SNOW) {
      this.char = SNOWFLAKES[Math.floor(Math.random() * SNOWFLAKES.length)];
    } else {
      this.char = '';
    }
  }

  explode(centerX: number, centerY: number) {
    const angle = Math.random() * Math.PI * 2;
    const force = 30 + Math.random() * 50; 
    this.vx = Math.cos(angle) * force;
    this.vy = Math.sin(angle) * force;
  }

  updateColor(mode: ParticleMode, index: number, total: number) {
    const randomAlpha = Math.random() * 0.5 + 0.5;

    switch (mode) {
      case ParticleMode.TNT:
        // Explosion colors: Yellow -> Orange -> Red -> Black smoke
        const life = Math.random();
        if (life > 0.9) this.currentColor = `rgba(255, 255, 200, 1)`; // Spark white
        else if (life > 0.6) this.currentColor = `rgba(255, 200, 0, ${randomAlpha})`; // Yellow
        else if (life > 0.3) this.currentColor = `rgba(255, 60, 0, ${randomAlpha})`; // Orange
        else this.currentColor = `rgba(100, 100, 100, ${randomAlpha * 0.5})`; // Smoke
        break;

      case ParticleMode.SORCERER:
        // Mystic Neon Purple/Cyan
        const magic = index % 3;
        if (magic === 0) this.currentColor = `rgba(0, 255, 255, ${randomAlpha})`; // Cyan
        else if (magic === 1) this.currentColor = `rgba(180, 50, 255, ${randomAlpha})`; // Purple
        else this.currentColor = `rgba(255, 200, 100, ${randomAlpha})`; // Gold
        break;

      case ParticleMode.ANGEL:
        // Holy White/Gold
        const isGold = index % 10 === 0;
        this.currentColor = isGold 
          ? `rgba(255, 215, 0, ${randomAlpha})` 
          : `rgba(240, 248, 255, ${randomAlpha * 0.8})`;
        break;

      case ParticleMode.SNOW:
        this.currentColor = `rgba(255, 255, 255, ${randomAlpha * 0.9})`;
        break;

      case ParticleMode.GHOST:
        this.currentColor = `rgba(150, 255, 200, ${randomAlpha * 0.3})`; // Ectoplasm green
        break;

      // ... Existing Colors ...
      case ParticleMode.DUEL:
        this.currentColor = this.duelTeam === 0 ? `rgba(0, 200, 255, ${randomAlpha})` : `rgba(255, 60, 0, ${randomAlpha})`;
        break;
      case ParticleMode.DNA:
         this.currentColor = this.duelTeam === 0 ? `rgba(0, 255, 150, ${randomAlpha})` : `rgba(180, 0, 255, ${randomAlpha})`;
        break;
      case ParticleMode.GALAXY:
        const r = 100 + Math.random() * 100;
        this.currentColor = `rgba(${r}, 100, 255, ${randomAlpha})`;
        break;
      case ParticleMode.PHOENIX:
        const fireRatio = Math.random();
        if (fireRatio < 0.1) this.currentColor = `rgba(255, 255, 255, ${randomAlpha})`;
        else if (fireRatio < 0.4) this.currentColor = `rgba(255, 200, 0, ${randomAlpha})`;
        else if (fireRatio < 0.7) this.currentColor = `rgba(255, 100, 0, ${randomAlpha})`;
        else this.currentColor = `rgba(200, 20, 0, ${randomAlpha})`;
        break;
      case ParticleMode.MATRIX:
        const isHead = Math.random() > 0.95;
        this.currentColor = isHead ? `rgba(200, 255, 200, 1)` : `rgba(0, 255, 50, ${randomAlpha * 0.6})`;
        break;
      case ParticleMode.BLACKHOLE:
        const dist = Math.random();
        if (dist > 0.8) this.currentColor = `rgba(255, 255, 255, ${randomAlpha})`;
        else this.currentColor = `rgba(${100 * dist}, 0, ${255 * dist}, ${randomAlpha})`;
        break;
      case ParticleMode.RAIN:
        this.currentColor = `rgba(150, 200, 255, ${randomAlpha * 0.5})`;
        break;
      case ParticleMode.FACE:
        this.currentColor = `rgba(200, 240, 255, ${randomAlpha})`;
        break;
      default:
        this.currentColor = this.baseColor;
    }
  }

  update(
    target: Point,
    mode: ParticleMode,
    width: number,
    height: number,
    index: number,
    totalParticles: number,
    speedMulti: number,
    animState: AnimationState,
    time: number
  ) {
    let destX = target.x;
    let destY = target.y;

    this.updateColor(mode, index, totalParticles);

    // --- Supernova Logic ---
    if (animState === AnimationState.GATHERING) {
      destX = width / 2;
      destY = height / 2;
      const dx = destX - this.x;
      const dy = destY - this.y;
      this.vx += dx * 0.1; 
      this.vy += dy * 0.1;
      this.vx *= 0.8; 
      this.vy *= 0.8;
      this.x += this.vx;
      this.y += this.vy;
      return;
    } 
    if (animState === AnimationState.EXPLODING) {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      return;
    }

    // --- Special Physics Modes ---

    if (mode === ParticleMode.TNT) {
      // "Spark Fountain" physics
      // Particles emit from mouse and fall with gravity
      
      // Reset if off screen or too slow
      if (this.y > height || (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1)) {
        this.x = target.x;
        this.y = target.y;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2; // Upward cone
        const force = Math.random() * 15 * speedMulti;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force;
      }

      this.vy += 0.5; // Gravity
      this.vx *= 0.95; // Air resistance
      
      // Bounce off floor
      if (this.y >= height && this.vy > 0) {
        this.vy *= -0.6;
        this.y = height;
      }

      this.x += this.vx;
      this.y += this.vy;
      return;
    }

    if (mode === ParticleMode.SNOW) {
      if (this.y > height) {
        this.y = -20;
        this.x = Math.random() * width;
      }
      const wind = Math.sin(time * 0.001 + this.x * 0.01) * 0.5;
      this.vx = wind + (target.x - width/2) * 0.002; // Mouse wind
      this.vy = (1 + Math.random() * 2) * speedMulti;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += 0.02;
      return;
    }
    
    if (mode === ParticleMode.GHOST) {
        // Wandering trail behavior
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        
        // Perlin-noise-ish wandering
        const noise = Math.sin(index + time * 0.005) * 20;
        
        this.vx += (dx * 0.005) + (Math.cos(time * 0.002 + index) * 0.2);
        this.vy += (dy * 0.005) + (Math.sin(time * 0.002 + index) * 0.2);
        
        this.vx *= 0.92;
        this.vy *= 0.92;
        
        this.x += this.vx;
        this.y += this.vy;
        return;
    }

    // --- Matrix & Rain (Existing) ---
    if (mode === ParticleMode.MATRIX) {
      if (this.y > height) {
        this.y = -Math.random() * 100;
        this.x = Math.floor(Math.random() * (width / 10)) * 10;
      }
      this.vy = (5 + Math.random() * 5) * speedMulti;
      this.x += 0;
      this.y += this.vy;
      return;
    }

    if (mode === ParticleMode.RAIN) {
      if (this.y > height) {
        this.y = -10;
        this.x = Math.random() * width;
        this.vy = 0;
      }
      this.vy += 0.5 * speedMulti; 
      this.vx = (target.x - width/2) * 0.005;
      this.x += this.vx;
      this.y += this.vy;
      return;
    }

    // --- Shape Calculations ---

    if (mode === ParticleMode.SORCERER) {
      // Rotating Runes Circles
      const ringIndex = index % 5; // 5 Rings
      const ringRadius = 60 + ringIndex * 50;
      const dir = ringIndex % 2 === 0 ? 1 : -1;
      const speed = (0.001 + ringIndex * 0.0005) * dir * speedMulti;
      const angle = (index / (totalParticles / 5)) * Math.PI * 2 + (time * speed);
      
      destX = target.x + Math.cos(angle) * ringRadius;
      destY = target.y + Math.sin(angle) * ringRadius;
      this.rotation = angle + Math.PI / 2;

    } else if (mode === ParticleMode.ANGEL) {
      // Angel Wings
      const t = time * 0.003 * speedMulti;
      const i = index / totalParticles;
      const side = i < 0.5 ? 1 : -1; // Right or Left wing
      
      // Normalized progress along wing (0 to 1)
      const p = (i < 0.5 ? i * 2 : (i - 0.5) * 2);
      
      // Wing shape math
      const wingSpan = 300;
      const wingHeight = 250;
      
      // Flapping motion
      const flap = Math.sin(t) * 0.5;
      
      // Parametric wing curve attempt
      const r = wingSpan * p;
      const theta = p * Math.PI * 1.2;
      
      const wx = side * (r * Math.cos(theta));
      const wy = -wingHeight * Math.sin(theta) * p + (Math.abs(wx) * flap * 0.5);
      
      destX = target.x + wx;
      destY = target.y + wy - 50; // Offset up slightly

    } else if (mode === ParticleMode.SWARM) {
      destX = target.x + (Math.random() - 0.5) * 120;
      destY = target.y + (Math.random() - 0.5) * 120;
    
    } else if (mode === ParticleMode.VORTEX) {
      const angle = time * 0.001 * speedMulti + this.angleOffset;
      const dist = 100 + Math.sin(index * 0.1) * 50;
      destX = target.x + Math.cos(angle) * dist;
      destY = target.y + Math.sin(angle) * dist;
    
    } else if (mode === ParticleMode.CIRCLE) {
      const angle = (index / totalParticles) * Math.PI * 2 + (time * 0.0005);
      const radius = 150;
      destX = target.x + Math.cos(angle) * radius;
      destY = target.y + Math.sin(angle) * radius;
    
    } else if (mode === ParticleMode.STAR) {
      const angle = (index / totalParticles) * Math.PI * 2 - Math.PI / 2;
      destX = target.x + Math.cos(angle) * (100 + Math.cos(angle * 5) * 50);
      destY = target.y + Math.sin(angle) * (100 + Math.cos(angle * 5) * 50);

    } else if (mode === ParticleMode.HEART) {
      const t = (index / totalParticles) * Math.PI * 2;
      const scale = 12;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      destX = target.x + hx * scale;
      destY = target.y + hy * scale;

    } else if (mode === ParticleMode.SATURN) {
      const isRing = index > totalParticles * 0.6;
      if (isRing) {
        const angle = (index / (totalParticles * 0.4)) * Math.PI * 2 * 3 + (time * 0.0002);
        const radius = 140 + Math.random() * 40;
        destX = target.x + Math.cos(angle) * radius;
        destY = target.y + Math.sin(angle) * (radius * 0.3);
        const tilt = Math.PI / 6;
        const tx = (destX - target.x) * Math.cos(tilt) - (destY - target.y) * Math.sin(tilt);
        const ty = (destX - target.x) * Math.sin(tilt) + (destY - target.y) * Math.cos(tilt);
        destX = target.x + tx;
        destY = target.y + ty;
      } else {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * 80;
        destX = target.x + Math.cos(angle) * r;
        destY = target.y + Math.sin(angle) * r;
      }

    } else if (mode === ParticleMode.SWORD) {
      const type = index / totalParticles;
      if (type < 0.7) { 
        const bladeHeight = 250;
        const yPos = -bladeHeight + (type / 0.7) * bladeHeight; 
        destX = target.x + (Math.random() - 0.5) * 20 * (1 - Math.abs(yPos)/300);
        destY = target.y + yPos;
      } else if (type < 0.85) {
        destX = target.x + (Math.random() - 0.5) * 140;
        destY = target.y + (Math.random() - 0.5) * 20;
      } else {
        destX = target.x + (Math.random() - 0.5) * 20;
        destY = target.y + 40 + (Math.random()) * 60;
      }

    } else if (mode === ParticleMode.SPEAR) {
      const type = index / totalParticles;
      if (type < 0.15) {
        const h = 60;
        const yRel = (Math.random()) * h;
        const wRel = yRel * 0.5;
        destX = target.x + (Math.random() - 0.5) * wRel;
        destY = target.y - 200 + yRel;
      } else {
        destX = target.x + (Math.random() - 0.5) * 8;
        destY = target.y - 140 + (Math.random()) * 400;
      }

    } else if (mode === ParticleMode.SHIELD) {
      const yRel = (Math.random() - 0.5) * 200;
      let widthAtY = 0;
      if (yRel < -50) widthAtY = 120; 
      else widthAtY = 120 * (1 - (yRel + 50) / 150);
      if (widthAtY < 0) widthAtY = 0;
      destX = target.x + (Math.random() - 0.5) * widthAtY * 1.5;
      destY = target.y + yRel;

    } else if (mode === ParticleMode.HOURGLASS) {
      const h = 120;
      const w = 100;
      const yRel = (Math.random() - 0.5) * 2 * h;
      const wAtY = (Math.abs(yRel) / h) * w + 5;
      destX = target.x + (Math.random() - 0.5) * wAtY;
      destY = target.y + yRel;
      
    } else if (mode === ParticleMode.GALAXY) {
      const arm = index % 2; 
      const armOffset = arm === 0 ? 0 : Math.PI;
      const spin = time * 0.0001 * speedMulti;
      const r = (index / totalParticles) * 300; 
      const angle = armOffset + r * 0.05 + spin;
      const randomOffset = (Math.random() - 0.5) * (r * 0.4); 
      destX = target.x + Math.cos(angle) * r + randomOffset;
      destY = target.y + Math.sin(angle) * r + randomOffset;

    } else if (mode === ParticleMode.DNA) {
      const strand = this.duelTeam; 
      const t = time * 0.002 * speedMulti;
      const height = 400;
      const yPos = (index / totalParticles) * height - height/2;
      const xOffset = Math.sin(yPos * 0.02 + t + (strand * Math.PI)) * 60;
      destX = target.x + xOffset;
      destY = target.y + yPos;

    } else if (mode === ParticleMode.FACE) {
      const t = time * 0.002;
      const ratio = index / totalParticles;
      if (ratio < 0.70) {
        const theta = ratio * Math.PI * 60;
        const phi = Math.acos(2 * Math.random() - 1);
        let r = 100;
        if (phi > Math.PI/2) r = 85; 
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.cos(phi) * 1.4;
        let z = r * Math.sin(phi) * Math.sin(theta);
        if (z < -30) {
            destX = target.x + x * 0.5;
            destY = target.y + y * 0.5;
        } else {
            const rotY = Math.sin(t * 0.5) * 0.2;
            const xRot = x * Math.cos(rotY) - z * Math.sin(rotY);
            destX = target.x + xRot;
            destY = target.y + y;
        }
      } else if (ratio < 0.85) {
        const eyeSide = ratio < 0.775 ? -1 : 1;
        const eyeXOffset = 35 * eyeSide;
        const eyeYOffset = -10;
        const blinkCycle = Math.sin(t * 2); 
        const isBlinking = blinkCycle > 0.95;
        const eyeOpenness = isBlinking ? 0.1 : 1;
        const eyeTheta = Math.random() * Math.PI * 2;
        const eyeR = Math.random() * 12;
        destX = target.x + eyeXOffset + Math.cos(eyeTheta) * eyeR;
        destY = target.y + eyeYOffset + (Math.sin(eyeTheta) * eyeR * eyeOpenness);
      } else {
        const mouthW = 40;
        const mouthX = (Math.random() - 0.5) * mouthW;
        const talkSpeed = Math.sin(t * 8) * Math.sin(t * 3);
        const mouthOpen = 5 + Math.abs(talkSpeed) * 15;
        const lipTop = Math.cos((mouthX / mouthW) * Math.PI);
        const yLip = 60 + (Math.random() > 0.5 ? 1 : -1) * Math.random() * mouthOpen * lipTop;
        destX = target.x + mouthX;
        destY = target.y + yLip;
      }

    } else if (mode === ParticleMode.PHOENIX) {
      const t = time * 0.005 * speedMulti;
      const i = index / totalParticles;
      if (i < 0.2) {
        destX = target.x + (Math.random() - 0.5) * 20;
        destY = target.y + (Math.random() - 0.5) * 60;
      } else if (i < 0.7) {
        const wingSide = i < 0.45 ? -1 : 1;
        const wingSpan = 200;
        const distFromBody = Math.random() * wingSpan;
        const flapY = Math.sin(t + distFromBody * 0.01) * 60;
        destX = target.x + (wingSide * distFromBody);
        destY = target.y + flapY - 20 - (distFromBody * 0.2); 
      } else {
        const tailLen = 150;
        const distDown = Math.random() * tailLen;
        const sway = Math.sin(t + distDown * 0.05) * 20;
        destX = target.x + sway + (Math.random()-0.5)*10;
        destY = target.y + 50 + distDown;
      }

    } else if (mode === ParticleMode.BLACKHOLE) {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 30) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 300 + Math.random() * 50;
        this.x = target.x + Math.cos(angle) * radius;
        this.y = target.y + Math.sin(angle) * radius;
        this.vx = 0;
        this.vy = 0;
        return;
      }
      const force = 500 / (dist + 1);
      const angle = Math.atan2(dy, dx);
      this.vx += Math.cos(angle) * force + Math.cos(angle + Math.PI/2) * 2;
      this.vy += Math.sin(angle) * force + Math.sin(angle + Math.PI/2) * 2;
      this.x += this.vx;
      this.y += this.vy;
      return;
      
    } else if (mode === ParticleMode.DUEL) {
      const isBlueTeam = this.duelTeam === 0;
      const separation = 150;
      const osc = Math.sin(time * 0.005) * 100; 
      let centerX = isBlueTeam ? target.x - separation + osc : target.x + separation - osc;
      const centerY = target.y;
      const bodyPart = Math.random();
      let offsetX, offsetY;
      if (bodyPart < 0.2) { 
        const ang = Math.random() * Math.PI * 2;
        const r = Math.random() * 15;
        offsetX = Math.cos(ang) * r;
        offsetY = -50 + Math.sin(ang) * r;
      } else if (bodyPart < 0.6) {
        offsetX = (Math.random() - 0.5) * 20;
        offsetY = (Math.random() - 0.5) * 50;
      } else {
        offsetX = (Math.random() - 0.5) * 60;
        offsetY = (Math.random() - 0.5) * 60;
      }
      if (Math.abs(osc) > 80) {
         offsetX *= 2;
         offsetY *= 1.5;
      }
      destX = centerX + offsetX;
      destY = centerY + offsetY;
    }

    const dx = destX - this.x;
    const dy = destY - this.y;

    this.vx += dx * this.ease * 0.1 * speedMulti;
    this.vy += dy * this.ease * 0.1 * speedMulti;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D, mode: ParticleMode) {
    if (mode === ParticleMode.TNT) {
      // Draw rectangular debris
      ctx.fillStyle = this.currentColor;
      ctx.fillRect(this.x, this.y, this.radius * 2, this.radius * 2);
    } 
    else if ((mode === ParticleMode.SORCERER || mode === ParticleMode.SNOW) && this.char) {
      // Draw Text/Runes
      ctx.font = `${this.radius * 4}px monospace`; // Scale text up
      ctx.fillStyle = this.currentColor;
      ctx.save();
      ctx.translate(this.x, this.y);
      if (mode === ParticleMode.SNOW) ctx.rotate(this.rotation);
      if (mode === ParticleMode.SORCERER) ctx.rotate(this.rotation);
      ctx.fillText(this.char, -this.radius, this.radius);
      ctx.restore();
    }
    else if (mode === ParticleMode.ANGEL) {
      // Draw Feathers (Elongated Ellipses)
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius * 3, this.radius, this.rotation || 0, 0, Math.PI * 2);
      ctx.fillStyle = this.currentColor;
      ctx.fill();
    }
    else {
      // Default Circles
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.currentColor;
      ctx.fill();
    }
  }
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ config, supernovaTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>();
  const mouseRef = useRef<Point>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const isInteracting = useRef<boolean>(false);
  const animationState = useRef<AnimationState>(AnimationState.NORMAL);
  const lastSupernova = useRef<number>(0);

  const initParticles = useCallback(() => {
    const { width, height } = window.screen;
    const currentParticles = particlesRef.current;
    
    // Adjust count
    if (currentParticles.length < config.particleCount) {
      const toAdd = config.particleCount - currentParticles.length;
      for (let i = 0; i < toAdd; i++) {
        const p = new Particle(width, height, config.particleSize);
        p.setChar(config.mode); // Initialize char
        currentParticles.push(p);
      }
    } 
    else if (currentParticles.length > config.particleCount) {
      currentParticles.splice(config.particleCount);
    }
    
    // Re-initialize chars if mode changed
    particlesRef.current.forEach(p => p.setChar(config.mode));
    
  }, [config.particleCount, config.particleSize, config.mode]);

  useEffect(() => {
    if (supernovaTrigger && supernovaTrigger !== lastSupernova.current) {
      lastSupernova.current = supernovaTrigger;
      animationState.current = AnimationState.GATHERING;
      setTimeout(() => {
        const { width, height } = canvasRef.current || { width: 0, height: 0 };
        const cx = width / 2;
        const cy = height / 2;
        particlesRef.current.forEach(p => p.explode(cx, cy));
        animationState.current = AnimationState.EXPLODING;
        setTimeout(() => {
           animationState.current = AnimationState.NORMAL;
        }, 800);
      }, 800);
    }
  }, [supernovaTrigger]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        if (!isInteracting.current) {
           mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); 
    const { width, height } = window.screen;
    particlesRef.current = Array.from({ length: config.particleCount }, () => {
      const p = new Particle(width, height, config.particleSize);
      p.setChar(config.mode);
      return p;
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []); // Only run once on mount

  useEffect(() => {
    initParticles();
  }, [config, initParticles]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Trail effect strength
    let trail = 0.15;
    if (config.mode === ParticleMode.GHOST) trail = 0.05; // Longer trails
    if (config.mode === ParticleMode.TNT) trail = 0.3; // Short trails
    if (animationState.current === AnimationState.EXPLODING) trail = 0.05;

    ctx.fillStyle = `rgba(0, 0, 0, ${trail})`; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowBlur = config.glowIntensity;
    
    // Shadow Colors
    let shadowColor = 'rgba(255, 255, 255, 0.8)';
    if (config.mode === ParticleMode.PHOENIX) shadowColor = 'rgba(255, 100, 0, 0.6)';
    else if (config.mode === ParticleMode.MATRIX) shadowColor = 'rgba(0, 255, 50, 0.5)';
    else if (config.mode === ParticleMode.BLACKHOLE) shadowColor = 'rgba(100, 0, 255, 0.6)';
    else if (config.mode === ParticleMode.SORCERER) shadowColor = 'rgba(0, 255, 255, 0.6)';
    else if (config.mode === ParticleMode.TNT) shadowColor = 'rgba(255, 50, 0, 0.8)';
    else if (config.mode === ParticleMode.ANGEL) shadowColor = 'rgba(255, 223, 0, 0.6)';
    
    ctx.shadowColor = shadowColor;

    const time = Date.now();

    particlesRef.current.forEach((particle, index) => {
      particle.update(
        mouseRef.current,
        config.mode,
        canvas.width,
        canvas.height,
        index,
        particlesRef.current.length,
        config.baseSpeed,
        animationState.current,
        time
      );
      particle.draw(ctx, config.mode);
    });

    ctx.shadowBlur = 0;
    requestRef.current = requestAnimationFrame(animate);
  }, [config]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (animationState.current === AnimationState.GATHERING) return;
    isInteracting.current = true;
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    mouseRef.current = { x: clientX, y: clientY };
  };

  const handleInteractionEnd = () => {};

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full cursor-none block touch-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onTouchStart={handleMouseMove}
      onMouseLeave={handleInteractionEnd}
      onTouchEnd={handleInteractionEnd}
    />
  );
};

export default ParticleCanvas;
