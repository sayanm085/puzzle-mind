// ═══════════════════════════════════════════════════════════════════════════════
// 💡 INSIGHT DISPLAY - Profound Message Component
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { InsightRule } from '../types';
import { COLORS } from '../constants/colors';

interface InsightDisplayProps {
  insight: InsightRule;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  tempo: COLORS.cyan,
  precision: COLORS.lime,
  mastery: COLORS.gold,
  pattern: COLORS.violet,
  flow: COLORS.magenta,
  milestone: COLORS.rose,
};

const InsightDisplay: React.FC<InsightDisplayProps> = ({
  insight,
  onDismiss,
  autoHide = true,
  duration = 4000,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const categoryColor = CATEGORY_COLORS[insight.category] || COLORS.cyan;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto hide
    if (autoHide) {
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onDismiss?.();
        });
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [insight, autoHide, duration]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
          opacity: fadeAnim,
        },
      ]}
    >
      <BlurView intensity={40} style={styles.blur}>
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)']}
          style={styles.gradient}
        >
          {/* Glow border */}
          <Animated.View
            style={[
              styles.glowBorder,
              {
                borderColor: categoryColor,
                shadowColor: categoryColor,
                opacity: glowOpacity,
              },
            ]}
          />

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{insight.icon}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.category}>
              {insight.category.toUpperCase()}
            </Text>
            <Text style={[styles.message, { color: categoryColor }]}>
              "{insight.message}"
            </Text>
          </View>

          {/* Category indicator */}
          <View
            style={[
              styles.categoryIndicator,
              { backgroundColor: categoryColor },
            ]}
          />
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  blur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  category: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  categoryIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
});

export default InsightDisplay;
