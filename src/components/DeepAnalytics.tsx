// ═══════════════════════════════════════════════════════════════════════════════
// 📊 DEEP ANALYTICS - Research-Style Cognitive Insights
// "A scientist observing your mind."
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { 
  Path, 
  Circle, 
  Line, 
  Text as SvgText, 
  G, 
  Polygon,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';
import { COGNITIVE_PALETTE } from '../engine/ElitePuzzleEngine';
import { ARCHETYPES, ArchetypeId } from '../engine/ArchetypeEngine';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface CognitiveProfile {
  perception: number;
  spatial: number;
  logic: number;
  temporal: number;
  meta: number;
}

export interface SessionData {
  rounds: number;
  accuracy: number;
  averageResponseTime: number;
  streakMax: number;
  trapsFallen: number;
  rulesAdapted: number;
  dominantArchetype: ArchetypeId;
  archetypeBalance: Record<ArchetypeId, number>;
  insights: string[];
  evolutionProgress: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COGNITIVE RADAR - Pentagon visualization of cognitive dimensions
// ─────────────────────────────────────────────────────────────────────────────────

interface CognitiveRadarProps {
  profile: CognitiveProfile;
  size?: number;
  color?: string;
  animated?: boolean;
}

export const CognitiveRadar: React.FC<CognitiveRadarProps> = ({
  profile,
  size = SCREEN_WIDTH - 80,
  color = COGNITIVE_PALETTE.valid,
  animated = true,
}) => {
  const animProgress = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (animated) {
      Animated.timing(animProgress, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }).start();
    } else {
      animProgress.setValue(1);
    }
  }, [animated]);
  
  const dimensions = ['perception', 'spatial', 'logic', 'temporal', 'meta'] as const;
  const labels = ['PERCEPTION', 'SPATIAL', 'LOGIC', 'TEMPORAL', 'META'];
  
  const center = size / 2;
  const maxRadius = (size / 2) - 40;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  
  // Calculate polygon points for a given set of values
  const getPolygonPoints = (values: number[], radius: number): string => {
    return values.map((value, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const r = radius * (value / 100);
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      return `${x},${y}`;
    }).join(' ');
  };
  
  const profileValues = dimensions.map(d => profile[d]);
  
  return (
    <View style={[styles.radarContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </SvgGradient>
        </Defs>
        
        {/* Background grid */}
        {levels.map((level, i) => (
          <Polygon
            key={`level-${i}`}
            points={getPolygonPoints([100, 100, 100, 100, 100], maxRadius * level)}
            fill="none"
            stroke="#1a1a25"
            strokeWidth="1"
          />
        ))}
        
        {/* Axis lines */}
        {dimensions.map((_, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const x = center + Math.cos(angle) * maxRadius;
          const y = center + Math.sin(angle) * maxRadius;
          return (
            <Line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#1a1a25"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data polygon */}
        <Polygon
          points={getPolygonPoints(profileValues, maxRadius)}
          fill="url(#radarGradient)"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Data points */}
        {profileValues.map((value, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const r = maxRadius * (value / 100);
          const x = center + Math.cos(angle) * r;
          const y = center + Math.sin(angle) * r;
          return (
            <Circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r={4}
              fill={color}
            />
          );
        })}
        
        {/* Labels */}
        {labels.map((label, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const x = center + Math.cos(angle) * (maxRadius + 25);
          const y = center + Math.sin(angle) * (maxRadius + 25);
          return (
            <SvgText
              key={`label-${i}`}
              x={x}
              y={y}
              fill="#555"
              fontSize="9"
              fontWeight="600"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {label}
            </SvgText>
          );
        })}
        
        {/* Center value */}
        <SvgText
          x={center}
          y={center}
          fill="#666"
          fontSize="14"
          fontWeight="300"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {Math.round((profileValues.reduce((a, b) => a + b, 0) / 5))}
        </SvgText>
      </Svg>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// ARCHETYPE BALANCE - Four-way distribution visualization
// ─────────────────────────────────────────────────────────────────────────────────

interface ArchetypeBalanceProps {
  balance: Record<ArchetypeId, number>;
  dominant: ArchetypeId;
}

export const ArchetypeBalance: React.FC<ArchetypeBalanceProps> = ({
  balance,
  dominant,
}) => {
  const archetypes: ArchetypeId[] = ['observer', 'strategist', 'reactor', 'architect'];
  
  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.balanceTitle}>COGNITIVE ARCHETYPE</Text>
      
      <View style={styles.balanceGrid}>
        {archetypes.map(id => {
          const archetype = ARCHETYPES[id];
          const percentage = Math.round(balance[id] * 100);
          const isDominant = id === dominant;
          
          return (
            <View key={id} style={styles.balanceItem}>
              <View
                style={[
                  styles.balanceBar,
                  {
                    height: `${percentage}%`,
                    backgroundColor: isDominant ? archetype.color : archetype.secondaryColor,
                  },
                ]}
              />
              <Text style={styles.balanceIcon}>{archetype.icon}</Text>
              <Text
                style={[
                  styles.balanceLabel,
                  isDominant && { color: archetype.color },
                ]}
              >
                {archetype.name.toUpperCase()}
              </Text>
              <Text style={styles.balancePercent}>{percentage}%</Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.dominantInfo}>
        <Text style={[styles.dominantTitle, { color: ARCHETYPES[dominant].color }]}>
          {ARCHETYPES[dominant].title}
        </Text>
        <Text style={styles.dominantEssence}>
          {ARCHETYPES[dominant].essence}
        </Text>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// BEHAVIORAL INSIGHT - Research-style observation notes
// ─────────────────────────────────────────────────────────────────────────────────

interface BehavioralInsightProps {
  data: SessionData;
}

export const BehavioralInsight: React.FC<BehavioralInsightProps> = ({ data }) => {
  // Generate research-style observations
  const observations = useMemo(() => {
    const obs: string[] = [];
    
    // Accuracy analysis
    if (data.accuracy > 0.9) {
      obs.push('Subject demonstrates exceptional pattern recognition accuracy.');
    } else if (data.accuracy > 0.7) {
      obs.push('Pattern recognition within expected parameters.');
    } else if (data.accuracy > 0.5) {
      obs.push('Accuracy suggests room for deliberate practice.');
    } else {
      obs.push('Pattern recognition developing. Further observation needed.');
    }
    
    // Response time analysis
    if (data.averageResponseTime < 1000) {
      obs.push('Response latency indicates strong intuitive processing.');
    } else if (data.averageResponseTime < 2000) {
      obs.push('Balanced deliberation-action cycle observed.');
    } else {
      obs.push('Extended deliberation phase noted. Strategic tendencies evident.');
    }
    
    // Trap susceptibility
    if (data.trapsFallen === 0) {
      obs.push('No false affordance errors. High cognitive resistance.');
    } else if (data.trapsFallen <= 2) {
      obs.push(`Minor susceptibility to deceptive patterns (n=${data.trapsFallen}).`);
    } else {
      obs.push(`Elevated trap susceptibility requires attention (n=${data.trapsFallen}).`);
    }
    
    // Streak analysis
    if (data.streakMax >= 10) {
      obs.push(`Peak consecutive accuracy of ${data.streakMax}. Flow state achieved.`);
    } else if (data.streakMax >= 5) {
      obs.push(`Moderate consistency (max streak: ${data.streakMax}).`);
    }
    
    // Rule adaptation
    if (data.rulesAdapted > 0) {
      obs.push(`Successfully adapted to ${data.rulesAdapted} rule inversion(s).`);
    }
    
    return obs;
  }, [data]);
  
  return (
    <View style={styles.insightContainer}>
      <Text style={styles.insightHeader}>BEHAVIORAL OBSERVATIONS</Text>
      <Text style={styles.insightSubheader}>Session Analysis Report</Text>
      
      <View style={styles.observationsContainer}>
        {observations.map((obs, i) => (
          <View key={i} style={styles.observationRow}>
            <Text style={styles.observationBullet}>→</Text>
            <Text style={styles.observationText}>{obs}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{Math.round(data.accuracy * 100)}%</Text>
          <Text style={styles.metricLabel}>ACCURACY</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{Math.round(data.averageResponseTime)}ms</Text>
          <Text style={styles.metricLabel}>AVG RESPONSE</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{data.streakMax}</Text>
          <Text style={styles.metricLabel}>MAX STREAK</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{data.rounds}</Text>
          <Text style={styles.metricLabel}>ROUNDS</Text>
        </View>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// EVOLUTION PROGRESS - Mind evolution visualization
// ─────────────────────────────────────────────────────────────────────────────────

interface EvolutionProgressProps {
  stage: number;
  progress: number;
  title: string;
  nextUnlock?: string;
}

export const EvolutionProgress: React.FC<EvolutionProgressProps> = ({
  stage,
  progress,
  title,
  nextUnlock,
}) => {
  const stageNames = ['AWAKENING', 'RECOGNITION', 'INTEGRATION', 'MASTERY', 'TRANSCENDENCE', 'INFINITY'];
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress / 100,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progress]);
  
  return (
    <View style={styles.evolutionContainer}>
      <Text style={styles.evolutionTitle}>MIND EVOLUTION</Text>
      
      <View style={styles.stageIndicators}>
        {stageNames.map((name, i) => (
          <View key={name} style={styles.stageItem}>
            <View
              style={[
                styles.stageDot,
                i <= stage && styles.stageDotActive,
                i === stage && styles.stageDotCurrent,
              ]}
            />
            {i < stageNames.length - 1 && (
              <View
                style={[
                  styles.stageLine,
                  i < stage && styles.stageLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
      
      <Text style={styles.stageLabel}>{stageNames[stage]}</Text>
      <Text style={styles.stageTitle}>{title}</Text>
      
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>{progress}% to next stage</Text>
      
      {nextUnlock && (
        <Text style={styles.nextUnlock}>Next: {nextUnlock}</Text>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// INSIGHT CARD - Individual insight display
// ─────────────────────────────────────────────────────────────────────────────────

interface InsightCardProps {
  insight: string;
  index?: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, index = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: index * 200,
      useNativeDriver: true,
    }).start();
  }, [index]);
  
  return (
    <Animated.View
      style={[
        styles.insightCard,
        { opacity: fadeAnim },
      ]}
    >
      <Text style={styles.insightQuote}>"</Text>
      <Text style={styles.insightCardText}>{insight}</Text>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Radar
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Balance
  balanceContainer: {
    paddingVertical: 20,
  },
  balanceTitle: {
    fontSize: 10,
    color: '#555',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 20,
  },
  balanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 120,
    paddingHorizontal: 20,
  },
  balanceItem: {
    alignItems: 'center',
    width: 70,
  },
  balanceBar: {
    width: 30,
    borderRadius: 4,
    minHeight: 8,
  },
  balanceIcon: {
    fontSize: 20,
    marginTop: 8,
  },
  balanceLabel: {
    fontSize: 8,
    color: '#444',
    letterSpacing: 1,
    marginTop: 4,
  },
  balancePercent: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  dominantInfo: {
    marginTop: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  dominantTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  dominantEssence: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  
  // Insight
  insightContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  insightHeader: {
    fontSize: 10,
    color: '#555',
    letterSpacing: 3,
  },
  insightSubheader: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  observationsContainer: {
    marginBottom: 20,
  },
  observationRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  observationBullet: {
    fontSize: 12,
    color: '#444',
    marginRight: 8,
  },
  observationText: {
    fontSize: 12,
    color: '#777',
    flex: 1,
    lineHeight: 18,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1a1a25',
    paddingTop: 16,
  },
  metricItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '200',
    color: '#888',
  },
  metricLabel: {
    fontSize: 8,
    color: '#444',
    letterSpacing: 2,
    marginTop: 2,
  },
  
  // Evolution
  evolutionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  evolutionTitle: {
    fontSize: 10,
    color: '#555',
    letterSpacing: 3,
    marginBottom: 20,
  },
  stageIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a1a25',
  },
  stageDotActive: {
    backgroundColor: '#333',
  },
  stageDotCurrent: {
    backgroundColor: COGNITIVE_PALETTE.valid,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stageLine: {
    width: 20,
    height: 2,
    backgroundColor: '#1a1a25',
  },
  stageLineActive: {
    backgroundColor: '#333',
  },
  stageLabel: {
    fontSize: 9,
    color: '#555',
    letterSpacing: 3,
  },
  stageTitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '80%',
    height: 3,
    backgroundColor: '#1a1a25',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COGNITIVE_PALETTE.valid,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#444',
    marginTop: 8,
  },
  nextUnlock: {
    fontSize: 10,
    color: '#555',
    marginTop: 12,
    fontStyle: 'italic',
  },
  
  // Insight Card
  insightCard: {
    backgroundColor: 'rgba(20,20,30,0.5)',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 20,
    borderLeftWidth: 2,
    borderLeftColor: COGNITIVE_PALETTE.valid + '40',
  },
  insightQuote: {
    fontSize: 24,
    color: '#333',
    position: 'absolute',
    top: 10,
    left: 15,
  },
  insightCardText: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    lineHeight: 22,
    paddingLeft: 10,
  },
});

export default {
  CognitiveRadar,
  ArchetypeBalance,
  BehavioralInsight,
  EvolutionProgress,
  InsightCard,
};
