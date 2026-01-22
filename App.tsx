// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 PUZZLE MIND - Premium AAA Cognitive Training Game
// ═══════════════════════════════════════════════════════════════════════════════
// A beautifully crafted puzzle experience with intelligent adaptive systems

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Types
import { Screen, Shape, Level, World, ChallengeType, InsightRule } from './src/types';

// Constants
import { COLORS, GRADIENTS, W, H } from './src/constants/colors';
import { LEVELS, WORLDS, getLevelsByWorld, getWorldById } from './src/constants/levels';
import { getRandomInsight } from './src/constants/insights';

// Systems
import { playerIntelligence } from './src/systems/PlayerIntelligence';
import { adaptiveDifficulty } from './src/systems/AdaptiveDifficulty';
import { scoringSystem, ScoreBreakdownResult } from './src/systems/Scoring';
import { 
  generateShapes, 
  getCorrectShape, 
  getChallengeText, 
  selectChallengeForLevel,
  getModifierDescription 
} from './src/systems/GameLogic';

// Components
import AmbientParticles from './src/components/AmbientParticles';
import GlowingShape from './src/components/GlowingShape';
import SuccessExplosion from './src/components/SuccessExplosion';
import RadarChart from './src/components/RadarChart';
import InsightDisplay from './src/components/InsightDisplay';
import ScoreBreakdown from './src/components/ScoreBreakdown';
import ComboIndicator from './src/components/ComboIndicator';
import TimerBar from './src/components/TimerBar';
import ChallengeBanner from './src/components/ChallengeBanner';

// Utils
import haptics from './src/utils/haptics';

// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  // ─────────────────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [selectedWorld, setSelectedWorld] = useState<number>(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  
  // Game state
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeType>('largestShape');
  const [roundNumber, setRoundNumber] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Feedback state
  const [showCorrect, setShowCorrect] = useState<number | null>(null);
  const [showWrong, setShowWrong] = useState<number | null>(null);
  const [explosions, setExplosions] = useState<{ id: number; x: number; y: number; variant: string }[]>([]);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdownResult | null>(null);
  const [currentInsight, setCurrentInsight] = useState<InsightRule | null>(null);
  
  // Round timing
  const roundStartTime = useRef<number>(0);
  const explosionId = useRef(0);

  // Animations
  const titleGlow = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  // ─────────────────────────────────────────────────────────────────────────────
  // ANIMATIONS SETUP
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Title glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleGlow, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(titleGlow, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // TIMER LOGIC
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isTimerRunning || screen !== 'puzzle') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          handleTimeout();
          return 0;
        }
        if (prev <= 3) {
          haptics.tick();
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isTimerRunning, screen]);

  // ─────────────────────────────────────────────────────────────────────────────
  // GAME LOGIC
  // ─────────────────────────────────────────────────────────────────────────────
  const startLevel = useCallback((level: Level) => {
    setCurrentLevel(level);
    setRoundNumber(0);
    setStreak(0);
    setScore(0);
    setLives(3);
    
    // Reset systems
    playerIntelligence.reset();
    adaptiveDifficulty.reset();
    scoringSystem.reset();
    
    // Start first round
    startNewRound(level, 0);
    
    // Transition to puzzle screen
    Animated.timing(screenFade, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setScreen('puzzle');
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    haptics.medium();
  }, []);

  const startNewRound = useCallback((level: Level, round: number) => {
    // Select challenge
    const challenge = selectChallengeForLevel(level, round);
    setCurrentChallenge(challenge);

    // Get adaptive difficulty
    const profile = playerIntelligence.getProfile();
    const difficulty = adaptiveDifficulty.adapt(profile);
    
    // Generate shapes
    const shapeCount = adaptiveDifficulty.getShapeCount(level.shapeCount);
    const newShapes = generateShapes(shapeCount, level.specialModifier);
    setShapes(newShapes);

    // Set time limit
    const baseTime = level.timeLimit || 10;
    const adjustedTime = adaptiveDifficulty.getTimeLimit(baseTime);
    setTimeLeft(adjustedTime);
    setIsTimerRunning(true);
    
    // Record start time
    roundStartTime.current = Date.now();

    // Clear feedback
    setShowCorrect(null);
    setShowWrong(null);
    setScoreBreakdown(null);
  }, []);

  const handleShapePress = useCallback((shape: Shape) => {
    if (!currentLevel || !isTimerRunning) return;

    const responseTime = Date.now() - roundStartTime.current;
    const correctShape = getCorrectShape(shapes, currentChallenge);
    const isCorrect = correctShape?.id === shape.id;

    setIsTimerRunning(false);

    // Record behavior
    playerIntelligence.recordRound({
      roundNumber,
      responseTime,
      wasCorrect: isCorrect,
      challengeType: currentChallenge,
      selectedPosition: { x: shape.x / W, y: shape.y / H },
      correctPosition: correctShape ? { x: correctShape.x / W, y: correctShape.y / H } : undefined,
      timestamp: Date.now(),
    });

    adaptiveDifficulty.recordResult(isCorrect);

    if (isCorrect) {
      handleCorrectAnswer(shape, responseTime);
    } else {
      handleWrongAnswer(shape, correctShape);
    }
  }, [currentLevel, isTimerRunning, shapes, currentChallenge, roundNumber]);

  const handleCorrectAnswer = useCallback((shape: Shape, responseTime: number) => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    setMaxStreak(Math.max(maxStreak, newStreak));
    setShowCorrect(shape.id);

    // Calculate score
    const profile = playerIntelligence.getProfile();
    const breakdown = scoringSystem.calculateScore(
      true,
      responseTime,
      currentChallenge,
      newStreak,
      profile,
      currentLevel?.timeLimit || 10
    );
    setScoreBreakdown(breakdown);
    setScore(prev => prev + breakdown.total);

    // Add explosion
    const variant = newStreak >= 10 ? 'levelUp' : newStreak >= 5 ? 'combo' : 'success';
    addExplosion(shape.x, shape.y, variant);

    // Haptics
    haptics.success();
    if (newStreak % 5 === 0) {
      haptics.streakMilestone(newStreak);
    }

    // Check level completion
    if (newStreak >= currentLevel!.requiredStreak) {
      setTimeout(() => handleLevelComplete(), 1000);
    } else {
      setTimeout(() => {
        startNewRound(currentLevel!, roundNumber + 1);
        setRoundNumber(prev => prev + 1);
      }, 1200);
    }
  }, [streak, maxStreak, currentChallenge, currentLevel, roundNumber]);

  const handleWrongAnswer = useCallback((shape: Shape, correctShape: Shape | null) => {
    const newLives = lives - 1;
    setLives(newLives);
    setStreak(0);
    setShowWrong(shape.id);
    if (correctShape) setShowCorrect(correctShape.id);

    haptics.error();
    addExplosion(shape.x, shape.y, 'streak');

    if (newLives <= 0) {
      setTimeout(() => handleLevelFailed(), 1000);
    } else {
      setTimeout(() => {
        startNewRound(currentLevel!, roundNumber + 1);
        setRoundNumber(prev => prev + 1);
      }, 1500);
    }
  }, [lives, currentLevel, roundNumber]);

  const handleTimeout = useCallback(() => {
    const correctShape = getCorrectShape(shapes, currentChallenge);
    handleWrongAnswer({ id: -1, x: W / 2, y: H / 2 } as Shape, correctShape);
  }, [shapes, currentChallenge]);

  const handleLevelComplete = useCallback(() => {
    if (!currentLevel) return;

    // Unlock next level
    const nextLevelId = currentLevel.id + 1;
    if (!completedLevels.includes(currentLevel.id)) {
      setCompletedLevels(prev => [...prev, currentLevel.id]);
    }

    // Get insight
    const profile = playerIntelligence.getProfile();
    const insight = getRandomInsight(profile);
    setCurrentInsight(insight);

    haptics.victory();

    Animated.timing(screenFade, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setScreen('victory');
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [currentLevel, completedLevels]);

  const handleLevelFailed = useCallback(() => {
    const profile = playerIntelligence.getProfile();
    const insight = getRandomInsight(profile);
    setCurrentInsight(insight);

    haptics.defeat();

    Animated.timing(screenFade, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setScreen('defeat');
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const addExplosion = useCallback((x: number, y: number, variant: string) => {
    const id = explosionId.current++;
    setExplosions(prev => [...prev, { id, x, y, variant }]);
    setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.id !== id));
    }, 1000);
  }, []);

  const navigateTo = useCallback((newScreen: Screen) => {
    haptics.selection();
    Animated.timing(screenFade, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setScreen(newScreen);
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER HOME SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  const renderHomeScreen = () => (
    <View style={styles.screenContainer}>
      <AmbientParticles count={40} intensity={0.8} />
      
      <View style={styles.homeContent}>
        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleGlow.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ]}
        >
          <Text style={styles.titleEmoji}>🧠</Text>
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleGlow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ]}
          >
            PUZZLE MIND
          </Animated.Text>
          <Text style={styles.subtitle}>COGNITIVE EVOLUTION</Text>
        </Animated.View>

        {/* Stats display */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedLevels.length}</Text>
            <Text style={styles.statLabel}>Levels</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{maxStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Play button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigateTo('galaxy')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.cyan, COLORS.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.playButtonGradient}
          >
            <Text style={styles.playButtonText}>ENTER GALAXY</Text>
            <Text style={styles.playButtonIcon}>🚀</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER GALAXY MAP
  // ─────────────────────────────────────────────────────────────────────────────
  const renderGalaxyMap = () => {
    const worldLevels = getLevelsByWorld(selectedWorld);
    const selectedWorldData = getWorldById(selectedWorld);

    return (
      <View style={styles.screenContainer}>
        <AmbientParticles count={30} intensity={0.5} />

        {/* Header */}
        <View style={styles.galaxyHeader}>
          <TouchableOpacity onPress={() => navigateTo('home')}>
            <Text style={styles.backButton}>← HOME</Text>
          </TouchableOpacity>
          <Text style={styles.galaxyTitle}>GALAXY MAP</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* World selector */}
        <View style={styles.worldSelector}>
          {WORLDS.slice(0, 5).map(world => (
            <TouchableOpacity
              key={world.id}
              style={[
                styles.worldTab,
                selectedWorld === world.id && styles.worldTabActive,
                completedLevels.length < world.unlockRequirement && styles.worldTabLocked,
              ]}
              onPress={() => {
                if (completedLevels.length >= world.unlockRequirement) {
                  setSelectedWorld(world.id);
                  haptics.selection();
                }
              }}
            >
              <Text style={styles.worldTabIcon}>{world.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* World name */}
        {selectedWorldData && (
          <View style={styles.worldNameContainer}>
            <Text style={[styles.worldName, { color: selectedWorldData.color }]}>
              {selectedWorldData.icon} {selectedWorldData.name}
            </Text>
            <Text style={styles.worldDescription}>{selectedWorldData.description}</Text>
          </View>
        )}

        {/* Level grid */}
        <View style={styles.levelGrid}>
          {worldLevels.map(level => {
            const isCompleted = completedLevels.includes(level.id);
            const isUnlocked = level.id === 1 || completedLevels.includes(level.id - 1);

            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelCard,
                  isCompleted && styles.levelCardCompleted,
                  !isUnlocked && styles.levelCardLocked,
                ]}
                onPress={() => isUnlocked && startLevel(level)}
                disabled={!isUnlocked}
              >
                <Text style={styles.levelNumber}>{level.id}</Text>
                <Text style={styles.levelName}>{level.name}</Text>
                {isCompleted && <Text style={styles.levelStar}>⭐</Text>}
                {!isUnlocked && <Text style={styles.levelLock}>🔒</Text>}
                {level.specialModifier && (
                  <Text style={styles.levelModifier}>
                    {level.specialModifier === 'blitz' ? '⚡' : 
                     level.specialModifier === 'chaos' ? '🌪️' : 
                     level.specialModifier === 'zen' ? '🧘' : '✨'}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER PUZZLE SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  const renderPuzzleScreen = () => {
    if (!currentLevel) return null;

    const correctShape = showCorrect !== null || showWrong !== null 
      ? getCorrectShape(shapes, currentChallenge) 
      : null;

    return (
      <View style={styles.screenContainer}>
        <AmbientParticles count={20} intensity={0.3} />

        {/* Header */}
        <View style={styles.puzzleHeader}>
          <View style={styles.livesContainer}>
            {[...Array(3)].map((_, i) => (
              <Text key={i} style={styles.lifeHeart}>
                {i < lives ? '❤️' : '🖤'}
              </Text>
            ))}
          </View>
          <Text style={styles.scoreText}>{score.toLocaleString()}</Text>
        </View>

        {/* Challenge banner */}
        <ChallengeBanner
          challenge={currentChallenge}
          modifier={currentLevel.specialModifier}
          roundNumber={roundNumber + 1}
          totalRounds={currentLevel.requiredStreak}
        />

        {/* Timer */}
        <View style={styles.timerContainer}>
          <TimerBar
            timeLeft={timeLeft}
            maxTime={currentLevel.timeLimit || 10}
            isUrgent={timeLeft < 3}
            isBlitz={currentLevel.specialModifier === 'blitz'}
          />
        </View>

        {/* Shapes */}
        {shapes.map(shape => (
          <GlowingShape
            key={shape.id}
            shape={shape}
            onPress={handleShapePress}
            disabled={!isTimerRunning}
            showCorrect={showCorrect === shape.id}
            showWrong={showWrong === shape.id}
          />
        ))}

        {/* Combo indicator */}
        <ComboIndicator
          combo={scoringSystem.getComboCount()}
          streak={streak}
          maxStreak={maxStreak}
        />

        {/* Score breakdown */}
        {scoreBreakdown && (
          <View style={styles.scoreBreakdownContainer}>
            <ScoreBreakdown breakdown={scoreBreakdown} compact />
          </View>
        )}

        {/* Explosions */}
        {explosions.map(exp => (
          <SuccessExplosion
            key={exp.id}
            x={exp.x}
            y={exp.y}
            variant={exp.variant as any}
          />
        ))}
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER VICTORY SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  const renderVictoryScreen = () => {
    const profile = playerIntelligence.getProfile();

    return (
      <View style={styles.screenContainer}>
        <AmbientParticles count={50} intensity={1} />

        <View style={styles.victoryContent}>
          <Text style={styles.victoryEmoji}>🎉</Text>
          <Text style={styles.victoryTitle}>LEVEL COMPLETE!</Text>
          <Text style={styles.victoryLevel}>{currentLevel?.name}</Text>

          {/* Score display */}
          <View style={styles.victoryScore}>
            <Text style={styles.victoryScoreLabel}>TOTAL SCORE</Text>
            <Text style={styles.victoryScoreValue}>{score.toLocaleString()}</Text>
          </View>

          {/* Stars */}
          <View style={styles.starsContainer}>
            {[1, 2, 3].map(star => (
              <Text
                key={star}
                style={[
                  styles.victoryStar,
                  star <= scoringSystem.getStarRating(1000) && styles.victoryStarEarned,
                ]}
              >
                ⭐
              </Text>
            ))}
          </View>

          {/* Radar chart */}
          <RadarChart skills={profile.skillVector} size={W * 0.5} />

          {/* Insight */}
          {currentInsight && (
            <InsightDisplay insight={currentInsight} autoHide={false} />
          )}

          {/* Buttons */}
          <View style={styles.victoryButtons}>
            <TouchableOpacity
              style={styles.victoryButton}
              onPress={() => navigateTo('galaxy')}
            >
              <Text style={styles.victoryButtonText}>GALAXY MAP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.victoryButton, styles.victoryButtonPrimary]}
              onPress={() => {
                const nextLevel = LEVELS.find(l => l.id === (currentLevel?.id || 0) + 1);
                if (nextLevel) startLevel(nextLevel);
                else navigateTo('galaxy');
              }}
            >
              <Text style={styles.victoryButtonText}>NEXT LEVEL →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER DEFEAT SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  const renderDefeatScreen = () => (
    <View style={styles.screenContainer}>
      <AmbientParticles count={20} intensity={0.4} />

      <View style={styles.defeatContent}>
        <Text style={styles.defeatEmoji}>💔</Text>
        <Text style={styles.defeatTitle}>LEVEL FAILED</Text>
        <Text style={styles.defeatSubtitle}>Don't give up!</Text>

        {/* Score display */}
        <View style={styles.defeatScore}>
          <Text style={styles.defeatScoreLabel}>SCORE ACHIEVED</Text>
          <Text style={styles.defeatScoreValue}>{score.toLocaleString()}</Text>
        </View>

        {/* Insight */}
        {currentInsight && (
          <InsightDisplay insight={currentInsight} autoHide={false} />
        )}

        {/* Buttons */}
        <View style={styles.defeatButtons}>
          <TouchableOpacity
            style={styles.defeatButton}
            onPress={() => navigateTo('galaxy')}
          >
            <Text style={styles.defeatButtonText}>GALAXY MAP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.defeatButton, styles.defeatButtonPrimary]}
            onPress={() => currentLevel && startLevel(currentLevel)}
          >
            <Text style={styles.defeatButtonText}>TRY AGAIN 🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={GRADIENTS.void} style={StyleSheet.absoluteFill} />
      
      <Animated.View style={[styles.screenWrapper, { opacity: screenFade }]}>
        {screen === 'home' && renderHomeScreen()}
        {screen === 'galaxy' && renderGalaxyMap()}
        {screen === 'puzzle' && renderPuzzleScreen()}
        {screen === 'victory' && renderVictoryScreen()}
        {screen === 'defeat' && renderDefeatScreen()}
      </Animated.View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  screenWrapper: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },

  // Home Screen
  homeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 4,
    textShadowColor: COLORS.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 6,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 50,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.gold,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  playButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 18,
    gap: 12,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 2,
  },
  playButtonIcon: {
    fontSize: 24,
  },

  // Galaxy Map
  galaxyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    fontSize: 14,
    color: COLORS.cyan,
    fontWeight: '700',
  },
  galaxyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 3,
  },
  worldSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  worldTab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  worldTabActive: {
    backgroundColor: 'rgba(0,255,255,0.2)',
    borderWidth: 2,
    borderColor: COLORS.cyan,
  },
  worldTabLocked: {
    opacity: 0.3,
  },
  worldTabIcon: {
    fontSize: 24,
  },
  worldNameContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  worldName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 3,
  },
  worldDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  levelCard: {
    width: 60,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  levelCardCompleted: {
    backgroundColor: 'rgba(0,255,136,0.15)',
    borderColor: COLORS.lime,
  },
  levelCardLocked: {
    opacity: 0.4,
  },
  levelNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  levelName: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    letterSpacing: 1,
  },
  levelStar: {
    fontSize: 14,
    marginTop: 4,
  },
  levelLock: {
    fontSize: 16,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  levelModifier: {
    fontSize: 12,
    position: 'absolute',
    bottom: 5,
    right: 5,
  },

  // Puzzle Screen
  puzzleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  livesContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  lifeHeart: {
    fontSize: 24,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.gold,
  },
  timerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scoreBreakdownContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  // Victory Screen
  victoryContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  victoryEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  victoryTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 3,
  },
  victoryLevel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
    letterSpacing: 2,
  },
  victoryScore: {
    alignItems: 'center',
    marginVertical: 20,
  },
  victoryScoreLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  victoryScoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.gold,
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  victoryStar: {
    fontSize: 40,
    opacity: 0.3,
  },
  victoryStarEarned: {
    opacity: 1,
  },
  victoryButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
  },
  victoryButton: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  victoryButtonPrimary: {
    backgroundColor: COLORS.cyan,
  },
  victoryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1,
  },

  // Defeat Screen
  defeatContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  defeatEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  defeatTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF0066',
    letterSpacing: 3,
  },
  defeatSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },
  defeatScore: {
    alignItems: 'center',
    marginVertical: 20,
  },
  defeatScoreLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  defeatScoreValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 8,
  },
  defeatButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
  },
  defeatButton: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  defeatButtonPrimary: {
    backgroundColor: '#FF0066',
  },
  defeatButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1,
  },
});
