// ═══════════════════════════════════════════════════════════════════════════════
// 💥 SUCCESS EXPLOSION - Celebratory Particle Effect
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Easing, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';

const { width: W, height: H } = Dimensions.get('window');

interface SuccessExplosionProps {
  x: number;
  y: number;
  color?: string;
  particleCount?: number;
  onComplete?: () => void;
  variant?: 'success' | 'combo' | 'levelUp' | 'perfect' | 'streak';
}

const EXPLOSION_COLORS = [
  COLORS.cyan,
  COLORS.gold,
  COLORS.magenta,
  COLORS.lime,
  COLORS.rose,
  '#FFFFFF',
];

const SuccessExplosion: React.FC<SuccessExplosionProps> = ({
  x,
  y,
  color,
  particleCount = 12,
  onComplete,
  variant = 'success',
}) => {
  const particles = useRef(
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      angle: (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5,
      distance: 80 + Math.random() * 60,
      size: variant === 'levelUp' ? 8 + Math.random() * 6 : 4 + Math.random() * 4,
      color: color || EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
      delay: Math.random() * 100,
    }))
  ).current;

  const animations = useRef(
    particles.map(() => ({
      position: new Animated.Value(0),
      opacity: new Animated.Value(1),
      scale: new Animated.Value(0),
      rotation: new Animated.Value(0),
    }))
  ).current;

  // Ring expansion animation for combo/levelUp
  const ringScale = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Particle animations
    const particleAnims = particles.map((particle, index) => {
      const anim = animations[index];
      return Animated.parallel([
        Animated.timing(anim.position, {
          toValue: 1,
          duration: variant === 'levelUp' ? 800 : 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
          delay: particle.delay,
        }),
        Animated.sequence([
          Animated.timing(anim.scale, {
            toValue: 1.5,
            duration: 150,
            useNativeDriver: true,
            delay: particle.delay,
          }),
          Animated.timing(anim.scale, {
            toValue: 0,
            duration: variant === 'levelUp' ? 650 : 350,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: variant === 'levelUp' ? 800 : 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
          delay: particle.delay,
        }),
        Animated.timing(anim.rotation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);
    });

    // Ring animation for special variants
    const ringAnim = (variant === 'combo' || variant === 'levelUp' || variant === 'perfect')
      ? Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 3,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      : null;

    const allAnims = ringAnim 
      ? Animated.parallel([...particleAnims, ringAnim])
      : Animated.parallel(particleAnims);

    allAnims.start(() => {
      onComplete?.();
    });
  }, []);

  const getVariantColor = () => {
    switch (variant) {
      case 'combo': return COLORS.gold;
      case 'levelUp': return COLORS.cyan;
      case 'perfect': return COLORS.lime;
      case 'streak': return COLORS.magenta;
      default: return COLORS.cyan;
    }
  };

  return (
    <View style={[styles.container, { left: x, top: y }]} pointerEvents="none">
      {/* Expanding ring for special variants */}
      {(variant === 'combo' || variant === 'levelUp' || variant === 'perfect') && (
        <Animated.View
          style={[
            styles.ring,
            {
              borderColor: getVariantColor(),
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
            },
          ]}
        />
      )}

      {/* Particles */}
      {particles.map((particle, index) => {
        const anim = animations[index];
        
        const translateX = anim.position.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(particle.angle) * particle.distance],
        });
        
        const translateY = anim.position.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(particle.angle) * particle.distance],
        });

        const rotation = anim.rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${360 * (Math.random() > 0.5 ? 1 : -1)}deg`],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                borderRadius: particle.size / 2,
                shadowColor: particle.color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: particle.size,
                transform: [
                  { translateX },
                  { translateY },
                  { scale: anim.scale },
                  { rotate: rotation },
                ],
                opacity: anim.opacity,
              },
            ]}
          />
        );
      })}

      {/* Sparkle trails for levelUp */}
      {variant === 'levelUp' && (
        <>
          {[0, 1, 2, 3].map(i => (
            <Animated.View
              key={`trail-${i}`}
              style={[
                styles.trail,
                {
                  backgroundColor: getVariantColor(),
                  transform: [
                    { 
                      translateX: animations[0].position.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, Math.cos(Math.PI * 0.5 * i) * 120],
                      })
                    },
                    { 
                      translateY: animations[0].position.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, Math.sin(Math.PI * 0.5 * i) * 120],
                      })
                    },
                    { 
                      scaleX: animations[0].position.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 1, 0],
                      })
                    },
                  ],
                  opacity: animations[0].opacity,
                },
              ]}
            />
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  particle: {
    position: 'absolute',
  },
  ring: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    marginLeft: -30,
    marginTop: -30,
  },
  trail: {
    position: 'absolute',
    width: 40,
    height: 3,
    borderRadius: 2,
    marginLeft: -20,
    marginTop: -1.5,
  },
});

export default SuccessExplosion;
