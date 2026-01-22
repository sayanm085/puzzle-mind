// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 DIMENSIONAL MENU - Menus Feel Like Entering Dimensions
// Spatial navigation, parallax depth, cinematic transitions
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CINEMATIC_EASING } from '../engine/VisualEngine';
import { Sector, Chamber } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// DIMENSIONAL PORTAL - Entry to each dimension
// ─────────────────────────────────────────────────────────────────────────────────

interface DimensionalPortalProps {
  sector: Sector;
  onEnter: (sectorId: string) => void;
  index: number;
  isActive?: boolean;
  isLocked?: boolean;
  progress?: number;
}

export const DimensionalPortal: React.FC<DimensionalPortalProps> = ({
  sector,
  onEnter,
  index,
  isActive = false,
  isLocked = false,
  progress = 0,
}) => {
  const portalAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Entrance animation
    Animated.spring(portalAnim, {
      toValue: 1,
      delay: index * 100,
      tension: 60,
      friction: 10,
      useNativeDriver: true,
    }).start();
    
    // Continuous rotation (very slow)
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();
    
    // Glow pulse
    if (!isLocked) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    
    // Active pulse
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [index, isLocked, isActive]);
  
  const scale = portalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });
  
  const opacity = portalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });
  
  return (
    <TouchableOpacity
      onPress={() => !isLocked && onEnter(sector.id)}
      activeOpacity={isLocked ? 1 : 0.8}
      disabled={isLocked}
    >
      <Animated.View
        style={[
          styles.portalContainer,
          {
            opacity,
            transform: [{ scale: Animated.multiply(scale, pulseAnim) }],
          },
        ]}
      >
        {/* Rotating ring */}
        <Animated.View
          style={[
            styles.portalRing,
            {
              borderColor: sector.color + '60',
              transform: [{ rotate }],
            },
          ]}
        />
        
        {/* Inner glow */}
        {!isLocked && (
          <Animated.View
            style={[
              styles.portalGlow,
              {
                backgroundColor: sector.color,
                opacity: glowOpacity,
              },
            ]}
          />
        )}
        
        {/* Core */}
        <LinearGradient
          colors={isLocked 
            ? ['#333333', '#1A1A1A'] 
            : [sector.color + '40', sector.color + '10']}
          style={styles.portalCore}
        >
          <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
          
          {/* Icon */}
          <Text style={[styles.portalIcon, isLocked && styles.portalIconLocked]}>
            {isLocked ? '🔒' : sector.icon}
          </Text>
          
          {/* Name */}
          <Text style={[styles.portalName, { color: isLocked ? '#666666' : sector.color }]}>
            {sector.name}
          </Text>
          
          {/* Subtitle */}
          <Text style={styles.portalSubtitle}>
            {isLocked ? 'LOCKED' : `${sector.chambers.length} CHAMBERS`}
          </Text>
          
          {/* Progress bar */}
          {!isLocked && progress > 0 && (
            <View style={styles.portalProgressContainer}>
              <View
                style={[
                  styles.portalProgressBar,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: sector.color,
                  },
                ]}
              />
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// CHAMBER NODE - Individual challenge chamber
// ─────────────────────────────────────────────────────────────────────────────────

interface ChamberNodeProps {
  chamber: Chamber;
  onSelect: (chamberId: string) => void;
  index: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  sectorColor: string;
}

export const ChamberNode: React.FC<ChamberNodeProps> = ({
  chamber,
  onSelect,
  index,
  isUnlocked,
  isCompleted,
  isCurrent,
  sectorColor,
}) => {
  const nodeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Entrance
    Animated.spring(nodeAnim, {
      toValue: 1,
      delay: index * 80,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
    
    // Current node pulse
    if (isCurrent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: CINEMATIC_EASING.breathe,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [index, isCurrent]);
  
  const translateY = nodeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });
  
  const opacity = nodeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  const nodeColor = isCompleted 
    ? sectorColor 
    : isUnlocked 
      ? sectorColor + '80' 
      : '#333333';
  
  return (
    <TouchableOpacity
      onPress={() => isUnlocked && onSelect(chamber.id)}
      disabled={!isUnlocked}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.chamberNode,
          {
            opacity,
            transform: [{ translateY }, { scale: pulseAnim }],
          },
        ]}
      >
        {/* Glow effect */}
        {isCurrent && (
          <Animated.View
            style={[
              styles.chamberGlow,
              {
                backgroundColor: sectorColor,
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 0.5],
                }),
              },
            ]}
          />
        )}
        
        {/* Node circle */}
        <View
          style={[
            styles.chamberCircle,
            {
              borderColor: nodeColor,
              backgroundColor: isCompleted ? nodeColor + '20' : 'transparent',
            },
          ]}
        >
          {isCompleted && (
            <Text style={styles.chamberCheck}>✓</Text>
          )}
          {!isCompleted && !isUnlocked && (
            <Text style={styles.chamberLock}>🔒</Text>
          )}
          {isUnlocked && !isCompleted && (
            <Text style={styles.chamberNumber}>{index + 1}</Text>
          )}
        </View>
        
        {/* Label */}
        <Text style={[styles.chamberLabel, { color: nodeColor }]}>
          {chamber.name}
        </Text>
        
        {/* Difficulty indicator */}
        <View style={styles.difficultyContainer}>
          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.difficultyDot,
                {
                  backgroundColor: i < chamber.difficulty 
                    ? sectorColor 
                    : '#333333',
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// PARALLAX LAYER - Depth through motion
// ─────────────────────────────────────────────────────────────────────────────────

interface ParallaxContainerProps {
  children: React.ReactNode;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ children }) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        // Subtle parallax effect based on touch movement
        pan.setValue({
          x: gesture.dx * 0.02,
          y: gesture.dy * 0.02,
        });
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;
  
  return (
    <View style={styles.parallaxContainer} {...panResponder.panHandlers}>
      {/* Far background layer */}
      <Animated.View
        style={[
          styles.parallaxLayer,
          {
            transform: [
              { translateX: Animated.multiply(pan.x, 0.5) },
              { translateY: Animated.multiply(pan.y, 0.5) },
            ],
          },
        ]}
      >
        <ParallaxStars count={30} depth={0.3} />
      </Animated.View>
      
      {/* Mid layer */}
      <Animated.View
        style={[
          styles.parallaxLayer,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
            ],
          },
        ]}
      >
        <ParallaxStars count={20} depth={0.6} />
      </Animated.View>
      
      {/* Near layer */}
      <Animated.View
        style={[
          styles.parallaxLayer,
          {
            transform: [
              { translateX: Animated.multiply(pan.x, 2) },
              { translateY: Animated.multiply(pan.y, 2) },
            ],
          },
        ]}
      >
        <ParallaxStars count={10} depth={1} />
      </Animated.View>
      
      {/* Content */}
      <Animated.View
        style={[
          styles.parallaxContent,
          {
            transform: [
              { translateX: Animated.multiply(pan.x, 1.5) },
              { translateY: Animated.multiply(pan.y, 1.5) },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

// Parallax stars component
const ParallaxStars: React.FC<{ count: number; depth: number }> = ({ count, depth }) => {
  const stars = React.useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT,
      size: (1 + Math.random() * 2) * depth,
      opacity: (0.2 + Math.random() * 0.5) * depth,
    })),
    [count, depth]
  );
  
  return (
    <>
      {stars.map(star => (
        <View
          key={star.id}
          style={[
            styles.parallaxStar,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// COSMIC NAVIGATION BAR - Bottom navigation with presence
// ─────────────────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  icon: string;
  label: string;
  color: string;
}

interface CosmicNavBarProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const CosmicNavBar: React.FC<CosmicNavBarProps> = ({
  items,
  activeId,
  onSelect,
}) => {
  return (
    <View style={styles.navBarContainer}>
      <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="dark" />
      <LinearGradient
        colors={['transparent', '#00000050']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.navBarContent}>
        {items.map((item, index) => (
          <NavBarItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onPress={() => onSelect(item.id)}
            index={index}
          />
        ))}
      </View>
    </View>
  );
};

const NavBarItem: React.FC<{
  item: NavItem;
  isActive: boolean;
  onPress: () => void;
  index: number;
}> = ({ item, isActive, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.navItem}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.navItemInner,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow */}
        <Animated.View
          style={[
            styles.navItemGlow,
            {
              backgroundColor: item.color,
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
              }),
            },
          ]}
        />
        
        {/* Icon */}
        <Animated.Text
          style={[
            styles.navItemIcon,
            {
              transform: [{
                scale: scaleAnim.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: [1, 1.2],
                }),
              }],
            },
          ]}
        >
          {item.icon}
        </Animated.Text>
        
        {/* Label */}
        <Animated.Text
          style={[
            styles.navItemLabel,
            {
              color: isActive ? item.color : '#666666',
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ]}
        >
          {item.label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// SECTOR DETAIL VIEW - Chamber pathway visualization
// ─────────────────────────────────────────────────────────────────────────────────

interface SectorDetailViewProps {
  sector: Sector;
  completedChambers: string[];
  currentChamber: string;
  onChamberSelect: (chamberId: string) => void;
  onBack: () => void;
}

export const SectorDetailView: React.FC<SectorDetailViewProps> = ({
  sector,
  completedChambers,
  currentChamber,
  onChamberSelect,
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
  
  return (
    <Animated.View
      style={[
        styles.sectorDetailContainer,
        {
          opacity: entranceAnim,
          transform: [{
            translateY: entranceAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.sectorHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← RETURN</Text>
        </TouchableOpacity>
        
        <View style={styles.sectorTitleContainer}>
          <Text style={styles.sectorIcon}>{sector.icon}</Text>
          <Text style={[styles.sectorTitle, { color: sector.color }]}>
            {sector.name}
          </Text>
          <Text style={styles.sectorSubtitle}>{sector.description}</Text>
        </View>
      </View>
      
      {/* Chamber path */}
      <ScrollView style={styles.chamberPathScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.chamberPath}>
          {/* Connecting line */}
          <View style={[styles.pathLine, { backgroundColor: sector.color + '30' }]} />
          
          {/* Chambers */}
          {sector.chambers.map((chamber, index) => {
            const previousUnlocked = index === 0 || completedChambers.includes(sector.chambers[index - 1].id);
            const isUnlocked = index === 0 || completedChambers.includes(sector.chambers[index - 1].id);
            const isCompleted = completedChambers.includes(chamber.id);
            const isCurrent = chamber.id === currentChamber;
            
            return (
              <ChamberNode
                key={chamber.id}
                chamber={chamber}
                onSelect={onChamberSelect}
                index={index}
                isUnlocked={isUnlocked}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                sectorColor={sector.color}
              />
            );
          })}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Portal styles
  portalContainer: {
    width: (SCREEN_WIDTH - 48) / 2,
    marginBottom: 16,
  },
  portalRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderStyle: 'dashed',
    top: 15,
    alignSelf: 'center',
  },
  portalGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: 25,
    alignSelf: 'center',
  },
  portalCore: {
    width: '100%',
    height: 130,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  portalIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  portalIconLocked: {
    opacity: 0.4,
  },
  portalName: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  portalSubtitle: {
    fontSize: 9,
    color: '#666666',
    letterSpacing: 1,
    marginTop: 5,
    fontWeight: '500',
  },
  portalProgressContainer: {
    width: 60,
    height: 3,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  portalProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  
  // Chamber styles
  chamberNode: {
    alignItems: 'center',
    marginVertical: 20,
  },
  chamberGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    top: -10,
  },
  chamberCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chamberCheck: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  chamberLock: {
    fontSize: 16,
  },
  chamberNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chamberLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 100,
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 3,
  },
  difficultyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  
  // Parallax styles
  parallaxContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  parallaxLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  parallaxContent: {
    flex: 1,
  },
  parallaxStar: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  
  // NavBar styles
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 95,
    overflow: 'hidden',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  navBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 25,
    paddingTop: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navItemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    minWidth: 70,
  },
  navItemGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  navItemIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  navItemLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  
  // Sector detail styles
  sectorDetailContainer: {
    flex: 1,
    padding: 20,
  },
  sectorHeader: {
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#666666',
    fontSize: 12,
    letterSpacing: 2,
  },
  sectorTitleContainer: {
    alignItems: 'center',
  },
  sectorIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  sectorTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 4,
  },
  sectorSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 250,
  },
  chamberPathScroll: {
    flex: 1,
  },
  chamberPath: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pathLine: {
    position: 'absolute',
    width: 2,
    top: 40,
    bottom: 40,
  },
});

export default {
  DimensionalPortal,
  ChamberNode,
  ParallaxContainer,
  CosmicNavBar,
  SectorDetailView,
};
