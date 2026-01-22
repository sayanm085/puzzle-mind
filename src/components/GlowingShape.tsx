// ═══════════════════════════════════════════════════════════════════════════════
// 💎 GLOWING SHAPE - Interactive Shape Component with Effects
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, memo } from 'react';
import { Animated, StyleSheet, TouchableOpacity, Easing, View } from 'react-native';
import { Shape } from '../types';

interface GlowingShapeProps {
  shape: Shape;
  onPress: (shape: Shape) => void;
  disabled?: boolean;
  highlighted?: boolean;
  showCorrect?: boolean;
  showWrong?: boolean;
}

const GlowingShape: React.FC<GlowingShapeProps> = memo(({
  shape,
  onPress,
  disabled = false,
  highlighted = false,
  showCorrect = false,
  showWrong = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const positionX = useRef(new Animated.Value(0)).current;
  const positionY = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flickerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
      delay: (typeof shape.id === 'number' ? shape.id : 0) * 50,
    }).start();

    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500 + Math.random() * 500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500 + Math.random() * 500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation if rotating
    if (shape.isRotating) {
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }

    // Movement animation if moving
    if (shape.isMoving) {
      const animateMovement = () => {
        Animated.sequence([
          Animated.timing(positionX, {
            toValue: (Math.random() - 0.5) * 40,
            duration: 2000 + Math.random() * 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(positionY, {
            toValue: (Math.random() - 0.5) * 40,
            duration: 2000 + Math.random() * 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]).start(() => animateMovement());
      };
      animateMovement();
    }

    // Pulse animation
    if (shape.isPulsing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Flicker animation
    if (shape.isFlickering) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flickerAnim, {
            toValue: 0.3,
            duration: 100 + Math.random() * 200,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 1,
            duration: 100 + Math.random() * 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [shape]);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderShapePath = () => {
    const { size, type, color } = shape;
    const baseStyle = {
      width: size,
      height: size,
      backgroundColor: color.hex,
      shadowColor: color.hex,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: size * 0.4,
    };

    switch (type) {
      case 'circle':
        return <View style={[baseStyle, { borderRadius: size / 2 }]} />;
      
      case 'square':
        return <View style={[baseStyle, { borderRadius: size * 0.1 }]} />;
      
      case 'triangle':
        return (
          <View style={{
            width: 0,
            height: 0,
            borderLeftWidth: size / 2,
            borderRightWidth: size / 2,
            borderBottomWidth: size,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color.hex,
            shadowColor: color.hex,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: size * 0.3,
          }} />
        );
      
      case 'diamond':
        return (
          <View style={{
            width: size * 0.7,
            height: size * 0.7,
            backgroundColor: color.hex,
            transform: [{ rotate: '45deg' }],
            shadowColor: color.hex,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: size * 0.3,
          }} />
        );
      
      case 'hexagon':
        return (
          <View style={{
            width: size,
            height: size * 0.6,
            backgroundColor: color.hex,
            borderRadius: size * 0.1,
            shadowColor: color.hex,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: size * 0.3,
          }} />
        );
      
      case 'star':
        return (
          <View style={[baseStyle, { 
            borderRadius: size * 0.15,
            transform: [{ rotate: '45deg' }],
          }]} />
        );
      
      case 'pentagon':
        return <View style={[baseStyle, { borderRadius: size * 0.3 }]} />;
      
      case 'octagon':
        return <View style={[baseStyle, { borderRadius: size * 0.2 }]} />;
      
      default:
        return <View style={[baseStyle, { borderRadius: size / 2 }]} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: shape.x - shape.size / 2,
          top: shape.y - shape.size / 2,
          transform: [
            { translateX: positionX },
            { translateY: positionY },
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
            { rotate: rotation },
          ],
          opacity: flickerAnim,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => !disabled && onPress(shape)}
        activeOpacity={0.7}
        disabled={disabled}
        style={[
          styles.touchable,
          highlighted && styles.highlighted,
          showCorrect && styles.correct,
          showWrong && styles.wrong,
        ]}
      >
        <Animated.View
          style={{
            opacity: glowAnim,
          }}
        >
          {renderShapePath()}
        </Animated.View>
        
        {/* Glow ring */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              width: shape.size + 20,
              height: shape.size + 20,
              borderRadius: (shape.size + 20) / 2,
              borderColor: shape.color.hex,
              opacity: Animated.multiply(glowAnim, 0.4),
            },
          ]}
        />
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  highlighted: {
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 50,
  },
  correct: {
    borderWidth: 4,
    borderColor: '#00FF88',
    borderRadius: 50,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  wrong: {
    borderWidth: 4,
    borderColor: '#FF0066',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 0, 102, 0.2)',
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 2,
  },
});

export default GlowingShape;
