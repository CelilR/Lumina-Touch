
import React, { useState } from 'react';
import { ParticleConfig, ParticleMode } from '../types';
import { 
  Settings2, X, Activity, Star, Circle, Heart, Wind, Zap, 
  Sword, Shield, Hourglass, Disc, Swords, Dna, Orbit, Smile,
  Flame, CloudRain, Binary, Aperture, Feather, Bomb, Sparkles, Ghost, Snowflake
} from 'lucide-react';

interface ControlsProps {
  config: ParticleConfig;
  activateMode: (mode: ParticleMode) => void;
  setConfig: React.Dispatch<React.SetStateAction<ParticleConfig>>;
}

const Controls: React.FC<ControlsProps> = ({ config, activateMode, setConfig }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const updateConfig = <K extends keyof ParticleConfig>(key: K, value: ParticleConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const modes = [
    { id: ParticleMode.SWARM, icon: <Wind size={18} />, label: 'Swarm (1)' },
    { id: ParticleMode.VORTEX, icon: <Activity size={18} />, label: 'Vortex (2)' },
    { id: ParticleMode.CIRCLE, icon: <Circle size={18} />, label: 'Circle (3)' },
    { id: ParticleMode.STAR, icon: <Star size={18} />, label: 'Star (4)' },
    { id: ParticleMode.HEART, icon: <Heart size={18} />, label: 'Heart (5)' },
    { id: ParticleMode.SATURN, icon: <Disc size={18} />, label: 'Saturn (R)' },
    { id: ParticleMode.SWORD, icon: <Sword size={18} />, label: 'Sword (S)' },
    { id: ParticleMode.SHIELD, icon: <Shield size={18} />, label: 'Shield (K)' },
    { id: ParticleMode.SPEAR, icon: <div className="h-4 w-0.5 bg-current rotate-45" />, label: 'Spear (P)' },
    { id: ParticleMode.HOURGLASS, icon: <Hourglass size={18} />, label: 'Time (H)' },
    
    // Creative Modes
    { id: ParticleMode.DUEL, icon: <Swords size={18} />, label: 'Duel (F)' },
    { id: ParticleMode.GALAXY, icon: <Orbit size={18} />, label: 'Galaxy (G)' },
    { id: ParticleMode.DNA, icon: <Dna size={18} />, label: 'DNA (L)' },
    { id: ParticleMode.FACE, icon: <Smile size={18} />, label: 'Face (A)' },
    
    // High Concept
    { id: ParticleMode.PHOENIX, icon: <Flame size={18} />, label: 'Phoenix' },
    { id: ParticleMode.BLACKHOLE, icon: <Aperture size={18} />, label: 'Void' },
    { id: ParticleMode.MATRIX, icon: <Binary size={18} />, label: 'Matrix' },
    { id: ParticleMode.RAIN, icon: <CloudRain size={18} />, label: 'Rain' },
    
    // Visual Feast (New)
    { id: ParticleMode.ANGEL, icon: <Feather size={18} />, label: 'Angel' },
    { id: ParticleMode.SORCERER, icon: <Sparkles size={18} />, label: 'Magic' },
    { id: ParticleMode.TNT, icon: <Bomb size={18} />, label: 'TNT' },
    { id: ParticleMode.SNOW, icon: <Snowflake size={18} />, label: 'Snow' },
    { id: ParticleMode.GHOST, icon: <Ghost size={18} />, label: 'Ghost' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Toggle Button */}
      <button
        onClick={toggleOpen}
        className={`p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
          isOpen ? 'bg-white text-black rotate-90' : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        {isOpen ? <X size={24} /> : <Settings2 size={24} />}
      </button>

      {/* Control Panel */}
      <div
        className={`bg-black/85 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-80 shadow-2xl transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="space-y-6 text-white">
          
          {/* Header */}
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Zap className="text-yellow-400" size={20} />
            <h2 className="font-bold text-lg">System Controls</h2>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3 block">
              Pattern Mode
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => activateMode(m.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                    config.mode === m.id
                      ? 'bg-white text-black shadow-white/20 shadow-lg scale-105'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                  title={m.label}
                >
                  {m.icon}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-2 font-mono">
              {modes.find(m => m.id === config.mode)?.label}
            </p>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Particle Count</span>
                <span className="font-mono">{config.particleCount}</span>
              </div>
              <input
                type="range"
                min="100"
                max="4000"
                step="100"
                value={config.particleCount}
                onChange={(e) => updateConfig('particleCount', Number(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Response Speed</span>
                <span className="font-mono">{config.baseSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={config.baseSpeed}
                onChange={(e) => updateConfig('baseSpeed', Number(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Glow Intensity</span>
                <span className="font-mono">{config.glowIntensity}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={config.glowIntensity}
                onChange={(e) => updateConfig('glowIntensity', Number(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
