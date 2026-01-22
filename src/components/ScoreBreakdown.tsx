// ═══════════════════════════════════════════════════════════════════════════════
// 🏆 SCORE BREAKDOWN - Detailed Score Display Component
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScoreBreakdownResult } from '../systems/Scoring';
import { COLORS } from '../constants/colors';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownResult;
  visible?: boolean;
  compact?: boolean;
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  breakdown,
  visible = true,
  compact = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  // Individual item animations
  const itemAnims = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (visible && breakdown.total > 0) {
      // Container animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Staggered item animations
      itemAnims.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 200,
          delay: 100 + index * 80,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }).start();
      });
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      scaleAnim.setValue(0.8);
      itemAnims.forEach(anim => anim.setValue(0));
    }
  }, [visible, breakdown.total]);

  if (!visible || breakdown.total === 0) return null;

  const items = [
    { label: 'Base', value: breakdown.base, color: '#FFFFFF' },
    { label: 'Streak', value: breakdown.streakBonus, color: COLORS.gold, show: breakdown.streakBonus > 0 },
    { label: 'Speed', value: breakdown.speedBonus, color: COLORS.cyan, show: breakdown.speedBonus > 0 },
    { label: 'Accuracy', value: breakdown.accuracyBonus, color: COLORS.lime, show: breakdown.accuracyBonus > 0 },
    { label: 'Difficulty', value: breakdown.difficultyBonus, color: COLORS.violet, show: breakdown.difficultyBonus > 0 },
    { label: 'Combo', value: breakdown.comboBonus, color: COLORS.magenta, show: breakdown.comboBonus > 0 },
    { label: 'Perfect!', value: breakdown.perfectBonus, color: COLORS.gold, show: breakdown.perfectBonus > 0 },
  ].filter(item => item.show !== false);

  if (compact) {
    return (
      <Animated.View
        style={[
          styles.compactContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Text style={styles.compactTotal}>+{breakdown.total}</Text>
        {breakdown.multiplier > 1 && (
          <Text style={styles.multiplier}>×{breakdown.multiplier.toFixed(2)}</Text>
        )}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
        style={styles.gradient}
      >
        <Text style={styles.header}>SCORE BREAKDOWN</Text>
        
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <Animated.View
              key={item.label}
              style={[
                styles.item,
                {
                  opacity: itemAnims[index],
                  transform: [{
                    scale: itemAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  }],
                },
              ]}
            >
              <Text style={[styles.itemLabel, { color: item.color }]}>
                {item.label}
              </Text>
              <Text style={[styles.itemValue, { color: item.color }]}>
                +{item.value}
              </Text>
            </Animated.View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <View style={styles.totalValueContainer}>
            <Text style={styles.totalValue}>+{breakdown.total}</Text>
            {breakdown.multiplier > 1 && (
              <Text style={styles.totalMultiplier}>
                ×{breakdown.multiplier.toFixed(2)}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 12,
  },
  itemsContainer: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  totalValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.gold,
  },
  totalMultiplier: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cyan,
    marginLeft: 8,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
  },
  compactTotal: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.gold,
  },
  multiplier: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cyan,
  },
});

export default ScoreBreakdown;
