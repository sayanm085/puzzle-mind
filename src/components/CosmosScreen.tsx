// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 COSMOS SCREEN - The Galaxy Map
// A living visualization of the player's cognitive universe
// "Each star is a challenge. Each constellation, a domain."
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Line, Path, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import { SECTORS } from '../universe/UniverseStructure';
import { sessionFlow, COGNITIVE_STAGES, CognitiveStage } from '../engine/SessionFlowEngine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface CosmosScreenProps {
  playerMind: any;
  unlockedSectors: string[];
  sectorProgress: Record<string, number>;
  onSectorSelect: (sectorId: string) => void;
  onBack: () => void;
}

interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  brightness: number;
  color: string;
  twinkleSpeed: number;
}

interface Constellation {
  id: string;
  name: string;
  stars: { x: number; y: number }[];
  connections: [number, number][];
  color: string;
  unlocked: boolean;
  progress: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const COLORS = {
  void: '#030308',
  voidDeep: '#000004',
  starWhite: '#ffffff',
  starBlue: '#a8c5ff',
  starYellow: '#fff4d6',
  nebulaPurple: 'rgba(139, 92, 246, 0.15)',
  nebulaBlue: 'rgba(59, 130, 246, 0.1)',
  nebulaPink: 'rgba(236, 72, 153, 0.08)',
  text: '#e2e8f0',
  textDim: '#64748b',
  accent: '#4a9eff',
  gold: '#fbbf24',
  locked: '#374151',
};

// Sector positions on the galaxy map (normalized 0-1)
const SECTOR_POSITIONS: Record<string, { x: number; y: number }> = {
  genesis: { x: 0.5, y: 0.55 },      // Center - starting point
  prisma: { x: 0.25, y: 0.35 },     // Upper left
  memoria: { x: 0.75, y: 0.35 },    // Upper right
  logica: { x: 0.2, y: 0.65 },      // Lower left
  flux: { x: 0.8, y: 0.65 },        // Lower right
  nexus_prime: { x: 0.5, y: 0.25 }, // Top center (advanced)
  void_heart: { x: 0.5, y: 0.8 },   // Bottom center (endgame)
};

// Connections between sectors (paths through the cosmos)
const SECTOR_CONNECTIONS: [string, string][] = [
  ['genesis', 'prisma'],
  ['genesis', 'memoria'],
  ['genesis', 'logica'],
  ['genesis', 'flux'],
  ['prisma', 'nexus_prime'],
  ['memoria', 'nexus_prime'],
  ['logica', 'void_heart'],
  ['flux', 'void_heart'],
  ['nexus_prime', 'void_heart'],
];

// ─────────────────────────────────────────────────────────────────────────────────
// STAR FIELD GENERATOR
// ─────────────────────────────────────────────────────────────────────────────────

const generateStarField = (count: number): Star[] => {
  const stars: Star[] = [];
  
  for (let i = 0; i < count; i++) {
    const brightness = Math.random();
    const colorRoll = Math.random();
    
    stars.push({
      id: `star-${i}`,
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT,
      size: 0.5 + brightness * 2,
      brightness: 0.3 + brightness * 0.7,
      color: colorRoll > 0.8 ? COLORS.starBlue : (colorRoll > 0.6 ? COLORS.starYellow : COLORS.starWhite),
      twinkleSpeed: 2000 + Math.random() * 3000,
    });
  }
  
  return stars;
};

// ─────────────────────────────────────────────────────────────────────────────────
// TWINKLING STAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

const TwinklingStar: React.FC<{ star: Star }> = ({ star }) => {
  const opacityAnim = useRef(new Animated.Value(star.brightness)).current;
  
  useEffect(() => {
    const twinkle = () => {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: star.brightness * 0.3,
          duration: star.twinkleSpeed / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: star.brightness,
          duration: star.twinkleSpeed / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => twinkle());
    };
    
    // Random delay before starting
    const timeout = setTimeout(twinkle, Math.random() * star.twinkleSpeed);
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: star.color,
          opacity: opacityAnim,
        },
      ]}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// SECTOR NODE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface SectorNodeProps {
  sector: typeof SECTORS[0];
  position: { x: number; y: number };
  unlocked: boolean;
  progress: number;
  onSelect: () => void;
  isCenter?: boolean;
}

const SectorNode: React.FC<SectorNodeProps> = ({
  sector,
  position,
  unlocked,
  progress,
  onSelect,
  isCenter,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Ambient pulse for unlocked sectors
  useEffect(() => {
    if (unlocked) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Glow in
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [unlocked]);
  
  const handlePress = () => {
    if (!unlocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
    
    onSelect();
  };
  
  const nodeSize = isCenter ? 80 : 60;
  const glowSize = nodeSize + 30;
  
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.sectorNode,
        {
          left: position.x * SCREEN_WIDTH - nodeSize / 2,
          top: position.y * SCREEN_HEIGHT - nodeSize / 2,
          width: nodeSize,
          height: nodeSize,
        },
      ]}
    >
      {/* Outer glow */}
      {unlocked && (
        <Animated.View
          style={[
            styles.sectorGlow,
            {
              width: glowSize,
              height: glowSize,
              borderRadius: glowSize / 2,
              backgroundColor: sector.color,
              opacity: glowOpacity,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}
      
      {/* Main node */}
      <Animated.View
        style={[
          styles.sectorNodeInner,
          {
            width: nodeSize,
            height: nodeSize,
            borderRadius: nodeSize / 2,
            borderColor: unlocked ? sector.color : COLORS.locked,
            backgroundColor: unlocked ? `${sector.color}20` : 'rgba(30, 30, 40, 0.8)',
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Progress ring */}
        {unlocked && progress > 0 && (
          <Svg
            width={nodeSize}
            height={nodeSize}
            style={styles.progressRing}
          >
            <Circle
              cx={nodeSize / 2}
              cy={nodeSize / 2}
              r={(nodeSize - 8) / 2}
              stroke={sector.color}
              strokeWidth={3}
              fill="none"
              strokeDasharray={`${progress * Math.PI * (nodeSize - 8)} ${Math.PI * (nodeSize - 8)}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${nodeSize / 2} ${nodeSize / 2})`}
            />
          </Svg>
        )}
        
        {/* Sector icon */}
        <Text style={[
          styles.sectorIcon,
          { fontSize: isCenter ? 28 : 22 },
          !unlocked && styles.sectorIconLocked,
        ]}>
          {sector.icon}
        </Text>
      </Animated.View>
      
      {/* Label */}
      <View style={styles.sectorLabel}>
        <Text style={[
          styles.sectorName,
          !unlocked && styles.sectorNameLocked,
        ]}>
          {sector.name}
        </Text>
        {unlocked && progress > 0 && (
          <Text style={styles.sectorProgress}>
            {Math.round(progress * 100)}%
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// CONNECTION LINES COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

const ConnectionLines: React.FC<{
  connections: [string, string][];
  unlockedSectors: string[];
}> = ({ connections, unlockedSectors }) => {
  return (
    <Svg
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      style={styles.connectionsSvg}
    >
      <Defs>
        <RadialGradient id="pathGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.3} />
          <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      
      {connections.map(([from, to], index) => {
        const fromPos = SECTOR_POSITIONS[from];
        const toPos = SECTOR_POSITIONS[to];
        
        if (!fromPos || !toPos) return null;
        
        const bothUnlocked = unlockedSectors.includes(from) && unlockedSectors.includes(to);
        const oneUnlocked = unlockedSectors.includes(from) || unlockedSectors.includes(to);
        
        const x1 = fromPos.x * SCREEN_WIDTH;
        const y1 = fromPos.y * SCREEN_HEIGHT;
        const x2 = toPos.x * SCREEN_WIDTH;
        const y2 = toPos.y * SCREEN_HEIGHT;
        
        return (
          <G key={`connection-${index}`}>
            {/* Background line */}
            <Line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={bothUnlocked ? COLORS.accent : (oneUnlocked ? COLORS.textDim : COLORS.locked)}
              strokeWidth={bothUnlocked ? 2 : 1}
              strokeDasharray={bothUnlocked ? undefined : "5,5"}
              opacity={bothUnlocked ? 0.6 : 0.3}
            />
          </G>
        );
      })}
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// NEBULA BACKGROUND COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

const NebulaBackground: React.FC = () => {
  const drift1 = useRef(new Animated.Value(0)).current;
  const drift2 = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.timing(drift1, {
        toValue: 1,
        duration: 30000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    
    Animated.loop(
      Animated.timing(drift2, {
        toValue: 1,
        duration: 45000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  const translateX1 = drift1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });
  
  const translateY1 = drift1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 30, 0],
  });
  
  return (
    <View style={styles.nebulaContainer}>
      <Animated.View
        style={[
          styles.nebula,
          styles.nebula1,
          {
            transform: [
              { translateX: translateX1 },
              { translateY: translateY1 },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.nebula,
          styles.nebula2,
          {
            transform: [
              { translateX: Animated.multiply(translateX1, -1) },
              { translateY: translateY1 },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.nebula,
          styles.nebula3,
        ]}
      />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// COGNITIVE STAGE INDICATOR
// ─────────────────────────────────────────────────────────────────────────────────

const StageIndicator: React.FC<{ stage: CognitiveStage; progress: number }> = ({ stage, progress }) => {
  const stageInfo = COGNITIVE_STAGES[stage];
  
  return (
    <View style={styles.stageIndicator}>
      <Text style={styles.stageLabel}>{stageInfo.name}</Text>
      <View style={styles.stageProgressBar}>
        <View style={[styles.stageProgressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.stageDescription}>{stageInfo.description}</Text>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COSMOS SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

export const CosmosScreen: React.FC<CosmosScreenProps> = ({
  playerMind,
  unlockedSectors,
  sectorProgress,
  onSectorSelect,
  onBack,
}) => {
  // Generate star field once
  const stars = useMemo(() => generateStarField(150), []);
  
  // Get current cognitive stage
  const currentStage = sessionFlow.getCurrentStage();
  const metrics = sessionFlow.getMetrics();
  
  // Fade in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Deep void background */}
      <LinearGradient
        colors={[COLORS.voidDeep, COLORS.void, COLORS.voidDeep]}
        locations={[0, 0.5, 1]}
        style={styles.background}
      />
      
      {/* Nebula layers */}
      <NebulaBackground />
      
      {/* Star field */}
      <View style={styles.starField}>
        {stars.map(star => (
          <TwinklingStar key={star.id} star={star} />
        ))}
      </View>
      
      {/* Connection lines between sectors */}
      <ConnectionLines
        connections={SECTOR_CONNECTIONS}
        unlockedSectors={unlockedSectors}
      />
      
      {/* Sector nodes */}
      {SECTORS.map(sector => {
        const position = SECTOR_POSITIONS[sector.id];
        if (!position) return null;
        
        return (
          <SectorNode
            key={sector.id}
            sector={sector}
            position={position}
            unlocked={unlockedSectors.includes(sector.id)}
            progress={sectorProgress[sector.id] || 0}
            onSelect={() => onSectorSelect(sector.id)}
            isCenter={sector.id === 'genesis'}
          />
        );
      })}
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>COSMOS</Text>
        <Text style={styles.headerSubtitle}>Your Cognitive Universe</Text>
      </View>
      
      {/* Cognitive Stage */}
      <StageIndicator stage={currentStage} progress={metrics.stageProgress} />
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.accent }]} />
          <Text style={styles.legendText}>Unlocked</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.locked }]} />
          <Text style={styles.legendText}>Locked</Text>
        </View>
      </View>
      
      {/* Stats summary */}
      <View style={styles.statsSummary}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{playerMind.totalSessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(playerMind.lifetimeAccuracy * 100)}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{unlockedSectors.length}/{SECTORS.length}</Text>
          <Text style={styles.statLabel}>Sectors</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.voidDeep,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  nebulaContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  nebula: {
    position: 'absolute',
    borderRadius: 999,
  },
  nebula1: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    top: SCREEN_HEIGHT * 0.1,
    left: -SCREEN_WIDTH * 0.2,
    backgroundColor: COLORS.nebulaPurple,
  },
  nebula2: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    top: SCREEN_HEIGHT * 0.5,
    right: -SCREEN_WIDTH * 0.1,
    backgroundColor: COLORS.nebulaBlue,
  },
  nebula3: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    bottom: SCREEN_HEIGHT * 0.1,
    left: SCREEN_WIDTH * 0.3,
    backgroundColor: COLORS.nebulaPink,
  },
  starField: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
  },
  connectionsSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  sectorNode: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectorGlow: {
    position: 'absolute',
  },
  sectorNodeInner: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  progressRing: {
    position: 'absolute',
  },
  sectorIcon: {
    textAlign: 'center',
  },
  sectorIconLocked: {
    opacity: 0.3,
  },
  sectorLabel: {
    position: 'absolute',
    top: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  sectorName: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  sectorNameLocked: {
    color: COLORS.locked,
  },
  sectorProgress: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '200',
    letterSpacing: 8,
  },
  headerSubtitle: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 2,
    marginTop: 4,
  },
  stageIndicator: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  stageLabel: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  stageProgressBar: {
    width: 120,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1.5,
    marginTop: 6,
    overflow: 'hidden',
  },
  stageProgressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 1.5,
  },
  stageDescription: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '400',
    marginTop: 4,
  },
  legend: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  statsSummary: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  statLabel: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
});

export default CosmosScreen;
