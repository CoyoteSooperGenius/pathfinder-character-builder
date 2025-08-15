const DataUtils = {
  async loadGameData(gameData, setError, resetCurrentCharacter) {
    try {
      const schemaResponse = await fetch('data/character-schema.json');
      if (schemaResponse.ok) {
        gameData.characterSchema = await schemaResponse.json();
        if (typeof resetCurrentCharacter === 'function') {
          resetCurrentCharacter();
        }
      }
    } catch (error) {
      console.error('Failed to load character-schema.json:', error);
      if (typeof setError === 'function') setError('Failed to load character schema.');
    }

    const dataFiles = ['races', 'classes', 'feats', 'spells'];
    for (const dataFile of dataFiles) {
      try {
        const response = await fetch(`data/${dataFile}.json`);
        if (response.ok) {
          const data = await response.json();
          gameData[dataFile] = data[Object.keys(data)[0]] || data;
        }
      } catch (error) {
        console.warn(`Failed to load ${dataFile}.json:`, error);
      }
    }
  },

  saveCurrentCharacterToLocalStorage(currentCharacter, setError) {
    try {
      localStorage.setItem('current-character', JSON.stringify(currentCharacter));
    } catch (error) {
      console.error('Failed to save current character to localStorage:', error);
      if (typeof setError === 'function') setError('Failed to save character progress.');
    }
  },

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

  saveCharacter(character, generateCharacterStorageKey, setError, loadSavedCharacters) {
    try {
      const characterName = generateCharacterStorageKey(character.name.first, character.name.last);
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

  loadSavedCharacters(setSavedCharacters, setError) {
    const savedCharacters = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key !== 'current-character' && !key.startsWith('.')) {
          const character = JSON.parse(localStorage.getItem(key));
          savedCharacters.push({
            key: key,
            character: character,
            name: `${character.name.first} ${character.name.last}`.trim(),
            race: character.race ? character.race.name || character.race : 'Unknown',
            characterClass: character.characterClass ? character.characterClass.name || character.characterClass : 'Unknown'
          });
        }
      }
      if (typeof setSavedCharacters === 'function') setSavedCharacters(savedCharacters);
    } catch (error) {
      console.error('Failed to load saved characters:', error);
      if (typeof setError === 'function') setError('Failed to load saved characters.');
    }
  },

  generateCharacterStorageKey(firstName, lastName) {
    let baseName = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
    let counter = 1;
    let finalName = baseName;

    while (localStorage.getItem(finalName)) {
      finalName = `${baseName}-${counter}`;
      counter++;
    }

    return finalName;
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