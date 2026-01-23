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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Path, Line, Text as SvgText, G, Polygon, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
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
import gameStorage from '../storage/GameStorage';
import { PlayerMindModel, SessionReflection } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// VOID SCREEN - The Beginning
// "Welcome to Puzzle Mind - Train Your Brain"
// ─────────────────────────────────────────────────────────────────────────────────

interface VoidScreenProps {
  onAwaken: () => void;
}

// Floating puzzle piece component
const FloatingPuzzlePiece: React.FC<{
  delay: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}> = ({ delay, x, y, size, color, rotation }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000,
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000 + Math.random() * 2000,
          easing: CINEMATIC_EASING.breathe,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000 + Math.random() * 4000,
        easing: CINEMATIC_EASING.smoothInOut,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        opacity: opacityAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.6],
        }),
        transform: [
          {
            translateY: floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -20],
            }),
          },
          {
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [`${rotation}deg`, `${rotation + 360}deg`],
            }),
          },
        ],
      }}
    >
      <Text style={{ fontSize: size, color, textShadowColor: color, textShadowRadius: 10 }}>🧩</Text>
    </Animated.View>
  );
};

export const VoidScreen: React.FC<VoidScreenProps> = ({ onAwaken }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Epic entrance sequence
    Animated.sequence([
      // Fade in background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Logo entrance with bounce
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1000,
          easing: CINEMATIC_EASING.heavyOut,
          useNativeDriver: true,
        }),
      ]),
      // Title reveal
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Subtitle
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Tagline
      Animated.timing(taglineFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(300),
      // Button
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Continuous pulse effect
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
    
    // Shimmer effect
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  // Floating puzzle pieces data
  const puzzlePieces = [
    { x: 10, y: 15, size: 24, color: '#7B68EE', rotation: 15, delay: 500 },
    { x: 85, y: 20, size: 20, color: '#4ECDC4', rotation: -20, delay: 700 },
    { x: 5, y: 45, size: 18, color: '#FFE66D', rotation: 45, delay: 900 },
    { x: 90, y: 55, size: 22, color: '#FF6B6B', rotation: -30, delay: 1100 },
    { x: 15, y: 75, size: 20, color: '#00D9FF', rotation: 60, delay: 1300 },
    { x: 80, y: 80, size: 26, color: '#FF69B4', rotation: -45, delay: 1500 },
    { x: 50, y: 10, size: 16, color: '#4ECDC4', rotation: 30, delay: 800 },
    { x: 25, y: 88, size: 18, color: '#7B68EE', rotation: -60, delay: 1000 },
  ];
  
  return (
    <View style={introStyles.container}>
      <LinearGradient
        colors={['#0A0A2E', '#1A0A3E', '#0A1A2E', '#050520']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.View style={[introStyles.content, { opacity: fadeAnim }]}>
        {/* Floating puzzle pieces background */}
        {puzzlePieces.map((piece, index) => (
          <FloatingPuzzlePiece key={index} {...piece} />
        ))}
        
        {/* Animated background circles */}
        <Animated.View
          style={[
            introStyles.bgCircle1,
            {
              opacity: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.2],
              }),
              transform: [{
                scale: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              }],
            },
          ]}
        />
        <Animated.View
          style={[
            introStyles.bgCircle2,
            {
              opacity: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.15, 0.25],
              }),
              transform: [{
                scale: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.1, 1],
                }),
              }],
            },
          ]}
        />
        
        {/* Main Logo */}
        <Animated.View
          style={[
            introStyles.logoContainer,
            {
              transform: [
                { scale: logoScale },
                {
                  rotate: logoRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-180deg', '0deg'],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Glow ring */}
          <Animated.View
            style={[
              introStyles.logoGlow,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 0.8],
                }),
                transform: [{
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.15],
                  }),
                }],
              },
            ]}
          />
          
          {/* Logo background */}
          <View style={introStyles.logoBg}>
            <Image
              source={require('../../assets/icon.png')}
              style={introStyles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
        
        {/* App Name */}
        <Animated.View
          style={[
            introStyles.titleContainer,
            {
              opacity: titleFade,
              transform: [{
                translateY: titleFade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              }],
            },
          ]}
        >
          <Text style={introStyles.titleMain}>PUZZLE</Text>
          <LinearGradient
            colors={['#7B68EE', '#4ECDC4', '#00D9FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={introStyles.titleGradientBg}
          >
            <Text style={introStyles.titleAccent}>MIND</Text>
          </LinearGradient>
        </Animated.View>
        
        {/* Subtitle */}
        <Animated.View
          style={{
            opacity: subtitleFade,
            transform: [{
              translateY: subtitleFade.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}
        >
          <Text style={introStyles.subtitle}>TRAIN YOUR BRAIN</Text>
          <View style={introStyles.subtitleLine} />
        </Animated.View>
        
        {/* Tagline */}
        <Animated.View
          style={{
            opacity: taglineFade,
            transform: [{
              translateY: taglineFade.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
            marginTop: 24,
          }}
        >
          <Text style={introStyles.tagline}>
            Challenge your cognitive abilities{'\n'}
            with immersive puzzle experiences
          </Text>
        </Animated.View>
        
        {/* Features */}
        <Animated.View
          style={[
            introStyles.featuresContainer,
            {
              opacity: taglineFade,
              transform: [{
                translateY: taglineFade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          <View style={introStyles.featureItem}>
            <Text style={introStyles.featureIcon}>🧠</Text>
            <Text style={introStyles.featureText}>Cognitive Training</Text>
          </View>
          <View style={introStyles.featureDivider} />
          <View style={introStyles.featureItem}>
            <Text style={introStyles.featureIcon}>📊</Text>
            <Text style={introStyles.featureText}>Track Progress</Text>
          </View>
          <View style={introStyles.featureDivider} />
          <View style={introStyles.featureItem}>
            <Text style={introStyles.featureIcon}>🎯</Text>
            <Text style={introStyles.featureText}>Daily Challenges</Text>
          </View>
        </Animated.View>
        
        {/* Start Button */}
        <Animated.View
          style={[
            introStyles.buttonContainer,
            {
              opacity: buttonFade,
              transform: [{
                translateY: buttonFade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              }, {
                scale: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                }),
              }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={onAwaken}
            activeOpacity={0.9}
            style={introStyles.startButton}
          >
            <LinearGradient
              colors={['#7B68EE', '#5B4ACE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={introStyles.startButtonGradient}
            >
              <Text style={introStyles.startButtonText}>START JOURNEY</Text>
              <Text style={introStyles.startButtonIcon}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={introStyles.versionText}>v1.0.0 • Made with ❤️</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// Intro Screen Styles
const introStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050520',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  bgCircle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#7B68EE',
    top: '10%',
    left: -100,
  },
  bgCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#4ECDC4',
    bottom: '15%',
    right: -80,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#7B68EE',
  },
  logoBg: {
    width: 120,
    height: 120,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A3A',
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    overflow: 'hidden',
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleMain: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 12,
    textShadowColor: 'rgba(123, 104, 238, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  titleGradientBg: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: -8,
  },
  titleAccent: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 16,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B68EE',
    letterSpacing: 6,
    textAlign: 'center',
    marginTop: 12,
  },
  subtitleLine: {
    width: 60,
    height: 3,
    backgroundColor: '#7B68EE',
    borderRadius: 2,
    marginTop: 12,
    alignSelf: 'center',
  },
  tagline: {
    fontSize: 15,
    color: '#8888AA',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingHorizontal: 10,
  },
  featureItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 1,
    textAlign: 'center',
  },
  featureDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  startButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 50,
    gap: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  startButtonIcon: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  versionText: {
    fontSize: 11,
    color: '#555',
    marginTop: 20,
    letterSpacing: 1,
  },
});

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

// Mini animated stat ring component
const AnimatedStatRing: React.FC<{
  value: number;
  maxValue: number;
  size: number;
  color: string;
  label: string;
  icon: string;
  delay?: number;
}> = ({ value, maxValue, size, color, label, icon, delay = 0 }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(animValue, {
          toValue: value / maxValue,
          duration: 1200,
          easing: CINEMATIC_EASING.heavyOut,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [value]);
  
  const percentage = Math.round((value / maxValue) * 100);
  const circumference = size * Math.PI;
  
  return (
    <Animated.View style={[mindStyles.statRingContainer, { transform: [{ scale: scaleAnim }] }]}>
      <View style={[mindStyles.statRingOuter, { width: size, height: size }]}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={(size - 8) / 2}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={4}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={(size - 8) / 2}
            stroke={color}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [circumference, 0],
            })}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={mindStyles.statRingInner}>
          <Text style={mindStyles.statRingIcon}>{icon}</Text>
          <Text style={[mindStyles.statRingValue, { color }]}>{percentage}</Text>
        </View>
      </View>
      <Text style={mindStyles.statRingLabel}>{label}</Text>
    </Animated.View>
  );
};

// Animated number counter
const AnimatedCounter: React.FC<{
  value: number;
  suffix?: string;
  color?: string;
  size?: number;
  delay?: number;
}> = ({ value, suffix = '', color = '#fff', size = 36, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1500;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  
  return (
    <Text style={[mindStyles.animatedCounter, { color, fontSize: size }]}>
      {displayValue.toLocaleString()}{suffix}
    </Text>
  );
};

// Cognitive dimension bar
const CognitiveDimensionBar: React.FC<{
  label: string;
  value: number;
  color: string;
  icon: string;
  trend: 'up' | 'down' | 'stable';
  delay?: number;
}> = ({ label, value, color, icon, trend, delay = 0 }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(widthAnim, {
          toValue: value,
          duration: 1000,
          easing: CINEMATIC_EASING.heavyOut,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [value]);
  
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—';
  const trendColor = trend === 'up' ? '#4ECDC4' : trend === 'down' ? '#FF6B6B' : '#666';
  
  return (
    <Animated.View style={[mindStyles.dimensionRow, { opacity: opacityAnim }]}>
      <View style={mindStyles.dimensionLeft}>
        <Text style={mindStyles.dimensionIcon}>{icon}</Text>
        <Text style={mindStyles.dimensionLabel}>{label}</Text>
      </View>
      <View style={mindStyles.dimensionBarContainer}>
        <Animated.View
          style={[
            mindStyles.dimensionBarFill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: color,
            },
          ]}
        />
        <View style={[mindStyles.dimensionBarGlow, { backgroundColor: color }]} />
      </View>
      <View style={mindStyles.dimensionRight}>
        <Text style={[mindStyles.dimensionValue, { color }]}>{value}</Text>
        <Text style={[mindStyles.dimensionTrend, { color: trendColor }]}>{trendIcon}</Text>
      </View>
    </Animated.View>
  );
};

// Session history mini chart
const SessionHistoryChart: React.FC<{
  data: number[];
  color: string;
}> = ({ data, color }) => {
  // Ensure we have at least some data to display
  const displayData = data.length > 0 ? data : [50];
  const maxVal = Math.max(...displayData, 1);
  const chartWidth = SCREEN_WIDTH - 80;
  const chartHeight = 80;
  const barCount = Math.max(displayData.length, 1);
  const barWidth = Math.min(24, (chartWidth - (barCount * 6)) / barCount);
  
  // If no real data, show placeholder message
  if (data.length === 0) {
    return (
      <View style={[mindStyles.historyChart, { width: chartWidth, height: chartHeight, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#555', fontSize: 13 }}>Play sessions to see your performance history</Text>
      </View>
    );
  }
  
  return (
    <View style={[mindStyles.historyChart, { width: chartWidth, height: chartHeight }]}>
      {displayData.map((val, i) => {
        const height = Math.max(8, (val / maxVal) * (chartHeight - 20));
        const isLast = i === displayData.length - 1;
        return (
          <View key={i} style={mindStyles.historyBarContainer}>
            <Animated.View
              style={[
                mindStyles.historyBar,
                {
                  width: barWidth,
                  height,
                  backgroundColor: isLast ? color : `${color}60`,
                  borderRadius: barWidth / 2,
                },
              ]}
            />
            <Text style={mindStyles.historyLabel}>{val}%</Text>
          </View>
        );
      })}
    </View>
  );
};

// Animated SVG Circle for React Native
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  playerMind,
  onBack,
}) => {
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        easing: CINEMATIC_EASING.heavyOut,
        useNativeDriver: true,
      }),
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 800,
        easing: CINEMATIC_EASING.heavyOut,
        useNativeDriver: true,
      }),
      Animated.timing(cardsAnim, {
        toValue: 1,
        duration: 600,
        easing: CINEMATIC_EASING.heavyOut,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Calculate real statistics from playerMind
  const avgAccuracy = Math.round(playerMind.lifetimeAccuracy * 100);
  const avgReactionTime = Math.round(playerMind.reactionProfile.mean);
  const evolutionLevel = playerMind.evolutionStage;
  const totalTrials = playerMind.totalTrials;
  const totalSessions = playerMind.totalSessions;
  
  // Calculate streak (sessions in last 7 days - simulated from data)
  const daysSinceUpdate = Math.floor((Date.now() - playerMind.lastUpdated) / (1000 * 60 * 60 * 24));
  const currentStreak = daysSinceUpdate < 2 ? Math.min(totalSessions, 7) : 0;
  
  // Calculate mind score (weighted average of cognitive dimensions)
  const mindScore = Math.round(
    (playerMind.cognitiveVector.perception * 0.15 +
     playerMind.cognitiveVector.spatial * 0.15 +
     playerMind.cognitiveVector.logic * 0.2 +
     playerMind.cognitiveVector.temporal * 0.15 +
     playerMind.cognitiveVector.working_memory * 0.2 +
     playerMind.cognitiveVector.pattern_recognition * 0.15)
  );
  
  // Cognitive dimensions with real data
  const cognitiveDimensions = [
    { 
      label: 'PERCEPTION', 
      value: Math.round(playerMind.cognitiveVector.perception), 
      color: '#00D9FF', 
      icon: '👁️',
      trend: (playerMind.cognitiveVector.perception > 50 ? 'up' : 'stable') as 'up' | 'down' | 'stable',
    },
    { 
      label: 'SPATIAL', 
      value: Math.round(playerMind.cognitiveVector.spatial), 
      color: '#4ECDC4', 
      icon: '🧭',
      trend: (playerMind.cognitiveVector.spatial > 50 ? 'up' : 'stable') as 'up' | 'down' | 'stable',
    },
    { 
      label: 'LOGIC', 
      value: Math.round(playerMind.cognitiveVector.logic), 
      color: '#7B68EE', 
      icon: '🧠',
      trend: (playerMind.cognitiveVector.logic > 50 ? 'up' : 'stable') as 'up' | 'down' | 'stable',
    },
    { 
      label: 'TEMPORAL', 
      value: Math.round(playerMind.cognitiveVector.temporal), 
      color: '#FF69B4', 
      icon: '⏱️',
      trend: 'stable' as 'up' | 'down' | 'stable',
    },
    { 
      label: 'MEMORY', 
      value: Math.round(playerMind.cognitiveVector.working_memory), 
      color: '#FFE66D', 
      icon: '💾',
      trend: (playerMind.cognitiveVector.working_memory > 50 ? 'up' : 'stable') as 'up' | 'down' | 'stable',
    },
    { 
      label: 'PATTERN', 
      value: Math.round(playerMind.cognitiveVector.pattern_recognition), 
      color: '#FF6B6B', 
      icon: '🔮',
      trend: (playerMind.cognitiveVector.pattern_recognition > 50 ? 'up' : 'stable') as 'up' | 'down' | 'stable',
    },
  ];
  
  // Get REAL performance history from storage
  const sessionHistory = gameStorage.getSessionHistory(10);
  const performanceHistory = sessionHistory.length > 0
    ? sessionHistory.map(s => Math.round(s.accuracy * 100)).reverse()
    : [50]; // Default if no history
  
  // Get real streak from storage
  const realStreak = gameStorage.getDailyStreak();
  const displayStreak = realStreak > 0 ? realStreak : currentStreak;
  
  // Get total play time
  const totalPlayTime = gameStorage.getTotalPlayTimeFormatted();
  
  // Mind type based on behavior signature
  const getMindType = (): { type: string; description: string; icon: string } => {
    const intuition = playerMind.behaviorSignature?.intuitionVsAnalysis || 0.5;
    const speed = playerMind.reactionProfile.mean;
    const risk = playerMind.riskProfile?.riskTolerance || 0.5;
    
    if (intuition < 0.35 && speed < 700) {
      return { type: 'INTUITIVE STRIKER', description: 'Fast instincts, sharp decisions', icon: '⚡' };
    } else if (intuition > 0.65 && speed > 900) {
      return { type: 'METHODICAL ANALYST', description: 'Calculated precision, deep thinking', icon: '🎯' };
    } else if (risk > 0.6) {
      return { type: 'BOLD EXPLORER', description: 'Risk-taker, pattern breaker', icon: '🚀' };
    } else if (risk < 0.4) {
      return { type: 'STEADY GUARDIAN', description: 'Consistent, reliable performance', icon: '🛡️' };
    }
    return { type: 'BALANCED MIND', description: 'Adaptive, versatile thinker', icon: '✨' };
  };
  
  const mindType = getMindType();
  
  // Reaction time breakdown
  const reactionBreakdown = {
    fast: Math.round((1 - playerMind.reactionProfile.percentile_25 / 2000) * 100),
    average: Math.round((1 - playerMind.reactionProfile.median / 2000) * 100),
    consistency: Math.round(100 - (playerMind.reactionProfile.variance / 10)),
  };
  
  // Focus score from fatigue model
  const focusScore = Math.round(100 - (playerMind.fatigueModel?.estimatedFatigue || 0) * 100);
  
  return (
    <BreathingBackground primaryColor="#0A0A1A" secondaryColor="#050510">
      <View style={mindStyles.container}>
        {/* Floating Header */}
        <Animated.View
          style={[
            mindStyles.header,
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
          <TouchableOpacity onPress={onBack} style={mindStyles.backBtn}>
            <Text style={mindStyles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={mindStyles.headerCenter}>
            <Text style={mindStyles.headerTitle}>MIND</Text>
            <Text style={mindStyles.headerSubtitle}>COGNITIVE PROFILE</Text>
          </View>
          <View style={mindStyles.headerRight}>
            <View style={mindStyles.levelBadge}>
              <Text style={mindStyles.levelText}>LV.{evolutionLevel}</Text>
            </View>
          </View>
        </Animated.View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={mindStyles.scrollContent}
        >
          {/* Hero Mind Card */}
          <Animated.View
            style={[
              mindStyles.heroCard,
              {
                opacity: entranceAnim,
                transform: [{
                  scale: entranceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(123, 104, 238, 0.15)', 'rgba(78, 205, 196, 0.08)', 'rgba(10, 10, 26, 0.95)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={mindStyles.heroGradient}
            />
            
            {/* Mind Score Ring */}
            <View style={mindStyles.mindScoreSection}>
              <View style={mindStyles.mindScoreRing}>
                <Svg width={140} height={140}>
                  <Defs>
                    <SvgGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#7B68EE" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#4ECDC4" stopOpacity="1" />
                    </SvgGradient>
                  </Defs>
                  <Circle
                    cx={70}
                    cy={70}
                    r={60}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={8}
                    fill="none"
                  />
                  <Circle
                    cx={70}
                    cy={70}
                    r={60}
                    stroke="url(#scoreGradient)"
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(mindScore / 100) * 377} 377`}
                    rotation="-90"
                    origin="70, 70"
                  />
                </Svg>
                <View style={mindStyles.mindScoreInner}>
                  <AnimatedCounter value={mindScore} color="#fff" size={42} />
                  <Text style={mindStyles.mindScoreLabel}>MIND SCORE</Text>
                </View>
              </View>
              
              {/* Mind Type */}
              <View style={mindStyles.mindTypeContainer}>
                <Text style={mindStyles.mindTypeIcon}>{mindType.icon}</Text>
                <Text style={mindStyles.mindTypeName}>{mindType.type}</Text>
                <Text style={mindStyles.mindTypeDesc}>{mindType.description}</Text>
              </View>
            </View>
            
            {/* Quick Stats Row */}
            <View style={mindStyles.quickStatsRow}>
              <View style={mindStyles.quickStat}>
                <AnimatedCounter value={totalSessions} color="#4ECDC4" size={28} delay={200} />
                <Text style={mindStyles.quickStatLabel}>SESSIONS</Text>
              </View>
              <View style={mindStyles.quickStatDivider} />
              <View style={mindStyles.quickStat}>
                <AnimatedCounter value={totalTrials} color="#7B68EE" size={28} delay={400} />
                <Text style={mindStyles.quickStatLabel}>TRIALS</Text>
              </View>
              <View style={mindStyles.quickStatDivider} />
              <View style={mindStyles.quickStat}>
                <AnimatedCounter value={displayStreak} color="#FFE66D" size={28} delay={600} />
                <Text style={mindStyles.quickStatLabel}>STREAK</Text>
              </View>
            </View>
            
            {/* Play Time */}
            {totalPlayTime && totalPlayTime !== '0m' && (
              <View style={mindStyles.playTimeRow}>
                <Text style={mindStyles.playTimeLabel}>⏱️ Total Play Time: </Text>
                <Text style={mindStyles.playTimeValue}>{totalPlayTime}</Text>
              </View>
            )}
          </Animated.View>
          
          {/* Performance Metrics Grid */}
          <Animated.View
            style={[
              mindStyles.metricsSection,
              {
                opacity: cardsAnim,
                transform: [{
                  translateY: cardsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={mindStyles.sectionHeader}>
              <Text style={mindStyles.sectionIcon}>📊</Text>
              <Text style={mindStyles.sectionTitleText}>PERFORMANCE</Text>
            </View>
            
            <View style={mindStyles.metricsGrid}>
              <AnimatedStatRing
                value={avgAccuracy}
                maxValue={100}
                size={90}
                color="#4ECDC4"
                label="ACCURACY"
                icon="🎯"
                delay={100}
              />
              <AnimatedStatRing
                value={Math.max(0, 100 - Math.round(avgReactionTime / 20))}
                maxValue={100}
                size={90}
                color="#7B68EE"
                label="SPEED"
                icon="⚡"
                delay={200}
              />
              <AnimatedStatRing
                value={focusScore}
                maxValue={100}
                size={90}
                color="#FFE66D"
                label="FOCUS"
                icon="🔥"
                delay={300}
              />
              <AnimatedStatRing
                value={reactionBreakdown.consistency}
                maxValue={100}
                size={90}
                color="#FF69B4"
                label="CONSISTENCY"
                icon="💫"
                delay={400}
              />
            </View>
          </Animated.View>
          
          {/* Cognitive Dimensions */}
          <Animated.View
            style={[
              mindStyles.dimensionsSection,
              {
                opacity: cardsAnim,
                transform: [{
                  translateY: cardsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [60, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={mindStyles.sectionHeader}>
              <Text style={mindStyles.sectionIcon}>🧠</Text>
              <Text style={mindStyles.sectionTitleText}>COGNITIVE DIMENSIONS</Text>
            </View>
            
            <View style={mindStyles.dimensionsList}>
              {cognitiveDimensions.map((dim, index) => (
                <CognitiveDimensionBar
                  key={dim.label}
                  label={dim.label}
                  value={dim.value}
                  color={dim.color}
                  icon={dim.icon}
                  trend={dim.trend}
                  delay={index * 100}
                />
              ))}
            </View>
          </Animated.View>
          
          {/* Session History */}
          <Animated.View
            style={[
              mindStyles.historySection,
              {
                opacity: cardsAnim,
                transform: [{
                  translateY: cardsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [80, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={mindStyles.sectionHeader}>
              <Text style={mindStyles.sectionIcon}>📈</Text>
              <Text style={mindStyles.sectionTitleText}>RECENT PERFORMANCE</Text>
            </View>
            
            <View style={mindStyles.historyCard}>
              <SessionHistoryChart data={performanceHistory} color="#7B68EE" />
              <View style={mindStyles.historyFooter}>
                <Text style={mindStyles.historyFooterText}>Last 10 sessions</Text>
                <View style={mindStyles.historyTrend}>
                  <Text style={mindStyles.historyTrendIcon}>
                    {performanceHistory[9] > performanceHistory[0] ? '📈' : '📊'}
                  </Text>
                  <Text style={[
                    mindStyles.historyTrendText,
                    { color: performanceHistory[9] > performanceHistory[0] ? '#4ECDC4' : '#666' }
                  ]}>
                    {performanceHistory[9] > performanceHistory[0] ? 'Improving' : 'Stable'}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
          
          {/* Reaction Profile */}
          <Animated.View
            style={[
              mindStyles.reactionSection,
              {
                opacity: cardsAnim,
                transform: [{
                  translateY: cardsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={mindStyles.sectionHeader}>
              <Text style={mindStyles.sectionIcon}>⏱️</Text>
              <Text style={mindStyles.sectionTitleText}>REACTION PROFILE</Text>
            </View>
            
            <View style={mindStyles.reactionCard}>
              <View style={mindStyles.reactionRow}>
                <View style={mindStyles.reactionItem}>
                  <Text style={mindStyles.reactionLabel}>AVERAGE</Text>
                  <Text style={mindStyles.reactionValue}>{avgReactionTime}ms</Text>
                </View>
                <View style={mindStyles.reactionItem}>
                  <Text style={mindStyles.reactionLabel}>BEST 25%</Text>
                  <Text style={[mindStyles.reactionValue, { color: '#4ECDC4' }]}>
                    {Math.round(playerMind.reactionProfile.percentile_25)}ms
                  </Text>
                </View>
                <View style={mindStyles.reactionItem}>
                  <Text style={mindStyles.reactionLabel}>MEDIAN</Text>
                  <Text style={mindStyles.reactionValue}>
                    {Math.round(playerMind.reactionProfile.median)}ms
                  </Text>
                </View>
              </View>
              
              <View style={mindStyles.reactionBarSection}>
                <View style={mindStyles.reactionBarBg}>
                  <View 
                    style={[
                      mindStyles.reactionBarFast, 
                      { width: `${reactionBreakdown.fast}%` }
                    ]} 
                  />
                </View>
                <View style={mindStyles.reactionBarLabels}>
                  <Text style={mindStyles.reactionBarLabel}>Fast</Text>
                  <Text style={mindStyles.reactionBarLabel}>Slow</Text>
                </View>
              </View>
            </View>
          </Animated.View>
          
          {/* Insights Card */}
          <Animated.View
            style={[
              mindStyles.insightsSection,
              {
                opacity: cardsAnim,
                transform: [{
                  translateY: cardsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [120, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={mindStyles.sectionHeader}>
              <Text style={mindStyles.sectionIcon}>💡</Text>
              <Text style={mindStyles.sectionTitleText}>INSIGHTS</Text>
            </View>
            
            <View style={mindStyles.insightCard}>
              <View style={mindStyles.insightRow}>
                <View style={[mindStyles.insightDot, { backgroundColor: '#4ECDC4' }]} />
                <Text style={mindStyles.insightText}>
                  {getThinkingStyleDescription(playerMind)}
                </Text>
              </View>
              <View style={mindStyles.insightRow}>
                <View style={[mindStyles.insightDot, { backgroundColor: '#FFE66D' }]} />
                <Text style={mindStyles.insightText}>
                  Peak performance: {getPeakTimeDescription(playerMind)}. Keep the rhythm going.
                </Text>
              </View>
              <View style={mindStyles.insightRow}>
                <View style={[mindStyles.insightDot, { backgroundColor: '#7B68EE' }]} />
                <Text style={mindStyles.insightText}>
                  You're a {getLearnerTypeDescription(playerMind)} learner. Each challenge refines your neural pathways.
                </Text>
              </View>
            </View>
          </Animated.View>
          
          {/* Bottom Padding */}
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </BreathingBackground>
  );
};

// Mind Profile Styles
const mindStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: 8,
  },
  headerSubtitle: {
    fontSize: 9,
    color: '#666',
    letterSpacing: 3,
    marginTop: 2,
  },
  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(123, 104, 238, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(123, 104, 238, 0.3)',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7B68EE',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  mindScoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  mindScoreRing: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mindScoreInner: {
    position: 'absolute',
    alignItems: 'center',
  },
  mindScoreLabel: {
    fontSize: 9,
    color: '#666',
    letterSpacing: 2,
    marginTop: 2,
  },
  mindTypeContainer: {
    flex: 1,
    marginLeft: 20,
  },
  mindTypeIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  mindTypeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 4,
  },
  mindTypeDesc: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
  quickStatsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 20,
    marginHorizontal: 24,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  quickStatLabel: {
    fontSize: 9,
    color: '#666',
    letterSpacing: 2,
    marginTop: 4,
  },
  playTimeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    marginTop: 8,
    marginHorizontal: 24,
  },
  playTimeLabel: {
    fontSize: 12,
    color: '#666',
  },
  playTimeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  animatedCounter: {
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  metricsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  sectionTitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 3,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  statRingContainer: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statRingOuter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statRingInner: {
    position: 'absolute',
    alignItems: 'center',
  },
  statRingIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  statRingValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statRingLabel: {
    fontSize: 9,
    color: '#666',
    letterSpacing: 2,
    marginTop: 8,
  },
  dimensionsSection: {
    marginBottom: 24,
  },
  dimensionsList: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  dimensionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dimensionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
  },
  dimensionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  dimensionLabel: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 1,
  },
  dimensionBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  dimensionBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  dimensionBarGlow: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 20,
    height: '100%',
    opacity: 0.5,
  },
  dimensionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
    justifyContent: 'flex-end',
  },
  dimensionValue: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  dimensionTrend: {
    fontSize: 12,
  },
  historySection: {
    marginBottom: 24,
  },
  historyCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  historyChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  historyBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  historyBar: {
    minHeight: 8,
  },
  historyLabel: {
    fontSize: 9,
    color: '#666',
    marginTop: 6,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  historyFooterText: {
    fontSize: 11,
    color: '#555',
  },
  historyTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTrendIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  historyTrendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reactionSection: {
    marginBottom: 24,
  },
  reactionCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  reactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  reactionItem: {
    alignItems: 'center',
  },
  reactionLabel: {
    fontSize: 9,
    color: '#666',
    letterSpacing: 1,
    marginBottom: 4,
  },
  reactionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  reactionBarSection: {
    marginTop: 8,
  },
  reactionBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  reactionBarFast: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  reactionBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  reactionBarLabel: {
    fontSize: 9,
    color: '#555',
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: '#aaa',
    lineHeight: 20,
  },
});

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
