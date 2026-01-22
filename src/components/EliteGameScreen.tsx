// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 ELITE GAME SCREEN - The Thinking Experience
// "Not a game. A mirror."
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { elitePuzzleEngine, PuzzleElement, PuzzleState, COGNITIVE_PALETTE } from '../engine/ElitePuzzleEngine';
import { adaptiveIntelligence } from '../engine/AdaptiveIntelligence';
import { emotionalModulation } from '../engine/EmotionalModulation';
import { archetypeEngine } from '../engine/ArchetypeEngine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface EliteGameScreenProps {
  sectorId: string;
  chamberId: string;
  sectorColor: string;
  onComplete: (score: number, accuracy: number, insights: string[]) => void;
  onExit: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// ELEMENT COMPONENT - Minimal, intentional, alive
// ─────────────────────────────────────────────────────────────────────────────────

interface ElementProps {
  element: PuzzleElement;
  onSelect: (id: string) => void;
  isSelected: boolean;
  feedbackState: 'none' | 'correct' | 'wrong' | 'trap';
  phaseOpacity: Animated.Value;
}

const Element: React.FC<ElementProps> = ({
  element,
  onSelect,
  isSelected,
  feedbackState,
  phaseOpacity,
}) => {
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Deliberate entrance - elements materialize, not pop
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 400,
      delay: Math.random() * 200,
      useNativeDriver: true,
    }).start();
  }, []);
  
  useEffect(() => {
    if (feedbackState !== 'none') {
      // Feedback animation - restrained but clear
      if (feedbackState === 'correct') {
        Animated.sequence([
          Animated.timing(feedbackAnim, {
            toValue: 1.08,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(feedbackAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (feedbackState === 'trap') {
        // Trap - element reveals its deception
        Animated.sequence([
          Animated.timing(feedbackAnim, {
            toValue: 0.8,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(feedbackAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      } else {
        // Wrong - quiet disappearance
        Animated.timing(feedbackAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [feedbackState]);
  
  const renderShape = () => {
    const size = element.size;
    const color = element.color;
    
    switch (element.type) {
      case 'circle':
        return (
          <View
            style={[
              styles.elementShape,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                opacity: element.opacity,
                transform: [{ rotate: `${element.rotation}deg` }],
              },
            ]}
          />
        );
      
      case 'square':
        return (
          <View
            style={[
              styles.elementShape,
              {
                width: size,
                height: size,
                borderRadius: size * 0.15,
                backgroundColor: color,
                opacity: element.opacity,
                transform: [{ rotate: `${element.rotation}deg` }],
              },
            ]}
          />
        );
      
      case 'triangle':
        return (
          <View
            style={[
              styles.elementTriangle,
              {
                borderLeftWidth: size / 2,
                borderRightWidth: size / 2,
                borderBottomWidth: size * 0.866,
                borderBottomColor: color,
                opacity: element.opacity,
                transform: [{ rotate: `${element.rotation}deg` }],
              },
            ]}
          />
        );
      
      case 'diamond':
        return (
          <View
            style={[
              styles.elementShape,
              {
                width: size * 0.7,
                height: size * 0.7,
                backgroundColor: color,
                opacity: element.opacity,
                transform: [
                  { rotate: '45deg' },
                  { rotate: `${element.rotation}deg` },
                ],
              },
            ]}
          />
        );
      
      case 'hexagon':
        return (
          <View
            style={[
              styles.elementShape,
              {
                width: size,
                height: size * 0.866,
                backgroundColor: color,
                opacity: element.opacity,
                borderRadius: size * 0.1,
                transform: [{ rotate: `${element.rotation}deg` }],
              },
            ]}
          />
        );
      
      default:
        return (
          <View
            style={[
              styles.elementShape,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                opacity: element.opacity,
              },
            ]}
          />
        );
    }
  };
  
  const getFeedbackColor = () => {
    switch (feedbackState) {
      case 'correct': return COGNITIVE_PALETTE.valid;
      case 'wrong': return COGNITIVE_PALETTE.neutral;
      case 'trap': return COGNITIVE_PALETTE.trap;
      default: return 'transparent';
    }
  };
  
  return (
    <TouchableOpacity
      onPress={() => onSelect(element.id)}
      activeOpacity={0.9}
      disabled={isSelected || feedbackState !== 'none'}
    >
      <Animated.View
        style={[
          styles.elementContainer,
          {
            left: element.x,
            top: element.y,
            opacity: Animated.multiply(entranceAnim, Animated.multiply(feedbackAnim, phaseOpacity)),
            transform: [
              { scale: Animated.multiply(entranceAnim, feedbackAnim) },
            ],
          },
        ]}
      >
        {/* Trap glow - only visible when trap is revealed */}
        {feedbackState === 'trap' && (
          <Animated.View
            style={[
              styles.trapGlow,
              {
                width: element.size + 20,
                height: element.size + 20,
                borderRadius: (element.size + 20) / 2,
                opacity: glowAnim,
              },
            ]}
          />
        )}
        
        {renderShape()}
        
        {/* Feedback ring */}
        {feedbackState !== 'none' && (
          <Animated.View
            style={[
              styles.feedbackRing,
              {
                width: element.size + 12,
                height: element.size + 12,
                borderRadius: (element.size + 12) / 2,
                borderColor: getFeedbackColor(),
                opacity: feedbackAnim,
              },
            ]}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// RULE INDICATOR - Cryptic, not explicit
// ─────────────────────────────────────────────────────────────────────────────────

interface RuleIndicatorProps {
  rule: string;
  isInverted: boolean;
  color: string;
}

const RuleIndicator: React.FC<RuleIndicatorProps> = ({ rule, isInverted, color }) => {
  const invertAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isInverted) {
      Animated.sequence([
        Animated.timing(invertAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(invertAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isInverted]);
  
  return (
    <Animated.View
      style={[
        styles.ruleContainer,
        {
          borderColor: isInverted ? COGNITIVE_PALETTE.warning : color + '40',
          transform: [{
            scale: invertAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 1.02, 1.05],
            }),
          }],
        },
      ]}
    >
      <Text style={[styles.ruleText, { color: isInverted ? COGNITIVE_PALETTE.warning : '#888' }]}>
        {rule}
      </Text>
      {isInverted && (
        <Text style={styles.invertedIndicator}>SHIFTED</Text>
      )}
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// PRESSURE BAR - Time visualized as pressure, not countdown
// ─────────────────────────────────────────────────────────────────────────────────

interface PressureBarProps {
  progress: number; // 0-1, 1 = full time remaining
  color: string;
  pressureLevel: number;
}

const PressureBar: React.FC<PressureBarProps> = ({ progress, color, pressureLevel }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (pressureLevel > 0.7) {
      // Subtle pulse when pressure is high
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 500 - pressureLevel * 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500 - pressureLevel * 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [pressureLevel > 0.7]);
  
  const barColor = pressureLevel > 0.8 
    ? COGNITIVE_PALETTE.warning 
    : pressureLevel > 0.5 
      ? COGNITIVE_PALETTE.pending 
      : color;
  
  return (
    <Animated.View style={[styles.pressureContainer, { transform: [{ scaleX: pulseAnim }] }]}>
      <View style={styles.pressureTrack}>
        <Animated.View
          style={[
            styles.pressureFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN ELITE GAME SCREEN
// ─────────────────────────────────────────────────────────────────────────────────

const EliteGameScreen: React.FC<EliteGameScreenProps> = ({
  sectorId,
  chamberId,
  sectorColor,
  onComplete,
  onExit,
}) => {
  // Game state
  const [puzzleState, setPuzzleState] = useState<PuzzleState | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [feedbackMap, setFeedbackMap] = useState<Map<string, 'correct' | 'wrong' | 'trap'>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [ruleInverted, setRuleInverted] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [showSilence, setShowSilence] = useState(false);
  
  // Stats
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalActions, setTotalActions] = useState(0);
  const [trapsFallen, setTrapsFallen] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  
  const MAX_ROUNDS = 10;
  
  // Animations
  const phaseOpacity = useRef(new Animated.Value(1)).current;
  const silenceOpacity = useRef(new Animated.Value(0)).current;
  const insightOpacity = useRef(new Animated.Value(0)).current;
  const roundTransition = useRef(new Animated.Value(0)).current;
  
  // Timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundStartTime = useRef<number>(Date.now());
  const actionTimes = useRef<number[]>([]);
  
  // Initialize puzzle
  const initializePuzzle = useCallback((roundNum: number) => {
    // Get adaptive parameters
    const params = adaptiveIntelligence.getParameters();
    const bias = adaptiveIntelligence.getNextPuzzleBias();
    const difficulty = adaptiveIntelligence.getDifficultyForNextPuzzle();
    
    // Check for silence phase
    if (adaptiveIntelligence.shouldTriggerSilence() && roundNum > 2) {
      setShowSilence(true);
      emotionalModulation.transitionTo('silence', 300);
      
      setTimeout(() => {
        setShowSilence(false);
        emotionalModulation.transitionTo('observation', 500);
        actuallyStartPuzzle();
      }, 1500);
    } else {
      actuallyStartPuzzle();
    }
    
    function actuallyStartPuzzle() {
      const state = elitePuzzleEngine.generatePuzzle(roundNum, difficulty, bias);
      setPuzzleState(state);
      setSelectedIds(new Set());
      setFeedbackMap(new Map());
      setRuleInverted(false);
      
      // Set time based on adaptive parameters
      const roundTime = params.actionTime;
      setTimeRemaining(1);
      roundStartTime.current = Date.now();
      actionTimes.current = [];
      
      // Entrance animation
      phaseOpacity.setValue(0);
      Animated.timing(phaseOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Start timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - roundStartTime.current;
        const remaining = Math.max(0, 1 - elapsed / roundTime);
        setTimeRemaining(remaining);
        
        // Update emotional state based on time pressure
        emotionalModulation.updatePressure(remaining);
        
        // Check for rule inversion
        if (elitePuzzleEngine.checkForRuleInversion()) {
          setRuleInverted(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          emotionalModulation.triggerMoment({
            type: 'rule_shift',
            intensity: 'powerful',
            timestamp: Date.now(),
          });
        }
        
        if (remaining <= 0) {
          handleRoundEnd();
        }
      }, 50);
    }
  }, []);
  
  // Handle element selection
  const handleSelect = useCallback((elementId: string) => {
    if (!puzzleState || selectedIds.has(elementId)) return;
    
    const timestamp = Date.now();
    const responseTime = timestamp - roundStartTime.current - 
      (actionTimes.current.length > 0 ? actionTimes.current[actionTimes.current.length - 1] : 0);
    actionTimes.current.push(timestamp - roundStartTime.current);
    
    const result = elitePuzzleEngine.processAction(elementId, timestamp);
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.add(elementId);
    setSelectedIds(newSelectedIds);
    setTotalActions(prev => prev + 1);
    
    // Update feedback
    const newFeedbackMap = new Map(feedbackMap);
    
    if (result.success) {
      newFeedbackMap.set(elementId, 'correct');
      setTotalCorrect(prev => prev + 1);
      setStreakCount(prev => prev + 1);
      setScore(prev => prev + Math.floor(100 * (result.scoreModifier || 1)));
      
      emotionalModulation.triggerMoment({
        type: 'correct',
        intensity: streakCount > 4 ? 'powerful' : streakCount > 2 ? 'clear' : 'subtle',
        timestamp,
      });
      
      // Streak feedback
      if (streakCount > 0 && streakCount % 5 === 0) {
        emotionalModulation.triggerMoment({
          type: 'streak',
          intensity: streakCount >= 10 ? 'powerful' : 'clear',
          timestamp,
        });
      }
      
      // Generate insight occasionally
      if (result.insightGenerated) {
        setInsights(prev => [...prev, result.insightGenerated!]);
      }
      
    } else {
      newFeedbackMap.set(elementId, result.feedback === 'trap' ? 'trap' : 'wrong');
      setStreakCount(0);
      
      if (result.feedback === 'trap') {
        setTrapsFallen(prev => prev + 1);
        emotionalModulation.triggerMoment({
          type: 'trap_fallen',
          intensity: 'powerful',
          timestamp,
        });
        
        if (result.insightGenerated) {
          setInsights(prev => [...prev, result.insightGenerated!]);
        }
      } else {
        emotionalModulation.triggerMoment({
          type: 'incorrect',
          intensity: 'subtle',
          timestamp,
        });
      }
    }
    
    setFeedbackMap(newFeedbackMap);
    
    // Update archetype based on action
    archetypeEngine.processAction({
      responseTime,
      wasCorrect: result.success,
      wasDeliberate: responseTime > 2000,
      wasImpulsive: responseTime < 400,
      trapAvoided: false,
      trapFallen: result.feedback === 'trap',
      ruleAdapted: ruleInverted,
      patternFound: streakCount > 3,
    });
    
    // Check if round complete (all valid targets found)
    const remainingTargets = elitePuzzleEngine.getRemainingValidTargets();
    if (remainingTargets === 0) {
      setTimeout(() => handleRoundEnd(), 500);
    }
  }, [puzzleState, selectedIds, feedbackMap, streakCount, ruleInverted]);
  
  // Handle round end
  const handleRoundEnd = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Record performance for adaptive system
    const accuracy = totalActions > 0 ? totalCorrect / totalActions : 0;
    adaptiveIntelligence.recordPerformance({
      timestamp: Date.now(),
      roundNumber: round,
      accuracy,
      averageResponseTime: actionTimes.current.length > 0 
        ? actionTimes.current.reduce((a, b) => a + b, 0) / actionTimes.current.length 
        : 0,
      impulsiveActionRate: 0, // Would calculate from action times
      trapsFallen,
      rulesAdapted: ruleInverted ? 1 : 0,
      emotionalState: adaptiveIntelligence.getEmotionalState(),
    });
    
    emotionalModulation.triggerMoment({
      type: 'round_complete',
      intensity: accuracy > 0.8 ? 'powerful' : 'subtle',
      timestamp: Date.now(),
    });
    
    // Next round or complete
    if (round >= MAX_ROUNDS) {
      handleGameComplete();
    } else {
      // Round transition
      Animated.sequence([
        Animated.timing(phaseOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(roundTransition, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(roundTransition, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRound(prev => prev + 1);
        initializePuzzle(round + 1);
      });
    }
  }, [round, totalCorrect, totalActions, trapsFallen, ruleInverted]);
  
  // Handle game complete
  const handleGameComplete = useCallback(() => {
    setIsComplete(true);
    emotionalModulation.triggerMoment({
      type: 'session_end',
      intensity: 'powerful',
      timestamp: Date.now(),
    });
    
    // Generate final insight
    const sessionInsight = adaptiveIntelligence.generateSessionInsight();
    const archetypeInsight = archetypeEngine.generateInsight();
    
    const finalInsights = [...insights];
    if (sessionInsight) finalInsights.push(sessionInsight);
    if (archetypeInsight) finalInsights.push(archetypeInsight);
    
    const accuracy = totalActions > 0 ? totalCorrect / totalActions : 0;
    
    setTimeout(() => {
      onComplete(score, accuracy, finalInsights);
    }, 2000);
  }, [score, totalCorrect, totalActions, insights, onComplete]);
  
  // Initialize on mount
  useEffect(() => {
    adaptiveIntelligence.startNewSession();
    emotionalModulation.transitionTo('observation', 800);
    initializePuzzle(1);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Get current rule description
  const currentRule = useMemo(() => {
    const rule = elitePuzzleEngine.getActiveRule();
    return rule?.description || 'Observe. Understand. Act.';
  }, [puzzleState]);
  
  // Render
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COGNITIVE_PALETTE.void, COGNITIVE_PALETTE.abyss]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Silence overlay */}
      {showSilence && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.silenceOverlay,
            { opacity: silenceOpacity },
          ]}
        >
          <Text style={styles.silenceText}>...</Text>
        </Animated.View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton}>
          <Text style={styles.exitText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.roundIndicator}>
          <Text style={styles.roundNumber}>{round}</Text>
          <Text style={styles.roundDivider}>/</Text>
          <Text style={styles.roundTotal}>{MAX_ROUNDS}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, { color: sectorColor }]}>{score}</Text>
        </View>
      </View>
      
      {/* Pressure bar */}
      <PressureBar
        progress={timeRemaining}
        color={sectorColor}
        pressureLevel={emotionalModulation.getPressureLevel()}
      />
      
      {/* Rule indicator */}
      <RuleIndicator
        rule={currentRule}
        isInverted={ruleInverted}
        color={sectorColor}
      />
      
      {/* Game area */}
      <View style={styles.gameArea}>
        {puzzleState?.elements.map(element => (
          <Element
            key={element.id}
            element={element}
            onSelect={handleSelect}
            isSelected={selectedIds.has(element.id)}
            feedbackState={feedbackMap.get(element.id) || 'none'}
            phaseOpacity={phaseOpacity}
          />
        ))}
      </View>
      
      {/* Round transition overlay */}
      <Animated.View
        style={[
          styles.roundTransitionOverlay,
          {
            opacity: roundTransition,
            pointerEvents: 'none',
          },
        ]}
      >
        <Text style={styles.roundTransitionText}>Round {round + 1}</Text>
      </Animated.View>
      
      {/* Completion overlay */}
      {isComplete && (
        <View style={styles.completeOverlay}>
          <LinearGradient
            colors={['rgba(5,5,10,0.98)', 'rgba(10,10,15,0.95)']}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.completeTitle}>CHAMBER CLEARED</Text>
          <Text style={[styles.completeScore, { color: sectorColor }]}>{score}</Text>
          <Text style={styles.completeSubtitle}>
            {totalCorrect}/{totalActions} • {trapsFallen === 0 ? 'No traps fallen' : `${trapsFallen} trap${trapsFallen > 1 ? 's' : ''}`}
          </Text>
          
          {insights.length > 0 && (
            <View style={styles.insightContainer}>
              <Text style={styles.insightText}>{insights[insights.length - 1]}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COGNITIVE_PALETTE.void,
  },
  silenceOverlay: {
    backgroundColor: COGNITIVE_PALETTE.silence,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  silenceText: {
    fontSize: 24,
    color: '#222',
    letterSpacing: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  exitButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitText: {
    fontSize: 24,
    color: '#444',
  },
  roundIndicator: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  roundNumber: {
    fontSize: 24,
    fontWeight: '300',
    color: '#666',
  },
  roundDivider: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 4,
  },
  roundTotal: {
    fontSize: 14,
    color: '#333',
  },
  scoreContainer: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
  },
  pressureContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  pressureTrack: {
    height: 2,
    backgroundColor: '#1a1a20',
    borderRadius: 1,
    overflow: 'hidden',
  },
  pressureFill: {
    height: '100%',
    borderRadius: 1,
  },
  ruleContainer: {
    marginHorizontal: 40,
    marginTop: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(20,20,30,0.5)',
    alignItems: 'center',
  },
  ruleText: {
    fontSize: 13,
    letterSpacing: 1,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  invertedIndicator: {
    fontSize: 9,
    color: COGNITIVE_PALETTE.warning,
    letterSpacing: 2,
    marginTop: 6,
    fontWeight: '600',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  elementContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  elementShape: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  elementTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  trapGlow: {
    position: 'absolute',
    backgroundColor: COGNITIVE_PALETTE.trap,
    opacity: 0.3,
  },
  feedbackRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  roundTransitionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,5,10,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundTransitionText: {
    fontSize: 16,
    color: '#444',
    letterSpacing: 4,
    fontWeight: '300',
  },
  completeOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeTitle: {
    fontSize: 12,
    color: '#555',
    letterSpacing: 4,
    marginBottom: 20,
  },
  completeScore: {
    fontSize: 64,
    fontWeight: '200',
  },
  completeSubtitle: {
    fontSize: 12,
    color: '#444',
    letterSpacing: 1,
    marginTop: 15,
  },
  insightContainer: {
    marginTop: 40,
    paddingHorizontal: 50,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
});

export default EliteGameScreen;
