// ═══════════════════════════════════════════════════════════════════════════════
// 🧩 PUZZLE MIND - A Living Cognitive Universe
// Built with the philosophy of 100-year experience elite studios
// "The game feels smarter than the player, alive when untouched, deeper every session"
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
  BackHandler,
  ActivityIndicator,
  Text,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

// Engines
import { cognitiveEngine } from './engine/CognitiveEngine';
import { visualEngine, CINEMATIC_EASING } from './engine/VisualEngine';

// Systems
import dialogueSystem from './systems/DialogueSystem';
import { eventScheduler, generateDailyTrial } from './universe/EventSystem';
import { SECTORS, getSectorById, getChamberById } from './universe/UniverseStructure';

// Storage - Persistent Data
import gameStorage, { SessionRecord } from './storage/GameStorage';

// Components
import {
  VoidScreen,
  NexusScreen,
  ReflectionScreen,
  ProfileScreen,
} from './components/Screens';
import { SectorDetailScreen } from './components/SectorDetailScreen';
import { GameScreen } from './components/GameScreen';
import { CosmosScreen } from './components/CosmosScreen';
import { CosmicNavBar } from './components/DimensionalMenu';
import { ScreenTransition } from './components/SpatialUI';

// Types
import {
  PlayerMindModel,
  SessionReflection,
  GameState,
  DailyTrial,
  Sector,
} from './types';

// ─────────────────────────────────────────────────────────────────────────────────
// APPLICATION STATE TYPES
// ─────────────────────────────────────────────────────────────────────────────────

type ScreenType = 
  | 'void'      // The beginning - dark, still
  | 'awakening' // First-time intro sequence
  | 'nexus'     // Main hub
  | 'sector'    // Inside a sector viewing chambers
  | 'trial'     // Active gameplay
  | 'reflection' // Post-session analysis
  | 'profile'   // Deep player stats
  | 'cosmos'    // Galaxy map (advanced)
  | 'event';    // Special event screen

interface AppState {
  currentScreen: ScreenType;
  previousScreen: ScreenType | null;
  isFirstTime: boolean;
  sessionActive: boolean;
  currentSectorId: string | null;
  currentChamberId: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────────────────────────────────────────────

const createInitialPlayerMind = (): PlayerMindModel => ({
  id: `player_${Date.now()}`,
  createdAt: Date.now(),
  lastUpdated: Date.now(),
  totalSessions: 0,
  totalTrials: 0,
  lifetimeAccuracy: 0,
  evolutionStage: 1,
  cognitiveVector: {
    perception: 50,
    spatial: 50,
    logic: 50,
    temporal: 50,
    working_memory: 50,
    pattern_recognition: 50,
    inhibition: 50,
    flexibility: 50,
  },
  reactionProfile: {
    mean: 800,
    median: 750,
    variance: 100,
    percentile_25: 600,
    percentile_75: 900,
    trend: 'stable',
    fatigueSignal: 0,
  },
  riskProfile: {
    riskTolerance: 0.5,
    speedAccuracyTradeoff: 0.5,
    hesitationFrequency: 0.2,
    changeOfMindRate: 0.1,
    pressureResponse: 'neutral',
  },
  fatigueModel: {
    sessionDuration: 0,
    roundsPlayed: 0,
    responseTimeDeviation: 0,
    accuracyDecline: 0,
    microPauseFrequency: 0,
    estimatedFatigue: 0,
    recommendedBreak: false,
    optimalSessionLength: 15,
  },
  learningCurves: new Map(),
  behaviorSignature: {
    preferredScreenRegion: { x: 0.5, y: 0.5, radius: 0.3 },
    scanPattern: 'center-out',
    peakPerformanceTime: 5,
    warmupRounds: 3,
    cooldownSignal: 0,
    confidenceThreshold: 0.7,
    revisionRate: 0.1,
    intuitionVsAnalysis: 0.5,
  },
  currentMood: 'focused',
});

const createMockReflection = (): SessionReflection => ({
  headline: 'Growing Stronger',
  subheadline: 'Your pattern recognition showed notable improvement. The void notices your dedication.',
  insights: [
    {
      id: 'growth_1',
      category: 'growth',
      message: 'Your reaction time improved by 15% compared to your first session. The mind adapts.',
      subtext: 'Pattern recognition: improving',
      conditions: [],
      priority: 80,
      cooldown: 0,
      tone: 'encouraging',
      duration: 'standard',
    },
    {
      id: 'pattern_1',
      category: 'pattern',
      message: 'You perform better on spatial challenges than memory challenges. Consider focusing on memory training.',
      subtext: 'Spatial vs Memory balance',
      conditions: [],
      priority: 60,
      cooldown: 0,
      tone: 'neutral',
      duration: 'standard',
    },
  ],
  highlightedMetric: {
    label: 'ACCURACY',
    value: '83%',
    context: 'Above your recent average',
    trend: 'up',
  },
  suggestion: 'Try the Prisma sector for color perception training',
  overallTone: 'encouraging',
});

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN APPLICATION
// ─────────────────────────────────────────────────────────────────────────────────

export const CosmosMindApp: React.FC = () => {
  // ── Loading State ──
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Awakening...');
  
  // ── State Management ──
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'void',
    previousScreen: null,
    isFirstTime: true,
    sessionActive: false,
    currentSectorId: null,
    currentChamberId: null,
  });
  
  const [playerMind, setPlayerMind] = useState<PlayerMindModel>(createInitialPlayerMind());
  const [currentReflection, setCurrentReflection] = useState<SessionReflection | null>(null);
  const [unlockedSectors, setUnlockedSectors] = useState<string[]>(['genesis']);
  const [sectorProgress, setSectorProgress] = useState<Record<string, number>>({});
  const [completedChambers, setCompletedChambers] = useState<string[]>([]);
  const [dailyTrial, setDailyTrial] = useState<DailyTrial | null>(null);
  
  // ── Session tracking ──
  const sessionStartTime = useRef<number>(0);
  const sessionRoundsPlayed = useRef<number>(0);
  const sessionTotalResponseTime = useRef<number>(0);
  const sessionCorrectAnswers = useRef<number>(0);
  
  // ── Animation Values ──
  const screenTransition = useRef(new Animated.Value(1)).current;
  
  // ── Initialize from persistent storage ──
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setLoadingMessage('Loading mind data...');
        const savedData = await gameStorage.initialize();
        
        // Load persisted data into state
        setPlayerMind(savedData.playerMind);
        setUnlockedSectors(savedData.unlockedSectors);
        setSectorProgress(savedData.sectorProgress);
        setCompletedChambers(savedData.completedChambers);
        
        // Check if this is truly first time (no sessions played)
        const isFirstTime = savedData.playerMind.totalSessions === 0;
        
        setAppState(prev => ({
          ...prev,
          isFirstTime,
        }));
        
        setLoadingMessage('Ready');
        
        // Small delay for smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        
        console.log('🎮 Game initialized with saved data:', {
          sessions: savedData.playerMind.totalSessions,
          accuracy: Math.round(savedData.playerMind.lifetimeAccuracy * 100) + '%',
          completedChambers: savedData.completedChambers.length,
          unlockedSectors: savedData.unlockedSectors,
        });
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setIsLoading(false);
      }
    };
    
    initializeGame();
  }, []);
  
  // ── Navigation ──
  const navigateTo = useCallback((screen: ScreenType, options?: { 
    sectorId?: string;
    chamberId?: string;
  }) => {
    // Haptic feedback for navigation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Transition out
    Animated.timing(screenTransition, {
      toValue: 0,
      duration: 300,
      easing: CINEMATIC_EASING.smoothIn,
      useNativeDriver: true,
    }).start(() => {
      // Update state
      setAppState(prev => ({
        ...prev,
        previousScreen: prev.currentScreen,
        currentScreen: screen,
        currentSectorId: options?.sectorId || prev.currentSectorId,
        currentChamberId: options?.chamberId || prev.currentChamberId,
      }));
      
      // Transition in
      Animated.timing(screenTransition, {
        toValue: 1,
        duration: 500,
        easing: CINEMATIC_EASING.heavyOut,
        useNativeDriver: true,
      }).start();
    });
  }, []);
  
  // ── Event Handlers ──
  const handleAwaken = useCallback(() => {
    setAppState(prev => ({ ...prev, isFirstTime: false }));
    navigateTo('nexus');
  }, [navigateTo]);
  
  const handleSectorSelect = useCallback((sectorId: string) => {
    navigateTo('sector', { sectorId });
  }, [navigateTo]);
  
  const handleProfileOpen = useCallback(() => {
    navigateTo('profile');
  }, [navigateTo]);
  
  const handleDailyTrialOpen = useCallback(() => {
    // Generate today's trial if not exists
    if (!dailyTrial) {
      const trial = generateDailyTrial(new Date());
      setDailyTrial(trial);
    }
    // Daily challenge uses genesis sector as base
    navigateTo('trial', { sectorId: 'genesis', chamberId: 'daily_challenge' });
  }, [navigateTo, dailyTrial]);
  
  const handleSessionStart = useCallback(() => {
    // Track session start
    sessionStartTime.current = Date.now();
    sessionRoundsPlayed.current = 0;
    sessionTotalResponseTime.current = 0;
    sessionCorrectAnswers.current = 0;
  }, []);

  const handleRoundComplete = useCallback((isCorrect: boolean, responseTime: number) => {
    // Track round data for the session
    sessionRoundsPlayed.current += 1;
    sessionTotalResponseTime.current += responseTime;
    if (isCorrect) {
      sessionCorrectAnswers.current += 1;
    }
  }, []);

  const handleSessionComplete = useCallback((score: number, accuracy: number) => {
    const sessionDuration = Math.round((Date.now() - sessionStartTime.current) / 1000);
    const avgResponseTime = sessionRoundsPlayed.current > 0 
      ? sessionTotalResponseTime.current / sessionRoundsPlayed.current 
      : 800;
    
    // Record session to persistent storage
    if (appState.currentSectorId && appState.currentChamberId) {
      gameStorage.recordSession({
        sectorId: appState.currentSectorId,
        chamberId: appState.currentChamberId,
        accuracy,
        responseTime: avgResponseTime,
        score,
        roundsPlayed: sessionRoundsPlayed.current || 1,
        duration: sessionDuration,
      });
      
      // Mark chamber as completed
      gameStorage.completeChamber(appState.currentChamberId);
      
      // Update sector progress
      const currentSector = SECTORS.find(s => s.id === appState.currentSectorId);
      if (currentSector) {
        const completedChamberIds = gameStorage.getCompletedChambers();
        const sectorChamberIds = currentSector.chambers.map(c => c.id);
        const completedInSector = completedChamberIds.filter(id => sectorChamberIds.includes(id)).length;
        const progress = completedInSector / currentSector.totalChambers;
        
        gameStorage.updateSectorProgress(appState.currentSectorId, progress);
        
        // Check if sector is now complete - unlock next sectors
        if (completedInSector >= currentSector.totalChambers) {
          const sectorUnlockMap: Record<string, string[]> = {
            'genesis': ['prisma', 'void'],
            'prisma': ['axiom'],
            'void': ['chronos'],
            'axiom': ['nexus'],
            'chronos': ['nexus'],
            'nexus': ['entropy', 'oracle'],
            'entropy': ['abyss'],
            'oracle': ['abyss'],
            'abyss': ['transcendence'],
          };
          
          const sectorsToUnlock = sectorUnlockMap[appState.currentSectorId] || [];
          sectorsToUnlock.forEach(sectorId => {
            gameStorage.unlockSector(sectorId);
          });
        }
      }
      
      // Force save to persist data immediately
      gameStorage.forceSave();
      
      // Sync state with storage
      setPlayerMind(gameStorage.getPlayerMind());
      setCompletedChambers(gameStorage.getCompletedChambers());
      setUnlockedSectors(gameStorage.getUnlockedSectors());
      setSectorProgress(gameStorage.getAllSectorProgress());
    }
    
    // Generate reflection based on real data
    const savedMind = gameStorage.getPlayerMind();
    const reflection: SessionReflection = {
      headline: accuracy >= 0.8 ? 'Excellent Performance!' : accuracy >= 0.6 ? 'Growing Stronger' : 'Keep Practicing',
      subheadline: `You completed ${sessionRoundsPlayed.current} rounds with ${Math.round(accuracy * 100)}% accuracy.`,
      insights: [
        {
          id: 'accuracy_insight',
          category: accuracy >= savedMind.lifetimeAccuracy ? 'mastery' : 'growth',
          message: accuracy >= savedMind.lifetimeAccuracy 
            ? `Above your lifetime average of ${Math.round(savedMind.lifetimeAccuracy * 100)}%!`
            : `Room to grow. Your lifetime average is ${Math.round(savedMind.lifetimeAccuracy * 100)}%.`,
          subtext: `Session accuracy: ${Math.round(accuracy * 100)}%`,
          conditions: [],
          priority: 80,
          cooldown: 0,
          tone: 'encouraging',
          duration: 'standard',
        },
        {
          id: 'speed_insight',
          category: avgResponseTime < savedMind.reactionProfile.mean ? 'tempo' : 'pattern',
          message: avgResponseTime < savedMind.reactionProfile.mean
            ? `Quick thinking! Faster than your average of ${Math.round(savedMind.reactionProfile.mean)}ms.`
            : `Your reaction time averaged ${Math.round(avgResponseTime)}ms.`,
          subtext: `Response time: ${Math.round(avgResponseTime)}ms`,
          conditions: [],
          priority: 60,
          cooldown: 0,
          tone: 'encouraging',
          duration: 'standard',
        },
      ],
      highlightedMetric: {
        label: 'ACCURACY',
        value: `${Math.round(accuracy * 100)}%`,
        context: accuracy >= savedMind.lifetimeAccuracy ? 'Above average!' : 'Keep improving',
        trend: accuracy >= savedMind.lifetimeAccuracy ? 'up' : 'stable',
      },
      suggestion: savedMind.totalSessions < 5 
        ? 'Complete more sessions to unlock new dimensions'
        : 'Try challenging yourself with harder chambers',
      overallTone: accuracy >= 0.7 ? 'encouraging' : 'challenging',
    };
    setCurrentReflection(reflection);
    
    navigateTo('reflection');
  }, [navigateTo, appState.currentChamberId, appState.currentSectorId]);
  
  const handleChamberSelect = useCallback((chamberId: string) => {
    navigateTo('trial', { chamberId });
  }, [navigateTo]);
  
  const handleExitGame = useCallback(() => {
    if (appState.currentSectorId) {
      navigateTo('sector', { sectorId: appState.currentSectorId });
    } else {
      navigateTo('nexus');
    }
  }, [navigateTo, appState.currentSectorId]);
  
  const handleContinueFromReflection = useCallback(() => {
    setCurrentReflection(null);
    navigateTo('nexus');
  }, [navigateTo]);
  
  const handleBackToNexus = useCallback(() => {
    navigateTo('nexus');
  }, [navigateTo]);
  
  // ── Initialization ──
  useEffect(() => {
    // Initialize systems
    eventScheduler.checkAndGenerateEvents();
    
    // Generate daily trial
    const trial = generateDailyTrial(new Date());
    setDailyTrial(trial);
    
    // Start in void
    setTimeout(() => {
      // Could auto-skip void for returning players
      if (!appState.isFirstTime) {
        navigateTo('nexus');
      }
    }, 100);
  }, []);
  
  // ── Hardware Back Button Handler ──
  useEffect(() => {
    const handleBackPress = () => {
      const { currentScreen, previousScreen, currentSectorId } = appState;
      
      // Define back navigation logic for each screen
      switch (currentScreen) {
        case 'void':
          // On void screen, let app close (return false)
          return false;
          
        case 'nexus':
          // On nexus (main hub), let app close
          return false;
          
        case 'sector':
          // Go back to nexus
          navigateTo('nexus');
          return true;
          
        case 'trial':
          // Go back to sector if we came from there, otherwise nexus
          if (currentSectorId) {
            navigateTo('sector', { sectorId: currentSectorId });
          } else {
            navigateTo('nexus');
          }
          return true;
          
        case 'reflection':
          // Go back to nexus
          setCurrentReflection(null);
          navigateTo('nexus');
          return true;
          
        case 'profile':
          // Go back to nexus
          navigateTo('nexus');
          return true;
          
        case 'cosmos':
          // Go back to nexus
          navigateTo('nexus');
          return true;
          
        default:
          // Default: go to nexus
          navigateTo('nexus');
          return true;
      }
    };
    
    // Add event listener
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    // Cleanup
    return () => backHandler.remove();
  }, [appState, navigateTo]);
  
  // ── Nav Bar Configuration ──
  const navItems = [
    { id: 'nexus', icon: '🌀', label: 'NEXUS', color: '#7B68EE' },
    { id: 'cosmos', icon: '🌌', label: 'COSMOS', color: '#00FFFF' },
    { id: 'profile', icon: '🔮', label: 'MIND', color: '#4ECDC4' },
  ];
  
  const handleNavSelect = useCallback((id: string) => {
    navigateTo(id as ScreenType);
  }, [navigateTo]);
  
  // ── Render Current Screen ──
  const renderScreen = () => {
    const currentSector = appState.currentSectorId ? getSectorById(appState.currentSectorId) : null;
    
    switch (appState.currentScreen) {
      case 'void':
        return <VoidScreen onAwaken={handleAwaken} />;
        
      case 'nexus':
        return (
          <NexusScreen
            playerMind={playerMind}
            onSectorSelect={handleSectorSelect}
            onProfileOpen={handleProfileOpen}
            onDailyTrialOpen={handleDailyTrialOpen}
            unlockedSectors={unlockedSectors}
            sectorProgress={sectorProgress}
          />
        );
      
      case 'sector':
        return currentSector ? (
          <SectorDetailScreen
            sector={currentSector}
            completedChambers={completedChambers}
            onChamberSelect={handleChamberSelect}
            onBack={handleBackToNexus}
          />
        ) : (
          <NexusScreen
            playerMind={playerMind}
            onSectorSelect={handleSectorSelect}
            onProfileOpen={handleProfileOpen}
            onDailyTrialOpen={handleDailyTrialOpen}
            unlockedSectors={unlockedSectors}
            sectorProgress={sectorProgress}
          />
        );
      
      case 'trial':
        return currentSector ? (
          <GameScreen
            sectorId={currentSector.id}
            chamberId={appState.currentChamberId || 'default'}
            sectorColor={currentSector.color}
            onComplete={handleSessionComplete}
            onExit={handleExitGame}
          />
        ) : (
          <NexusScreen
            playerMind={playerMind}
            onSectorSelect={handleSectorSelect}
            onProfileOpen={handleProfileOpen}
            onDailyTrialOpen={handleDailyTrialOpen}
            unlockedSectors={unlockedSectors}
            sectorProgress={sectorProgress}
          />
        );
        
      case 'reflection':
        return currentReflection ? (
          <ReflectionScreen
            reflection={currentReflection}
            onContinue={handleContinueFromReflection}
            onViewDetails={() => {}}
          />
        ) : null;
        
      case 'profile':
        return (
          <ProfileScreen
            playerMind={playerMind}
            onBack={handleBackToNexus}
          />
        );
      
      case 'cosmos':
        return (
          <CosmosScreen
            playerMind={playerMind}
            unlockedSectors={unlockedSectors}
            sectorProgress={sectorProgress}
            onSectorSelect={handleSectorSelect}
            onBack={handleBackToNexus}
          />
        );
        
      // For now, other screens redirect to nexus
      default:
        return (
          <NexusScreen
            playerMind={playerMind}
            onSectorSelect={handleSectorSelect}
            onProfileOpen={handleProfileOpen}
            onDailyTrialOpen={handleDailyTrialOpen}
            unlockedSectors={unlockedSectors}
            sectorProgress={sectorProgress}
          />
        );
    }
  };
  
  // ── Show/Hide Nav Bar ──
  const showNavBar = ['nexus', 'cosmos', 'profile'].includes(appState.currentScreen);
  
  // ── Loading Screen ──
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#0A0A1A', '#050510']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContent}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.loadingIcon}
            resizeMode="contain"
          />
          <Text style={styles.loadingTitle}>PUZZLE MIND</Text>
          <ActivityIndicator size="small" color="#7B68EE" style={{ marginTop: 24 }} />
          <Text style={styles.loadingMessage}>{loadingMessage}</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Screen Content */}
      <Animated.View
        style={[
          styles.screenContainer,
          {
            opacity: screenTransition,
            transform: [{
              scale: screenTransition.interpolate({
                inputRange: [0, 1],
                outputRange: [0.98, 1],
              }),
            }],
          },
        ]}
      >
        {renderScreen()}
      </Animated.View>
      
      {/* Navigation Bar */}
      {showNavBar && (
        <CosmicNavBar
          items={navItems}
          activeId={appState.currentScreen}
          onSelect={handleNavSelect}
        />
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
    backgroundColor: '#000000',
  },
  screenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 20,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: 8,
  },
  loadingMessage: {
    fontSize: 12,
    color: '#666',
    letterSpacing: 2,
    marginTop: 12,
  },
});

export default CosmosMindApp;
