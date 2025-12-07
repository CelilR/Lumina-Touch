
export enum ParticleMode {
  SWARM = 'SWARM',
  VORTEX = 'VORTEX',
  CIRCLE = 'CIRCLE',
  STAR = 'STAR',
  HEART = 'HEART',
  SATURN = 'SATURN',
  SWORD = 'SWORD',
  SPEAR = 'SPEAR',
  SHIELD = 'SHIELD',
  HOURGLASS = 'HOURGLASS',
  // Creative Modes
  DUEL = 'DUEL',      // Two avatars fighting
  GALAXY = 'GALAXY',  // Spiral galaxy
  DNA = 'DNA',        // Double helix
  FACE = 'FACE',      // Cybernetic face
  PHOENIX = 'PHOENIX', // Fire bird
  BLACKHOLE = 'BLACKHOLE', // Accretion disk
  MATRIX = 'MATRIX',   // Digital rain
  RAIN = 'RAIN',       // Storm
  
  // Visual Feast Modes (Non-Standard Rendering)
  ANGEL = 'ANGEL',     // Wings with feather rendering
  SORCERER = 'SORCERER', // Rune circles with text rendering
  TNT = 'TNT',         // Explosive debris with rect rendering
  SNOW = 'SNOW',       // Snowflakes with text rendering
  GHOST = 'GHOST',     // Spooky trails
}

export interface ParticleConfig {
  particleCount: number;
  baseSpeed: number;
  particleSize: number;
  glowIntensity: number;
  mode: ParticleMode;
}

export interface Point {
  x: number;
  y: number;
}
