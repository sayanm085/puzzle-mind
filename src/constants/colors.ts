import { Dimensions } from 'react-native';

export const { width: W, height: H } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 PREMIUM COLOR SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
export const COLORS = {
  // Backgrounds
  void: '#0A0A0F',
  abyss: '#050510',
  cosmos: '#08081A',
  deep: '#030308',
  
  // Neon accents
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  violet: '#8B5CF6',
  gold: '#FFD700',
  emerald: '#00FF88',
  rose: '#FF6B9D',
  orange: '#FF8C42',
  blue: '#00BFFF',
  red: '#FF4444',
  lime: '#CCFF00',
  pink: '#FF69B4',
  teal: '#00CED1',
  amber: '#FFBF00',
  indigo: '#4B0082',
  coral: '#FF7F50',
  mint: '#98FF98',
  
  // UI
  textPrimary: '#FFFFFF',
  textSecondary: '#8888AA',
  textMuted: '#444466',
  textGold: '#FFD700',
  textSuccess: '#00FF88',
  textDanger: '#FF4444',
  surface: '#12121F',
  surfaceLight: '#1A1A2E',
  surfaceDark: '#080812',
  border: '#222233',
  borderLight: '#333344',
};

// Extended glow colors for more variety
export const GLOW_COLORS = [
  { main: '#00FFFF', glow: '#00FFFF40', name: 'Cyan' },
  { main: '#FF00FF', glow: '#FF00FF40', name: 'Magenta' },
  { main: '#8B5CF6', glow: '#8B5CF640', name: 'Violet' },
  { main: '#FFD700', glow: '#FFD70040', name: 'Gold' },
  { main: '#00FF88', glow: '#00FF8840', name: 'Emerald' },
  { main: '#FF6B9D', glow: '#FF6B9D40', name: 'Rose' },
  { main: '#FF8C42', glow: '#FF8C4240', name: 'Orange' },
  { main: '#00BFFF', glow: '#00BFFF40', name: 'Sky' },
  { main: '#CCFF00', glow: '#CCFF0040', name: 'Lime' },
  { main: '#FF69B4', glow: '#FF69B440', name: 'Pink' },
  { main: '#00CED1', glow: '#00CED140', name: 'Teal' },
  { main: '#FF7F50', glow: '#FF7F5040', name: 'Coral' },
];

// World-specific color themes
export const WORLD_THEMES = {
  1: { primary: COLORS.violet, secondary: COLORS.cyan, accent: COLORS.magenta },
  2: { primary: COLORS.cyan, secondary: COLORS.emerald, accent: COLORS.blue },
  3: { primary: COLORS.gold, secondary: COLORS.orange, accent: COLORS.amber },
  4: { primary: COLORS.rose, secondary: COLORS.magenta, accent: COLORS.pink },
  5: { primary: COLORS.emerald, secondary: COLORS.teal, accent: COLORS.mint },
  6: { primary: COLORS.orange, secondary: COLORS.coral, accent: COLORS.red },
  7: { primary: COLORS.blue, secondary: COLORS.indigo, accent: COLORS.violet },
  8: { primary: COLORS.lime, secondary: COLORS.emerald, accent: COLORS.cyan },
  9: { primary: COLORS.magenta, secondary: COLORS.rose, accent: COLORS.violet },
  10: { primary: COLORS.gold, secondary: COLORS.amber, accent: COLORS.orange },
};

// Gradient presets
export const GRADIENTS = {
  void: [COLORS.void, COLORS.abyss, COLORS.cosmos],
  cosmic: [COLORS.deep, COLORS.violet + '20', COLORS.deep],
  aurora: [COLORS.void, COLORS.emerald + '15', COLORS.cyan + '10', COLORS.void],
  sunset: [COLORS.void, COLORS.orange + '15', COLORS.rose + '10', COLORS.void],
  matrix: [COLORS.deep, COLORS.emerald + '08', COLORS.deep],
  nebula: [COLORS.void, COLORS.violet + '20', COLORS.magenta + '10', COLORS.void],
};
