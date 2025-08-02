// Ability Calculator Service - Shared ability score calculations
const AbilityCalculator = {
  // Calculate ability modifier from ability score
  getModifier(abilityScore) {
    if (typeof abilityScore !== 'number' || isNaN(abilityScore)) {
      return 0;
    }
    return Math.floor((abilityScore - 10) / 2);
  },

  // Get current ability scores with racial adjustments applied
  getCurrentAbilityScores() {
    const abilityData = CharacterDataService.getAbilityScores();
    return abilityData ? abilityData.scores : {};
  },

  // Calculate ability score with racial adjustments
  calculateAbilityWithRacialAdjustments(baseScore, ability, raceData, selectedIncreases = [], selectedDecreases = []) {
    let finalScore = baseScore || 10;

    if (!raceData) return finalScore;

    // Apply fixed racial increases
    if (raceData.abilityAdjustments.increases.fixed) {
      if (raceData.abilityAdjustments.increases.abilities && 
          raceData.abilityAdjustments.increases.abilities.includes(ability)) {
        finalScore += 2;
      }
    } else {
      // Apply selected increases (for races like Human)
      if (selectedIncreases.includes(ability)) {
        finalScore += 2;
      }
    }

    // Apply fixed racial decreases
    if (raceData.abilityAdjustments.decreases.fixed) {
      if (raceData.abilityAdjustments.decreases.abilities && 
          raceData.abilityAdjustments.decreases.abilities.includes(ability)) {
        finalScore -= 2;
      }
    } else {
      // Apply selected decreases
      if (selectedDecreases.includes(ability)) {
        finalScore -= 2;
      }
    }

    return finalScore;
  },

  // Calculate Intelligence modifier for language bonus
  getIntelligenceModifier(raceData = null, selectedIncreases = [], selectedDecreases = []) {
    // Get base Intelligence from localStorage
    const abilityData = CharacterDataService.getAbilityScores();
    let baseIntelligence = 10; // Default if no saved scores
    
    if (abilityData && abilityData.scores && abilityData.scores.INT) {
      baseIntelligence = abilityData.scores.INT;
    }

    // If racial data is provided, calculate with racial adjustments
    if (raceData) {
      baseIntelligence = this.calculateAbilityWithRacialAdjustments(
        baseIntelligence, 
        'INT', 
        raceData, 
        selectedIncreases, 
        selectedDecreases
      );
    }

    return this.getModifier(baseIntelligence);
  },

  // Get bonus languages count from Intelligence
  getBonusLanguagesCount(raceData = null, selectedIncreases = [], selectedDecreases = []) {
    const intModifier = this.getIntelligenceModifier(raceData, selectedIncreases, selectedDecreases);
    return Math.max(0, intModifier);
  },

  // Calculate all current ability modifiers
  getAllCurrentModifiers() {
    const scores = this.getCurrentAbilityScores();
    const modifiers = {};
    
    ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].forEach(ability => {
      modifiers[ability] = this.getModifier(scores[ability] || 10);
    });

    return modifiers;
  },

  // Calculate hit points for 1st level character
  calculateHitPoints(classHitDie, constitutionScore) {
    const conModifier = this.getModifier(constitutionScore || 10);
    return Math.max(1, classHitDie + conModifier);
  },

  // Calculate skill points for 1st level character
  calculateSkillPoints(classSkillPoints, intelligenceScore) {
    const intModifier = this.getModifier(intelligenceScore || 10);
    return Math.max(1, classSkillPoints + intModifier);
  },

  // Calculate saving throws
  calculateSavingThrow(baseSave, abilityScore) {
    const abilityModifier = this.getModifier(abilityScore || 10);
    return baseSave + abilityModifier;
  },

  // Calculate attack bonus
  calculateAttackBonus(baseAttackBonus, abilityScore) {
    const abilityModifier = this.getModifier(abilityScore || 10);
    return baseAttackBonus + abilityModifier;
  },

  // Calculate Armor Class
  calculateArmorClass(baseAC, dexterityScore, armorBonus = 0, shieldBonus = 0, otherBonuses = 0) {
    const dexModifier = this.getModifier(dexterityScore || 10);
    return baseAC + dexModifier + armorBonus + shieldBonus + otherBonuses;
  },

  // Validate ability score ranges
  isValidAbilityScore(score) {
    return typeof score === 'number' && score >= 3 && score <= 25;
  },

  // Format ability score display with modifier
  formatAbilityScore(score) {
    if (!this.isValidAbilityScore(score)) {
      return '--';
    }
    
    const modifier = this.getModifier(score);
    const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
    return `${score} (${modifierStr})`;
  },

  // Get ability score costs for point buy
  getPointBuyCost(score) {
    const costs = {
      7: -4, 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 3, 
      14: 5, 15: 7, 16: 10, 17: 13, 18: 17
    };
    return costs[score] || 0;
  },

  // Calculate total point buy cost
  calculatePointBuyTotal(scores) {
    return Object.values(scores).reduce((total, score) => {
      return total + this.getPointBuyCost(score || 10);
    }, 0);
  }
};

// Make service globally available
window.AbilityCalculator = AbilityCalculator;