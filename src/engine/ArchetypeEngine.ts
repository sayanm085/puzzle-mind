// ═══════════════════════════════════════════════════════════════════════════════
// 🧬 COGNITIVE ARCHETYPES - Mind Evolution System
// "The world changes because of the player."
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type ArchetypeId = 'observer' | 'strategist' | 'reactor' | 'architect';
export type EvolutionStage = 0 | 1 | 2 | 3 | 4 | 5; // Awakening → Transcendence

export interface CognitiveArchetype {
  id: ArchetypeId;
  name: string;
  title: string;            // Full ceremonial title
  essence: string;          // Core description
  strengths: string[];
  blindSpots: string[];
  evolutionPath: string[];  // Titles at each stage
  color: string;
  secondaryColor: string;
  icon: string;
  
  // Behavioral signatures
  preferredDomains: string[];
  responsePattern: 'deliberate' | 'balanced' | 'reactive';
  riskProfile: 'cautious' | 'measured' | 'bold';
}

export interface PlayerEvolution {
  dominantArchetype: ArchetypeId;
  secondaryArchetype: ArchetypeId | null;
  archetypeScores: Record<ArchetypeId, number>;
  evolutionStage: EvolutionStage;
  stageProgress: number;    // 0-100 within current stage
  totalInsights: number;
  breakthroughs: Breakthrough[];
  currentTitle: string;
}

export interface Breakthrough {
  id: string;
  timestamp: number;
  type: 'archetype_shift' | 'stage_advance' | 'insight' | 'mastery';
  title: string;
  description: string;
  archetypeId?: ArchetypeId;
}

// ─────────────────────────────────────────────────────────────────────────────────
// ARCHETYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────────

export const ARCHETYPES: Record<ArchetypeId, CognitiveArchetype> = {
  observer: {
    id: 'observer',
    name: 'Observer',
    title: 'The Watcher in Stillness',
    essence: 'Sees what others miss. Finds patterns in chaos. Patience as power.',
    strengths: [
      'Detecting subtle differences',
      'Resisting false patterns',
      'Long-term pattern recognition',
      'Maintaining focus under pressure',
    ],
    blindSpots: [
      'Over-analysis leading to hesitation',
      'Missing time-sensitive opportunities',
      'Difficulty with rapid decisions',
    ],
    evolutionPath: [
      'Awakening Observer',
      'Perceptive Mind',
      'Pattern Seer',
      'Depth Reader',
      'The All-Seeing',
      'Transcendent Observer',
    ],
    color: '#00FFFF',
    secondaryColor: '#006666',
    icon: '👁',
    preferredDomains: ['perception', 'meta'],
    responsePattern: 'deliberate',
    riskProfile: 'cautious',
  },
  
  strategist: {
    id: 'strategist',
    name: 'Strategist',
    title: 'The Architect of Paths',
    essence: 'Plans before moving. Every action serves the whole. Thinking in systems.',
    strengths: [
      'Multi-step planning',
      'Rule comprehension',
      'Adapting to rule changes',
      'Resource optimization',
    ],
    blindSpots: [
      'Paralysis when plans fail',
      'Overthinking simple problems',
      'Frustration with randomness',
    ],
    evolutionPath: [
      'Awakening Strategist',
      'Thoughtful Mind',
      'System Thinker',
      'Master Planner',
      'The Foreseeing',
      'Transcendent Strategist',
    ],
    color: '#A855F7',
    secondaryColor: '#4B2876',
    icon: '♟',
    preferredDomains: ['logic', 'spatial'],
    responsePattern: 'deliberate',
    riskProfile: 'measured',
  },
  
  reactor: {
    id: 'reactor',
    name: 'Reactor',
    title: 'The Lightning Mind',
    essence: 'Acts on instinct refined by experience. Speed without sacrifice. Flow state native.',
    strengths: [
      'Rapid accurate responses',
      'Intuitive pattern matching',
      'Performing under time pressure',
      'Quick recovery from errors',
    ],
    blindSpots: [
      'Falling for obvious traps',
      'Impatience with complex rules',
      'Difficulty with delayed gratification',
    ],
    evolutionPath: [
      'Awakening Reactor',
      'Swift Mind',
      'Instinct Rider',
      'Flow Walker',
      'The Instantaneous',
      'Transcendent Reactor',
    ],
    color: '#FF6B35',
    secondaryColor: '#8B3A1D',
    icon: '⚡',
    preferredDomains: ['temporal', 'perception'],
    responsePattern: 'reactive',
    riskProfile: 'bold',
  },
  
  architect: {
    id: 'architect',
    name: 'Architect',
    title: 'The Builder of Understanding',
    essence: 'Constructs mental models. Understands the why behind the what. Creates from chaos.',
    strengths: [
      'Deep rule comprehension',
      'Building on past knowledge',
      'Creating novel solutions',
      'Meta-cognitive awareness',
    ],
    blindSpots: [
      'Over-engineering simple situations',
      'Slow initial learning',
      'Frustration with arbitrary rules',
    ],
    evolutionPath: [
      'Awakening Architect',
      'Foundation Mind',
      'Structure Builder',
      'Framework Master',
      'The Reality Shaper',
      'Transcendent Architect',
    ],
    color: '#10B981',
    secondaryColor: '#065F46',
    icon: '🏛',
    preferredDomains: ['logic', 'meta'],
    responsePattern: 'balanced',
    riskProfile: 'measured',
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// EVOLUTION STAGES
// ─────────────────────────────────────────────────────────────────────────────────

export const EVOLUTION_STAGES: Record<EvolutionStage, {
  name: string;
  threshold: number;   // Total score needed to reach
  description: string;
  unlocks: string[];
}> = {
  0: {
    name: 'Awakening',
    threshold: 0,
    description: 'The void stirs. Awareness begins.',
    unlocks: ['Genesis Sector'],
  },
  1: {
    name: 'Recognition',
    threshold: 500,
    description: 'Patterns emerge from noise. The self observes the self.',
    unlocks: ['Prisma Sector', 'Basic Insights'],
  },
  2: {
    name: 'Integration',
    threshold: 2000,
    description: 'Separate skills weave together. The mind becomes more than parts.',
    unlocks: ['Axiom Sector', 'Cognitive Radar'],
  },
  3: {
    name: 'Mastery',
    threshold: 5000,
    description: 'Understanding deepens beyond technique. Intuition and analysis merge.',
    unlocks: ['Chronos Sector', 'Deep Insights'],
  },
  4: {
    name: 'Transcendence',
    threshold: 12000,
    description: 'The game becomes the teacher. Every challenge, a mirror.',
    unlocks: ['Nexus Sector', 'Meta-Awareness'],
  },
  5: {
    name: 'Infinity',
    threshold: 30000,
    description: 'Beyond measurement. The observer and observed unite.',
    unlocks: ['The Void', 'Complete Understanding'],
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// ARCHETYPE ENGINE
// ─────────────────────────────────────────────────────────────────────────────────

class ArchetypeEngine {
  private evolution: PlayerEvolution;
  
  constructor() {
    this.evolution = this.createDefaultEvolution();
  }
  
  private createDefaultEvolution(): PlayerEvolution {
    return {
      dominantArchetype: 'observer',
      secondaryArchetype: null,
      archetypeScores: {
        observer: 25,
        strategist: 25,
        reactor: 25,
        architect: 25,
      },
      evolutionStage: 0,
      stageProgress: 0,
      totalInsights: 0,
      breakthroughs: [],
      currentTitle: ARCHETYPES.observer.evolutionPath[0],
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SCORE PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════════
  
  processAction(data: {
    responseTime: number;
    wasCorrect: boolean;
    wasDeliberate: boolean;
    wasImpulsive: boolean;
    trapAvoided: boolean;
    trapFallen: boolean;
    ruleAdapted: boolean;
    patternFound: boolean;
  }): ArchetypeUpdate {
    const updates: Partial<Record<ArchetypeId, number>> = {};
    
    // ─── Observer signals ───
    if (data.trapAvoided) {
      updates.observer = (updates.observer || 0) + 3;
    }
    if (data.wasDeliberate && data.wasCorrect) {
      updates.observer = (updates.observer || 0) + 1;
    }
    if (data.patternFound) {
      updates.observer = (updates.observer || 0) + 2;
    }
    
    // ─── Strategist signals ───
    if (data.ruleAdapted) {
      updates.strategist = (updates.strategist || 0) + 3;
    }
    if (data.wasDeliberate && data.wasCorrect && data.responseTime > 1500) {
      updates.strategist = (updates.strategist || 0) + 1;
    }
    
    // ─── Reactor signals ───
    if (data.wasImpulsive && data.wasCorrect) {
      updates.reactor = (updates.reactor || 0) + 2;
    }
    if (data.responseTime < 800 && data.wasCorrect) {
      updates.reactor = (updates.reactor || 0) + 2;
    }
    if (data.trapFallen) {
      updates.reactor = (updates.reactor || 0) - 1; // Reactors struggle with traps
    }
    
    // ─── Architect signals ───
    if (data.ruleAdapted && data.patternFound) {
      updates.architect = (updates.architect || 0) + 3;
    }
    if (data.wasCorrect && !data.wasImpulsive) {
      updates.architect = (updates.architect || 0) + 0.5;
    }
    
    // Apply updates
    for (const [archetype, delta] of Object.entries(updates)) {
      this.evolution.archetypeScores[archetype as ArchetypeId] += delta;
      // Keep scores positive
      this.evolution.archetypeScores[archetype as ArchetypeId] = Math.max(
        0,
        this.evolution.archetypeScores[archetype as ArchetypeId]
      );
    }
    
    // Check for archetype shifts and evolution
    return this.evaluateEvolution();
  }
  
  private evaluateEvolution(): ArchetypeUpdate {
    const result: ArchetypeUpdate = {
      archetypeShift: null,
      stageAdvance: null,
      newInsight: null,
    };
    
    // Find dominant archetype
    const scores = this.evolution.archetypeScores;
    const sorted = (Object.entries(scores) as [ArchetypeId, number][])
      .sort((a, b) => b[1] - a[1]);
    
    const newDominant = sorted[0][0];
    const newSecondary = sorted[1][0];
    
    // Check for archetype shift
    if (newDominant !== this.evolution.dominantArchetype) {
      // Significant lead required to shift
      const lead = sorted[0][1] - sorted[1][1];
      if (lead > 10) {
        result.archetypeShift = {
          from: this.evolution.dominantArchetype,
          to: newDominant,
        };
        
        this.evolution.dominantArchetype = newDominant;
        this.evolution.breakthroughs.push({
          id: `archetype_${Date.now()}`,
          timestamp: Date.now(),
          type: 'archetype_shift',
          title: `Emergence of the ${ARCHETYPES[newDominant].name}`,
          description: ARCHETYPES[newDominant].essence,
          archetypeId: newDominant,
        });
      }
    }
    
    // Update secondary
    if (newSecondary !== this.evolution.secondaryArchetype) {
      const secondaryLead = sorted[1][1] - sorted[2][1];
      if (secondaryLead > 5) {
        this.evolution.secondaryArchetype = newSecondary;
      }
    }
    
    // Update title
    this.evolution.currentTitle = 
      ARCHETYPES[this.evolution.dominantArchetype].evolutionPath[this.evolution.evolutionStage];
    
    // Check for stage evolution
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const currentStage = this.evolution.evolutionStage;
    const nextStage = (currentStage + 1) as EvolutionStage;
    
    if (nextStage <= 5 && totalScore >= EVOLUTION_STAGES[nextStage].threshold) {
      result.stageAdvance = {
        from: currentStage,
        to: nextStage,
        unlocks: EVOLUTION_STAGES[nextStage].unlocks,
      };
      
      this.evolution.evolutionStage = nextStage;
      this.evolution.stageProgress = 0;
      this.evolution.currentTitle = 
        ARCHETYPES[this.evolution.dominantArchetype].evolutionPath[nextStage];
      
      this.evolution.breakthroughs.push({
        id: `stage_${Date.now()}`,
        timestamp: Date.now(),
        type: 'stage_advance',
        title: `${EVOLUTION_STAGES[nextStage].name} Achieved`,
        description: EVOLUTION_STAGES[nextStage].description,
      });
    } else if (currentStage < 5) {
      // Update stage progress
      const currentThreshold = EVOLUTION_STAGES[currentStage].threshold;
      const nextThreshold = EVOLUTION_STAGES[nextStage].threshold;
      this.evolution.stageProgress = Math.floor(
        ((totalScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100
      );
    }
    
    return result;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  generateInsight(): string | null {
    const dominant = ARCHETYPES[this.evolution.dominantArchetype];
    const secondary = this.evolution.secondaryArchetype 
      ? ARCHETYPES[this.evolution.secondaryArchetype]
      : null;
    
    const insights: string[] = [];
    
    // Archetype-specific insights
    switch (this.evolution.dominantArchetype) {
      case 'observer':
        insights.push(
          'Your patience reveals what haste conceals.',
          'The stillness before action defines the action.',
          'You see the trap before the trap sees you.',
        );
        break;
      case 'strategist':
        insights.push(
          'Every move serves the whole pattern.',
          'You think three steps ahead. Consider four.',
          'The rule behind the rule - you sense it.',
        );
        break;
      case 'reactor':
        insights.push(
          'Trust your trained instinct.',
          'Speed and accuracy - your equilibrium.',
          'The moment arrives. You are ready.',
        );
        break;
      case 'architect':
        insights.push(
          'You build understanding from chaos.',
          'The structure of the problem reveals the solution.',
          'Every failure is a foundation stone.',
        );
        break;
    }
    
    // Hybrid insights
    if (secondary) {
      insights.push(
        `The ${dominant.name} and ${secondary.name} within you collaborate.`,
        `Your ${dominant.name} nature is tempered by ${secondary.name} wisdom.`,
      );
    }
    
    // Evolution stage insights
    const stage = EVOLUTION_STAGES[this.evolution.evolutionStage];
    insights.push(stage.description);
    
    // Select one randomly
    this.evolution.totalInsights++;
    return insights[Math.floor(Math.random() * insights.length)];
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getEvolution(): PlayerEvolution {
    return { ...this.evolution };
  }
  
  getDominantArchetype(): CognitiveArchetype {
    return ARCHETYPES[this.evolution.dominantArchetype];
  }
  
  getSecondaryArchetype(): CognitiveArchetype | null {
    return this.evolution.secondaryArchetype 
      ? ARCHETYPES[this.evolution.secondaryArchetype]
      : null;
  }
  
  getCurrentTitle(): string {
    return this.evolution.currentTitle;
  }
  
  getStageInfo(): typeof EVOLUTION_STAGES[EvolutionStage] {
    return EVOLUTION_STAGES[this.evolution.evolutionStage];
  }
  
  getArchetypeBalance(): Record<ArchetypeId, number> {
    const total = Object.values(this.evolution.archetypeScores)
      .reduce((a, b) => a + b, 0);
    
    const balance: Record<ArchetypeId, number> = {} as any;
    for (const [id, score] of Object.entries(this.evolution.archetypeScores)) {
      balance[id as ArchetypeId] = total > 0 ? score / total : 0.25;
    }
    
    return balance;
  }
  
  getRecentBreakthroughs(count: number = 5): Breakthrough[] {
    return this.evolution.breakthroughs
      .slice(-count)
      .reverse();
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// SUPPORTING TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface ArchetypeUpdate {
  archetypeShift: {
    from: ArchetypeId;
    to: ArchetypeId;
  } | null;
  stageAdvance: {
    from: EvolutionStage;
    to: EvolutionStage;
    unlocks: string[];
  } | null;
  newInsight: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────────

export const archetypeEngine = new ArchetypeEngine();
export default ArchetypeEngine;
