// ═══════════════════════════════════════════════════════════════════════════════
// 🏛️ SECTOR DETAIL SCREEN - Chamber Selection Within a Sector
// "Each chamber is a step deeper into understanding"
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react';
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
import * as Haptics from 'expo-haptics';
import { CINEMATIC_EASING } from '../engine/VisualEngine';
import { BreathingBackground, VoidParticles, DimensionalButton, SectionDivider } from './SpatialUI';
import { Sector, Chamber } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// CHAMBER CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface ChamberCardProps {
  chamber: Chamber;
  index: number;
  sectorColor: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  onSelect: (chamberId: string) => void;
}

const ChamberCard: React.FC<ChamberCardProps> = ({
  chamber,
  index,
  sectorColor,
  isUnlocked,
  isCompleted,
  onSelect,
}) => {
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(entranceAnim, {
      toValue: 1,
      delay: index * 80,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
    
    if (isUnlocked && !isCompleted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [index, isUnlocked, isCompleted]);
  
  const handlePress = () => {
    if (isUnlocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSelect(chamber.id);
    }
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={isUnlocked ? 0.8 : 1}
      disabled={!isUnlocked}
    >
      <Animated.View
        style={[
          styles.chamberCard,
          {
            opacity: entranceAnim,
            transform: [
              {
                translateY: entranceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              {
                scale: entranceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        {/* Glow effect */}
        {isUnlocked && !isCompleted && (
          <Animated.View
            style={[
              styles.chamberGlow,
              {
                backgroundColor: sectorColor,
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 0.25],
                }),
              },
            ]}
          />
        )}
        
        <LinearGradient
          colors={
            isCompleted 
              ? ['rgba(78, 205, 196, 0.15)', 'rgba(78, 205, 196, 0.05)']
              : isUnlocked
                ? [`${sectorColor}20`, `${sectorColor}08`]
                : ['rgba(50,50,50,0.3)', 'rgba(30,30,30,0.2)']
          }
          style={styles.chamberCardGradient}
        >
          {/* Chamber Number */}
          <View style={[
            styles.chamberNumber,
            { backgroundColor: isCompleted ? '#4ECDC4' : isUnlocked ? sectorColor : '#444444' },
          ]}>
            <Text style={styles.chamberNumberText}>
              {isCompleted ? '✓' : index + 1}
            </Text>
          </View>
          
          {/* Chamber Info */}
          <View style={styles.chamberInfo}>
            <Text style={[
              styles.chamberName,
              { color: isCompleted ? '#4ECDC4' : isUnlocked ? '#FFFFFF' : '#666666' },
            ]}>
              {chamber.name}
            </Text>
            <Text style={[
              styles.chamberDescription,
              { color: isCompleted ? '#4ECDC480' : isUnlocked ? '#888888' : '#444444' },
            ]}>
              {!isUnlocked ? 'Complete previous chamber' : chamber.essence}
            </Text>
          </View>
          
          {/* Difficulty indicators */}
          <View style={styles.difficultyContainer}>
            {[1, 2, 3, 4, 5].map(level => (
              <View
                key={level}
                style={[
                  styles.difficultyDot,
                  {
                    backgroundColor: 
                      level <= chamber.difficulty * 5
                        ? (isUnlocked ? sectorColor : '#444444')
                        : 'rgba(255,255,255,0.1)',
                  },
                ]}
              />
            ))}
          </View>
          
          {/* Arrow */}
          {isUnlocked && !isCompleted && (
            <Text style={[styles.chamberArrow, { color: sectorColor }]}>→</Text>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// SECTOR DETAIL SCREEN
// ─────────────────────────────────────────────────────────────────────────────────

interface SectorDetailScreenProps {
  sector: Sector;
  completedChambers: string[];
  onChamberSelect: (chamberId: string) => void;
  onBack: () => void;
}

export const SectorDetailScreen: React.FC<SectorDetailScreenProps> = ({
  sector,
  completedChambers,
  onChamberSelect,
  onBack,
}) => {
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 600,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        easing: CINEMATIC_EASING.heavyOut,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const progress = completedChambers.filter(id => 
    sector.chambers.some(c => c.id === id)
  ).length / sector.chambers.length;
  
  // Determine which chambers are unlocked
  const getUnlockedStatus = (index: number) => {
    if (index === 0) return true;
    const prevChamber = sector.chambers[index - 1];
    return completedChambers.includes(prevChamber.id);
  };
  
  return (
    <BreathingBackground primaryColor="#0A0A1A" secondaryColor="#000005">
      <VoidParticles count={40} color={sector.color} speed={0.3} />
      
      <Animated.View
        style={[
          styles.container,
          {
            opacity: entranceAnim,
          },
        ]}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              }],
            },
          ]}
        >
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← RETURNS</Text>
          </TouchableOpacity>
          
          {/* Sector Icon & Title */}
          <View style={styles.sectorHeader}>
            <View style={[styles.sectorIcon, { backgroundColor: sector.color + '20' }]}>
              <Text style={styles.sectorIconText}>{sector.icon}</Text>
            </View>
            <View style={styles.sectorTitleContainer}>
              <Text style={[styles.sectorName, { color: sector.color }]}>{sector.name}</Text>
              <Text style={styles.sectorSubtitle}>{sector.subtitle}</Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: sector.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {completedChambers.filter(id => sector.chambers.some(c => c.id === id)).length}/{sector.chambers.length} CHAMBERS
            </Text>
          </View>
        </Animated.View>
        
        <SectionDivider color={sector.color} />
        
        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{sector.description}</Text>
        </View>
        
        {/* Chambers List */}
        <Text style={styles.chambersTitle}>CHAMBERS</Text>
        <ScrollView
          style={styles.chambersList}
          contentContainerStyle={styles.chambersContent}
          showsVerticalScrollIndicator={false}
        >
          {sector.chambers.map((chamber, index) => (
            <ChamberCard
              key={chamber.id}
              chamber={chamber}
              index={index}
              sectorColor={sector.color}
              isUnlocked={getUnlockedStatus(index)}
              isCompleted={completedChambers.includes(chamber.id)}
              onSelect={onChamberSelect}
            />
          ))}
          
          {/* Bottom padding */}
          <View style={{ height: 120 }} />
        </ScrollView>
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
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 12,
    color: '#666666',
    letterSpacing: 2,
  },
  sectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectorIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectorIconText: {
    fontSize: 32,
  },
  sectorTitleContainer: {
    flex: 1,
  },
  sectorName: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 3,
  },
  sectorSubtitle: {
    fontSize: 12,
    color: '#666666',
    letterSpacing: 2,
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#666666',
    letterSpacing: 2,
    textAlign: 'right',
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  chambersTitle: {
    fontSize: 12,
    color: '#666666',
    letterSpacing: 3,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  chambersList: {
    flex: 1,
  },
  chambersContent: {
    paddingHorizontal: 20,
  },
  chamberCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chamberGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  chamberCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  chamberNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  chamberNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chamberInfo: {
    flex: 1,
  },
  chamberName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  chamberDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 3,
    marginLeft: 12,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chamberArrow: {
    fontSize: 20,
    marginLeft: 10,
  },
});

export default SectorDetailScreen;
