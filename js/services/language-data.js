// Language Data Service - Centralized language data for Pathfinder
const LanguageData = {
  // All available languages in Pathfinder Core Rulebook
  ALL_LANGUAGES: [
    'Abyssal',
    'Aklo', 
    'Aquan',
    'Auran',
    'Celestial',
    'Common',
    'Draconic',
    'Druidic',
    'Dwarven',
    'Elven',
    'Giant',
    'Gnoll',
    'Gnome',
    'Goblin',
    'Halfling',
    'Ignan',
    'Infernal',
    'Orc',
    'Sylvan',
    'Terran',
    'Undercommon'
  ],

  // Racial language data
  RACE_LANGUAGES: {
    'Human': {
      automatic: [],
      available: 'any'
    },
    'Dwarf': {
      automatic: ['Dwarven'],
      available: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon']
    },
    'Elf': {
      automatic: ['Elven'],
      available: ['Celestial', 'Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan']
    },
    'Gnome': {
      automatic: ['Gnome'],
      available: ['Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc']
    },
    'Half-Elf': {
      automatic: ['Elven'],
      available: 'any'
    },
    'Half-Orc': {
      automatic: ['Orc'],
      available: ['Abyssal', 'Draconic', 'Giant', 'Gnoll', 'Goblin']
    },
    'Halfling': {
      automatic: ['Halfling'],
      available: ['Dwarven', 'Elven', 'Gnome', 'Goblin']
    }
  },

  // Get racial language data for a specific race
  getRaceLanguageData(raceName) {
    return this.RACE_LANGUAGES[raceName] || { automatic: [], available: [] };
  },

  // Get automatic languages for a race
  getAutomaticLanguages(raceName) {
    const raceData = this.getRaceLanguageData(raceName);
    return ['Common', ...raceData.automatic];
  },

  // Get available bonus languages for a race
  getAvailableBonusLanguages(raceName) {
    const raceData = this.getRaceLanguageData(raceName);
    
    if (raceData.available === 'any') {
      // Filter out Common and automatic languages
      const automaticLanguages = this.getAutomaticLanguages(raceName);
      return this.ALL_LANGUAGES.filter(lang => !automaticLanguages.includes(lang));
    }
    
    return raceData.available || [];
  },

  // Calculate total languages a character should know
  calculateTotalLanguages(raceName, intelligenceModifier) {
    const automaticCount = this.getAutomaticLanguages(raceName).length;
    const bonusCount = Math.max(0, intelligenceModifier);
    return automaticCount + bonusCount;
  },

  // Validate language selection
  validateLanguageSelection(raceName, selectedLanguages, intelligenceModifier) {
    const automaticLanguages = this.getAutomaticLanguages(raceName);
    const availableBonusLanguages = this.getAvailableBonusLanguages(raceName);
    const maxTotal = this.calculateTotalLanguages(raceName, intelligenceModifier);

    // Check that all automatic languages are included
    const hasAllAutomatic = automaticLanguages.every(lang => selectedLanguages.includes(lang));
    
    // Check that no invalid bonus languages are selected
    const bonusLanguages = selectedLanguages.filter(lang => !automaticLanguages.includes(lang));
    const hasValidBonus = bonusLanguages.every(lang => availableBonusLanguages.includes(lang));
    
    // Check total count - for character creation, must use all available language slots
    const isValidCount = selectedLanguages.length === maxTotal;

    return {
      isValid: hasAllAutomatic && hasValidBonus && isValidCount,
      hasAllAutomatic,
      hasValidBonus,
      isValidCount,
      maxTotal,
      currentTotal: selectedLanguages.length
    };
  },

  // Get language category (automatic vs bonus)
  getLanguageCategory(raceName, language) {
    const automaticLanguages = this.getAutomaticLanguages(raceName);
    return automaticLanguages.includes(language) ? 'automatic' : 'bonus';
  }
};

// Make service globally available
window.LanguageData = LanguageData;