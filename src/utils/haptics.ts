// ═══════════════════════════════════════════════════════════════════════════════
// 📱 HAPTIC FEEDBACK UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

import * as Haptics from 'expo-haptics';

export const haptics = {
  // Light feedback for small interactions
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  
  // Medium feedback for standard actions
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  
  // Heavy feedback for important actions
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  
  // Success feedback
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  
  // Error feedback
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  
  // Warning feedback
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  
  // Selection feedback
  selection: () => Haptics.selectionAsync(),
  
  // Combo celebration - rapid fire haptics
  combo: async (count: number) => {
    for (let i = 0; i < Math.min(count, 5); i++) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  },
  
  // Victory celebration
  victory: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  
  // Defeat feedback
  defeat: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    await new Promise(resolve => setTimeout(resolve, 200));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  
  // Level up celebration
  levelUp: async () => {
    for (let i = 0; i < 3; i++) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise(resolve => setTimeout(resolve, 80));
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  
  // Countdown tick
  tick: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  
  // Time running out warning
  timeWarning: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  
  // Streak milestone
  streakMilestone: async (streak: number) => {
    const intensity = streak >= 10 ? Haptics.ImpactFeedbackStyle.Heavy :
                      streak >= 5 ? Haptics.ImpactFeedbackStyle.Medium :
                      Haptics.ImpactFeedbackStyle.Light;
    await Haptics.impactAsync(intensity);
    if (streak >= 5) {
      await new Promise(resolve => setTimeout(resolve, 50));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  
  // Power-up activation
  powerUp: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
};

export default haptics;
