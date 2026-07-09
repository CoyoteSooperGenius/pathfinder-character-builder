const DataUtils = {
  // Character Data Management
  
  /**
   * Load all game data files including character schema
   * @param {Object} gameData - Game data object to populate
   * @param {Function} setError - Error callback function
   * @param {Function} resetCurrentCharacter - Function to reset current character
   */
  async loadGameData(gameData, setError, resetCurrentCharacter) {
    try {
      // Load character schema first - this is critical for the app
      const schemaResponse = await fetch('data/character-schema.json');
      if (schemaResponse.ok) {
        gameData.characterSchema = await schemaResponse.json();
        if (typeof resetCurrentCharacter === 'function') {
          resetCurrentCharacter();
        }
      } else {
        throw new Error(`Failed to load character schema: ${schemaResponse.status}`);
      }
    } catch (error) {
      console.error('Failed to load character-schema.json:', error);
      if (typeof setError === 'function') setError('Failed to load character schema.');
      return false;
    }

    // Load other game data files
    const dataFiles = ['races', 'classes', 'feats', 'spells'];
    let successCount = 0;
    
    for (const dataFile of dataFiles) {
      try {
        const response = await fetch(`data/${dataFile}.json`);
        if (response.ok) {
          const data = await response.json();
          gameData[dataFile] = data[Object.keys(data)[0]] || data;
          successCount++;
        } else {
          console.warn(`Failed to load ${dataFile}.json: ${response.status}`);
        }
      } catch (error) {
        console.warn(`Failed to load ${dataFile}.json:`, error);
      }
    }

    console.log(`Game data loaded: ${successCount}/${dataFiles.length} files successful`);
    return successCount > 0; // Return success if at least some data loaded
  },

  /**
   * Save current work-in-progress character to localStorage
   * @param {Object} currentCharacter - Character object to save
   * @param {Function} setError - Error callback function
   */
  saveCurrentCharacterToLocalStorage(currentCharacter, setError) {
    try {
      localStorage.setItem('current-character', JSON.stringify(currentCharacter));
    } catch (error) {
      console.error('Failed to save current character to localStorage:', error);
      if (typeof setError === 'function') setError('Failed to save character progress.');
    }
  },

  /**
   * Load current work-in-progress character from localStorage
   * @param {Function} createDefaultCharacter - Function to create default character
   * @param {Function} setError - Error callback function
   * @returns {Object} Character object or default character
   */
  loadCurrentCharacterFromLocalStorage(createDefaultCharacter, setError) {
    try {
      const saved = localStorage.getItem('current-character');
      if (saved) {
        return JSON.parse(saved);
      } else {
        // Initialize with default character if no saved character exists
        return typeof createDefaultCharacter === 'function' ? createDefaultCharacter() : {};
      }
    } catch (error) {
      console.error('Failed to load current character from localStorage:', error);
      if (typeof setError === 'function') setError('Failed to load character progress.');
      // Fallback to default character
      return typeof createDefaultCharacter === 'function' ? createDefaultCharacter() : {};
    }
  },

  /**
   * Save completed character to localStorage with unique name
   * @param {Object} character - Character object to save
   * @param {Function} generateCharacterStorageKey - Function to generate storage key
   * @param {Function} setError - Error callback function
   * @param {Function} loadSavedCharacters - Callback to refresh character list
   * @returns {boolean} Success status
   */
  saveCharacter(character, generateCharacterStorageKey, setError, loadSavedCharacters) {
    try {
      const characterName = generateCharacterStorageKey(character.name.first, character.name.last);
      character.lastModified = new Date().toISOString();
      localStorage.setItem(characterName, JSON.stringify(character));
      // Remove current-character since it's now saved permanently
      localStorage.removeItem('current-character');
      if (typeof loadSavedCharacters === 'function') loadSavedCharacters();
      return true;
    } catch (error) {
      console.error('Failed to save character:', error);
      if (typeof setError === 'function') setError('Failed to save character.');
      return false;
    }
  },

  /**
   * Load specific character by storage key
   * @param {string} characterKey - Storage key for the character
   * @param {Function} setError - Error callback function
   * @returns {Object|null} Character object or null if not found
   */
  loadCharacter(characterKey, setError) {
    try {
      const saved = localStorage.getItem(characterKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load character:', error);
      if (typeof setError === 'function') setError('Failed to load character.');
    }
    return null;
  },

  /**
   * Delete character from localStorage
   * @param {string} characterKey - Storage key for the character
   * @param {Function} loadSavedCharacters - Callback to refresh character list
   * @param {Function} setError - Error callback function
   * @returns {boolean} Success status
   */
  deleteCharacter(characterKey, loadSavedCharacters, setError) {
    try {
      localStorage.removeItem(characterKey);
      if (typeof loadSavedCharacters === 'function') loadSavedCharacters();
      return true;
    } catch (error) {
      console.error('Failed to delete character:', error);
      if (typeof setError === 'function') setError('Failed to delete character.');
      return false;
    }
  },

  /**
   * Load all saved characters from localStorage
   * Each entry is a display-ready wrapper: { storageKey, name, race,
   * characterClass, level, hitPoints, armorClass, concept, lastModified }
   * with race/characterClass flattened to strings and hitPoints/armorClass
   * null when absent (0 is a legitimate value). Load the full character on
   * demand via loadCharacter(storageKey).
   * @param {Function} setSavedCharacters - Callback to set saved characters array
   * @param {Function} setError - Error callback function
   */
  loadSavedCharacters(setSavedCharacters, setError) {
    const savedCharacters = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key !== 'current-character' && !key.startsWith('.')) {
          // localStorage may hold non-character entries (e.g. app settings
          // like pf-theme) — skip anything that isn't a character object
          let character;
          try {
            character = JSON.parse(localStorage.getItem(key));
          } catch (parseError) {
            continue;
          }
          if (!character || typeof character !== 'object' || !character.name) {
            continue;
          }
          savedCharacters.push({
            storageKey: key,
            name: GameUtils.getCharacterFullName(character.name),
            race: GameUtils.flattenEntityName(character.race),
            characterClass: GameUtils.flattenEntityName(character.characterClass),
            level: character.level || 1,
            hitPoints: character.hitPoints ?? null,
            armorClass: character.armorClass ?? null,
            concept: character.concept || '',
            lastModified: character.lastModified || null
          });
        }
      }
      if (typeof setSavedCharacters === 'function') setSavedCharacters(savedCharacters);
    } catch (error) {
      console.error('Failed to load saved characters:', error);
      if (typeof setError === 'function') setError('Failed to load saved characters.');
    }
  },

  /**
   * Generate unique storage key for character with collision handling
   * @param {string} firstName - Character's first name
   * @param {string} lastName - Character's last name
   * @returns {string} Unique storage key
   */
  generateCharacterStorageKey(firstName, lastName) {
    let baseName = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
    let counter = 1;
    let finalName = baseName;

    while (localStorage.getItem(finalName)) {
      finalName = `${baseName}-${counter}`;
      counter++;
    }

    return finalName;
  },

  // Additional utility functions

  /**
   * Export character data as JSON for backup/sharing
   * @param {string} characterKey - Storage key for the character
   * @returns {string|null} JSON string of character data
   */
  exportCharacter(characterKey) {
    try {
      const character = this.loadCharacter(characterKey);
      if (character) {
        return JSON.stringify(character, null, 2);
      }
    } catch (error) {
      console.error('Failed to export character:', error);
    }
    return null;
  },

  /**
   * Import character data from JSON
   * @param {string} jsonData - JSON string of character data
   * @param {Function} setError - Error callback function
   * @returns {Object|null} Parsed character object
   */
  importCharacter(jsonData, setError) {
    try {
      const character = JSON.parse(jsonData);
      
      // Basic validation
      if (!character.name || !character.name.first || !character.name.last) {
        throw new Error('Invalid character data: missing name');
      }

      // Validate ability scores if present
      if (character.abilityScores) {
        for (const [ability, score] of Object.entries(character.abilityScores)) {
          if (!GameUtils.isValidAbilityScore(score)) {
            throw new Error(`Invalid ${ability} score: ${score}`);
          }
        }
      }

      return character;
    } catch (error) {
      console.error('Failed to import character:', error);
      if (typeof setError === 'function') {
        setError(`Failed to import character: ${error.message}`);
      }
      return null;
    }
  },

  /**
   * Duplicate an existing character with a new name
   * @param {string} sourceKey - Storage key of character to duplicate
   * @param {string} newFirstName - New first name for duplicate
   * @param {string} newLastName - New last name for duplicate
   * @param {Function} setError - Error callback function
   * @param {Function} loadSavedCharacters - Callback to refresh character list
   * @returns {boolean} Success status
   */
  duplicateCharacter(sourceKey, newFirstName, newLastName, setError, loadSavedCharacters) {
    try {
      const sourceCharacter = this.loadCharacter(sourceKey, setError);
      if (!sourceCharacter) {
        throw new Error('Source character not found');
      }

      // Create duplicate with new name
      const duplicate = JSON.parse(JSON.stringify(sourceCharacter));
      duplicate.name.first = newFirstName;
      duplicate.name.last = newLastName;

      // Save the duplicate
      return this.saveCharacter(duplicate, this.generateCharacterStorageKey, setError, loadSavedCharacters);
    } catch (error) {
      console.error('Failed to duplicate character:', error);
      if (typeof setError === 'function') {
        setError(`Failed to duplicate character: ${error.message}`);
      }
      return false;
    }
  },

  /**
   * Get character storage statistics
   * @returns {Object} Storage statistics
   */
  getStorageStats() {
    try {
      const stats = {
        totalCharacters: 0,
        hasCurrentCharacter: false,
        storageUsed: 0,
        characters: []
      };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const item = localStorage.getItem(key);
        
        if (key === 'current-character') {
          stats.hasCurrentCharacter = true;
          stats.storageUsed += item.length;
        } else if (key && !key.startsWith('.')) {
          try {
            const character = JSON.parse(item);
            if (character.name) {
              stats.totalCharacters++;
              stats.storageUsed += item.length;
              stats.characters.push({
                key: key,
                name: GameUtils.getCharacterFullName(character.name),
                size: item.length
              });
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }

      return stats;
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { totalCharacters: 0, hasCurrentCharacter: false, storageUsed: 0, characters: [] };
    }
  },

  /**
   * Clear all character data from localStorage
   * @param {boolean} includeCurrentCharacter - Whether to clear current character too
   * @param {Function} setError - Error callback function
   * @returns {boolean} Success status
   */
  clearAllCharacters(includeCurrentCharacter = false, setError) {
    try {
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('.')) {
          if (key === 'current-character' && !includeCurrentCharacter) {
            continue; // Skip current character if not requested
          }
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`Cleared ${keysToRemove.length} character(s) from storage`);
      return true;
    } catch (error) {
      console.error('Failed to clear characters:', error);
      if (typeof setError === 'function') {
        setError('Failed to clear character data');
      }
      return false;
    }
  },

  /**
   * Validate character data completeness
   * @param {Object} character - Character object to validate
   * @returns {Object} Validation result with errors and completion status
   */
  validateCharacterData(character) {
    if (!character) {
      return { isValid: false, errors: ['Character data is required'], completionSteps: {} };
    }

    const errors = [];
    const completionSteps = {};

    // Step 1: Ability Scores
    const abilityScoresValid = character.abilityScores && 
      Object.values(character.abilityScores).every(score => GameUtils.isValidAbilityScore(score));
    completionSteps.abilityScores = abilityScoresValid;
    if (!abilityScoresValid) {
      errors.push('Invalid or missing ability scores');
    }

    // Step 2: Concept
    const conceptValid = character.concept && character.concept.trim().length > 0;
    completionSteps.concept = conceptValid;

    // Step 3: Race
    const raceValid = character.race !== null && character.race !== undefined;
    completionSteps.race = raceValid;

    // Step 4: Class
    const classValid = character.characterClass !== null && character.characterClass !== undefined;
    completionSteps.characterClass = classValid;

    // Step 5-8: Skills, Feats, Equipment, Spells (optional)
    completionSteps.skills = true;
    completionSteps.feats = true;
    completionSteps.equipment = true;
    completionSteps.spells = true;

    // Step 9: Details
    const detailsValid = character.name && 
      character.name.first && character.name.first.trim().length > 0 &&
      character.name.last && character.name.last.trim().length > 0;
    completionSteps.details = detailsValid;
    if (!detailsValid) {
      errors.push('Character name is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      completionSteps: completionSteps,
      isComplete: Object.values(completionSteps).every(step => step === true)
    };
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.DataUtils = DataUtils;
}

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataUtils;
}