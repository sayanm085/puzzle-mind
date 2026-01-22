// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 SPATIAL UI COMPONENTS - Dimensional Interface Elements
// UI feels spatial, not flat. Menus feel like entering dimensions.
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { visualEngine, CINEMATIC_EASING } from '../engine/VisualEngine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// BREATHING BACKGROUND - The universe always moves
// ─────────────────────────────────────────────────────────────────────────────────

interface BreathingBackgroundProps {
  primaryColor: string;
  secondaryColor: string;
  intensity?: number;
  children?: React.ReactNode;
}

export const BreathingBackground: React.FC<BreathingBackgroundProps> = ({
  primaryColor,
  secondaryColor,
  intensity = 0.5,
  children,
}) => {
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Main breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 4000,
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 4000,
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Secondary pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: CINEMATIC_EASING.smoothInOut,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2500,
          easing: CINEMATIC_EASING.smoothInOut,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const scale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1 + intensity * 0.1],
  });
  
  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.5],
  });
  
  return (
    <View style={styles.backgroundContainer}>
      <LinearGradient
        colors={[primaryColor, secondaryColor, '#000000']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[
          styles.breathingOverlay,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <LinearGradient
          colors={[primaryColor + '40', 'transparent', primaryColor + '20']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
      {children}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// VOID PARTICLES - Floating ambient elements
// ─────────────────────────────────────────────────────────────────────────────────

interface VoidParticlesProps {
  count?: number;
  color?: string;
  speed?: number;
}

export const VoidParticles: React.FC<VoidParticlesProps> = ({
  count = 50,
  color = '#FFFFFF',
  speed = 1,
}) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT,
      size: 1 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.4,
      speed: (0.5 + Math.random()) * speed,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count, speed]);
  
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map(particle => (
        <VoidParticle key={particle.id} {...particle} color={color} />
      ))}
    </View>
  );
};

const VoidParticle: React.FC<{
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
  color: string;
}> = ({ x, y, size, opacity, speed, phase, color }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(opacity)).current;
  
  useEffect(() => {
    // Vertical drift
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -30 * speed,
          duration: 8000 / speed,
          easing: CINEMATIC_EASING.smoothInOut,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 30 * speed,
          duration: 8000 / speed,
          easing: CINEMATIC_EASING.smoothInOut,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Horizontal drift
    Animated.loop(
      Animated.sequence([
        Animated.delay(phase * 1000),
        Animated.timing(translateX, {
          toValue: 15 * speed,
          duration: 12000 / speed,
          easing: CINEMATIC_EASING.smoothInOut,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -15 * speed,
          duration: 12000 / speed,
          easing: CINEMATIC_EASING.smoothInOut,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Opacity pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: opacity * 1.5,
          duration: 3000,
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: opacity * 0.5,
          duration: 3000,
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.voidParticle,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: opacityAnim,
          transform: [{ translateX }, { translateY }],
        },
      ]}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// DIMENSIONAL BUTTON - Interactive elements with depth
// ─────────────────────────────────────────────────────────────────────────────────

interface DimensionalButtonProps {
  title: string;
  subtitle?: string;
  icon?: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  glow?: boolean;
}

export const DimensionalButton: React.FC<DimensionalButtonProps> = ({
  title,
  subtitle,
  icon,
  color,
  onPress,
  disabled = false,
  size = 'medium',
  glow = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const pressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (glow && !disabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 2000,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [glow, disabled]);
  
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(pressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(pressAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const sizeStyles = {
    small: { paddingVertical: 12, paddingHorizontal: 20, minWidth: 100 },
    medium: { paddingVertical: 18, paddingHorizontal: 32, minWidth: 160 },
    large: { paddingVertical: 24, paddingHorizontal: 48, minWidth: 220 },
  };
  
  const fontSizes = {
    small: { title: 14, subtitle: 10 },
    medium: { title: 18, subtitle: 12 },
    large: { title: 24, subtitle: 14 },
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.dimensionalButton,
          sizeStyles[size],
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        {/* Glow layer */}
        {glow && !disabled && (
          <Animated.View
            style={[
              styles.buttonGlow,
              {
                backgroundColor: color,
                opacity: glowAnim.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: [0.1, 0.25],
                }),
              },
            ]}
          />
        )}
        
        {/* Border gradient */}
        <LinearGradient
          colors={[color + '80', color + '20', color + '40']}
          style={styles.buttonBorder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Content */}
        <View style={styles.buttonContent}>
          {icon && <Text style={styles.buttonIcon}>{icon}</Text>}
          <View>
            <Text style={[styles.buttonTitle, { fontSize: fontSizes[size].title, color }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.buttonSubtitle, { fontSize: fontSizes[size].subtitle }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        {/* Press overlay */}
        <Animated.View
          style={[
            styles.buttonPressOverlay,
            {
              backgroundColor: color,
              opacity: pressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2],
              }),
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// GLOWING TEXT - Typography with presence
// ─────────────────────────────────────────────────────────────────────────────────

interface GlowingTextProps {
  children: string;
  color?: string;
  size?: number;
  weight?: 'light' | 'normal' | 'bold';
  glow?: boolean;
  style?: TextStyle;
}

export const GlowingText: React.FC<GlowingTextProps> = ({
  children,
  color = '#FFFFFF',
  size = 16,
  weight = 'normal',
  glow = true,
  style,
}) => {
  const fontWeight = {
    light: '300' as const,
    normal: '400' as const,
    bold: '700' as const,
  };
  
  return (
    <Text
      style={[
        {
          color,
          fontSize: size,
          fontWeight: fontWeight[weight],
          letterSpacing: 2,
          textTransform: 'uppercase',
          textShadowColor: glow ? color : 'transparent',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: glow ? 10 : 0,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// SECTION DIVIDER - Visual hierarchy with motion
// ─────────────────────────────────────────────────────────────────────────────────

interface SectionDividerProps {
  color?: string;
  animated?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  color = '#FFFFFF',
  animated = true,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          easing: CINEMATIC_EASING.smoothInOut,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [animated]);
  
  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });
  
  return (
    <View style={styles.dividerContainer}>
      <View style={[styles.dividerLine, { backgroundColor: color + '30' }]} />
      {animated && (
        <Animated.View
          style={[
            styles.dividerShimmer,
            {
              backgroundColor: color,
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// FLOATING CARD - Information containers with depth
// ─────────────────────────────────────────────────────────────────────────────────

interface FloatingCardProps {
  children: React.ReactNode;
  color?: string;
  blur?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  color = '#FFFFFF',
  blur = 20,
  onPress,
  style,
}) => {
  const hoverAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(hoverAnim, {
          toValue: 1,
          duration: 3000,
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
        Animated.timing(hoverAnim, {
          toValue: 0,
          duration: 3000,
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const translateY = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });
  
  const content = (
    <Animated.View
      style={[
        styles.floatingCard,
        {
          borderColor: color + '30',
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <BlurView intensity={blur} style={StyleSheet.absoluteFill} tint="dark" />
      <LinearGradient
        colors={[color + '10', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.floatingCardContent}>{children}</View>
    </Animated.View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
};

// ─────────────────────────────────────────────────────────────────────────────────
// PROGRESS RING - Circular progress with glow
// ─────────────────────────────────────────────────────────────────────────────────

interface ProgressRingProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 100,
  strokeWidth = 4,
  color = '#00FFFF',
  backgroundColor = '#FFFFFF20',
  children,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  
  useEffect(() => {
    Animated.spring(animatedProgress, {
      toValue: progress,
      tension: 50,
      friction: 10,
      useNativeDriver: true,
    }).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [progress]);
  
  const rotation = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={[styles.progressRingContainer, { width: size, height: size }]}>
      {/* Background ring */}
      <View
        style={[
          styles.progressRingBg,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: backgroundColor,
          },
        ]}
      />
      
      {/* Progress arc (simplified visual) */}
      <Animated.View
        style={[
          styles.progressRingArc,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: 'transparent',
            borderRightColor: progress > 0.25 ? color : 'transparent',
            borderBottomColor: progress > 0.5 ? color : 'transparent',
            borderLeftColor: progress > 0.75 ? color : 'transparent',
            transform: [{ rotate: rotation }],
          },
        ]}
      />
      
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.progressRingGlow,
          {
            width: size + 10,
            height: size + 10,
            borderRadius: (size + 10) / 2,
            borderWidth: 2,
            borderColor: color,
            opacity: glowAnim.interpolate({
              inputRange: [0.5, 1],
              outputRange: [0.2, 0.5],
            }),
          },
        ]}
      />
      
      {/* Center content */}
      <View style={styles.progressRingCenter}>{children}</View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// SCREEN TRANSITION - Cinematic screen changes
// ─────────────────────────────────────────────────────────────────────────────────

interface ScreenTransitionProps {
  visible: boolean;
  type?: 'fade' | 'portal' | 'fold';
  duration?: number;
  children: React.ReactNode;
}

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  visible,
  type = 'fade',
  duration = 500,
  children,
}) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(visible ? 1 : 0.9)).current;
  const translateY = useRef(new Animated.Value(visible ? 0 : 50)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          easing: CINEMATIC_EASING.smoothOut,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          easing: CINEMATIC_EASING.heavyOut,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration * 0.7,
          easing: CINEMATIC_EASING.smoothIn,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: duration * 0.7,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 30,
          duration: duration * 0.7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  
  return (
    <Animated.View
      style={[
        styles.screenTransition,
        {
          opacity,
          transform: [{ scale }, { translateY }],
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {children}
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  breathingOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  voidParticle: {
    position: 'absolute',
  },
  dimensionalButton: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0A0A0A',
  },
  buttonGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  buttonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 1,
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonTitle: {
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
  },
  buttonSubtitle: {
    color: '#FFFFFF60',
    letterSpacing: 1,
    marginTop: 2,
    textAlign: 'center',
  },
  buttonPressOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  dividerContainer: {
    width: '100%',
    height: 1,
    overflow: 'hidden',
    marginVertical: 20,
  },
  dividerLine: {
    ...StyleSheet.absoluteFillObject,
  },
  dividerShimmer: {
    position: 'absolute',
    width: 100,
    height: '100%',
    opacity: 0.5,
  },
  floatingCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF05',
  },
  floatingCardContent: {
    padding: 20,
  },
  progressRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingBg: {
    position: 'absolute',
  },
  progressRingArc: {
    position: 'absolute',
  },
  progressRingGlow: {
    position: 'absolute',
  },
  progressRingCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTransition: {
    flex: 1,
  },
});

export default {
  BreathingBackground,
  VoidParticles,
  DimensionalButton,
  GlowingText,
  SectionDivider,
  FloatingCard,
  ProgressRing,
  ScreenTransition,
};
