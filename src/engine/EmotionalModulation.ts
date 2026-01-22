// ═══════════════════════════════════════════════════════════════════════════════
// 🎭 EMOTIONAL MODULATION SYSTEM
// Tension → Release → Reflection
// "The space between moments is where meaning lives."
// ═══════════════════════════════════════════════════════════════════════════════

import { Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type EmotionalPhase = 
  | 'silence'      // Before critical moments - complete stillness
  | 'observation'  // Calm awareness - studying the puzzle
  | 'tension'      // Building pressure - time running, stakes rising
  | 'action'       // Peak engagement - rapid decisions
  | 'consequence'  // Immediate aftermath - success or failure
  | 'release'      // Relief - tension dissolves
  | 'reflection';  // Meaning-making - insights emerge

export interface EmotionalState {
  currentPhase: EmotionalPhase;
  intensity: number;        // 0-1, how strongly the phase is expressed
  transitionProgress: number; // 0-1, how far into transition to next phase
  breathCycle: number;      // 0-1, current position in breathing rhythm
  pressureLevel: number;    // 0-1, accumulated pressure
  lastSignificantMoment: number; // Timestamp
}

export interface MomentType {
  type: 'correct' | 'incorrect' | 'trap_fallen' | 'near_miss' | 'streak' | 
        'rule_shift' | 'time_warning' | 'round_complete' | 'session_end';
  intensity: 'whisper' | 'subtle' | 'clear' | 'powerful' | 'overwhelming';
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// EMOTIONAL MODULATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────────

class EmotionalModulation {
  private state: EmotionalState;
  private breathingInterval: ReturnType<typeof setInterval> | null = null;
  
  // Animated values for UI binding
  public readonly ambientOpacity: Animated.Value;
  public readonly tensionLevel: Animated.Value;
  public readonly focusIntensity: Animated.Value;
  public readonly calmWave: Animated.Value;
  public readonly pressurePulse: Animated.Value;
  
  constructor() {
    this.state = this.createDefaultState();
    
    // Initialize animated values
    this.ambientOpacity = new Animated.Value(0.3);
    this.tensionLevel = new Animated.Value(0);
    this.focusIntensity = new Animated.Value(0.5);
    this.calmWave = new Animated.Value(0);
    this.pressurePulse = new Animated.Value(1);
    
    this.startBreathingCycle();
  }
  
  private createDefaultState(): EmotionalState {
    return {
      currentPhase: 'observation',
      intensity: 0.5,
      transitionProgress: 0,
      breathCycle: 0,
      pressureLevel: 0,
      lastSignificantMoment: Date.now(),
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // BREATHING CYCLE - The ambient rhythm of the experience
  // ═══════════════════════════════════════════════════════════════════════════════
  
  private startBreathingCycle(): void {
    // 4 seconds inhale, 4 seconds exhale
    const cycleDuration = 8000;
    
    const breathe = () => {
      Animated.sequence([
        // Inhale
        Animated.timing(this.calmWave, {
          toValue: 1,
          duration: cycleDuration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        // Exhale
        Animated.timing(this.calmWave, {
          toValue: 0,
          duration: cycleDuration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Only continue if not in high-tension phase
        if (this.state.currentPhase !== 'action' && 
            this.state.currentPhase !== 'tension') {
          breathe();
        }
      });
    };
    
    breathe();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PHASE TRANSITIONS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  transitionTo(phase: EmotionalPhase, duration: number = 500): void {
    const previousPhase = this.state.currentPhase;
    this.state.currentPhase = phase;
    this.state.transitionProgress = 0;
    
    // Phase-specific animations
    switch (phase) {
      case 'silence':
        this.enterSilence(duration);
        break;
      case 'observation':
        this.enterObservation(duration);
        break;
      case 'tension':
        this.enterTension(duration);
        break;
      case 'action':
        this.enterAction(duration);
        break;
      case 'consequence':
        // Handled by moment triggers
        break;
      case 'release':
        this.enterRelease(duration);
        break;
      case 'reflection':
        this.enterReflection(duration);
        break;
    }
  }
  
  private enterSilence(duration: number): void {
    // Everything fades to near-black, complete stillness
    Animated.parallel([
      Animated.timing(this.ambientOpacity, {
        toValue: 0.05,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(this.tensionLevel, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(this.focusIntensity, {
        toValue: 0.2,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Subtle haptic - barely perceptible
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, duration * 0.8);
  }
  
  private enterObservation(duration: number): void {
    // Calm, clear, aware state
    Animated.parallel([
      Animated.timing(this.ambientOpacity, {
        toValue: 0.4,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(this.focusIntensity, {
        toValue: 0.6,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    
    this.state.pressureLevel = 0;
    this.startBreathingCycle();
  }
  
  private enterTension(duration: number): void {
    // Building pressure, heightened awareness
    this.state.intensity = 0.7;
    
    Animated.parallel([
      Animated.timing(this.tensionLevel, {
        toValue: 0.6,
        duration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(this.ambientOpacity, {
        toValue: 0.25,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Start pressure pulse
    this.startPressurePulse();
  }
  
  private enterAction(duration: number): void {
    // Peak engagement, focused intensity
    this.state.intensity = 1;
    
    Animated.parallel([
      Animated.timing(this.focusIntensity, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(this.tensionLevel, {
        toValue: 0.8,
        duration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }
  
  private enterRelease(duration: number): void {
    // Tension dissolves, brief peace
    this.state.pressureLevel = 0;
    
    Animated.sequence([
      // Quick drop
      Animated.parallel([
        Animated.timing(this.tensionLevel, {
          toValue: 0,
          duration: duration * 0.3,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(this.ambientOpacity, {
          toValue: 0.5,
          duration: duration * 0.5,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Settle
      Animated.timing(this.focusIntensity, {
        toValue: 0.4,
        duration: duration * 0.7,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Gentle success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    this.startBreathingCycle();
  }
  
  private enterReflection(duration: number): void {
    // Contemplative, meaning-making state
    Animated.parallel([
      Animated.timing(this.ambientOpacity, {
        toValue: 0.35,
        duration: duration * 2,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(this.focusIntensity, {
        toValue: 0.3,
        duration: duration * 2,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(this.tensionLevel, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }
  
  private startPressurePulse(): void {
    const pulse = () => {
      if (this.state.currentPhase !== 'tension' && 
          this.state.currentPhase !== 'action') {
        this.pressurePulse.setValue(1);
        return;
      }
      
      // Pulse speed increases with pressure
      const pulseDuration = 1000 - (this.state.pressureLevel * 500);
      
      Animated.sequence([
        Animated.timing(this.pressurePulse, {
          toValue: 1.02 + (this.state.pressureLevel * 0.03),
          duration: pulseDuration / 2,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(this.pressurePulse, {
          toValue: 1,
          duration: pulseDuration / 2,
          easing: Easing.in(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    
    pulse();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // MOMENT TRIGGERS - Respond to significant events
  // ═══════════════════════════════════════════════════════════════════════════════
  
  triggerMoment(moment: MomentType): void {
    this.state.lastSignificantMoment = moment.timestamp;
    
    switch (moment.type) {
      case 'correct':
        this.onCorrectAction(moment.intensity);
        break;
      case 'incorrect':
        this.onIncorrectAction(moment.intensity);
        break;
      case 'trap_fallen':
        this.onTrapFallen();
        break;
      case 'near_miss':
        this.onNearMiss();
        break;
      case 'streak':
        this.onStreak(moment.intensity);
        break;
      case 'rule_shift':
        this.onRuleShift();
        break;
      case 'time_warning':
        this.onTimeWarning();
        break;
      case 'round_complete':
        this.onRoundComplete();
        break;
      case 'session_end':
        this.onSessionEnd();
        break;
    }
  }
  
  private onCorrectAction(intensity: MomentType['intensity']): void {
    // Brief, confident feedback - not celebratory
    const hapticMap = {
      whisper: Haptics.ImpactFeedbackStyle.Light,
      subtle: Haptics.ImpactFeedbackStyle.Light,
      clear: Haptics.ImpactFeedbackStyle.Medium,
      powerful: Haptics.ImpactFeedbackStyle.Medium,
      overwhelming: Haptics.ImpactFeedbackStyle.Heavy,
    };
    
    Haptics.impactAsync(hapticMap[intensity]);
    
    // Micro-expansion and settle
    Animated.sequence([
      Animated.timing(this.focusIntensity, {
        toValue: Math.min(1, this.state.intensity + 0.1),
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.focusIntensity, {
        toValue: this.state.intensity,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }
  
  private onIncorrectAction(intensity: MomentType['intensity']): void {
    // Quiet, clear failure signal - not punishing
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    
    // Brief tension spike
    Animated.sequence([
      Animated.timing(this.tensionLevel, {
        toValue: Math.min(1, (this.tensionLevel as any)._value + 0.2),
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.tensionLevel, {
        toValue: Math.max(0, (this.tensionLevel as any)._value - 0.1),
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }
  
  private onTrapFallen(): void {
    // The trap closes - distinct from regular failure
    // Micro-vibrations: realization of being deceived
    const microVibrate = async () => {
      for (let i = 0; i < 3; i++) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    };
    microVibrate();
    
    // Visual: brief color shift or desaturation
    Animated.sequence([
      Animated.timing(this.ambientOpacity, {
        toValue: 0.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(this.ambientOpacity, {
        toValue: 0.3,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }
  
  private onNearMiss(): void {
    // Almost wrong - heightened awareness
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Brief tension flash
    Animated.sequence([
      Animated.timing(this.tensionLevel, {
        toValue: 0.5,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(this.tensionLevel, {
        toValue: 0.3,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }
  
  private onStreak(intensity: MomentType['intensity']): void {
    // Building momentum - subtle acknowledgment
    const streakLevel = {
      whisper: 0.1,
      subtle: 0.2,
      clear: 0.3,
      powerful: 0.5,
      overwhelming: 0.7,
    };
    
    // Focus increases, ambient brightens slightly
    Animated.parallel([
      Animated.timing(this.focusIntensity, {
        toValue: 0.6 + streakLevel[intensity],
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(this.ambientOpacity, {
        toValue: 0.35 + streakLevel[intensity] * 0.2,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Single clean haptic
    if (intensity === 'powerful' || intensity === 'overwhelming') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }
  
  private onRuleShift(): void {
    // The world changes - disorienting but not unfair
    this.transitionTo('silence', 300);
    
    setTimeout(() => {
      // Reality reasserts
      this.transitionTo('observation', 500);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 800);
  }
  
  private onTimeWarning(): void {
    // Pressure increases
    this.state.pressureLevel = Math.min(1, this.state.pressureLevel + 0.3);
    
    // Visual pressure
    Animated.timing(this.tensionLevel, {
      toValue: 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Subtle haptic heartbeat
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  
  private onRoundComplete(): void {
    this.transitionTo('release', 600);
    
    setTimeout(() => {
      this.transitionTo('observation', 800);
    }, 1000);
  }
  
  private onSessionEnd(): void {
    this.transitionTo('reflection', 1500);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PRESSURE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════
  
  updatePressure(timeRemainingPercent: number): void {
    // Pressure increases as time decreases
    const newPressure = Math.max(0, Math.min(1, 1 - timeRemainingPercent));
    
    // Only update if significant change
    if (Math.abs(newPressure - this.state.pressureLevel) > 0.05) {
      this.state.pressureLevel = newPressure;
      
      // Transition to tension phase if pressure builds
      if (newPressure > 0.5 && this.state.currentPhase === 'observation') {
        this.transitionTo('tension', 500);
      }
      
      // High pressure warning
      if (newPressure > 0.8) {
        this.triggerMoment({
          type: 'time_warning',
          intensity: 'powerful',
          timestamp: Date.now(),
        });
      }
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getCurrentPhase(): EmotionalPhase {
    return this.state.currentPhase;
  }
  
  getState(): EmotionalState {
    return { ...this.state };
  }
  
  getPressureLevel(): number {
    return this.state.pressureLevel;
  }
  
  // Cleanup
  destroy(): void {
    if (this.breathingInterval) {
      clearInterval(this.breathingInterval);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────────

export const emotionalModulation = new EmotionalModulation();
export default EmotionalModulation;
