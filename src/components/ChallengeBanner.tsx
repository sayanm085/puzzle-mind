// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 CHALLENGE BANNER - Animated Challenge Display
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChallengeType } from '../types';
import { getChallengeDescription, getChallengeByType } from '../constants/challenges';
import { COLORS } from '../constants/colors';

interface ChallengeBannerProps {
  challenge: ChallengeType;
  modifier?: string;
  roundNumber?: number;
  totalRounds?: number;
}

const DOMAIN_ICONS: Record<string, string> = {
  visual: '👁️',
  spatial: '🎯',
  logical: '🧠',
  temporal: '⏳',
};

const MODIFIER_DETAILS: Record<string, { icon: string; color: string }> = {
  moving: { icon: '🌀', color: COLORS.cyan },
  rotating: { icon: '🔄', color: COLORS.violet },
  pulsing: { icon: '💓', color: COLORS.rose },
  chaos: { icon: '🌪️', color: COLORS.magenta },
  zen: { icon: '🧘', color: COLORS.lime },
  blitz: { icon: '⚡', color: COLORS.gold },
};

const ChallengeBanner: React.FC<ChallengeBannerProps> = ({
  challenge,
  modifier,
  roundNumber = 1,
  totalRounds = 5,
}) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const challengeData = getChallengeByType(challenge);
  const domain = challengeData?.domain || 'visual';
  const description = getChallengeDescription(challenge);

  useEffect(() => {
    // Entrance animation
    slideAnim.setValue(-50);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);

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

    // Continuous glow
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
  }, [challenge, roundNumber]);

  const modifierData = modifier ? MODIFIER_DETAILS[modifier] : null;

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
      <BlurView intensity={30} style={styles.blur}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)']}
          style={styles.gradient}
        >
          {/* Domain icon */}
          <Text style={styles.domainIcon}>{DOMAIN_ICONS[domain]}</Text>

          {/* Challenge text */}
          <View style={styles.textContainer}>
            <Text style={styles.roundIndicator}>
              ROUND {roundNumber}/{totalRounds}
            </Text>
            <Animated.Text
              style={[
                styles.challengeText,
                {
                  textShadowColor: COLORS.cyan,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 12,
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ]}
            >
              {description}
            </Animated.Text>
          </View>

          {/* Modifier badge */}
          {modifierData && (
            <View style={[styles.modifierBadge, { backgroundColor: modifierData.color + '40' }]}>
              <Text style={styles.modifierIcon}>{modifierData.icon}</Text>
              <Text style={[styles.modifierText, { color: modifierData.color }]}>
                {modifier?.toUpperCase()}
              </Text>
            </View>
          )}
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 10,
  },
  blur: {
    borderRadius: 16,
  },
  gradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  domainIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  roundIndicator: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    marginBottom: 4,
  },
  challengeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modifierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  modifierIcon: {
    fontSize: 14,
  },
  modifierText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default ChallengeBanner;
