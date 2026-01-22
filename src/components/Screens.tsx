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
// Elite AAA-Quality Redesign
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
  const heroAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Staggered entrance animations for premium feel
    Animated.stagger(120, [
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 800,
        easing: CINEMATIC_EASING.heavyOut,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 700,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
      Animated.timing(cardsAnim, {
        toValue: 1,
        duration: 500,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
      Animated.timing(gridAnim, {
        toValue: 1,
        duration: 600,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Ambient breathing
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Hero pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  // Get greeting based on time and player state
  const greeting = getTimeBasedGreeting(playerMind);
  const accuracy = Math.round(playerMind.lifetimeAccuracy * 100);
  const stage = playerMind.evolutionStage || 1;
  
  // Only show first 4 sectors for cleaner grid
  const visibleSectors = SECTORS.slice(0, 4);
  
  // Calculate cognitive summary
  const cogVector = playerMind.cognitiveVector;
  const avgCognitive = Math.round(
    (cogVector.perception + cogVector.spatial + cogVector.logic + 
     cogVector.temporal + cogVector.working_memory + cogVector.pattern_recognition) / 6
  );
  
  return (
    <BreathingBackground primaryColor="#050810" secondaryColor="#000204">
      <VoidParticles count={40} color="#4a9eff" speed={0.15} />
      
      <ScrollView 
        style={styles.nexusContainer}
        contentContainerStyle={styles.nexusContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ══════ HEADER ══════ */}
        <Animated.View
          style={[
            styles.nexusHeader,
            {
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.nexusGreeting}>{greeting.text}</Text>
            <Text style={styles.nexusTitle}>NEXUS</Text>
          </View>
          
          <TouchableOpacity onPress={onProfileOpen} style={styles.profileButton}>
            <View style={styles.profileRing}>
              <View style={styles.profileInner}>
                <Text style={styles.profileStage}>{stage}</Text>
              </View>
              {/* Progress arc would go here */}
            </View>
            <Text style={styles.profileLabel}>MIND</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ══════ HERO STATS CARD ══════ */}
        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: heroAnim,
              transform: [
                { scale: Animated.multiply(heroAnim, pulseAnim) },
                {
                  translateY: heroAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(74, 158, 255, 0.08)', 'rgba(139, 92, 246, 0.04)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          />
          
          <View style={styles.heroContent}>
            {/* Main stat */}
            <View style={styles.heroMainStat}>
              <Text style={styles.heroStatValue}>{playerMind.totalSessions}</Text>
              <Text style={styles.heroStatLabel}>SESSIONS</Text>
            </View>
            
            {/* Divider */}
            <View style={styles.heroDivider} />
            
            {/* Secondary stats */}
            <View style={styles.heroSecondaryStats}>
              <View style={styles.heroSecondary}>
                <Text style={styles.secondaryValue}>{accuracy}%</Text>
                <Text style={styles.secondaryLabel}>ACCURACY</Text>
              </View>
              <View style={styles.heroSecondary}>
                <Text style={styles.secondaryValue}>{avgCognitive}</Text>
                <Text style={styles.secondaryLabel}>COGNITIVE</Text>
              </View>
              <View style={styles.heroSecondary}>
                <Text style={styles.secondaryValue}>{playerMind.totalTrials}</Text>
                <Text style={styles.secondaryLabel}>TRIALS</Text>
              </View>
            </View>
          </View>
          
          {/* Subtle bottom accent */}
          <View style={styles.heroAccent} />
        </Animated.View>

        {/* ══════ QUICK ACTIONS ══════ */}
        <Animated.View
          style={[
            styles.quickActions,
            {
              opacity: cardsAnim,
              transform: [{
                translateY: cardsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              }],
            },
          ]}
        >
          {/* Daily Challenge Card */}
          <TouchableOpacity 
            onPress={onDailyTrialOpen} 
            activeOpacity={0.8}
            style={styles.actionCard}
          >
            <LinearGradient
              colors={['rgba(251, 191, 36, 0.12)', 'rgba(251, 191, 36, 0.03)']}
              style={styles.actionGradient}
            />
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>⚡</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Daily Challenge</Text>
              <Text style={styles.actionSubtitle}>New challenge awaits</Text>
            </View>
            <View style={styles.actionArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
          
          {/* Continue Training Card */}
          <TouchableOpacity 
            onPress={() => onSectorSelect('genesis')} 
            activeOpacity={0.8}
            style={styles.actionCard}
          >
            <LinearGradient
              colors={['rgba(74, 158, 255, 0.12)', 'rgba(74, 158, 255, 0.03)']}
              style={styles.actionGradient}
            />
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🎯</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Continue</Text>
              <Text style={styles.actionSubtitle}>Resume training</Text>
            </View>
            <View style={styles.actionArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ══════ SECTOR GRID ══════ */}
        <Animated.View
          style={[
            styles.sectorSection,
            {
              opacity: gridAnim,
              transform: [{
                translateY: gridAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DIMENSIONS</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sectorGrid}>
            {visibleSectors.map((sector, index) => {
              const isLocked = !unlockedSectors.includes(sector.id);
              const progress = sectorProgress[sector.id] || 0;
              
              return (
                <TouchableOpacity
                  key={sector.id}
                  style={[
                    styles.sectorCard,
                    isLocked && styles.sectorCardLocked,
                  ]}
                  onPress={() => !isLocked && onSectorSelect(sector.id)}
                  activeOpacity={isLocked ? 1 : 0.8}
                >
                  <LinearGradient
                    colors={isLocked 
                      ? ['rgba(30, 30, 40, 0.6)', 'rgba(20, 20, 30, 0.8)']
                      : [`${sector.color}15`, `${sector.color}05`]
                    }
                    style={styles.sectorGradient}
                  />
                  
                  {/* Icon */}
                  <View style={[
                    styles.sectorIconContainer,
                    { borderColor: isLocked ? '#333' : sector.color },
                  ]}>
                    <Text style={[
                      styles.sectorIcon,
                      isLocked && styles.sectorIconLocked,
                    ]}>
                      {sector.icon}
                    </Text>
                  </View>
                  
                  {/* Info */}
                  <Text style={[
                    styles.sectorName,
                    isLocked && styles.sectorNameLocked,
                  ]}>
                    {sector.name}
                  </Text>
                  
                  {/* Progress or Lock */}
                  {isLocked ? (
                    <Text style={styles.sectorLockText}>🔒</Text>
                  ) : progress > 0 ? (
                    <View style={styles.sectorProgressBar}>
                      <View 
                        style={[
                          styles.sectorProgressFill,
                          { width: `${progress * 100}%`, backgroundColor: sector.color },
                        ]} 
                      />
                    </View>
                  ) : (
                    <Text style={styles.sectorNewText}>NEW</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* ══════ INSIGHT CARD ══════ */}
        <Animated.View
          style={[
            styles.insightSection,
            {
              opacity: gridAnim,
            },
          ]}
        >
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightLabel}>💡 INSIGHT</Text>
            </View>
            <Text style={styles.insightText}>
              {playerMind.totalSessions === 0 
                ? "Begin your journey. The void awaits your first thought."
                : playerMind.lifetimeAccuracy > 0.7
                  ? "Your pattern recognition is sharp. Challenge yourself with harder dimensions."
                  : "Consistency builds mastery. Each session strengthens neural pathways."
              }
            </Text>
          </View>
        </Animated.View>

        {/* Bottom spacing for nav bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
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
  
  // Nexus Screen - Elite Redesign
  nexusContainer: {
    flex: 1,
  },
  nexusContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  nexusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  nexusGreeting: {
    fontSize: 13,
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 4,
  },
  nexusTitle: {
    fontSize: 32,
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: 6,
  },
  profileButton: {
    alignItems: 'center',
    padding: 4,
  },
  profileRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#4a9eff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 158, 255, 0.1)',
  },
  profileInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(74, 158, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileStage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a9eff',
  },
  profileLabel: {
    fontSize: 9,
    color: '#64748b',
    letterSpacing: 1,
    marginTop: 4,
  },
  
  // Hero Stats Card
  heroCard: {
    backgroundColor: 'rgba(15, 20, 30, 0.8)',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 158, 255, 0.15)',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    padding: 24,
  },
  heroMainStat: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroStatValue: {
    fontSize: 56,
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: 2,
  },
  heroStatLabel: {
    fontSize: 11,
    color: '#64748b',
    letterSpacing: 3,
    marginTop: 4,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 20,
  },
  heroSecondaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  heroSecondary: {
    alignItems: 'center',
  },
  secondaryValue: {
    fontSize: 22,
    fontWeight: '500',
    color: '#e2e8f0',
  },
  secondaryLabel: {
    fontSize: 9,
    color: '#64748b',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  heroAccent: {
    height: 3,
    backgroundColor: '#4a9eff',
    opacity: 0.6,
  },
  
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 25, 35, 0.8)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  actionGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionEmoji: {
    fontSize: 20,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  actionArrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: '#64748b',
  },
  
  // Sector Grid Section
  sectorSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#64748b',
    letterSpacing: 3,
    fontWeight: '600',
  },
  sectionAction: {
    fontSize: 12,
    color: '#4a9eff',
    letterSpacing: 1,
  },
  sectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectorCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: 'rgba(20, 25, 35, 0.8)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  sectorCardLocked: {
    opacity: 0.5,
  },
  sectorGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  sectorIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginBottom: 12,
  },
  sectorIcon: {
    fontSize: 24,
  },
  sectorIconLocked: {
    opacity: 0.4,
  },
  sectorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectorNameLocked: {
    color: '#64748b',
  },
  sectorProgressBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  sectorProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  sectorLockText: {
    fontSize: 12,
  },
  sectorNewText: {
    fontSize: 9,
    color: '#4a9eff',
    letterSpacing: 2,
    fontWeight: '600',
  },
  
  // Insight Section
  insightSection: {
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
  },
  insightHeader: {
    marginBottom: 8,
  },
  insightLabel: {
    fontSize: 10,
    color: '#a78bfa',
    letterSpacing: 2,
    fontWeight: '600',
  },
  insightText: {
    fontSize: 14,
    color: '#c4b5fd',
    lineHeight: 20,
  },
  
  // Legacy styles kept for compatibility
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
  reflectionSectionTitle: {
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
