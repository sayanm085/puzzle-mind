// ═══════════════════════════════════════════════════════════════════════════════
// ✨ AMBIENT PARTICLES - Floating Background Animation
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Particle } from '../types';
import { COLORS } from '../constants/colors';

const { width: W, height: H } = Dimensions.get('window');

interface AmbientParticlesProps {
  count?: number;
  color?: string;
  speed?: number;
  intensity?: number;
}

function generateParticle(index: number): Particle {
  return {
    id: index,
    x: Math.random() * W,
    y: Math.random() * H,
    size: 2 + Math.random() * 4,
    opacity: 0.1 + Math.random() * 0.4,
    speed: 0.5 + Math.random() * 1.5,
    angle: Math.random() * Math.PI * 2,
    color: [
      COLORS.cyan,
      COLORS.violet,
      COLORS.magenta,
      COLORS.gold,
      COLORS.rose,
    ][Math.floor(Math.random() * 5)],
  };
}

const AmbientParticles: React.FC<AmbientParticlesProps> = ({
  count = 30,
  speed = 1,
  intensity = 1,
}) => {
  const particles = useRef<Particle[]>([]);
  const animations = useRef<{ x: Animated.Value; y: Animated.Value; opacity: Animated.Value }[]>([]);

  useEffect(() => {
    // Initialize particles
    particles.current = Array.from({ length: count }, (_, i) => generateParticle(i));
    
    // Initialize animations
    animations.current = particles.current.map(p => ({
      x: new Animated.Value(p.x),
      y: new Animated.Value(p.y),
      opacity: new Animated.Value(p.opacity * intensity),
    }));

    // Animate each particle
    particles.current.forEach((particle, index) => {
      animateParticle(index);
    });

    return () => {
      animations.current.forEach(anim => {
        anim.x.stopAnimation();
        anim.y.stopAnimation();
        anim.opacity.stopAnimation();
      });
    };
  }, [count, speed, intensity]);

  const animateParticle = (index: number) => {
    const particle = particles.current[index];
    const anim = animations.current[index];
    if (!particle || !anim) return;

    const duration = (4000 + Math.random() * 4000) / speed;
    
    // Calculate new position
    const dx = Math.cos(particle.angle) * 100;
    const dy = Math.sin(particle.angle) * 100 - 50; // Slight upward drift
    
    const newX = ((particle.x + dx) % W + W) % W;
    const newY = ((particle.y + dy) % H + H) % H;

    Animated.parallel([
      Animated.timing(anim.x, {
        toValue: newX,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(anim.y, {
        toValue: newY,
        duration,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(anim.opacity, {
          toValue: (0.3 + Math.random() * 0.4) * intensity,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 0.1 * intensity,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      particle.x = newX;
      particle.y = newY;
      particle.angle = Math.random() * Math.PI * 2;
      animateParticle(index);
    });
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.current.map((particle, index) => {
        const anim = animations.current[index];
        if (!anim) return null;

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                width: particle.size,
                height: particle.size,
                borderRadius: particle.size / 2,
                backgroundColor: particle.color,
                transform: [
                  { translateX: anim.x },
                  { translateY: anim.y },
                ],
                opacity: anim.opacity,
                shadowColor: particle.color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: particle.size * 2,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
});

export default AmbientParticles;
