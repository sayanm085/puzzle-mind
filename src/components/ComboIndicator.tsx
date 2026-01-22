// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 COMBO INDICATOR - Streak & Combo Display
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

interface ComboIndicatorProps {
  combo: number;
  streak: number;
  maxStreak: number;
}

const ComboIndicator: React.FC<ComboIndicatorProps> = ({
  combo,
  streak,
  maxStreak,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (combo > 0 || streak > 0) {
      // Pop animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 100,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Intense shake for high combos
      if (combo >= 5) {
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -1, duration: 30, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
        ]).start();
      }
    }
  }, [combo, streak]);

  useEffect(() => {
    // Continuous glow for active combo
    if (combo > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [combo > 0]);

  if (streak === 0 && combo === 0) return null;

  const getComboColor = () => {
    if (combo >= 10) return COLORS.gold;
    if (combo >= 7) return COLORS.magenta;
    if (combo >= 5) return COLORS.rose;
    if (combo >= 3) return COLORS.cyan;
    return '#FFFFFF';
  };

  const getComboText = () => {
    if (combo >= 10) return '🔥 ON FIRE! 🔥';
    if (combo >= 7) return '⚡ UNSTOPPABLE ⚡';
    if (combo >= 5) return '💫 AMAZING! 💫';
    if (combo >= 3) return '✨ COMBO! ✨';
    return '';
  };

  const shakeTranslate = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-3, 0, 3],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { translateX: shakeTranslate },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)']}
        style={styles.gradient}
      >
        {/* Streak counter */}
        <View style={styles.streakContainer}>
          <Text style={styles.streakLabel}>STREAK</Text>
          <Text style={[styles.streakValue, { color: getComboColor() }]}>
            {streak}
          </Text>
          {maxStreak > 0 && (
            <Text style={styles.maxStreak}>MAX: {maxStreak}</Text>
          )}
        </View>

        {/* Combo indicator */}
        {combo >= 3 && (
          <Animated.View
            style={[
              styles.comboContainer,
              {
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ]}
          >
            <Text style={[styles.comboText, { color: getComboColor() }]}>
              {getComboText()}
            </Text>
            <Text style={[styles.comboMultiplier, { color: getComboColor() }]}>
              ×{(1 + combo * 0.25).toFixed(2)}
            </Text>
          </Animated.View>
        )}

        {/* Progress bar to next combo level */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min((combo % 3) / 3 * 100, 100)}%`,
                backgroundColor: getComboColor(),
              },
            ]}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 80,
  },
  gradient: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
  },
  maxStreak: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
  comboContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  comboText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  comboMultiplier: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  progressContainer: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default ComboIndicator;
