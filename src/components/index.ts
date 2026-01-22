// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 COMPONENT INDEX - Export all components for clean imports
// ═══════════════════════════════════════════════════════════════════════════════

// Legacy Components (maintained for backwards compatibility)
export { default as AmbientParticles } from './AmbientParticles';
export { default as GlowingShape } from './GlowingShape';
export { default as SuccessExplosion } from './SuccessExplosion';
export { default as RadarChart } from './RadarChart';
export { default as InsightDisplay } from './InsightDisplay';
export { default as ScoreBreakdown } from './ScoreBreakdown';
export { default as ComboIndicator } from './ComboIndicator';
export { default as TimerBar } from './TimerBar';
export { default as ChallengeBanner } from './ChallengeBanner';

// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 NEW COSMOS MIND COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Spatial UI Components - UI feels spatial, not flat
export {
  BreathingBackground,
  VoidParticles,
  DimensionalButton,
  GlowingText,
  SectionDivider,
  FloatingCard,
  ProgressRing,
  ScreenTransition,
} from './SpatialUI';

// Dimensional Menu Components - Menus feel like entering dimensions
export {
  DimensionalPortal,
  ChamberNode,
  ParallaxContainer,
  CosmicNavBar,
  SectorDetailView,
} from './DimensionalMenu';

// Analytics Visualization - Self-reflection, not stats
export {
  CognitiveRadar,
  FocusWave,
  InsightCard,
  CognitiveBalance,
  SessionTimeline,
  PerformancePulse,
} from './AnalyticsVisualization';

// Game Components - Objects with mass, inertia, life
export {
  PuzzleShape,
  TargetZone,
  TimerDisplay,
  ScoreDisplay,
  ComboDisplay,
} from './GameComponents';

// Screen Components - Each screen is a journey
export {
  VoidScreen,
  NexusScreen,
  ReflectionScreen,
  ProfileScreen,
} from './Screens';
