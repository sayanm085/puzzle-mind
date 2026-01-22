// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 SCREEN COMPONENTS - Cinematic Screen Experiences
// Each screen is a journey, not a destination
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CINEMATIC_EASING } from '../engine/VisualEngine';
import {
  BreathingBackground,
  VoidParticles,
  DimensionalButton,
  GlowingText,
  FloatingCard,
  ProgressRing,
  SectionDivider,
} from './SpatialUI';
import {
  DimensionalPortal,
  CosmicNavBar,
  ParallaxContainer,
} from './DimensionalMenu';
import {
  CognitiveRadar,
  FocusWave,
  InsightCard,
  CognitiveBalance,
  PerformancePulse,
} from './AnalyticsVisualization';
import { SECTORS } from '../universe/UniverseStructure';
import dialogueSystem from '../systems/DialogueSystem';
import { PlayerMindModel, SessionReflection } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// VOID SCREEN - The Beginning
// "Empty. Still. The void observes your presence."
// ─────────────────────────────────────────────────────────────────────────────────

interface VoidScreenProps {
  onAwaken: () => void;
}

export const VoidScreen: React.FC<VoidScreenProps> = ({ onAwaken }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const orbScale = useRef(new Animated.Value(0.3)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Dramatic entrance sequence
    Animated.sequence([
      // Fade in background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: CINEMATIC_EASING.smoothInOut,
        useNativeDriver: true,
      }),
      // Expand orb
      Animated.parallel([
        Animated.spring(orbScale, {
          toValue: 1,
          tension: 20,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          easing: CINEMATIC_EASING.smoothOut,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      // Reveal text
      Animated.timing(textFade, {
        toValue: 1,
        duration: 1200,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
      Animated.delay(800),
      // Show button
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 600,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Continuous breathing effect
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
  }, []);
  
  return (
    <BreathingBackground primaryColor="#08081A" secondaryColor="#000005">
      <Animated.View style={[styles.voidContainer, { opacity: fadeAnim }]}>
        <VoidParticles count={100} color="#FFFFFF" speed={0.4} />
        
        {/* Outer glow ring */}
        <Animated.View
          style={[
            styles.voidOuterGlow,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.15],
              }),
              transform: [{
                scale: breatheAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.15],
                }),
              }],
            },
          ]}
        />
        
        {/* Central orb */}
        <Animated.View
          style={[
            styles.voidOrb,
            {
              transform: [
                { scale: orbScale },
                {
                  scale: breatheAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.08],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#1A1A3A', '#0A0A1A']}
            style={styles.voidOrbGradient}
          />
          {/* Inner pulse core */}
          <Animated.View 
            style={[
              styles.voidOrbCore,
              {
                opacity: breatheAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
                transform: [{
                  scale: breatheAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                }],
              },
            ]} 
          />
        </Animated.View>
        
        {/* Text sequence */}
        <Animated.View style={[styles.voidTextContainer, { opacity: textFade }]}>
          <Animated.Text 
            style={[
              styles.voidTitle,
              {
                transform: [{
                  translateY: textFade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                }],
              },
            ]}
          >
            THE VOID
          </Animated.Text>
          <Text style={styles.voidSubtitle}>O B S E R V E S</Text>
          <View style={styles.voidDivider} />
          <Text style={styles.voidMessage}>
            Stillness precedes understanding.{'\n'}
            Your mind is ready.
          </Text>
        </Animated.View>
        
        {/* Awaken button */}
        <Animated.View 
          style={[
            styles.voidButtonContainer, 
            { 
              opacity: buttonFade,
              transform: [{
                translateY: buttonFade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              }],
            }
          ]}
        >
          <DimensionalButton
            title="AWAKEN"
            subtitle="Begin the journey"
            color="#7B68EE"
            onPress={onAwaken}
            size="large"
            glow
          />
        </Animated.View>
      </Animated.View>
    </BreathingBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// NEXUS SCREEN - The Hub
// "The nexus of all dimensions. Your journey begins here."
// ─────────────────────────────────────────────────────────────────────────────────

interface NexusScreenProps {
  playerMind: PlayerMindModel;
  onSectorSelect: (sectorId: string) => void;
  onProfileOpen: () => void;
  onDailyTrialOpen: () => void;
  unlockedSectors: string[];
  sectorProgress: Record<string, number>;
}

export const NexusScreen: React.FC<NexusScreenProps> = ({
  playerMind,
  onSectorSelect,
  onProfileOpen,
  onDailyTrialOpen,
  unlockedSectors,
  sectorProgress,
}) => {
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const dailyCardAnim = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Staggered entrance animations for premium feel
    Animated.stagger(150, [
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 600,
        easing: CINEMATIC_EASING.heavyOut,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
      Animated.timing(dailyCardAnim, {
        toValue: 1,
        duration: 400,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
      Animated.timing(gridAnim, {
        toValue: 1,
        duration: 500,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Get greeting based on time and player state
  const greeting = getTimeBasedGreeting(playerMind);
  
  // Only show first 6 sectors for cleaner grid
  const visibleSectors = SECTORS.slice(0, 6);
  
  return (
    <BreathingBackground primaryColor="#0A0F1A" secondaryColor="#020408">
      <VoidParticles count={60} color="#7B68EE" speed={0.25} />
      
      <View style={styles.nexusContainer}>
        {/* Header with stagger animation */}
        <Animated.View
          style={[
            styles.nexusHeader,
            {
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              }],
            },
          ]}
        >
          <View>
            <Text style={styles.nexusGreeting}>{greeting.text}</Text>
            <Text style={styles.nexusTitle}>THE NEXUS</Text>
          </View>
          <TouchableOpacity onPress={onProfileOpen} style={styles.profileButton}>
            <ProgressRing
              progress={Math.min(playerMind.totalSessions / 10, 1)}
              size={54}
              color="#7B68EE"
            >
              <Text style={styles.profileLevel}>{playerMind.totalSessions}</Text>
            </ProgressRing>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Daily Trial Banner with enhanced animation */}
        <Animated.View
          style={{
            opacity: dailyCardAnim,
            transform: [{
              translateX: dailyCardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-30, 0],
              }),
            }, {
              scale: dailyCardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            }],
          }}
        >
          <TouchableOpacity onPress={onDailyTrialOpen} activeOpacity={0.85}>
            <FloatingCard color="#FFE66D" style={styles.dailyTrialCard}>
              <View style={styles.dailyTrialContent}>
                <View style={styles.dailyTrialInfo}>
                  <View style={styles.dailyTrialBadge}>
                    <Text style={styles.dailyTrialLabel}>DAILY TRIAL</Text>
                  </View>
                  <Text style={styles.dailyTrialTitle}>Today's Challenge Awaits</Text>
                  <Text style={styles.dailyTrialSubtext}>Earn bonus rewards</Text>
                </View>
                <View style={styles.dailyTrialIconContainer}>
                  <Text style={styles.dailyTrialIcon}>⚡</Text>
                </View>
              </View>
            </FloatingCard>
          </TouchableOpacity>
        </Animated.View>
        
        <SectionDivider color="#7B68EE" />
        
        {/* Sector Grid with enhanced animation */}
        <Animated.View
          style={{
            flex: 1,
            opacity: gridAnim,
            transform: [{
              translateY: gridAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            }],
          }}
        >
          <Text style={styles.sectorGridTitle}>DIMENSIONAL PORTALS</Text>
          <ScrollView
            style={styles.sectorScroll}
            contentContainerStyle={styles.sectorGrid}
            showsVerticalScrollIndicator={false}
          >
            {visibleSectors.slice(0, 4).map((sector, index) => (
              <DimensionalPortal
                key={sector.id}
                sector={sector}
                onEnter={onSectorSelect}
                index={index}
                isLocked={!unlockedSectors.includes(sector.id)}
                progress={sectorProgress[sector.id] || 0}
              />
            ))}
            {/* View all button */}
            <View style={styles.viewAllContainer}>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>VIEW ALL SECTORS →</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </BreathingBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// REFLECTION SCREEN - Post-Session Insight
// "The observer speaks. Listen closely."
// ─────────────────────────────────────────────────────────────────────────────────

interface ReflectionScreenProps {
  reflection: SessionReflection;
  onContinue: () => void;
  onViewDetails: () => void;
}

export const ReflectionScreen: React.FC<ReflectionScreenProps> = ({
  reflection,
  onContinue,
  onViewDetails,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [showInsights, setShowInsights] = useState(false);
  
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: CINEMATIC_EASING.smoothOut,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          easing: CINEMATIC_EASING.heavyOut,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(500),
    ]).start(() => setShowInsights(true));
  }, []);
  
  // Build radar data from reflection
  const radarData = [
    { id: 'speed', label: 'SPEED', value: 75, color: '#4ECDC4', trend: 0, percentile: 70 },
    { id: 'accuracy', label: 'ACCURACY', value: 80, color: '#7B68EE', trend: 5, percentile: 75 },
    { id: 'focus', label: 'FOCUS', value: 70, color: '#FFE66D', trend: 0, percentile: 65 },
    { id: 'growth', label: 'GROWTH', value: 60, color: '#FF6B6B', trend: 10, percentile: 55 },
    { id: 'flow', label: 'FLOW', value: 65, color: '#00FFFF', trend: 2, percentile: 60 },
  ];
  
  return (
    <BreathingBackground primaryColor="#0A1628" secondaryColor="#000510">
      <VoidParticles count={30} color="#4ECDC4" speed={0.2} />
      
      <ScrollView style={styles.reflectionContainer} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header */}
          <View style={styles.reflectionHeader}>
            <Text style={styles.reflectionLabel}>SESSION COMPLETE</Text>
            <Text style={styles.reflectionTitle}>{reflection.headline}</Text>
            <Text style={styles.reflectionSubtitle}>{reflection.subheadline}</Text>
          </View>
          
          {/* Stats Overview */}
          <View style={styles.reflectionStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{reflection.insights.length}</Text>
              <Text style={styles.statLabel}>INSIGHTS</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{reflection.highlightedMetric.value}</Text>
              <Text style={styles.statLabel}>{reflection.highlightedMetric.label}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{reflection.overallTone === 'celebratory' ? '⭐' : '✨'}</Text>
              <Text style={styles.statLabel}>TONE</Text>
            </View>
          </View>
          
          <SectionDivider color="#4ECDC4" />
          
          {/* Cognitive Radar */}
          <View style={styles.radarSection}>
            <Text style={styles.sectionTitle}>COGNITIVE MAP</Text>
            <CognitiveRadar metrics={radarData} size={220} color="#4ECDC4" />
          </View>
          
          {/* Insights */}
          {showInsights && (
            <View style={styles.insightsSection}>
              <Text style={styles.sectionTitle}>OBSERVATIONS</Text>
              {reflection.insights.map((insight, index) => (
                <InsightCard
                  key={index}
                  title={insight.category.toUpperCase()}
                  description={insight.message}
                  icon={getObservationIcon(insight.category)}
                  color={getObservationColor(insight.category)}
                  intensity={insight.priority / 100}
                />
              ))}
            </View>
          )}
          
          {/* Actions */}
          <View style={styles.reflectionActions}>
            <DimensionalButton
              title="CONTINUE"
              color="#4ECDC4"
              onPress={onContinue}
              size="large"
            />
            <TouchableOpacity onPress={onViewDetails} style={styles.detailsLink}>
              <Text style={styles.detailsLinkText}>VIEW DETAILED ANALYSIS →</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </BreathingBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// PROFILE SCREEN - Deep Player Analysis
// ─────────────────────────────────────────────────────────────────────────────────

interface ProfileScreenProps {
  playerMind: PlayerMindModel;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  playerMind,
  onBack,
}) => {
  const entranceAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 600,
      easing: CINEMATIC_EASING.heavyOut,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Build radar data from cognitive vector
  const radarData = [
    { id: 'spatial', label: 'SPATIAL', value: playerMind.cognitiveVector.spatial, color: '#4ECDC4', trend: 0, percentile: 70 },
    { id: 'pattern', label: 'PATTERN', value: playerMind.cognitiveVector.pattern_recognition, color: '#7B68EE', trend: 5, percentile: 75 },
    { id: 'memory', label: 'MEMORY', value: playerMind.cognitiveVector.working_memory, color: '#FFE66D', trend: 0, percentile: 65 },
    { id: 'logic', label: 'LOGIC', value: playerMind.cognitiveVector.logic, color: '#FF6B6B', trend: 0, percentile: 60 },
    { id: 'perception', label: 'PERCEPT', value: playerMind.cognitiveVector.perception, color: '#00FFFF', trend: 3, percentile: 72 },
    { id: 'temporal', label: 'TEMPORAL', value: playerMind.cognitiveVector.temporal, color: '#FF69B4', trend: 0, percentile: 68 },
  ];
  
  // Recent focus data (mock for now)
  const focusHistory = [0.6, 0.7, 0.65, 0.8, 0.75, 0.9, 0.85, 0.7, 0.8, 0.85];
  
  return (
    <BreathingBackground primaryColor="#0F0F2A" secondaryColor="#050510">
      <Animated.View
        style={[
          styles.profileContainer,
          {
            opacity: entranceAnim,
            transform: [{
              translateY: entranceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← RETURN</Text>
          </TouchableOpacity>
          <Text style={styles.profileTitle}>MIND PROFILE</Text>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Overview Stats */}
          <View style={styles.overviewStats}>
            <View style={styles.overviewStatItem}>
              <Text style={styles.overviewStatValue}>{playerMind.totalSessions}</Text>
              <Text style={styles.overviewStatLabel}>SESSIONS</Text>
            </View>
            <PerformancePulse
              recentScores={[
                playerMind.cognitiveVector.perception - 10,
                playerMind.cognitiveVector.perception - 5,
                playerMind.cognitiveVector.perception,
              ]}
              color="#7B68EE"
            />
            <View style={styles.overviewStatItem}>
              <Text style={styles.overviewStatValue}>{playerMind.totalSessions}</Text>
              <Text style={styles.overviewStatLabel}>STREAK</Text>
            </View>
          </View>
          
          <SectionDivider color="#7B68EE" />
          
          {/* Cognitive Radar */}
          <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>COGNITIVE PROFILE</Text>
            <CognitiveRadar metrics={radarData} size={250} color="#7B68EE" />
          </View>
          
          {/* Cognitive Balance */}
          <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>THINKING STYLE</Text>
            <View style={styles.balanceContainer}>
              <CognitiveBalance
                analysis={playerMind.behaviorSignature?.intuitionVsAnalysis || 0.5}
                speed={(100 - playerMind.reactionProfile.mean / 20) / 100}
                size={160}
              />
              <View style={styles.balanceDescription}>
                <Text style={styles.balanceText}>
                  {getThinkingStyleDescription(playerMind)}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Focus Trend */}
          <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>FOCUS STABILITY</Text>
            <FocusWave data={focusHistory} color="#4ECDC4" />
          </View>
          
          {/* Behavior Insights */}
          <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>BEHAVIORAL INSIGHTS</Text>
            <InsightCard
              title="Peak Performance"
              description={`You perform best during ${getPeakTimeDescription(playerMind)}. Your focus is sharpest after ${playerMind.behaviorSignature?.peakPerformanceTime || 'warming up'}.`}
              icon="⏰"
              color="#FFE66D"
            />
            <InsightCard
              title="Learning Pattern"
              description={`You're a ${getLearnerTypeDescription(playerMind)} learner. Each challenge brings new mastery.`}
              icon="📈"
              color="#4ECDC4"
            />
          </View>
        </ScrollView>
      </Animated.View>
    </BreathingBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

function getTimeBasedGreeting(playerMind: PlayerMindModel): { text: string } {
  const hour = new Date().getHours();
  const mood = playerMind.currentMood;
  
  if (hour < 6) return { text: 'The void stirs...' };
  if (hour < 12) {
    if (mood === 'focused') return { text: 'Mind sharp and ready.' };
    return { text: 'A new day of discovery.' };
  }
  if (hour < 17) {
    if (mood === 'fatigued') return { text: 'Rest when needed.' };
    return { text: 'The journey continues.' };
  }
  if (hour < 21) {
    if (mood === 'flowing') return { text: 'You\'re in the flow.' };
    return { text: 'Evening clarity.' };
  }
  return { text: 'Night sharpens focus.' };
}

function getObservationIcon(type: string): string {
  const icons: Record<string, string> = {
    strength: '💪',
    growth: '📈',
    pattern: '🔮',
    warning: '⚠️',
    achievement: '🏆',
    insight: '💡',
  };
  return icons[type] || '🔹';
}

function getObservationColor(type: string): string {
  const colors: Record<string, string> = {
    strength: '#4ECDC4',
    growth: '#7B68EE',
    pattern: '#FFE66D',
    warning: '#FF6B6B',
    achievement: '#FFE66D',
    insight: '#00FFFF',
  };
  return colors[type] || '#FFFFFF';
}

function getThinkingStyleDescription(playerMind: PlayerMindModel): string {
  const intuition = playerMind.behaviorSignature?.intuitionVsAnalysis || 0.5;
  
  if (intuition < 0.3) {
    return 'You trust your gut. Quick decisions come naturally, and you often see the answer before understanding why.';
  } else if (intuition > 0.7) {
    return 'You\'re methodical and precise. You prefer to understand patterns fully before committing to a solution.';
  }
  return 'You balance intuition with analysis, adapting your approach to each challenge\'s demands.';
}

function getPeakTimeDescription(playerMind: PlayerMindModel): string {
  const time = playerMind.behaviorSignature?.peakPerformanceTime;
  if (!time) return 'any time';
  if (time < 3) return 'the first few challenges';
  if (time < 10) return 'mid-session, after warming up';
  return 'extended sessions';
}

function getLearnerTypeDescription(playerMind: PlayerMindModel): string {
  const curves = Object.values(playerMind.learningCurves);
  if (curves.length === 0) return 'natural';
  
  const avgRate = curves.reduce((sum, c) => sum + c.adaptationRate, 0) / curves.length;
  
  if (avgRate < 3) return 'rapid';
  if (avgRate < 6) return 'steady';
  return 'deliberate';
}

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Void Screen
  voidContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voidOuterGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#7B68EE',
    top: '25%',
  },
  voidOrb: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  voidOrbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voidOrbCore: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7B68EE',
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  voidTextContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  voidTitle: {
    fontSize: 48,
    fontWeight: '100',
    letterSpacing: 20,
    color: '#FFFFFF',
  },
  voidSubtitle: {
    fontSize: 14,
    letterSpacing: 8,
    color: '#666666',
    marginTop: 10,
  },
  voidDivider: {
    width: 60,
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 30,
  },
  voidMessage: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  voidButtonContainer: {
    position: 'absolute',
    bottom: 100,
  },
  
  // Nexus Screen
  nexusContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  nexusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  nexusGreeting: {
    fontSize: 12,
    color: '#888888',
    letterSpacing: 2,
  },
  nexusTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  profileButton: {
    padding: 5,
  },
  profileLevel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7B68EE',
  },
  dailyTrialCard: {
    marginVertical: 10,
  },
  dailyTrialContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyTrialInfo: {
    flex: 1,
  },
  dailyTrialBadge: {
    backgroundColor: 'rgba(255, 230, 109, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  dailyTrialLabel: {
    fontSize: 9,
    color: '#FFE66D',
    letterSpacing: 2,
    fontWeight: '600',
  },
  dailyTrialTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 2,
  },
  dailyTrialSubtext: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  dailyTrialIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 230, 109, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  dailyTrialIcon: {
    fontSize: 28,
  },
  sectorGridTitle: {
    fontSize: 11,
    color: '#666666',
    letterSpacing: 3,
    marginBottom: 15,
    fontWeight: '600',
  },
  sectorScroll: {
    flex: 1,
  },
  sectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  viewAllContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  viewAllButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 25,
  },
  viewAllText: {
    fontSize: 11,
    color: '#666666',
    letterSpacing: 2,
    fontWeight: '600',
  },
  
  // Reflection Screen
  reflectionContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  reflectionHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  reflectionLabel: {
    fontSize: 10,
    color: '#4ECDC4',
    letterSpacing: 4,
    marginBottom: 10,
  },
  reflectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  reflectionSubtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  reflectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: '#666666',
    letterSpacing: 2,
    marginTop: 4,
  },
  radarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#666666',
    letterSpacing: 3,
    marginBottom: 20,
    textAlign: 'center',
  },
  insightsSection: {
    marginVertical: 20,
  },
  reflectionActions: {
    alignItems: 'center',
    marginVertical: 40,
    paddingBottom: 40,
  },
  detailsLink: {
    marginTop: 20,
    padding: 10,
  },
  detailsLinkText: {
    fontSize: 12,
    color: '#666666',
    letterSpacing: 2,
  },
  
  // Profile Screen
  profileContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  profileHeader: {
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 12,
    color: '#666666',
    letterSpacing: 2,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  overviewStatItem: {
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overviewStatLabel: {
    fontSize: 10,
    color: '#666666',
    letterSpacing: 2,
    marginTop: 4,
  },
  profileSection: {
    marginVertical: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  balanceDescription: {
    flex: 1,
    marginLeft: 20,
  },
  balanceText: {
    fontSize: 13,
    color: '#AAAAAA',
    lineHeight: 22,
  },
});

export default {
  VoidScreen,
  NexusScreen,
  ReflectionScreen,
  ProfileScreen,
};
