// ═══════════════════════════════════════════════════════════════════════════════
// 📊 RADAR CHART - Skill Visualization Component
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, Dimensions } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { SkillVector } from '../types';
import { COLORS } from '../constants/colors';

const { width: W } = Dimensions.get('window');

interface RadarChartProps {
  skills: SkillVector;
  size?: number;
  color?: string;
  showLabels?: boolean;
  animated?: boolean;
}

const SKILL_LABELS = {
  visual: '👁️ Visual',
  spatial: '🎯 Spatial',
  logical: '🧠 Logical',
  temporal: '⏳ Temporal',
};

const RadarChart: React.FC<RadarChartProps> = ({
  skills,
  size = W * 0.5,
  color = COLORS.cyan,
  showLabels = true,
  animated = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
      fadeAnim.setValue(1);
    }
  }, [animated]);

  const center = size / 2;
  const maxRadius = size * 0.4;
  const skillKeys = Object.keys(skills) as (keyof SkillVector)[];
  const angleStep = (Math.PI * 2) / skillKeys.length;

  // Calculate polygon points
  const getPolygonPoints = (values: number[]): string => {
    return values.map((value, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const radius = value * maxRadius;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      return `${x},${y}`;
    }).join(' ');
  };

  const skillValues = skillKeys.map(key => skills[key]);
  const maxValues = skillKeys.map(() => 1);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <Svg width={size} height={size}>
        {/* Background grid */}
        <G>
          {[0.25, 0.5, 0.75, 1].map((level, i) => (
            <Polygon
              key={`grid-${i}`}
              points={getPolygonPoints(skillKeys.map(() => level))}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}
        </G>

        {/* Axis lines */}
        {skillKeys.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const endX = center + Math.cos(angle) * maxRadius;
          const endY = center + Math.sin(angle) * maxRadius;
          return (
            <Line
              key={`axis-${index}`}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon (filled area) */}
        <Polygon
          points={getPolygonPoints(skillValues)}
          fill={color}
          fillOpacity={0.3}
          stroke={color}
          strokeWidth="2"
        />

        {/* Data points */}
        {skillValues.map((value, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const radius = value * maxRadius;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return (
            <Circle
              key={`point-${index}`}
              cx={x}
              cy={y}
              r={5}
              fill={color}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {showLabels && skillKeys.map((key, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelRadius = maxRadius + 25;
          const x = center + Math.cos(angle) * labelRadius;
          const y = center + Math.sin(angle) * labelRadius;
          return (
            <SvgText
              key={`label-${index}`}
              x={x}
              y={y}
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {SKILL_LABELS[key]}
            </SvgText>
          );
        })}

        {/* Center dot */}
        <Circle
          cx={center}
          cy={center}
          r={3}
          fill={color}
        />
      </Svg>

      {/* Skill percentages */}
      {showLabels && (
        <View style={styles.statsContainer}>
          {skillKeys.map((key, index) => (
            <View key={key} style={styles.statItem}>
              <Text style={styles.statLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <Text style={[styles.statValue, { color }]}>
                {Math.round(skills[key] * 100)}%
              </Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RadarChart;
