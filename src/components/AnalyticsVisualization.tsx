// ═══════════════════════════════════════════════════════════════════════════════
// 📊 ANALYTICS VISUALIZATION - Self-Reflection, Not Stats
// "Displayed as self-reflection, not stats. We don't say 'accuracy 78%.'
//  We say 'your eye drifts right under pressure. Train left-awareness.'"
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
  Circle,
  Path,
  Line,
  Text as SvgText,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Polygon,
} from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { CINEMATIC_EASING } from '../engine/VisualEngine';
import { CognitiveVector, RadarMetric, FocusStability, TemporalAnalysis } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Animated SVG components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

// ─────────────────────────────────────────────────────────────────────────────────
// COGNITIVE RADAR - Multi-dimensional ability visualization
// ─────────────────────────────────────────────────────────────────────────────────

interface CognitiveRadarProps {
  metrics: RadarMetric[];
  size?: number;
  color?: string;
  animated?: boolean;
}

export const CognitiveRadar: React.FC<CognitiveRadarProps> = ({
  metrics,
  size = 250,
  color = '#00FFFF',
  animated = true,
}) => {
  const animProgress = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (animated) {
      Animated.timing(animProgress, {
        toValue: 1,
        duration: 1500,
        easing: CINEMATIC_EASING.heavyOut,
        useNativeDriver: false,
      }).start();
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 2000,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      animProgress.setValue(1);
    }
  }, [animated]);
  
  const center = size / 2;
  const maxRadius = size * 0.4;
  const levels = 5;
  const angleStep = (Math.PI * 2) / metrics.length;
  
  // Generate radar grid
  const gridLines = useMemo(() => {
    const lines = [];
    // Concentric circles
    for (let i = 1; i <= levels; i++) {
      const r = (maxRadius / levels) * i;
      lines.push(
        <Circle
          key={`circle-${i}`}
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
      );
    }
    // Axis lines
    metrics.forEach((_, idx) => {
      const angle = angleStep * idx - Math.PI / 2;
      const x = center + Math.cos(angle) * maxRadius;
      const y = center + Math.sin(angle) * maxRadius;
      lines.push(
        <Line
          key={`axis-${idx}`}
          x1={center}
          y1={center}
          x2={x}
          y2={y}
          stroke="#FFFFFF"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
      );
    });
    return lines;
  }, [metrics.length, size]);
  
  // Generate data polygon path
  const dataPath = useMemo(() => {
    const points = metrics.map((metric, idx) => {
      const angle = angleStep * idx - Math.PI / 2;
      const r = (metric.value / 100) * maxRadius;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  }, [metrics, size]);
  
  // Labels
  const labels = useMemo(() => {
    return metrics.map((metric, idx) => {
      const angle = angleStep * idx - Math.PI / 2;
      const labelRadius = maxRadius + 25;
      const x = center + Math.cos(angle) * labelRadius;
      const y = center + Math.sin(angle) * labelRadius;
      return { ...metric, x, y };
    });
  }, [metrics, size]);
  
  return (
    <View style={[styles.radarContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgLinearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.1} />
          </SvgLinearGradient>
        </Defs>
        
        {/* Grid */}
        {gridLines}
        
        {/* Data area */}
        <Path
          d={dataPath}
          fill="url(#radarGradient)"
          stroke={color}
          strokeWidth={2}
          strokeOpacity={0.8}
        />
        
        {/* Data points */}
        {metrics.map((metric, idx) => {
          const angle = angleStep * idx - Math.PI / 2;
          const r = (metric.value / 100) * maxRadius;
          const x = center + Math.cos(angle) * r;
          const y = center + Math.sin(angle) * r;
          return (
            <Circle
              key={`point-${idx}`}
              cx={x}
              cy={y}
              r={5}
              fill={color}
              stroke="#000000"
              strokeWidth={2}
            />
          );
        })}
        
        {/* Labels */}
        {labels.map((label, idx) => (
          <SvgText
            key={`label-${idx}`}
            x={label.x}
            y={label.y}
            fill="#FFFFFF"
            fontSize={10}
            textAnchor="middle"
            fontWeight="600"
          >
            {label.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// FOCUS WAVE - Temporal focus visualization
// ─────────────────────────────────────────────────────────────────────────────────

interface FocusWaveProps {
  data: number[]; // 0-1 values over time
  width?: number;
  height?: number;
  color?: string;
  showLabels?: boolean;
}

export const FocusWave: React.FC<FocusWaveProps> = ({
  data,
  width = SCREEN_WIDTH - 40,
  height = 120,
  color = '#7B68EE',
  showLabels = true,
}) => {
  const animProgress = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animProgress, {
      toValue: 1,
      duration: 1200,
      easing: CINEMATIC_EASING.smoothOut,
      useNativeDriver: false,
    }).start();
  }, [data]);
  
  // Generate smooth curve path
  const curvePath = useMemo(() => {
    if (data.length < 2) return '';
    
    const padding = 20;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const stepX = graphWidth / (data.length - 1);
    
    const points = data.map((value, idx) => ({
      x: padding + idx * stepX,
      y: padding + (1 - value) * graphHeight,
    }));
    
    // Create smooth bezier curve
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    
    return path;
  }, [data, width, height]);
  
  // Area fill path
  const areaPath = useMemo(() => {
    if (!curvePath) return '';
    const padding = 20;
    return `${curvePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;
  }, [curvePath, width, height]);
  
  return (
    <View style={[styles.focusWaveContainer, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgLinearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </SvgLinearGradient>
        </Defs>
        
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(level => (
          <Line
            key={`grid-${level}`}
            x1={20}
            y1={20 + (1 - level) * (height - 40)}
            x2={width - 20}
            y2={20 + (1 - level) * (height - 40)}
            stroke="#FFFFFF"
            strokeOpacity={0.1}
            strokeWidth={1}
            strokeDasharray="4,4"
          />
        ))}
        
        {/* Area fill */}
        <Path d={areaPath} fill="url(#waveGradient)" />
        
        {/* Main curve */}
        <Path
          d={curvePath}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        
        {/* Labels */}
        {showLabels && (
          <>
            <SvgText x={10} y={25} fill="#666666" fontSize={8}>HIGH</SvgText>
            <SvgText x={10} y={height - 10} fill="#666666" fontSize={8}>LOW</SvgText>
          </>
        )}
      </Svg>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// INSIGHT CARD - Reflective feedback display
// ─────────────────────────────────────────────────────────────────────────────────

interface InsightCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  intensity?: number; // 0-1, how important/urgent
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  icon,
  color,
  intensity = 0.5,
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 600,
      easing: CINEMATIC_EASING.heavyOut,
      useNativeDriver: true,
    }).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000 / (0.5 + intensity),
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000 / (0.5 + intensity),
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [intensity]);
  
  return (
    <Animated.View
      style={[
        styles.insightCard,
        {
          opacity: entranceAnim,
          transform: [{
            translateY: entranceAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
        },
      ]}
    >
      <LinearGradient
        colors={[color + '20', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Glow border */}
      <Animated.View
        style={[
          styles.insightGlow,
          {
            borderColor: color,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.5 + intensity * 0.3],
            }),
          },
        ]}
      />
      
      <View style={styles.insightContent}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightIcon}>{icon}</Text>
          <Text style={[styles.insightTitle, { color }]}>{title}</Text>
        </View>
        <Text style={styles.insightDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// COGNITIVE BALANCE - Yin-yang style balance indicator
// ─────────────────────────────────────────────────────────────────────────────────

interface CognitiveBalanceProps {
  analysis: number; // 0-1 (0 = pure intuition, 1 = pure analysis)
  speed: number; // 0-1 (0 = careful, 1 = fast)
  size?: number;
}

export const CognitiveBalance: React.FC<CognitiveBalanceProps> = ({
  analysis,
  speed,
  size = 150,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  const center = size / 2;
  const radius = size * 0.4;
  
  // Calculate indicator position based on analysis/speed
  const indicatorAngle = Math.atan2(speed - 0.5, analysis - 0.5);
  const indicatorDistance = Math.sqrt(Math.pow(analysis - 0.5, 2) + Math.pow(speed - 0.5, 2)) * radius * 1.5;
  const indicatorX = center + Math.cos(indicatorAngle) * Math.min(indicatorDistance, radius);
  const indicatorY = center + Math.sin(indicatorAngle) * Math.min(indicatorDistance, radius);
  
  return (
    <View style={[styles.balanceContainer, { width: size, height: size }]}>
      <Animated.View
        style={{
          transform: [{
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          }],
        }}
      >
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="#1A1A1A"
            stroke="#333333"
            strokeWidth={2}
          />
          
          {/* Quadrant labels */}
          <SvgText x={center} y={center - radius - 10} fill="#666666" fontSize={8} textAnchor="middle">
            FAST
          </SvgText>
          <SvgText x={center} y={center + radius + 16} fill="#666666" fontSize={8} textAnchor="middle">
            CAREFUL
          </SvgText>
          <SvgText x={center - radius - 10} y={center + 3} fill="#666666" fontSize={8} textAnchor="end">
            INTUITIVE
          </SvgText>
          <SvgText x={center + radius + 10} y={center + 3} fill="#666666" fontSize={8} textAnchor="start">
            ANALYTICAL
          </SvgText>
          
          {/* Cross lines */}
          <Line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="#333333" strokeWidth={1} />
          <Line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="#333333" strokeWidth={1} />
          
          {/* Center point */}
          <Circle cx={center} cy={center} r={3} fill="#666666" />
        </Svg>
      </Animated.View>
      
      {/* Indicator (not rotating) */}
      <View
        style={[
          styles.balanceIndicator,
          {
            left: indicatorX - 8,
            top: indicatorY - 8,
            backgroundColor: getBalanceColor(analysis, speed),
          },
        ]}
      />
    </View>
  );
};

const getBalanceColor = (analysis: number, speed: number): string => {
  // Color based on position
  if (analysis > 0.6 && speed > 0.6) return '#FF6B6B'; // Fast analytical
  if (analysis < 0.4 && speed > 0.6) return '#FFE66D'; // Fast intuitive
  if (analysis > 0.6 && speed < 0.4) return '#4ECDC4'; // Careful analytical
  if (analysis < 0.4 && speed < 0.4) return '#7B68EE'; // Careful intuitive
  return '#00FFFF'; // Balanced
};

// ─────────────────────────────────────────────────────────────────────────────────
// SESSION TIMELINE - Visual session progression
// ─────────────────────────────────────────────────────────────────────────────────

interface TimelineEvent {
  time: number; // Seconds from start
  type: 'success' | 'error' | 'streak' | 'break' | 'milestone';
  label?: string;
}

interface SessionTimelineProps {
  events: TimelineEvent[];
  duration: number; // Total session seconds
  width?: number;
}

export const SessionTimeline: React.FC<SessionTimelineProps> = ({
  events,
  duration,
  width = SCREEN_WIDTH - 40,
}) => {
  const height = 60;
  const padding = 30;
  const timelineWidth = width - padding * 2;
  
  const eventColors = {
    success: '#4ECDC4',
    error: '#FF6B6B',
    streak: '#FFE66D',
    break: '#666666',
    milestone: '#7B68EE',
  };
  
  return (
    <View style={[styles.timelineContainer, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Main timeline line */}
        <Line
          x1={padding}
          y1={height / 2}
          x2={width - padding}
          y2={height / 2}
          stroke="#333333"
          strokeWidth={3}
          strokeLinecap="round"
        />
        
        {/* Events */}
        {events.map((event, idx) => {
          const x = padding + (event.time / duration) * timelineWidth;
          const color = eventColors[event.type];
          
          return (
            <G key={idx}>
              <Circle
                cx={x}
                cy={height / 2}
                r={event.type === 'milestone' ? 8 : 5}
                fill={color}
                stroke="#000000"
                strokeWidth={2}
              />
              {event.label && (
                <SvgText
                  x={x}
                  y={height / 2 - 15}
                  fill={color}
                  fontSize={8}
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {event.label}
                </SvgText>
              )}
            </G>
          );
        })}
        
        {/* Time labels */}
        <SvgText x={padding} y={height - 5} fill="#666666" fontSize={8} textAnchor="start">
          0:00
        </SvgText>
        <SvgText x={width - padding} y={height - 5} fill="#666666" fontSize={8} textAnchor="end">
          {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
        </SvgText>
      </Svg>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// PERFORMANCE PULSE - Heartbeat-style recent performance
// ─────────────────────────────────────────────────────────────────────────────────

interface PerformancePulseProps {
  recentScores: number[]; // Last N performance scores (0-100)
  color?: string;
}

export const PerformancePulse: React.FC<PerformancePulseProps> = ({
  recentScores,
  color = '#00FFFF',
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const avgScore = recentScores.length > 0
    ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
    : 0;
  
  const trend = recentScores.length >= 2
    ? recentScores[recentScores.length - 1] - recentScores[0]
    : 0;
  
  const trendColor = trend > 5 ? '#4ECDC4' : trend < -5 ? '#FF6B6B' : '#666666';
  const trendIcon = trend > 5 ? '↗' : trend < -5 ? '↘' : '→';
  
  return (
    <View style={styles.pulseContainer}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            borderColor: color,
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.7],
            }),
            transform: [{
              scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            }],
          },
        ]}
      />
      <View style={styles.pulseCore}>
        <Text style={[styles.pulseValue, { color }]}>{Math.round(avgScore)}</Text>
        <Text style={[styles.pulseTrend, { color: trendColor }]}>{trendIcon}</Text>
      </View>
      <Text style={styles.pulseLabel}>FLOW SCORE</Text>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusWaveContainer: {
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  insightCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    overflow: 'hidden',
    marginVertical: 8,
  },
  insightGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
  },
  insightContent: {
    padding: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  insightDescription: {
    fontSize: 13,
    color: '#AAAAAA',
    lineHeight: 20,
  },
  balanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceIndicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  timelineContainer: {
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
  },
  pulseCore: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pulseValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  pulseTrend: {
    fontSize: 20,
    marginLeft: 4,
  },
  pulseLabel: {
    fontSize: 8,
    color: '#666666',
    letterSpacing: 2,
    marginTop: 4,
  },
});

export default {
  CognitiveRadar,
  FocusWave,
  InsightCard,
  CognitiveBalance,
  SessionTimeline,
  PerformancePulse,
};
