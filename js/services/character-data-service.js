// Character Data Service - Centralized localStorage management
const CharacterDataService = {
  // Storage keys
  KEYS: {
    ABILITY_SCORES: 'currentAbilityScores',
    BASIC_INFO: 'currentBasicInfo', 
    DETAILS: 'currentDetails',
    TRAITS: 'currentTraits'
  },

  // Get ability scores from localStorage
  getAbilityScores() {
    try {
      const data = localStorage.getItem(this.KEYS.ABILITY_SCORES);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      return {
        method: parsed.method || '',
        totalPoints: parsed.totalPoints || 0,
        scores: parsed.scores || {}
      };
    } catch (error) {
      console.warn('Error loading ability scores:', error);
      return null;
    }
  },

  // Save ability scores to localStorage
  saveAbilityScores(abilityData) {
    try {
      const dataToSave = {
        method: abilityData.method || '',
        totalPoints: abilityData.totalPoints || 0,
        scores: abilityData.scores || {}
      };
      localStorage.setItem(this.KEYS.ABILITY_SCORES, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('Error saving ability scores:', error);
      return false;
    }
  },

  // Get basic character info (race, class, favored classes)
  getBasicInfo() {
    try {
      const data = localStorage.getItem(this.KEYS.BASIC_INFO);
      if (!data) return null;
      
      return JSON.parse(data);
    } catch (error) {
      console.warn('Error loading basic info:', error);
      return null;
    }
  },

  // Save basic character info
  saveBasicInfo(basicInfo) {
    try {
      localStorage.setItem(this.KEYS.BASIC_INFO, JSON.stringify(basicInfo));
      return true;
    } catch (error) {
      console.error('Error saving basic info:', error);
      return false;
    }
  },

  // Get character details (languages, etc.)
  getDetails() {
    try {
      const data = localStorage.getItem(this.KEYS.DETAILS);
      if (!data) return null;
      
      return JSON.parse(data);
    } catch (error) {
      console.warn('Error loading details:', error);
      return null;
    }
  },

  // Save character details
  saveDetails(details) {
    try {
      localStorage.setItem(this.KEYS.DETAILS, JSON.stringify(details));
      return true;
    } catch (error) {
      console.error('Error saving details:', error);
      return false;
    }
  },

  // Get racial traits
  getTraits() {
    try {
      const data = localStorage.getItem(this.KEYS.TRAITS);
      if (!data) return null;
      
      return JSON.parse(data);
    } catch (error) {
      console.warn('Error loading traits:', error);
      return null;
    }
  },

  // Save racial traits
  saveTraits(traits) {
    try {
      localStorage.setItem(this.KEYS.TRAITS, JSON.stringify(traits));
      return true;
    } catch (error) {
      console.error('Error saving traits:', error);
      return false;
    }
  },

  // Get complete character data
  getCompleteCharacter() {
    return {
      abilityScores: this.getAbilityScores(),
      basicInfo: this.getBasicInfo(),
      details: this.getDetails(),
      traits: this.getTraits()
    };
  },

  // Save race data (used by step-race)
  saveRaceData(raceData) {
    try {
      // Save basic info (race and favored classes)
      const basicInfo = {
        race: raceData.selectedRace,
        favoredClasses: raceData.selectedFavoredClasses
      };
      this.saveBasicInfo(basicInfo);

      // Save languages
      const details = {
        languages: raceData.languages
      };
      this.saveDetails(details);

      // Save racial traits - convert string traits to Label/Description format
      const formattedTraits = raceData.traits.map(trait => {
        const colonIndex = trait.indexOf(':');
        if (colonIndex > -1) {
          return {
            Label: trait.substring(0, colonIndex).trim(),
            Description: trait.substring(colonIndex + 1).trim()
          };
        } else {
          return {
            Label: trait.trim(),
            Description: ''
          };
        }
      });
      
      const traits = {
        racialTraits: formattedTraits
      };
      this.saveTraits(traits);

      return true;
    } catch (error) {
      console.error('Error saving race data:', error);
      return false;
    }
  },

  // Update ability scores with racial adjustments
  updateAbilityScoresWithRacialAdjustments(raceData) {
    const abilityScores = this.getAbilityScores();
    if (!abilityScores) {
      console.warn('No ability scores found to update');
      return false;
    }

    try {
      // Apply racial increases
      if (raceData.selectedIncreases) {
        raceData.selectedIncreases.forEach(ability => {
          abilityScores.scores[ability] = (abilityScores.scores[ability] || 10) + 2;
        });
      }

      // Apply racial decreases
      if (raceData.selectedDecreases) {
        raceData.selectedDecreases.forEach(ability => {
          abilityScores.scores[ability] = (abilityScores.scores[ability] || 10) - 2;
        });
      }

      return this.saveAbilityScores(abilityScores);
    } catch (error) {
      console.error('Error updating ability scores with racial adjustments:', error);
      return false;
    }
  },

  // Save class data
  saveClassData(classData) {
    try {
      const basicInfo = this.getBasicInfo() || {};
      basicInfo.class = classData.selectedClass;
      
      // Save Fighter-specific data
      if (classData.bonusFeat) {
        basicInfo.bonusFeat = classData.bonusFeat;
      }
      
      // Save Wizard-specific data
      if (classData.selectedClass === 'Wizard') {
        if (classData.arcaneBond) basicInfo.arcaneBond = classData.arcaneBond;
        if (classData.familiar) basicInfo.familiar = classData.familiar;
        if (classData.bondedObject) basicInfo.bondedObject = classData.bondedObject;
        if (classData.weapon) basicInfo.weapon = classData.weapon;
        if (classData.arcaneSchool) basicInfo.arcaneSchool = classData.arcaneSchool;
        if (classData.oppositionSchools) basicInfo.oppositionSchools = classData.oppositionSchools;
        if (classData.startingSpells) basicInfo.startingSpells = classData.startingSpells;
      }
      
      // Save complete class data for reference
      if (classData.classData) {
        basicInfo.classData = classData.classData;
      }
      
      return this.saveBasicInfo(basicInfo);
    } catch (error) {
      console.error('Error saving class data:', error);
      return false;
    }
  },

  // Clear all character data
  clearAllData() {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing character data:', error);
      return false;
    }
  },

  // Check if character data exists
  hasCharacterData() {
    return Object.values(this.KEYS).some(key => 
      localStorage.getItem(key) !== null
    );
  }
};

// Make service globally available
window.CharacterDataService = CharacterDataService;