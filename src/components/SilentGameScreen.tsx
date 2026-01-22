// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 SILENT GAME - Elite Mechanic Implementation
// Rule Discovery | Temporal Compression | Deceptive Affordance
// No tutorials. No hints. The universe responds.
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  eliteMechanics,
  GameElement,
  RuleContext,
  HIDDEN_RULES,
} from '../engine/EliteMechanics';
import {
  sessionFlow,
  sessionAnimations,
  WavePhase,
  CognitiveStage,
} from '../engine/SessionFlowEngine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface SilentGameScreenProps {
  sectorId: string;
  chamberId: string;
  sectorColor: string;
  onComplete: (success: boolean, stats: GameStats) => void;
  onExit: () => void;
}

interface GameStats {
  roundsCompleted: number;
  accuracy: number;
  cognitiveStage: CognitiveStage;
  sessionSummary: {
    description: string;
    cognitiveChanges: string[];
    suggestions: string[];
  };
}

type GameState = 
  | 'observation'      // Watch, don't touch
  | 'action'          // Make your choice
  | 'consequence'     // World responds
  | 'transition'      // Moving to next round
  | 'reflection'      // Phase reflection moment
  | 'ending';         // Session ending

// ─────────────────────────────────────────────────────────────────────────────────
// VISUAL CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const COLORS = {
  void: '#0a0a0f',
  voidLight: '#12121a',
  accent: '#4a9eff',
  correct: '#2dd4bf',
  incorrect: '#ef4444',
  trap: '#f97316',
  dim: '#1a1a2e',
  text: '#e2e8f0',
  textDim: '#64748b',
};

const ELEMENT_COLORS = [
  '#4a9eff', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#10b981', // Green
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
];

// ─────────────────────────────────────────────────────────────────────────────────
// ANIMATED VALUES
// ─────────────────────────────────────────────────────────────────────────────────

const createAnimatedValues = () => ({
  environmentContraction: new Animated.Value(1),
  environmentStability: new Animated.Value(0.5),
  observationOverlay: new Animated.Value(0),
  temporalNoise: new Animated.Value(0),
  pressureLevel: new Animated.Value(0),
  breathCycle: new Animated.Value(0),
  reflectionGlow: new Animated.Value(0),
});

// ─────────────────────────────────────────────────────────────────────────────────
// ELEMENT SHAPE RENDERER
// ─────────────────────────────────────────────────────────────────────────────────

interface ShapeProps {
  element: GameElement;
  isSelected: boolean;
  isTrap: boolean;
  revealed: boolean;
  affordanceLevel: number;
  onPress: () => void;
  disabled: boolean;
}

const ShapeElement: React.FC<ShapeProps> = ({
  element,
  isSelected,
  isTrap,
  revealed,
  affordanceLevel,
  onPress,
  disabled,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Attention pulse for high affordance elements (the traps!)
  useEffect(() => {
    if (affordanceLevel > 0.7 && !revealed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    return () => pulseAnim.setValue(1);
  }, [affordanceLevel, revealed]);
  
  // Selection animation
  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSelected]);
  
  // Reveal glow
  useEffect(() => {
    if (revealed) {
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [revealed]);
  
  const getShapePath = () => {
    const size = element.size;
    
    switch (element.type) {
      case 'circle':
        return { borderRadius: size / 2, width: size, height: size };
      case 'square':
        return { borderRadius: 4, width: size, height: size };
      case 'triangle':
        return { 
          width: 0, 
          height: 0,
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderBottomWidth: size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          backgroundColor: 'transparent',
        };
      case 'diamond':
        return { 
          width: size * 0.7, 
          height: size * 0.7, 
          transform: [{ rotate: '45deg' }],
          borderRadius: 4,
        };
      case 'hexagon':
        return { borderRadius: size / 4, width: size, height: size * 0.866 };
      default:
        return { borderRadius: size / 2, width: size, height: size };
    }
  };
  
  const shapeStyle = getShapePath();
  const isTriangle = element.type === 'triangle';
  
  const revealColor = revealed 
    ? (isTrap ? COLORS.trap : (element.isCorrect ? COLORS.correct : COLORS.dim))
    : element.color;
  
  const borderColor = revealed
    ? (isTrap ? COLORS.trap : (element.isCorrect ? COLORS.correct : 'transparent'))
    : (isSelected ? COLORS.accent : 'transparent');
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.elementContainer,
        {
          left: element.x - element.size / 2,
          top: element.y - element.size / 2,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.elementShape,
          shapeStyle,
          {
            backgroundColor: isTriangle ? 'transparent' : revealColor,
            borderBottomColor: isTriangle ? revealColor : undefined,
            borderWidth: isSelected || revealed ? 2 : 0,
            borderColor: borderColor,
            opacity: element.opacity,
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
              ...(shapeStyle.transform || []),
            ],
            shadowColor: revealed && element.isCorrect ? COLORS.correct : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: revealed ? 0.8 : 0,
            shadowRadius: 10,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// PHASE INDICATOR (Subtle, non-intrusive)
// ─────────────────────────────────────────────────────────────────────────────────

const PhaseIndicator: React.FC<{ phase: WavePhase; progress: number }> = ({ phase, progress }) => {
  const phaseColors: Record<WavePhase, string> = {
    warmup: '#10b981',
    stretch: '#f59e0b',
    peak: '#ef4444',
    reflection: '#8b5cf6',
  };
  
  return (
    <View style={styles.phaseIndicator}>
      <View style={styles.phaseBar}>
        <Animated.View
          style={[
            styles.phaseProgress,
            {
              width: `${progress * 100}%`,
              backgroundColor: phaseColors[phase],
            },
          ]}
        />
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// OBSERVATION OVERLAY
// ─────────────────────────────────────────────────────────────────────────────────

const ObservationOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [visible]);
  
  return (
    <Animated.View
      style={[
        styles.observationOverlay,
        { opacity: fadeAnim, pointerEvents: visible ? 'auto' : 'none' },
      ]}
    >
      <Animated.View style={[styles.observationPulse, { opacity: fadeAnim }]} />
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// SESSION END SCREEN
// ─────────────────────────────────────────────────────────────────────────────────

const SessionEndScreen: React.FC<{
  summary: { description: string; cognitiveChanges: string[]; suggestions: string[] };
  onContinue: () => void;
}> = ({ summary, onContinue }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Animated.View style={[styles.sessionEndContainer, { opacity: fadeAnim }]}>
      <View style={styles.sessionEndContent}>
        <Animated.Text style={styles.sessionEndTitle}>
          Session Complete
        </Animated.Text>
        
        <Animated.Text style={styles.sessionEndDescription}>
          {summary.description}
        </Animated.Text>
        
        <View style={styles.sessionEndSection}>
          {summary.cognitiveChanges.map((change, i) => (
            <Animated.Text key={i} style={styles.sessionEndChange}>
              • {change}
            </Animated.Text>
          ))}
        </View>
        
        <View style={styles.sessionEndSection}>
          {summary.suggestions.map((suggestion, i) => (
            <Animated.Text key={i} style={styles.sessionEndSuggestion}>
              {suggestion}
            </Animated.Text>
          ))}
        </View>
        
        <TouchableOpacity style={styles.sessionEndButton} onPress={onContinue}>
          <Animated.Text style={styles.sessionEndButtonText}>
            Continue
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const SilentGameScreen: React.FC<SilentGameScreenProps> = ({
  sectorId,
  chamberId,
  sectorColor,
  onComplete,
  onExit,
}) => {
  // ─── State ───
  const [gameState, setGameState] = useState<GameState>('observation');
  const [elements, setElements] = useState<GameElement[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [trapIds, setTrapIds] = useState<Set<string>>(new Set());
  const [correctIds, setCorrectIds] = useState<Set<string>>(new Set());
  const [round, setRound] = useState(1);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  
  // ─── Refs ───
  const animValues = useRef(createAnimatedValues()).current;
  const previousElements = useRef<GameElement[]>([]);
  const twoRoundsAgoElements = useRef<GameElement[]>([]);
  const gazeTimers = useRef<Map<string, number>>(new Map());
  
  // ─── Session Flow State ───
  const [currentPhase, setCurrentPhase] = useState<WavePhase>('warmup');
  const [phaseProgress, setPhaseProgress] = useState(0);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    sessionFlow.startSession();
    eliteMechanics.reset();
    initializeRound();
    startBreathingCycle();
    
    const unsubscribe = sessionFlow.subscribe((metrics) => {
      setCurrentPhase(metrics.currentPhase);
      setPhaseProgress(metrics.phaseProgress);
    });
    
    return () => unsubscribe();
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // BREATHING CYCLE (Ambient, continuous)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const startBreathingCycle = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValues.breathCycle, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(animValues.breathCycle, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ELEMENT GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const generateElements = useCallback((): GameElement[] => {
    const count = 5 + Math.floor(Math.random() * 3);
    const types: GameElement['type'][] = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
    const generated: GameElement[] = [];
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2 - 50;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 80 + Math.random() * 100;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const size = 50 + Math.random() * 30;
      const brightness = 0.4 + Math.random() * 0.6;
      const color = ELEMENT_COLORS[Math.floor(Math.random() * ELEMENT_COLORS.length)];
      
      // Check if this element existed before
      const previousVersion = previousElements.current.find(pe => pe.id === `el-${i}`);
      
      generated.push({
        id: `el-${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        color: color,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        size,
        opacity: brightness,
        hasMoved: previousVersion ? (
          Math.abs(previousVersion.x - x) > 10 || Math.abs(previousVersion.y - y) > 10
        ) : false,
        moveCount: previousVersion ? previousVersion.moveCount + (Math.random() > 0.6 ? 1 : 0) : 0,
        appearedRound: previousVersion ? previousVersion.appearedRound : round,
        wasSelectedBefore: previousVersion?.wasSelectedBefore || false,
        wasRelevantLastRound: previousVersion?.isCorrect || false,
        isSymmetric: Math.random() > 0.4,
        distanceFromCenter: Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)),
        brightness,
        gazeTime: 0,
        isCorrect: false,
        isTrap: false,
        metadata: {},
      });
    }
    
    return generated;
  }, [round]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ROUND INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const initializeRound = useCallback(() => {
    // Store history
    twoRoundsAgoElements.current = [...previousElements.current];
    previousElements.current = [...elements];
    
    // Generate new elements
    const newElements = generateElements();
    
    // Get current difficulty from session flow
    const difficulty = sessionFlow.getDifficulty();
    
    // Apply mechanics
    const challenge = eliteMechanics.generateCombinedChallenge(round, difficulty, newElements);
    
    // Create rule context
    const context: RuleContext = {
      allElements: newElements,
      previousRoundState: previousElements.current,
      twoRoundsAgoState: twoRoundsAgoElements.current,
      currentRound: round,
      playerSelections: [],
      historicalSelections: new Map(),
      symmetryAxis: { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 },
      centerPoint: { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 },
      dominantColor: newElements[0].color,
      dominantShape: newElements[0].type,
    };
    
    // Mark correct elements based on hidden rule
    newElements.forEach(el => {
      el.isCorrect = challenge.rule.evaluate(el, context);
      el.isTrap = challenge.deception.traps.includes(el.id);
    });
    
    // Update state
    setElements(newElements);
    setTrapIds(new Set(challenge.deception.traps));
    setCorrectIds(new Set(newElements.filter(e => e.isCorrect).map(e => e.id)));
    setSelectedIds(new Set());
    setRevealedIds(new Set());
    setRoundStartTime(Date.now());
    
    // Record temporal state
    eliteMechanics.recordTemporalState(round, newElements);
    
    // Start observation phase
    setGameState('observation');
    animateObservationPhase();
    
  }, [round, elements, generateElements]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PHASE ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const animateObservationPhase = useCallback(() => {
    // Show observation overlay
    Animated.timing(animValues.observationOverlay, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // After observation period, transition to action
    const observationDuration = currentPhase === 'warmup' ? 2500 : 1500;
    
    setTimeout(() => {
      Animated.timing(animValues.observationOverlay, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      setGameState('action');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, observationDuration);
  }, [currentPhase]);
  
  const animateEnvironmentResponse = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      // Environment stabilizes
      Animated.parallel([
        Animated.spring(animValues.environmentStability, {
          toValue: 0.8,
          friction: 8,
          useNativeDriver: false,
        }),
        Animated.timing(animValues.environmentContraction, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Environment contracts
      Animated.sequence([
        Animated.parallel([
          Animated.timing(animValues.environmentContraction, {
            toValue: 0.95,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(animValues.environmentStability, {
            toValue: 0.2,
            duration: 200,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.spring(animValues.environmentContraction, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(animValues.environmentStability, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SELECTION HANDLING
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const handleElementPress = useCallback((element: GameElement) => {
    if (gameState !== 'action') return;
    
    const reactionTime = Date.now() - roundStartTime;
    const hesitated = reactionTime > 3000;
    
    // Check for hesitation decay
    const hasDecayed = eliteMechanics.checkHesitationDecay(element.id, reactionTime);
    
    // Create context for rule evaluation
    const context: RuleContext = {
      allElements: elements,
      previousRoundState: previousElements.current,
      twoRoundsAgoState: twoRoundsAgoElements.current,
      currentRound: round,
      playerSelections: [element.id],
      historicalSelections: new Map(),
      symmetryAxis: { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 },
      centerPoint: { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 },
      dominantColor: elements[0].color,
      dominantShape: elements[0].type,
    };
    
    // Evaluate selection
    const result = eliteMechanics.evaluateSelection(element, context);
    
    // Override if decayed
    const finalCorrect = hasDecayed ? false : result.isCorrect;
    const wasTrap = trapIds.has(element.id);
    
    // Mark selected
    setSelectedIds(prev => new Set([...prev, element.id]));
    
    // Mark element as having been selected
    setElements(prev => prev.map(el => 
      el.id === element.id ? { ...el, wasSelectedBefore: true } : el
    ));
    
    // Transition to consequence
    setGameState('consequence');
    
    // Record result in session flow
    const sessionResult = sessionFlow.recordRoundResult(
      finalCorrect,
      reactionTime,
      hesitated,
      wasTrap ? 'trap_selected' : (!finalCorrect ? 'wrong_rule' : undefined)
    );
    
    // Animate environment response
    animateEnvironmentResponse(finalCorrect);
    
    // Reveal truth after delay
    setTimeout(() => {
      // Reveal all correct and trap elements
      setRevealedIds(new Set([...correctIds, ...trapIds, element.id]));
      
      // Check for rule mutation (silent)
      if (result.shouldMutateRule) {
        eliteMechanics.mutateRule();
        // No announcement - player must notice
      }
      
      // Check for session end
      if (sessionResult.shouldEndSession) {
        setTimeout(() => {
          const summary = sessionFlow.generateSessionSummary();
          setSessionSummary(summary);
          setSessionEnded(true);
          setGameState('ending');
        }, 1500);
        return;
      }
      
      // Check for phase change
      if (sessionResult.phaseChanged && sessionResult.newPhase === 'reflection') {
        setGameState('reflection');
        animateReflectionPhase();
        return;
      }
      
      // Transition to next round
      setTimeout(() => {
        setGameState('transition');
        setRound(prev => prev + 1);
      }, 1000);
      
    }, 800);
    
  }, [gameState, elements, round, roundStartTime, correctIds, trapIds, animateEnvironmentResponse]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // REFLECTION PHASE
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const animateReflectionPhase = useCallback(() => {
    Animated.timing(animValues.reflectionGlow, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.sin),
      useNativeDriver: false,
    }).start();
    
    // Slow, calming haptic
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Auto-continue after reflection
    setTimeout(() => {
      Animated.timing(animValues.reflectionGlow, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      
      setGameState('transition');
      setRound(prev => prev + 1);
    }, 3000);
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ROUND TRANSITION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (gameState === 'transition') {
      const timeout = setTimeout(() => {
        initializeRound();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [gameState, initializeRound]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SESSION END HANDLING
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const handleSessionEnd = useCallback(() => {
    const metrics = sessionFlow.getMetrics();
    onComplete(true, {
      roundsCompleted: metrics.roundsCompleted,
      accuracy: metrics.correctResponses / Math.max(metrics.roundsCompleted, 1),
      cognitiveStage: metrics.cognitiveStage,
      sessionSummary: sessionSummary || sessionFlow.generateSessionSummary(),
    });
  }, [onComplete, sessionSummary]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  
  // Calculate affordance for each element
  const getAffordanceLevel = (elementId: string): number => {
    const profile = eliteMechanics.getAffordanceProfile(elementId);
    return profile?.overallAffordance || 0.5;
  };
  
  // Environment background color based on stability
  const backgroundColor = animValues.environmentStability.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [COLORS.void, COLORS.voidLight, COLORS.dim],
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [{ scale: animValues.environmentContraction }],
        },
      ]}
    >
      {/* Breathing ambient effect */}
      <Animated.View
        style={[
          styles.breathingOverlay,
          {
            opacity: animValues.breathCycle.interpolate({
              inputRange: [0, 1],
              outputRange: [0.02, 0.06],
            }),
          },
        ]}
      />
      
      {/* Phase indicator (subtle) */}
      <PhaseIndicator phase={currentPhase} progress={phaseProgress} />
      
      {/* Game elements */}
      <View style={styles.elementsContainer}>
        {elements.map((element) => (
          <ShapeElement
            key={element.id}
            element={element}
            isSelected={selectedIds.has(element.id)}
            isTrap={trapIds.has(element.id)}
            revealed={revealedIds.has(element.id)}
            affordanceLevel={getAffordanceLevel(element.id)}
            onPress={() => handleElementPress(element)}
            disabled={gameState !== 'action'}
          />
        ))}
      </View>
      
      {/* Observation overlay (no touch during observation) */}
      <ObservationOverlay visible={gameState === 'observation'} />
      
      {/* Reflection glow */}
      <Animated.View
        style={[
          styles.reflectionOverlay,
          {
            opacity: animValues.reflectionGlow,
          },
        ]}
        pointerEvents="none"
      />
      
      {/* Fatigue overlay */}
      <Animated.View
        style={[
          styles.fatigueOverlay,
          {
            opacity: sessionAnimations.fatigueOverlay,
          },
        ]}
        pointerEvents="none"
      />
      
      {/* Exit button (minimal) */}
      <TouchableOpacity
        style={styles.exitButton}
        onPress={onExit}
        activeOpacity={0.7}
      >
        <View style={styles.exitLine} />
        <View style={[styles.exitLine, styles.exitLineRotated]} />
      </TouchableOpacity>
      
      {/* Session end screen */}
      {sessionEnded && sessionSummary && (
        <SessionEndScreen
          summary={sessionSummary}
          onContinue={handleSessionEnd}
        />
      )}
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.void,
  },
  breathingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
  },
  phaseIndicator: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    height: 2,
  },
  phaseBar: {
    flex: 1,
    backgroundColor: COLORS.dim,
    borderRadius: 1,
    overflow: 'hidden',
  },
  phaseProgress: {
    height: '100%',
    borderRadius: 1,
  },
  elementsContainer: {
    flex: 1,
    position: 'relative',
  },
  elementContainer: {
    position: 'absolute',
  },
  elementShape: {
    // Dynamic styles applied inline
  },
  observationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  observationPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  reflectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  fatigueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  exitButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitLine: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: COLORS.textDim,
    transform: [{ rotate: '45deg' }],
  },
  exitLineRotated: {
    transform: [{ rotate: '-45deg' }],
  },
  sessionEndContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 15, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  sessionEndContent: {
    maxWidth: 320,
    alignItems: 'center',
  },
  sessionEndTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: COLORS.text,
    marginBottom: 20,
    letterSpacing: 2,
  },
  sessionEndDescription: {
    fontSize: 15,
    color: COLORS.textDim,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  sessionEndSection: {
    marginBottom: 25,
    alignSelf: 'stretch',
  },
  sessionEndChange: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  sessionEndSuggestion: {
    fontSize: 14,
    color: COLORS.accent,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sessionEndButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: COLORS.textDim,
    borderRadius: 4,
    marginTop: 20,
  },
  sessionEndButtonText: {
    fontSize: 14,
    color: COLORS.text,
    letterSpacing: 2,
  },
});

export default SilentGameScreen;
