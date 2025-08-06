/**
 * Character Display Service
 * 
 * Centralized service for transforming raw character data into display-ready formats
 * for the character sheet components. Handles data formatting, computed properties,
 * and derived statistics.
 */
const CharacterDisplayService = {
  
  /**
   * Get character summary string
   */
  getCharacterSummary(basicInfo) {
    const race = basicInfo.race || 'Unknown';
    const charClass = basicInfo.class || 'Unknown';
    const level = basicInfo.level || 1;
    
    return `${race} ${charClass}, Level ${level}`;
  },
  
  /**
   * Format basic information for display in info panels
   */
  getBasicInfoData(basicInfo) {
    return [
      { key: 'name', label: 'Name', value: basicInfo.name || '—' },
      { key: 'race', label: 'Race', value: basicInfo.race || '—', id: 'character-sheet-race' },
      { key: 'class', label: 'Class', value: basicInfo.class || '—' },
      { key: 'level', label: 'Level', value: basicInfo.level || 1 }
    ];
  },
  
  /**
   * Format key statistics for display in info panels
   */
  getKeyStatsData(derivedStats) {
    return [
      { key: 'Hit Points', value: derivedStats.hitPoints || 0 },
      { key: 'Armor Class', value: derivedStats.armorClass || 10 }
    ];
  },
  
  /**
   * Get top 3 ability scores for compact display
   */
  getTopAbilities(abilityScores) {
    return Object.entries(abilityScores)
      .map(([ability, score]) => ({
        ability,
        score,
        modifier: AbilityCalculator.getModifier(score)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  },
  
  /**
   * Calculate all ability modifiers
   */
  getAbilityModifiers(abilityScores) {
    const modifiers = {};
    Object.keys(abilityScores).forEach(ability => {
      modifiers[ability] = AbilityCalculator.getModifier(abilityScores[ability]);
    });
    return modifiers;
  },
  
  /**
   * Format modifier for display (+1, -2, etc.)
   */
  formatModifier(modifier) {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  },
  
  /**
   * Calculate derived statistics based on ability scores and class
   */
  calculateDerivedStats(abilityScores, basicInfo) {
    const abilityModifiers = this.getAbilityModifiers(abilityScores);
    const conMod = abilityModifiers.CON || 0;
    const dexMod = abilityModifiers.DEX || 0;
    
    // Calculate hit points based on class
    let baseHitPoints = 8; // Default
    if (basicInfo.class === 'Fighter') baseHitPoints = 10;
    else if (basicInfo.class === 'Barbarian') baseHitPoints = 12;
    else if (basicInfo.class === 'Wizard' || basicInfo.class === 'Sorcerer') baseHitPoints = 6;
    
    return {
      hitPoints: Math.max(1, baseHitPoints + conMod),
      armorClass: 10 + dexMod,
      initiative: dexMod,
      speed: 30 // Base human speed, could be modified by race/class later
    };
  },
  
  /**
   * Process feats data for display
   */
  processFeatsData(basicInfo) {
    const feats = [];
    
    // Add fighter bonus feat
    if (basicInfo && basicInfo.class === 'Fighter' && basicInfo.bonusFeat) {
      feats.push({
        label: basicInfo.bonusFeat,
        description: 'Fighter bonus feat selected at 1st level.',
        source: 'Class (Fighter)'
      });
    }
    
    // Add human bonus feat
    if (basicInfo && basicInfo.race === 'Human') {
      if (basicInfo.humanBonusFeat) {
        feats.push({
          label: basicInfo.humanBonusFeat,
          description: 'Human racial bonus feat selected at 1st level.',
          source: 'Race (Human)'
        });
      } else {
        feats.push({
          label: 'Human Bonus Feat',
          description: 'Humans select one extra feat at 1st level (selection pending).',
          source: 'Race (Human)'
        });
      }
    }
    
    return feats;
  },
  
  /**
   * Process traits data for display
   */
  processTraitsData(traitsData, raceName) {
    if (!traitsData || !traitsData.racialTraits) {
      return [];
    }
    
    return traitsData.racialTraits.map(trait => ({
      label: trait.Label,
      description: trait.Description,
      source: `Race (${raceName})`
    }));
  },
  
  /**
   * Process languages data for display
   */
  processLanguagesData(detailsData) {
    if (!detailsData) return [];
    
    // Handle both new format (nested) and old format (direct array/string)
    if (detailsData.languages) {
      if (typeof detailsData.languages === 'object' && detailsData.languages.automatic) {
        // New nested format
        const allLanguages = [
          ...(detailsData.languages.automatic || []),
          ...(detailsData.languages.bonus || [])
        ];
        return [...new Set(allLanguages)]; // Remove duplicates
      } else if (Array.isArray(detailsData.languages)) {
        // Direct array format
        return detailsData.languages;
      } else if (typeof detailsData.languages === 'string') {
        // String format
        return detailsData.languages.split(',')
          .map(lang => lang.trim())
          .filter(lang => lang);
      }
    }
    
    return [];
  },
  
  /**
   * Check if class is a spellcaster
   */
  isSpellcaster(className) {
    const spellcasters = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Wizard'];
    return spellcasters.includes(className);
  },
  
  /**
   * Get relevant sections to display based on current step and completion
   */
  getRelevantSections(currentStep, completedSteps) {
    const sections = [];
    
    // Always show summary
    sections.push('summary');
    
    // Show based on current step and completion
    if (currentStep >= 0 || completedSteps.includes(0)) {
      sections.push('abilities');
    }
    if (currentStep >= 1 || completedSteps.includes(1)) {
      sections.push('background');
    }
    if (currentStep >= 2 || completedSteps.includes(2)) {
      sections.push('combat');
    }
    if (currentStep >= 3 || completedSteps.includes(3) || completedSteps.includes(4)) {
      sections.push('features');
    }
    
    return sections;
  },
  
  /**
   * Get step information configuration
   */
  getStepInfo() {
    return {
      0: { name: 'abilities', label: 'Ability Scores', icon: 'fas fa-chart-bar', primary: true },
      1: { name: 'race', label: 'Race & Heritage', icon: 'fas fa-users', primary: true },
      2: { name: 'class', label: 'Class & Features', icon: 'fas fa-sword', primary: true },
      3: { name: 'skills', label: 'Skills', icon: 'fas fa-tools', primary: false },
      4: { name: 'feats', label: 'Feats', icon: 'fas fa-star', primary: false },
      5: { name: 'equipment', label: 'Equipment', icon: 'fas fa-shield-alt', primary: false },
      6: { name: 'details', label: 'Final Details', icon: 'fas fa-scroll', primary: false }
    };
  },
  
  /**
   * Get current step information
   */
  getCurrentStepInfo(currentStep) {
    const stepInfo = this.getStepInfo();
    return stepInfo[currentStep] || stepInfo[0];
  },
  
  /**
   * Process all character data from localStorage into display-ready format
   */
  processAllCharacterData() {
    // Load raw data from localStorage
    const basicData = CharacterDataService.getBasicInfo();
    const abilityData = CharacterDataService.getAbilityScores();
    const traitsData = CharacterDataService.getTraits();
    const detailsData = CharacterDataService.getDetails();
    
    // Initialize default data structure
    const processedData = {
      basicInfo: {
        name: '',
        race: '',
        class: '',
        level: 1,
        alignment: '',
        favoredClasses: []
      },
      abilityScores: {
        STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10
      },
      derivedStats: {
        hitPoints: 0,
        armorClass: 10,
        initiative: 0,
        speed: 30
      },
      feats: [],
      traits: [],
      languages: [],
      skills: [] // Placeholder for future implementation
    };
    
    // Process basic info
    if (basicData) {
      processedData.basicInfo = {
        name: basicData.name || '',
        race: basicData.race || '',
        class: basicData.class || '',
        level: 1,
        alignment: basicData.alignment || '',
        favoredClasses: basicData.favoredClasses || [],
        // Include class-specific data
        arcaneBond: basicData.arcaneBond,
        familiar: basicData.familiar,
        bondedObject: basicData.bondedObject,
        weapon: basicData.weapon,
        arcaneSchool: basicData.arcaneSchool,
        oppositionSchools: basicData.oppositionSchools,
        startingSpells: basicData.startingSpells,
        bonusFeat: basicData.bonusFeat,
        humanBonusFeat: basicData.humanBonusFeat,
        classData: basicData.classData
      };
    }
    
    // Process ability scores
    if (abilityData && abilityData.scores) {
      processedData.abilityScores = { ...abilityData.scores };
    }
    
    // Calculate derived stats
    processedData.derivedStats = this.calculateDerivedStats(
      processedData.abilityScores, 
      processedData.basicInfo
    );
    
    // Process feats
    processedData.feats = this.processFeatsData(processedData.basicInfo);
    
    // Process traits
    processedData.traits = this.processTraitsData(traitsData, processedData.basicInfo.race);
    
    // Process languages
    processedData.languages = this.processLanguagesData(detailsData);
    
    return processedData;
  }
};