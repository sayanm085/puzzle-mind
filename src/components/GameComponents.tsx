// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 CORE GAME COMPONENTS - Objects with Mass, Inertia, Life
// "Objects have mass, inertia, resistance. Motion uses cinematic easing, never linear.
//  Idle animation everywhere. Nothing flat. Nothing static. Everything breathes."
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { CINEMATIC_EASING, visualEngine } from '../engine/VisualEngine';
import { PhysicsProperties } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// PHYSICS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const PHYSICS = {
  DRAG_FRICTION: 0.92,
  SPRING_TENSION: 180,
  SPRING_FRICTION: 12,
  MASS_MULTIPLIER: 1.5,
  GRAVITY: 0.5,
  BOUNCE_DAMPENING: 0.7,
  ROTATION_RESISTANCE: 0.95,
};

// ─────────────────────────────────────────────────────────────────────────────────
// PUZZLE SHAPE - The core interactive element with physics
// ─────────────────────────────────────────────────────────────────────────────────

export type ShapeType = 'circle' | 'square' | 'triangle' | 'hexagon' | 'diamond' | 'star';

interface PuzzleShapeProps {
  id: string;
  type: ShapeType;
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  targetX?: number;
  targetY?: number;
  targetRotation?: number;
  mass?: number;
  isCorrect?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
  onDrop?: (id: string, x: number, y: number) => void;
  disabled?: boolean;
  showGlow?: boolean;
  glowIntensity?: number;
}

export const PuzzleShape: React.FC<PuzzleShapeProps> = ({
  id,
  type,
  color,
  size,
  initialX,
  initialY,
  targetX,
  targetY,
  targetRotation = 0,
  mass = 1,
  isCorrect = false,
  isSelected = false,
  onSelect,
  onDragStart,
  onDragEnd,
  onDrop,
  disabled = false,
  showGlow = true,
  glowIntensity = 0.5,
}) => {
  // Animation values
  const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const shadowScale = useRef(new Animated.Value(1)).current;
  
  // Velocity tracking for momentum
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPanRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  
  // Entrance animation
  useEffect(() => {
    Animated.sequence([
      Animated.delay(Math.random() * 300),
      Animated.parallel([
        Animated.spring(opacity, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Idle breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 3000 + Math.random() * 1000,
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 3000 + Math.random() * 1000,
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  // Selected state animation
  useEffect(() => {
    if (isSelected) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.5,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      Animated.spring(scale, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }).start();
      glowAnim.setValue(0);
    }
  }, [isSelected]);
  
  // Correct state celebration
  useEffect(() => {
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.sequence([
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.3,
              duration: 150,
              easing: CINEMATIC_EASING.dramaticOut,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1,
              tension: 200,
              friction: 8,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCorrect]);
  
  // Pan responder for drag with physics
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      
      onPanResponderGrant: () => {
        isDragging.current = true;
        onDragStart?.(id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        // Lift animation with physics feel
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.15,
            tension: PHYSICS.SPRING_TENSION * mass,
            friction: PHYSICS.SPRING_FRICTION,
            useNativeDriver: true,
          }),
          Animated.timing(shadowScale, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        
        lastPanRef.current = { x: 0, y: 0 };
      },
      
      onPanResponderMove: (_, gestureState) => {
        // Track velocity for momentum
        const dx = gestureState.dx - lastPanRef.current.x;
        const dy = gestureState.dy - lastPanRef.current.y;
        velocityRef.current = { x: dx, y: dy };
        lastPanRef.current = { x: gestureState.dx, y: gestureState.dy };
        
        // Apply movement with mass resistance
        const resistedDx = gestureState.dx / (1 + (mass - 1) * 0.1);
        const resistedDy = gestureState.dy / (1 + (mass - 1) * 0.1);
        
        position.setValue({
          x: initialX + resistedDx,
          y: initialY + resistedDy,
        });
        
        // Subtle rotation based on velocity
        const velocityRotation = dx * 0.002;
        rotation.setValue(velocityRotation);
      },
      
      onPanResponderRelease: (_, gestureState) => {
        isDragging.current = false;
        
        const finalX = initialX + gestureState.dx;
        const finalY = initialY + gestureState.dy;
        
        onDragEnd?.(id, finalX, finalY);
        
        // Apply momentum
        const momentum = Math.sqrt(
          velocityRef.current.x ** 2 + velocityRef.current.y ** 2
        );
        
        if (momentum > 5) {
          Animated.sequence([
            Animated.timing(position, {
              toValue: {
                x: finalX + velocityRef.current.x * PHYSICS.MASS_MULTIPLIER * (2 - mass * 0.5),
                y: finalY + velocityRef.current.y * PHYSICS.MASS_MULTIPLIER * (2 - mass * 0.5),
              },
              duration: 200,
              easing: CINEMATIC_EASING.heavyOut,
              useNativeDriver: true,
            }),
            Animated.spring(position, {
              toValue: { x: finalX, y: finalY },
              tension: 100,
              friction: 10,
              useNativeDriver: true,
            }),
          ]).start();
        }
        
        // Drop animation with bounce
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1,
              tension: 300 * mass,
              friction: 8,
              useNativeDriver: true,
            }),
          ]),
          Animated.spring(shadowScale, {
            toValue: 1,
            tension: 200,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.spring(rotation, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
        
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onDrop?.(id, finalX, finalY);
      },
    })
  ).current;
  
  // Combined scale with breathing
  const combinedScale = Animated.add(
    scale,
    Animated.multiply(breatheAnim, 0.02)
  );
  
  // Rotation in degrees
  const rotationDegrees = rotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });
  
  return (
    <Animated.View
      style={[
        styles.shapeContainer,
        {
          width: size,
          height: size,
          opacity,
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { scale: combinedScale },
            { rotate: rotationDegrees },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Shadow layer */}
      <Animated.View
        style={[
          styles.shapeShadow,
          {
            width: size * 0.9,
            height: size * 0.2,
            transform: [
              { translateY: size * 0.4 },
              { scaleX: shadowScale },
            ],
          },
        ]}
      />
      
      {/* Glow layer */}
      {showGlow && (
        <Animated.View
          style={[
            styles.shapeGlow,
            {
              width: size * 1.4,
              height: size * 1.4,
              borderRadius: size * 0.7,
              backgroundColor: color,
              opacity: Animated.add(
                Animated.multiply(glowAnim, glowIntensity),
                isCorrect ? 0.3 : 0
              ),
            },
          ]}
        />
      )}
      
      {/* Shape body */}
      <TouchableOpacity
        onPress={() => onSelect?.(id)}
        disabled={disabled}
        activeOpacity={1}
        style={[
          styles.shapeBody,
          { width: size, height: size },
        ]}
      >
        <ShapeRenderer
          type={type}
          size={size}
          color={color}
          isCorrect={isCorrect}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// SHAPE RENDERER - Renders different shape types
// ─────────────────────────────────────────────────────────────────────────────────

interface ShapeRendererProps {
  type: ShapeType;
  size: number;
  color: string;
  isCorrect?: boolean;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  type,
  size,
  color,
  isCorrect,
}) => {
  const innerSize = size * 0.85;
  
  const shapeStyle = {
    width: innerSize,
    height: innerSize,
    backgroundColor: color,
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isCorrect ? 0.8 : 0.4,
    shadowRadius: isCorrect ? 15 : 8,
    elevation: isCorrect ? 15 : 8,
  };
  
  switch (type) {
    case 'circle':
      return (
        <View style={[shapeStyle, { borderRadius: innerSize / 2 }]}>
          <LinearGradient
            colors={[color, adjustColor(color, -30)]}
            style={[StyleSheet.absoluteFill, { borderRadius: innerSize / 2 }]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
          />
          {/* Highlight */}
          <View
            style={[
              styles.shapeHighlight,
              {
                width: innerSize * 0.3,
                height: innerSize * 0.3,
                borderRadius: innerSize * 0.15,
                top: innerSize * 0.15,
                left: innerSize * 0.2,
              },
            ]}
          />
        </View>
      );
      
    case 'square':
      return (
        <View style={[shapeStyle, { borderRadius: innerSize * 0.15 }]}>
          <LinearGradient
            colors={[color, adjustColor(color, -30)]}
            style={[StyleSheet.absoluteFill, { borderRadius: innerSize * 0.15 }]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
          />
          <View
            style={[
              styles.shapeHighlight,
              {
                width: innerSize * 0.25,
                height: innerSize * 0.25,
                borderRadius: 4,
                top: innerSize * 0.15,
                left: innerSize * 0.15,
              },
            ]}
          />
        </View>
      );
      
    case 'triangle':
      return (
        <View style={[styles.triangleContainer, { width: innerSize, height: innerSize }]}>
          <View
            style={[
              styles.triangle,
              {
                borderLeftWidth: innerSize / 2,
                borderRightWidth: innerSize / 2,
                borderBottomWidth: innerSize * 0.85,
                borderBottomColor: color,
              },
            ]}
          />
          {/* Inner lighter triangle for gradient effect */}
          <View
            style={[
              styles.triangleInner,
              {
                borderLeftWidth: innerSize * 0.35,
                borderRightWidth: innerSize * 0.35,
                borderBottomWidth: innerSize * 0.6,
                borderBottomColor: adjustColor(color, 20),
                top: innerSize * 0.2,
              },
            ]}
          />
        </View>
      );
      
    case 'hexagon':
      return (
        <View style={[styles.hexagonContainer, { width: innerSize, height: innerSize }]}>
          <View style={[styles.hexagonBefore, { backgroundColor: color }]} />
          <View style={[styles.hexagonMain, { backgroundColor: color }]}>
            <LinearGradient
              colors={[adjustColor(color, 20), color]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
          <View style={[styles.hexagonAfter, { backgroundColor: color }]} />
        </View>
      );
      
    case 'diamond':
      return (
        <View
          style={[
            shapeStyle,
            {
              borderRadius: innerSize * 0.1,
              transform: [{ rotate: '45deg' }],
            },
          ]}
        >
          <LinearGradient
            colors={[color, adjustColor(color, -30)]}
            style={[StyleSheet.absoluteFill, { borderRadius: innerSize * 0.1 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
      );
      
    case 'star':
      return (
        <View style={[styles.starContainer, { width: innerSize, height: innerSize }]}>
          <Text style={[styles.starEmoji, { fontSize: innerSize * 0.8 }]}>★</Text>
          <View style={[styles.starOverlay, { backgroundColor: color }]} />
        </View>
      );
      
    default:
      return <View style={[shapeStyle, { borderRadius: innerSize / 2 }]} />;
  }
};

// ─────────────────────────────────────────────────────────────────────────────────
// TARGET ZONE - Where shapes should be placed
// ─────────────────────────────────────────────────────────────────────────────────

interface TargetZoneProps {
  id: string;
  type: ShapeType;
  size: number;
  x: number;
  y: number;
  color: string;
  isOccupied?: boolean;
  isHighlighted?: boolean;
  onHover?: (id: string) => void;
}

export const TargetZone: React.FC<TargetZoneProps> = ({
  id,
  type,
  size,
  x,
  y,
  color,
  isOccupied = false,
  isHighlighted = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Subtle pulse when empty
    if (!isOccupied) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 2000,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isOccupied]);
  
  useEffect(() => {
    if (isHighlighted) {
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isHighlighted]);
  
  const borderOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });
  
  return (
    <Animated.View
      style={[
        styles.targetZone,
        {
          width: size,
          height: size,
          left: x - size / 2,
          top: y - size / 2,
          borderColor: color,
          borderRadius: type === 'circle' ? size / 2 : size * 0.15,
          opacity: isOccupied ? 0 : 1,
        },
      ]}
    >
      {/* Glow when highlighted */}
      <Animated.View
        style={[
          styles.targetGlow,
          {
            backgroundColor: color,
            borderRadius: type === 'circle' ? size / 2 : size * 0.15,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
          },
        ]}
      />
      
      {/* Dashed border effect using multiple views */}
      <Animated.View
        style={[
          styles.targetBorder,
          {
            borderColor: color,
            borderRadius: type === 'circle' ? size / 2 : size * 0.15,
            opacity: borderOpacity,
          },
        ]}
      />
      
      {/* Shape outline hint */}
      <View style={styles.targetHint}>
        <ShapeOutline type={type} size={size * 0.6} color={color} />
      </View>
    </Animated.View>
  );
};

// Shape outline (just the border)
const ShapeOutline: React.FC<{ type: ShapeType; size: number; color: string }> = ({
  type,
  size,
  color,
}) => {
  const style = {
    width: size,
    height: size,
    borderWidth: 2,
    borderColor: color + '40',
    backgroundColor: 'transparent',
  };
  
  switch (type) {
    case 'circle':
      return <View style={[style, { borderRadius: size / 2 }]} />;
    case 'square':
      return <View style={[style, { borderRadius: size * 0.1 }]} />;
    case 'diamond':
      return <View style={[style, { borderRadius: size * 0.1, transform: [{ rotate: '45deg' }] }]} />;
    default:
      return <View style={[style, { borderRadius: size / 2 }]} />;
  }
};

// ─────────────────────────────────────────────────────────────────────────────────
// TIMER DISPLAY - Cinematic countdown
// ─────────────────────────────────────────────────────────────────────────────────

interface TimerDisplayProps {
  seconds: number;
  maxSeconds: number;
  color?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  seconds,
  maxSeconds,
  color = '#00FFFF',
  warningThreshold = 10,
  criticalThreshold = 5,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const isCritical = seconds <= criticalThreshold;
  const isWarning = seconds <= warningThreshold;
  
  useEffect(() => {
    if (isCritical) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
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
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isCritical]);
  
  const displayColor = isCritical ? '#FF4444' : isWarning ? '#FFE66D' : color;
  const progress = seconds / maxSeconds;
  
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeString = minutes > 0
    ? `${minutes}:${secs.toString().padStart(2, '0')}`
    : secs.toString();
  
  return (
    <Animated.View
      style={[
        styles.timerContainer,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      {/* Glow */}
      <Animated.View
        style={[
          styles.timerGlow,
          {
            backgroundColor: displayColor,
            opacity: glowAnim,
          },
        ]}
      />
      
      {/* Progress arc background */}
      <View style={[styles.timerRing, { borderColor: displayColor + '30' }]} />
      
      {/* Progress arc */}
      <View
        style={[
          styles.timerProgress,
          {
            borderColor: displayColor,
            borderTopColor: 'transparent',
            borderRightColor: progress > 0.25 ? displayColor : 'transparent',
            borderBottomColor: progress > 0.5 ? displayColor : 'transparent',
            borderLeftColor: progress > 0.75 ? displayColor : 'transparent',
            transform: [{ rotate: `${progress * 360}deg` }],
          },
        ]}
      />
      
      {/* Time display */}
      <Text style={[styles.timerText, { color: displayColor }]}>
        {timeString}
      </Text>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// SCORE DISPLAY - Animated score counter
// ─────────────────────────────────────────────────────────────────────────────────

interface ScoreDisplayProps {
  score: number;
  multiplier?: number;
  color?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  multiplier = 1,
  color = '#FFE66D',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const prevScoreRef = useRef(score);
  
  useEffect(() => {
    if (score !== prevScoreRef.current) {
      // Score changed - animate
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 300,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      
      prevScoreRef.current = score;
    }
  }, [score]);
  
  return (
    <Animated.View
      style={[
        styles.scoreContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Glow */}
      <Animated.View
        style={[
          styles.scoreGlow,
          {
            backgroundColor: color,
            opacity: Animated.multiply(glowAnim, 0.3),
          },
        ]}
      />
      
      {/* Score */}
      <Text style={[styles.scoreText, { color }]}>
        {score.toLocaleString()}
      </Text>
      
      {/* Multiplier */}
      {multiplier > 1 && (
        <View style={styles.multiplierContainer}>
          <Text style={[styles.multiplierText, { color }]}>
            ×{multiplier}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// COMBO DISPLAY - Streak visualization
// ─────────────────────────────────────────────────────────────────────────────────

interface ComboDisplayProps {
  streak: number;
  color?: string;
}

export const ComboDisplay: React.FC<ComboDisplayProps> = ({
  streak,
  color = '#FF6B6B',
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (streak > 0) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 300,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -1, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0.5, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]),
      ]).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [streak]);
  
  const translateX = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-5, 0, 5],
  });
  
  if (streak < 2) return null;
  
  return (
    <Animated.View
      style={[
        styles.comboContainer,
        {
          opacity: scaleAnim,
          transform: [{ scale: scaleAnim }, { translateX }],
        },
      ]}
    >
      <LinearGradient
        colors={[color + '40', color + '10']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text style={[styles.comboText, { color }]}>
        {streak}× COMBO
      </Text>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

function adjustColor(hex: string, amount: number): string {
  const clamp = (val: number) => Math.min(255, Math.max(0, val));
  
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  
  const r = clamp(parseInt(color.substr(0, 2), 16) + amount);
  const g = clamp(parseInt(color.substr(2, 2), 16) + amount);
  const b = clamp(parseInt(color.substr(4, 2), 16) + amount);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  shapeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeShadow: {
    position: 'absolute',
    backgroundColor: '#000000',
    opacity: 0.3,
    borderRadius: 50,
  },
  shapeGlow: {
    position: 'absolute',
  },
  shapeBody: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeHighlight: {
    position: 'absolute',
    backgroundColor: '#FFFFFF40',
  },
  triangleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  triangleInner: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  hexagonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagonMain: {
    width: '60%',
    height: '100%',
  },
  hexagonBefore: {
    position: 'absolute',
    left: 0,
    width: '50%',
    height: '50%',
    transform: [{ rotate: '-60deg' }],
  },
  hexagonAfter: {
    position: 'absolute',
    right: 0,
    width: '50%',
    height: '50%',
    transform: [{ rotate: '60deg' }],
  },
  starContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starEmoji: {
    color: '#FFE66D',
  },
  starOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  targetZone: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  targetGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  targetBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
  },
  targetHint: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  timerRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
  },
  timerProgress: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  scoreContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scoreGlow: {
    position: 'absolute',
    width: '120%',
    height: '150%',
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  multiplierContainer: {
    position: 'absolute',
    right: -10,
    top: -5,
  },
  multiplierText: {
    fontSize: 14,
    fontWeight: '700',
  },
  comboContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF20',
  },
  comboText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

export default {
  PuzzleShape,
  TargetZone,
  TimerDisplay,
  ScoreDisplay,
  ComboDisplay,
};
