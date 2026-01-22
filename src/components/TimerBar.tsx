// ═══════════════════════════════════════════════════════════════════════════════
// ⏱️ TIMER BAR - Animated Time Display
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

interface TimerBarProps {
  timeLeft: number;
  maxTime: number;
  isUrgent?: boolean;
  isBlitz?: boolean;
}

const TimerBar: React.FC<TimerBarProps> = ({
  timeLeft,
  maxTime,
  isUrgent = false,
  isBlitz = false,
}) => {
  const widthAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const progress = Math.max(0, Math.min(1, timeLeft / maxTime));

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    if (isUrgent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isUrgent]);

  const getBarColor = (): [string, string] => {
    if (progress < 0.2) return ['#FF0066', '#FF4444'];
    if (progress < 0.4) return [COLORS.orange, COLORS.gold];
    if (isBlitz) return [COLORS.magenta, COLORS.rose];
    return [COLORS.cyan, COLORS.blue];
  };

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: pulseAnim }] },
      ]}
    >
      <View style={styles.barContainer}>
        <Animated.View style={[styles.barBackground, { width }]}>
          <LinearGradient
            colors={getBarColor()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
        
        {/* Glow effect for urgent */}
        {isUrgent && (
          <Animated.View
            style={[
              styles.urgentGlow,
              {
                opacity: glowAnim,
                backgroundColor: '#FF0066',
              },
            ]}
          />
        )}
      </View>

      {/* Time display */}
      <View style={styles.timeContainer}>
        <Text style={[
          styles.timeText,
          isUrgent && styles.urgentText,
          isBlitz && styles.blitzText,
        ]}>
          {timeLeft.toFixed(1)}s
        </Text>
        {isBlitz && (
          <Text style={styles.blitzIndicator}>⚡ BLITZ</Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  barContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barBackground: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  urgentGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  urgentText: {
    color: '#FF0066',
  },
  blitzText: {
    color: COLORS.magenta,
  },
  blitzIndicator: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.magenta,
    letterSpacing: 1,
  },
});

export default TimerBar;
