// Pathfinder 1e Game Rules and Utility Functions

const GameUtils = {
  
  // Ability Score Calculations
  calculateAbilityModifier(abilityScore) {
    return Math.floor((abilityScore - 10) / 2);
  },

  calculateAbilityModifiers(abilityScores) {
    const modifiers = {};
    for (const [ability, score] of Object.entries(abilityScores)) {
      modifiers[ability] = this.calculateAbilityModifier(score);
    }
    return modifiers;
  },

  // Character Name Utilities
  getCharacterFullName(nameObject) {
    if (!nameObject) return '';
    const { first = '', last = '' } = nameObject;
    return `${first} ${last}`.trim();
  },

  // Flatten a race/class value that may be stored as a string or as an
  // object with a name (legacy/imported data may lack the name)
  flattenEntityName(entity, fallback = 'Unknown') {
    if (!entity) return fallback;
    if (typeof entity === 'string') return entity;
    return entity.name || fallback;
  },

  // Combat Statistics Calculations
  calculateArmorClass(character) {
    // Base AC = 10 + armor bonus + shield bonus + DEX modifier + size modifier + natural armor + deflection + misc
    const abilityModifiers = this.calculateAbilityModifiers(character.abilityScores);
    let ac = 10;
    
    // Add DEX modifier
    ac += abilityModifiers.dexterity || 0;
    
    // TODO: Add armor, shield, size, natural armor, deflection, and misc bonuses
    // This will be implemented when equipment system is added
    
    return ac;
  },

  calculateInitiative(character) {
    const abilityModifiers = this.calculateAbilityModifiers(character.abilityScores);
    let initiative = abilityModifiers.dexterity || 0;
    
    // TODO: Add misc bonuses (feats, traits, equipment)
    
    return initiative;
  },

  calculateHitPoints(character) {
    if (!character.characterClass) return 0;
    
    const abilityModifiers = this.calculateAbilityModifiers(character.abilityScores);
    const conModifier = abilityModifiers.constitution || 0;
    
    // At 1st level: max hit die + CON modifier
    const hitDie = character.characterClass.hitDie || 8;
    let hp = hitDie + conModifier;
    
    // TODO: Add favored class bonus if applicable
    // TODO: Add feat bonuses (Toughness, etc.)
    
    return Math.max(1, hp); // Minimum 1 HP
  },

  calculateCombatManeuverBonus(character) {
    const abilityModifiers = this.calculateAbilityModifiers(character.abilityScores);
    const strModifier = abilityModifiers.strength || 0;
    const bab = character.baseAttackBonus || 0;
    
    // CMB = BAB + STR modifier + size modifier
    let cmb = bab + strModifier;
    
    // TODO: Add size modifier based on race
    
    return cmb;
  },

  calculateCombatManeuverDefense(character) {
    const abilityModifiers = this.calculateAbilityModifiers(character.abilityScores);
    const strModifier = abilityModifiers.strength || 0;
    const dexModifier = abilityModifiers.dexterity || 0;
    const bab = character.baseAttackBonus || 0;
    
    // CMD = 10 + BAB + STR modifier + DEX modifier + size modifier
    let cmd = 10 + bab + strModifier + dexModifier;
    
    // TODO: Add size modifier based on race
    
    return cmd;
  },

  calculateSavingThrows(character) {
    if (!character.characterClass) {
      return { fortitude: 0, reflex: 0, will: 0 };
    }

    const abilityModifiers = this.calculateAbilityModifiers(character.abilityScores);
    const saves = {
      fortitude: 0,
      reflex: 0,
      will: 0
    };

    // Base saves from class
    const classSaves = character.characterClass.saves || {};
    
    // Fortitude = base + CON modifier
    saves.fortitude = this.getBaseSave(classSaves.fortitude, character.level) + (abilityModifiers.constitution || 0);
    
    // Reflex = base + DEX modifier  
    saves.reflex = this.getBaseSave(classSaves.reflex, character.level) + (abilityModifiers.dexterity || 0);
    
    // Will = base + WIS modifier
    saves.will = this.getBaseSave(classSaves.will, character.level) + (abilityModifiers.wisdom || 0);

    // TODO: Add racial bonuses, feat bonuses, equipment bonuses

    return saves;
  },

  getBaseSave(saveProgression, level) {
    // Convert save progression string to numeric value
    // "High" progression: +2 at 1st level
    // "Low" progression: +0 at 1st level
    if (saveProgression === 'High') {
      return 2;
    } else if (saveProgression === 'Low') {
      return 0;
    }
    return 0;
  },

  // Skill Calculations
  calculateSkillPoints(character) {
    if (!character.characterClass) return 0;
    
    const abilityModifiers = this.calculateAbilityModifiers(character.abilityScores);
    const intModifier = abilityModifiers.intelligence || 0;
    const classSkillPoints = character.characterClass.skillPoints || 2;
    
    // Skill points per level = class skill points + INT modifier (minimum 1)
    const skillPointsPerLevel = Math.max(1, classSkillPoints + intModifier);
    
    // TODO: Add human bonus skill point
    // TODO: Add favored class bonus skill point
    
    return skillPointsPerLevel;
  },

  calculateSkillBonus(character, skillName, ranks = 0) {
    const abilityModifiers = this.calculateAbilityModifiers(character.abilityScores);
    
    // TODO: Implement skill-to-ability mapping
    // For now, return basic calculation
    let bonus = ranks;
    
    // Add class skill bonus (+3 if trained)
    if (ranks > 0 && this.isClassSkill(character, skillName)) {
      bonus += 3;
    }
    
    // TODO: Add ability modifier based on skill type
    // TODO: Add racial bonuses, feat bonuses, equipment bonuses
    
    return bonus;
  },

  isClassSkill(character, skillName) {
    if (!character.characterClass || !character.characterClass.classSkills) return false;
    return character.characterClass.classSkills.includes(skillName);
  },

  // Base Attack Bonus
  calculateBaseAttackBonus(character) {
    if (!character.characterClass) return 0;
    
    const babProgression = character.characterClass.baseAttackBonus;
    const level = character.level || 1;
    
    // Convert BAB progression to numeric value
    if (babProgression === 'High') {
      return level; // Full BAB
    } else if (babProgression === 'Medium') {
      return Math.floor(level * 3 / 4); // 3/4 BAB
    } else if (babProgression === 'Low') {
      return Math.floor(level / 2); // 1/2 BAB
    }
    
    return 0;
  },

  // Character Validation
  isValidAbilityScore(score) {
    return typeof score === 'number' && score >= 3 && score <= 25;
  },

  validateCharacterData(character) {
    const errors = [];

    // Validate ability scores
    for (const [ability, score] of Object.entries(character.abilityScores || {})) {
      if (!this.isValidAbilityScore(score)) {
        errors.push(`Invalid ${ability} score: ${score}`);
      }
    }

    // Validate required fields
    if (!character.name?.first?.trim()) {
      errors.push('First name is required');
    }
    if (!character.name?.last?.trim()) {
      errors.push('Last name is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  // Update all calculated values for a character
  updateCalculatedValues(character) {
    const abilityModifiers = this.calculateAbilityModifiers(character.abilityScores);
    
    // Update basic calculated values
    character.armorClass = this.calculateArmorClass(character);
    character.initiative = this.calculateInitiative(character);
    character.hitPoints = this.calculateHitPoints(character);
    character.baseAttackBonus = this.calculateBaseAttackBonus(character);
    character.combatManeuverBonus = this.calculateCombatManeuverBonus(character);
    character.combatManeuverDefense = this.calculateCombatManeuverDefense(character);
    character.savingThrows = this.calculateSavingThrows(character);
    character.skillPoints = this.calculateSkillPoints(character);

    return character;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.GameUtils = GameUtils;
}

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameUtils;
}