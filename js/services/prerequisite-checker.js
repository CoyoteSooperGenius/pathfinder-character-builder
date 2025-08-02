// Prerequisite Checker Service - Reusable prerequisite validation
const PrerequisiteChecker = {
  // Check if character meets all prerequisites for a feat
  meetsAllPrerequisites(prerequisites, characterData = null) {
    if (!prerequisites || prerequisites.length === 0) {
      return true;
    }

    // Get character data if not provided
    if (!characterData) {
      characterData = this.getCharacterData();
    }

    return prerequisites.every(prereq => this.meetsPrerequisite(prereq, characterData));
  },

  // Check a single prerequisite
  meetsPrerequisite(prerequisite, characterData) {
    switch (prerequisite.type) {
      case 'ability':
        return this.checkAbilityPrerequisite(prerequisite, characterData);
      
      case 'bab':
        return this.checkBaseAttackBonusPrerequisite(prerequisite, characterData);
      
      case 'feat':
        return this.checkFeatPrerequisite(prerequisite, characterData);
      
      case 'proficiency':
        return this.checkProficiencyPrerequisite(prerequisite, characterData);
      
      case 'class':
        return this.checkClassPrerequisite(prerequisite, characterData);
      
      case 'level':
        return this.checkLevelPrerequisite(prerequisite, characterData);
      
      case 'skill':
        return this.checkSkillPrerequisite(prerequisite, characterData);
      
      case 'race':
        return this.checkRacePrerequisite(prerequisite, characterData);
      
      default:
        console.warn('Unknown prerequisite type:', prerequisite.type);
        return false;
    }
  },

  // Check ability score prerequisite
  checkAbilityPrerequisite(prerequisite, characterData) {
    const abilityScore = characterData.abilityScores[prerequisite.ability] || 10;
    return abilityScore >= prerequisite.value;
  },

  // Check base attack bonus prerequisite
  checkBaseAttackBonusPrerequisite(prerequisite, characterData) {
    return characterData.bab >= prerequisite.value;
  },

  // Check feat prerequisite
  checkFeatPrerequisite(prerequisite, characterData) {
    if (!characterData.feats) {
      return false;
    }
    return characterData.feats.includes(prerequisite.feat);
  },

  // Check proficiency prerequisite
  checkProficiencyPrerequisite(prerequisite, characterData) {
    // For now, assume fighters have all weapon proficiencies
    // This can be made more sophisticated later
    if (characterData.class === 'Fighter') {
      return prerequisite.weapon === 'selected_weapon' || 
             prerequisite.weapon === 'martial' || 
             prerequisite.weapon === 'simple';
    }
    
    // Check character's specific proficiencies
    if (characterData.proficiencies) {
      return characterData.proficiencies.includes(prerequisite.weapon);
    }
    
    return false;
  },

  // Check class prerequisite
  checkClassPrerequisite(prerequisite, characterData) {
    return characterData.class === prerequisite.class;
  },

  // Check level prerequisite
  checkLevelPrerequisite(prerequisite, characterData) {
    return characterData.level >= prerequisite.value;
  },

  // Check skill prerequisite
  checkSkillPrerequisite(prerequisite, characterData) {
    if (!characterData.skills) {
      return false;
    }
    
    const skillRanks = characterData.skills[prerequisite.skill] || 0;
    return skillRanks >= prerequisite.value;
  },

  // Check race prerequisite
  checkRacePrerequisite(prerequisite, characterData) {
    return characterData.race === prerequisite.race;
  },

  // Get character data for prerequisite checking
  getCharacterData() {
    const completeData = CharacterDataService.getCompleteCharacter();
    const abilityScores = AbilityCalculator.getCurrentAbilityScores();
    const basicInfo = completeData.basicInfo || {};
    
    return {
      abilityScores: abilityScores,
      bab: this.getBaseAttackBonus(basicInfo.class, 1), // 1st level
      level: 1, // Currently only supporting 1st level
      class: basicInfo.class || '',
      race: basicInfo.race || '',
      feats: this.getCharacterFeats(basicInfo),
      skills: {}, // To be implemented when skills are added
      proficiencies: this.getClassProficiencies(basicInfo.class)
    };
  },

  // Get base attack bonus for class and level
  getBaseAttackBonus(className, level) {
    const babProgression = {
      'Fighter': 'full',     // +1 per level
      'Barbarian': 'full',
      'Paladin': 'full',
      'Ranger': 'full',
      'Bard': 'medium',      // +3/4 per level
      'Cleric': 'medium',
      'Druid': 'medium',
      'Monk': 'medium',
      'Rogue': 'medium',
      'Sorcerer': 'poor',    // +1/2 per level
      'Wizard': 'poor'
    };
    
    const progression = babProgression[className] || 'medium';
    
    switch (progression) {
      case 'full':
        return level;
      case 'medium':
        return Math.floor(level * 3 / 4);
      case 'poor':
        return Math.floor(level / 2);
      default:
        return 0;
    }
  },

  // Get character's feats (including racial and class bonus feats)
  getCharacterFeats(basicInfo) {
    const feats = [];
    
    // Add human bonus feat
    if (basicInfo.race === 'Human') {
      feats.push('Human Bonus Feat'); // Placeholder
    }
    
    // Add fighter bonus feat
    if (basicInfo.class === 'Fighter' && basicInfo.bonusFeat) {
      feats.push(basicInfo.bonusFeat);
    }
    
    return feats;
  },

  // Get class weapon/armor proficiencies
  getClassProficiencies(className) {
    const classProficiencies = {
      'Fighter': ['simple', 'martial', 'all_armor', 'shields'],
      'Barbarian': ['simple', 'martial', 'light_armor', 'medium_armor', 'shields'],
      'Paladin': ['simple', 'martial', 'all_armor', 'shields'],
      'Ranger': ['simple', 'martial', 'light_armor', 'medium_armor', 'shields'],
      'Bard': ['simple', 'longsword', 'rapier', 'shortbow', 'whip', 'light_armor', 'shields'],
      'Cleric': ['simple', 'all_armor', 'shields'],
      'Druid': ['club', 'dagger', 'dart', 'quarterstaff', 'scimitar', 'sickle', 'shortspear', 'sling', 'spear', 'leather_armor', 'studded_leather', 'shields'],
      'Monk': ['club', 'crossbow', 'dagger', 'handaxe', 'javelin', 'quarterstaff', 'shuriken', 'siangham', 'sling'],
      'Rogue': ['simple', 'hand_crossbow', 'rapier', 'sap', 'shortbow', 'short_sword', 'light_armor'],
      'Sorcerer': ['simple'],
      'Wizard': ['club', 'dagger', 'heavy_crossbow', 'light_crossbow', 'quarterstaff']
    };
    
    return classProficiencies[className] || ['simple'];
  },

  // Format prerequisite for display
  formatPrerequisite(prerequisite) {
    switch (prerequisite.type) {
      case 'ability':
        return `${prerequisite.ability} ${prerequisite.value}+`;
      
      case 'bab':
        return `Base attack bonus +${prerequisite.value}`;
      
      case 'feat':
        return prerequisite.feat;
      
      case 'proficiency':
        if (prerequisite.weapon === 'selected_weapon') {
          return 'Proficiency with selected weapon';
        }
        return `Proficiency with ${prerequisite.weapon}`;
      
      case 'class':
        return `${prerequisite.class} class`;
      
      case 'level':
        return `Character level ${prerequisite.value}+`;
      
      case 'skill':
        return `${prerequisite.skill} ${prerequisite.value} ranks`;
      
      case 'race':
        return prerequisite.race;
      
      default:
        return 'Unknown requirement';
    }
  },

  // Filter a list of items by prerequisites
  filterByPrerequisites(items, characterData = null) {
    if (!characterData) {
      characterData = this.getCharacterData();
    }
    
    return items.filter(item => {
      if (!item.prerequisites) {
        return true;
      }
      return this.meetsAllPrerequisites(item.prerequisites, characterData);
    });
  },

  // Get list of unmet prerequisites for an item
  getUnmetPrerequisites(prerequisites, characterData = null) {
    if (!prerequisites || prerequisites.length === 0) {
      return [];
    }

    if (!characterData) {
      characterData = this.getCharacterData();
    }

    return prerequisites.filter(prereq => !this.meetsPrerequisite(prereq, characterData));
  }
};

// Make service globally available
window.PrerequisiteChecker = PrerequisiteChecker;