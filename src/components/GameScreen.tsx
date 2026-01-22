// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 GAME SCREEN - The Actual Gameplay Experience
// Where cognitive challenges become reality
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { CINEMATIC_EASING } from '../engine/VisualEngine';
import { BreathingBackground, VoidParticles } from './SpatialUI';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface GameShape {
  id: string;
  type: 'circle' | 'square' | 'triangle' | 'hexagon' | 'diamond';
  color: string;
  x: number;
  y: number;
  size: number;
  isTarget: boolean;
}

interface GameScreenProps {
  sectorId: string;
  chamberId: string;
  sectorColor: string;
  onComplete: (score: number, accuracy: number) => void;
  onExit: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SHAPE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface ShapeProps {
  shape: GameShape;
  onTap: () => void;
  isCorrect: boolean | null;
}

const Shape: React.FC<ShapeProps> = ({ shape, onTap, isCorrect }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Simple entrance animation - no pulsing
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, []);
  
  useEffect(() => {
    if (isCorrect !== null) {
      // Feedback animation
      Animated.sequence([
        Animated.timing(feedbackAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(feedbackAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCorrect]);
  
  const renderShape = () => {
    const baseStyle = {
      width: shape.size,
      height: shape.size,
    };
    
    switch (shape.type) {
      case 'circle':
        return (
          <View style={[baseStyle, {
            borderRadius: shape.size / 2,
            backgroundColor: shape.color,
          }]} />
        );
      case 'square':
        return (
          <View style={[baseStyle, {
            borderRadius: 8,
            backgroundColor: shape.color,
          }]} />
        );
      case 'triangle':
        return (
          <View style={{
            width: 0,
            height: 0,
            borderLeftWidth: shape.size / 2,
            borderRightWidth: shape.size / 2,
            borderBottomWidth: shape.size,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: shape.color,
          }} />
        );
      case 'diamond':
        return (
          <View style={[baseStyle, {
            transform: [{ rotate: '45deg' }],
            borderRadius: 4,
            backgroundColor: shape.color,
          }]} />
        );
      case 'hexagon':
        return (
          <View style={[baseStyle, {
            borderRadius: shape.size / 4,
            backgroundColor: shape.color,
          }]} />
        );
      default:
        return (
          <View style={[baseStyle, {
            borderRadius: shape.size / 2,
            backgroundColor: shape.color,
          }]} />
        );
    }
  };
  
  const feedbackColor = isCorrect === true ? '#00FF88' : isCorrect === false ? '#FF4444' : 'transparent';
  
  return (
    <TouchableOpacity
      onPress={onTap}
      activeOpacity={0.8}
      style={[
        styles.shapeContainer,
        {
          left: shape.x - shape.size / 2,
          top: shape.y - shape.size / 2,
        },
      ]}
    >
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnim },
          ],
        }}
      >
        {/* Glow effect - subtle to avoid visual overlap */}
        <View style={[
          styles.shapeGlow,
          {
            backgroundColor: shape.color,
            width: shape.size * 1.25,
            height: shape.size * 1.25,
            borderRadius: shape.size * 0.625,
            opacity: 0.2,
            position: 'absolute',
            left: -shape.size * 0.125,
            top: -shape.size * 0.125,
          },
        ]} />
        
        {/* Shape */}
        {renderShape()}
        
        {/* Feedback ring */}
        <Animated.View
          style={[
            styles.feedbackRing,
            {
              width: shape.size + 20,
              height: shape.size + 20,
              borderRadius: (shape.size + 20) / 2,
              borderColor: feedbackColor,
              opacity: feedbackAnim,
              transform: [{
                scale: feedbackAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5],
                }),
              }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// TIMER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface TimerProps {
  timeLeft: number;
  maxTime: number;
  color: string;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, maxTime, color }) => {
  const progress = timeLeft / maxTime;
  const isLow = progress < 0.3;
  
  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerBar}>
        <Animated.View
          style={[
            styles.timerFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: isLow ? '#FF4444' : color,
            },
          ]}
        />
      </View>
      <Text style={[styles.timerText, isLow && { color: '#FF4444' }]}>
        {Math.ceil(timeLeft / 1000)}s
      </Text>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN GAME SCREEN
// ─────────────────────────────────────────────────────────────────────────────────

export const GameScreen: React.FC<GameScreenProps> = ({
  sectorId,
  chamberId,
  sectorColor,
  onComplete,
  onExit,
}) => {
  // Game state
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shapes, setShapes] = useState<GameShape[]>([]);
  const [targetType, setTargetType] = useState<string>('circle');
  const [timeLeft, setTimeLeft] = useState(10000);
  const [feedback, setFeedback] = useState<{ id: string; correct: boolean } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  
  const MAX_ROUNDS = 10;
  const ROUND_TIME = 10000;
  
  // Animations
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const roundAnim = useRef(new Animated.Value(0)).current;
  const comboAnim = useRef(new Animated.Value(1)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const roundCompleteAnim = useRef(new Animated.Value(0)).current;
  
  // Colors for shapes
  const shapeColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#7B68EE', '#00FFFF', '#FF69B4'];
  const shapeTypes: Array<'circle' | 'square' | 'triangle' | 'diamond'> = ['circle', 'square', 'triangle', 'diamond'];
  
  // Generate shapes for a round
  const generateShapes = useCallback((roundNum: number) => {
    const numShapes = Math.min(5 + roundNum, 10); // Fewer shapes to reduce overlap
    const targetCount = Math.max(2, Math.floor(numShapes * 0.35)); // More targets
    const newTargetType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    setTargetType(newTargetType);
    
    const gameArea = {
      x: 50,
      y: 280, // More space from top for instructions
      width: SCREEN_WIDTH - 100,
      height: SCREEN_HEIGHT - 500,
    };
    
    const newShapes: GameShape[] = [];
    const minSpacing = 100; // Minimum distance between shape centers
    
    // First, place target shapes to guarantee they exist
    for (let i = 0; i < targetCount; i++) {
      const size = 55 + Math.random() * 20;
      
      // Find non-overlapping position with more attempts
      let x: number = 0;
      let y: number = 0;
      let attempts = 0;
      let placed = false;
      
      while (attempts < 100 && !placed) {
        x = gameArea.x + Math.random() * (gameArea.width - size);
        y = gameArea.y + Math.random() * (gameArea.height - size);
        attempts++;
        
        // Check if far enough from all existing shapes
        const tooClose = newShapes.some(s => {
          const dist = Math.sqrt(Math.pow(s.x - x, 2) + Math.pow(s.y - y, 2));
          return dist < minSpacing;
        });
        
        if (!tooClose) {
          placed = true;
        }
      }
      
      // Place even if not ideal after max attempts
      newShapes.push({
        id: `shape_target_${i}_${Date.now()}`,
        type: newTargetType,
        color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
        x,
        y,
        size,
        isTarget: true,
      });
    }
    
    // Then place distractor shapes
    const distractorTypes = shapeTypes.filter(t => t !== newTargetType);
    const distractorCount = numShapes - targetCount;
    
    for (let i = 0; i < distractorCount; i++) {
      const size = 55 + Math.random() * 20;
      
      let x: number = 0;
      let y: number = 0;
      let attempts = 0;
      let placed = false;
      
      while (attempts < 100 && !placed) {
        x = gameArea.x + Math.random() * (gameArea.width - size);
        y = gameArea.y + Math.random() * (gameArea.height - size);
        attempts++;
        
        const tooClose = newShapes.some(s => {
          const dist = Math.sqrt(Math.pow(s.x - x, 2) + Math.pow(s.y - y, 2));
          return dist < minSpacing;
        });
        
        if (!tooClose) {
          placed = true;
        }
      }
      
      newShapes.push({
        id: `shape_distract_${i}_${Date.now()}`,
        type: distractorTypes[Math.floor(Math.random() * distractorTypes.length)],
        color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
        x,
        y,
        size,
        isTarget: false,
      });
    }
    
    // Shuffle to mix targets with distractors
    return newShapes.sort(() => Math.random() - 0.5);
  }, []);
  
  // Initialize
  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 800,
      easing: CINEMATIC_EASING.heavyOut,
      useNativeDriver: true,
    }).start();
    
    setShapes(generateShapes(1));
  }, []);
  
  // Timer
  useEffect(() => {
    if (isComplete) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          // Time's up - move to next round
          handleNextRound();
          return ROUND_TIME;
        }
        return prev - 100;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [round, isComplete]);
  
  // Handle shape tap
  const handleShapeTap = useCallback((shape: GameShape) => {
    if (isComplete) return;
    
    setTotalTaps(prev => prev + 1);
    setFeedback({ id: shape.id, correct: shape.isTarget });
    
    if (shape.isTarget) {
      // Correct!
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const basePoints = 100;
      const comboBonus = combo * 20;
      const timeBonus = Math.floor((timeLeft / ROUND_TIME) * 50);
      const points = basePoints + comboBonus + timeBonus;
      
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setTotalCorrect(prev => prev + 1);
      
      // Animate score
      Animated.sequence([
        Animated.timing(scoreAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(scoreAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
      
      // Animate combo
      Animated.sequence([
        Animated.spring(comboAnim, { toValue: 1.3, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(comboAnim, { toValue: 1, tension: 100, friction: 10, useNativeDriver: true }),
      ]).start();
      
      // Remove shape
      setShapes(prev => prev.filter(s => s.id !== shape.id));
      
      // Check if all targets cleared
      setTimeout(() => {
        setShapes(prev => {
          const remainingTargets = prev.filter(s => s.isTarget);
          if (remainingTargets.length === 0) {
            // Show round complete message
            setShowRoundComplete(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Animate round complete
            Animated.sequence([
              Animated.timing(roundCompleteAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.delay(800),
              Animated.timing(roundCompleteAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setShowRoundComplete(false);
              handleNextRound();
            });
          }
          return prev;
        });
      }, 100);
      
    } else {
      // Wrong!
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setCombo(0);
    }
    
    // Clear feedback
    setTimeout(() => setFeedback(null), 300);
  }, [combo, timeLeft, isComplete]);
  
  // Handle next round
  const handleNextRound = useCallback(() => {
    if (round >= MAX_ROUNDS) {
      // Game complete
      setIsComplete(true);
      const accuracy = totalTaps > 0 ? (totalCorrect / totalTaps) * 100 : 0;
      setTimeout(() => onComplete(score, accuracy), 1500);
      return;
    }
    
    // Round transition
    Animated.sequence([
      Animated.timing(roundAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(roundAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
    
    setRound(prev => prev + 1);
    setTimeLeft(ROUND_TIME);
    setShapes(generateShapes(round + 1));
  }, [round, score, totalCorrect, totalTaps, onComplete, generateShapes]);
  
  // Render
  return (
    <BreathingBackground primaryColor="#0A0A1A" secondaryColor="#000005">
      <VoidParticles count={30} color={sectorColor} speed={0.3} />
      
      <Animated.View
        style={[
          styles.container,
          {
            opacity: entranceAnim,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onExit} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.roundInfo}>
            <Animated.Text
              style={[
                styles.roundText,
                {
                  transform: [{
                    scale: roundAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  }],
                },
              ]}
            >
              ROUND {round}/{MAX_ROUNDS}
            </Animated.Text>
          </View>
          
          <Animated.View
            style={[
              styles.scoreContainer,
              {
                transform: [{
                  scale: scoreAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  }),
                }],
              },
            ]}
          >
            <Text style={styles.scoreText}>{score}</Text>
          </Animated.View>
        </View>
        
        {/* Timer */}
        <Timer timeLeft={timeLeft} maxTime={ROUND_TIME} color={sectorColor} />
        
        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionLabel}>TAP ALL</Text>
          <View style={styles.targetPreview}>
            <View style={[
              styles.targetShape,
              targetType === 'circle' && styles.targetCircle,
              targetType === 'square' && styles.targetSquare,
              targetType === 'triangle' && styles.targetTriangle,
              targetType === 'diamond' && styles.targetDiamond,
              { backgroundColor: targetType === 'triangle' ? 'transparent' : sectorColor },
              targetType === 'triangle' && { borderBottomColor: sectorColor },
            ]} />
          </View>
          <Text style={[styles.instructionType, { color: sectorColor }]}>
            {targetType.toUpperCase()}S
          </Text>
          
          {/* Combo indicator - inline with instructions */}
          {combo > 0 && (
            <Animated.View
              style={[
                styles.comboInline,
                { transform: [{ scale: comboAnim }] },
              ]}
            >
              <Text style={[styles.comboText, { color: sectorColor }]}>
                ×{combo}
              </Text>
            </Animated.View>
          )}
        </View>
        
        {/* Game Area */}
        <View style={styles.gameArea}>
          {shapes.map(shape => (
            <Shape
              key={shape.id}
              shape={shape}
              onTap={() => handleShapeTap(shape)}
              isCorrect={feedback?.id === shape.id ? feedback.correct : null}
            />
          ))}
        </View>
        
        {/* Round Complete Overlay */}
        {showRoundComplete && (
          <Animated.View 
            style={[
              styles.roundCompleteOverlay,
              {
                opacity: roundCompleteAnim,
                transform: [{
                  scale: roundCompleteAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                }],
              },
            ]}
          >
            <View style={[styles.roundCompleteBadge, { borderColor: sectorColor }]}>
              <Text style={styles.roundCompleteCheck}>✓</Text>
              <Text style={styles.roundCompleteText}>ROUND COMPLETE!</Text>
            </View>
          </Animated.View>
        )}
        
        {/* Completion Overlay */}
        {isComplete && (
          <View style={styles.completeOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0.8)']}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.completeTitle}>CHAMBER CLEARED</Text>
            <Text style={[styles.completeScore, { color: sectorColor }]}>{score}</Text>
            <Text style={styles.completeLabel}>POINTS</Text>
          </View>
        )}
      </Animated.View>
    </BreathingBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  exitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 20,
    color: '#666666',
  },
  roundInfo: {
    flex: 1,
    alignItems: 'center',
  },
  roundText: {
    fontSize: 12,
    color: '#888888',
    letterSpacing: 3,
    fontWeight: '600',
  },
  scoreContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  timerBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 2,
  },
  timerText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 12,
    width: 30,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginHorizontal: 40,
    borderRadius: 25,
    gap: 10,
  },
  instructionLabel: {
    fontSize: 13,
    color: '#AAAAAA',
    letterSpacing: 2,
    fontWeight: '600',
  },
  targetPreview: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetShape: {
    width: 22,
    height: 22,
  },
  targetCircle: {
    borderRadius: 11,
  },
  targetSquare: {
    borderRadius: 4,
  },
  targetTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    backgroundColor: 'transparent',
  },
  targetDiamond: {
    transform: [{ rotate: '45deg' }],
    width: 18,
    height: 18,
    borderRadius: 3,
  },
  instructionType: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
  },
  comboContainer: {
    position: 'absolute',
    top: 55,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  comboInline: {
    marginLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comboText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  shapeContainer: {
    position: 'absolute',
  },
  shapeGlow: {},
  feedbackRing: {
    position: 'absolute',
    borderWidth: 3,
    left: -10,
    top: -10,
  },
  completeOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeTitle: {
    fontSize: 14,
    color: '#888888',
    letterSpacing: 4,
    marginBottom: 20,
  },
  completeScore: {
    fontSize: 72,
    fontWeight: '700',
  },
  completeLabel: {
    fontSize: 12,
    color: '#666666',
    letterSpacing: 4,
    marginTop: 8,
  },
  roundCompleteOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 100,
  },
  roundCompleteBadge: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
  },
  roundCompleteCheck: {
    fontSize: 48,
    color: '#4CAF50',
    marginBottom: 8,
  },
  roundCompleteText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 3,
  },
});

export default GameScreen;
