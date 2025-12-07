
import React, { useState, useEffect, useRef } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import Controls from './components/Controls';
import { ParticleConfig, ParticleMode } from './types';
import { Terminal, Send } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<ParticleConfig>({
    particleCount: 1500,
    baseSpeed: 1.2,
    particleSize: 2.5,
    glowIntensity: 15,
    mode: ParticleMode.SWARM,
  });

  const [command, setCommand] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [supernovaTrigger, setSupernovaTrigger] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-Tune System: Sets ideal parameters for each mode
  const activateMode = (mode: ParticleMode) => {
    let newConfig: Partial<ParticleConfig> = { mode };

    switch (mode) {
      // Standard
      case ParticleMode.FACE:
        newConfig = { ...newConfig, particleCount: 2500, baseSpeed: 1.0, glowIntensity: 10, particleSize: 2.5 };
        break;
      case ParticleMode.PHOENIX:
        newConfig = { ...newConfig, particleCount: 3000, baseSpeed: 1.5, glowIntensity: 30, particleSize: 2.5 };
        break;
      case ParticleMode.MATRIX:
        newConfig = { ...newConfig, particleCount: 2000, baseSpeed: 2.0, glowIntensity: 5, particleSize: 2.5 };
        break;
      case ParticleMode.BLACKHOLE:
        newConfig = { ...newConfig, particleCount: 4000, baseSpeed: 2.5, glowIntensity: 40, particleSize: 2.0 };
        break;
      case ParticleMode.RAIN:
        newConfig = { ...newConfig, particleCount: 1500, baseSpeed: 2.2, glowIntensity: 2, particleSize: 2.5 };
        break;
      case ParticleMode.GALAXY:
        newConfig = { ...newConfig, particleCount: 3000, baseSpeed: 0.8, glowIntensity: 15, particleSize: 2.5 };
        break;
      case ParticleMode.DNA:
        newConfig = { ...newConfig, particleCount: 1200, baseSpeed: 1.2, glowIntensity: 12, particleSize: 3.0 };
        break;
      case ParticleMode.DUEL:
        newConfig = { ...newConfig, particleCount: 1800, baseSpeed: 1.8, glowIntensity: 20, particleSize: 2.5 };
        break;
        
      // Visual Feast (New Modes)
      case ParticleMode.ANGEL:
        // Fewer particles, but larger drawing (feathers)
        newConfig = { ...newConfig, particleCount: 1200, baseSpeed: 1.0, glowIntensity: 25, particleSize: 2.0 };
        break;
      case ParticleMode.SORCERER:
        // Render text, so reduce count for performance
        newConfig = { ...newConfig, particleCount: 800, baseSpeed: 1.2, glowIntensity: 20, particleSize: 4.0 };
        break;
      case ParticleMode.TNT:
        // Debris
        newConfig = { ...newConfig, particleCount: 1000, baseSpeed: 2.0, glowIntensity: 30, particleSize: 3.0 };
        break;
      case ParticleMode.SNOW:
        newConfig = { ...newConfig, particleCount: 600, baseSpeed: 0.5, glowIntensity: 5, particleSize: 4.0 };
        break;
      case ParticleMode.GHOST:
        newConfig = { ...newConfig, particleCount: 2000, baseSpeed: 1.0, glowIntensity: 15, particleSize: 5.0 };
        break;

      default:
        // Reset defaults
        newConfig = { ...newConfig, particleSize: 2.5 };
        break;
    }

    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const triggerSupernova = () => {
    setConfig(prev => ({ ...prev, particleCount: 4000, glowIntensity: 30 }));
    setSupernovaTrigger(Date.now());
    setTimeout(() => {
      setConfig(prev => ({ ...prev, glowIntensity: 15 }));
    }, 2000);
  };

  const handleCommandSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const cmd = command.toLowerCase().trim();
    
    switch (cmd) {
      // Basic Shapes
      case 'swarm': activateMode(ParticleMode.SWARM); break;
      case 'vortex': activateMode(ParticleMode.VORTEX); break;
      case 'circle': activateMode(ParticleMode.CIRCLE); break;
      case 'star': activateMode(ParticleMode.STAR); break;
      case 'heart': activateMode(ParticleMode.HEART); break;
      case 'saturn': 
      case 'ring': activateMode(ParticleMode.SATURN); break;
      case 'sword': activateMode(ParticleMode.SWORD); break;
      case 'spear': activateMode(ParticleMode.SPEAR); break;
      case 'shield': 
      case 'knight': activateMode(ParticleMode.SHIELD); break;
      case 'hourglass': 
      case 'time': activateMode(ParticleMode.HOURGLASS); break;
      
      // Creative Modes
      case 'duel': 
      case 'fight': activateMode(ParticleMode.DUEL); break;
      case 'galaxy': 
      case 'space': activateMode(ParticleMode.GALAXY); break;
      case 'dna': 
      case 'life': activateMode(ParticleMode.DNA); break;
      case 'face': 
      case 'ai': 
      case 'speak': activateMode(ParticleMode.FACE); break;

      // High Concept Modes
      case 'phoenix': 
      case 'fire': 
      case 'bird': activateMode(ParticleMode.PHOENIX); break;
      case 'blackhole': 
      case 'void': activateMode(ParticleMode.BLACKHOLE); break;
      case 'matrix': 
      case 'hack': 
      case 'code': activateMode(ParticleMode.MATRIX); break;
      case 'rain': 
      case 'storm': activateMode(ParticleMode.RAIN); break;

      // New Visual Feast
      case 'angel': 
      case 'wing': 
      case 'fly': activateMode(ParticleMode.ANGEL); break;
      case 'sorcerer': 
      case 'magic': 
      case 'rune': 
      case 'spell': activateMode(ParticleMode.SORCERER); break;
      case 'tnt': 
      case 'bomb': 
      case 'boom': activateMode(ParticleMode.TNT); break;
      case 'snow': 
      case 'winter': 
      case 'cold': activateMode(ParticleMode.SNOW); break;
      case 'ghost': 
      case 'boo': 
      case 'spirit': activateMode(ParticleMode.GHOST); break;

      case 'supernova': 
      case 'explode': triggerSupernova(); break;
      default: break; 
    }
    setCommand('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current) {
        if (e.key === 'Escape') {
          inputRef.current?.blur();
          setShowInput(false);
        }
        return;
      }

      if (e.key === 'Enter') {
        setShowInput(true);
        setTimeout(() => inputRef.current?.focus(), 10);
        return;
      }

      switch (e.key.toLowerCase()) {
        case '1': activateMode(ParticleMode.SWARM); break;
        case '2': activateMode(ParticleMode.VORTEX); break;
        case '3': activateMode(ParticleMode.CIRCLE); break;
        case '4': activateMode(ParticleMode.STAR); break;
        case '5': activateMode(ParticleMode.HEART); break;
        
        case 's': activateMode(ParticleMode.SWORD); break;
        case 'p': activateMode(ParticleMode.SPEAR); break;
        case 'k': activateMode(ParticleMode.SHIELD); break;
        case 'r': activateMode(ParticleMode.SATURN); break;
        case 'h': activateMode(ParticleMode.HOURGLASS); break;
        
        case 'f': activateMode(ParticleMode.DUEL); break;
        case 'g': activateMode(ParticleMode.GALAXY); break;
        case 'l': activateMode(ParticleMode.DNA); break;
        case 'a': activateMode(ParticleMode.FACE); break;

        case 'd': triggerSupernova(); break; 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none font-sans">
      
      {/* Intro Text */}
      <div className="absolute top-8 left-0 w-full text-center pointer-events-none z-10 opacity-60">
        <h1 className="text-white/50 text-sm font-light tracking-[0.3em] uppercase mb-2">
          Lumina Touch System
        </h1>
        <p className="text-white/30 text-[10px] tracking-widest uppercase">
          Try typing: 'Angel', 'Sorcerer', 'TNT', 'Snow'
        </p>
      </div>

      <ParticleCanvas config={config} supernovaTrigger={supernovaTrigger} />
      <Controls config={config} activateMode={activateMode} setConfig={setConfig} />

      {/* Command Bar UI */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md transition-all duration-300 z-50 ${
        showInput || command.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70 hover:opacity-100'
      }`}>
        <form onSubmit={handleCommandSubmit} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Terminal className="h-4 w-4 text-green-500 animate-pulse" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onFocus={() => setShowInput(true)}
            onBlur={() => setShowInput(false)}
            placeholder="Command (e.g., 'angel', 'tnt')..."
            className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-lg leading-5 bg-black/80 text-white placeholder-gray-500 focus:outline-none focus:bg-black/90 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 sm:text-sm shadow-2xl backdrop-blur-md transition-all"
            autoComplete="off"
          />
          <button 
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

    </div>
  );
};

export default App;
