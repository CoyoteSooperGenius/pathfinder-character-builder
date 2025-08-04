Vue.component('step-race', {
  data() {
    return {
      selectedRace: 'Human',
      selectedIncreases: [],
      selectedDecreases: [],
      selectedFavoredClasses: [],
      selectedLanguages: [],
      selectedHumanBonusFeat: null,
      abilities: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      races: []
    };
  },
  computed: {
    selectedRaceData() {
      return this.races.find(race => race.name === this.selectedRace);
    },
    intelligenceModifier() {
      return AbilityCalculator.getIntelligenceModifier(
        this.selectedRaceData, 
        this.selectedIncreases, 
        this.selectedDecreases
      );
    },
    currentAbilityScores() {
      // Get ability scores from localStorage for feat prerequisite checking
      const abilityData = CharacterDataService.getAbilityScores();
      if (!abilityData || !abilityData.scores) {
        return { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
      }
      return abilityData.scores;
    },
    isStepComplete() {
      const raceData = this.selectedRaceData;
      if (!raceData) return false;
      
      const increasesComplete = raceData.abilityAdjustments.increases.fixed || 
        this.selectedIncreases.length === raceData.abilityAdjustments.increases.count;
      const decreasesComplete = raceData.abilityAdjustments.decreases.fixed || 
        this.selectedDecreases.length === raceData.abilityAdjustments.decreases.count;
      
      // Check favored class completion
      const expectedFavoredClasses = raceData.name === 'Half-Elf' ? 2 : 1;
      const favoredClassComplete = this.selectedFavoredClasses.length === expectedFavoredClasses;
      
      // Check languages completion using proper validation
      const languagesComplete = LanguageData.validateLanguageSelection(
        raceData.name, 
        this.selectedLanguages, 
        this.intelligenceModifier
      ).isValid;
      
      // Check human bonus feat completion
      const humanBonusFeatComplete = this.selectedRace !== 'Human' || !!this.selectedHumanBonusFeat;
      
      return increasesComplete && decreasesComplete && favoredClassComplete && languagesComplete && humanBonusFeatComplete;
    }
  },
  methods: {
    async loadData() {
      try {
        // Load races data
        const racesResponse = await fetch('data/races.json');
        const racesData = await racesResponse.json();
        this.races = racesData.coreRaces;
        
      } catch (error) {
        console.error('Error loading races data:', error);
        alert('Error loading race data. Please refresh the page.');
      }
    },
    getRaceData() {
      // Return all the race-related data for saving
      return {
        selectedRace: this.selectedRace,
        selectedIncreases: this.selectedIncreases,
        selectedDecreases: this.selectedDecreases,
        selectedFavoredClasses: this.selectedFavoredClasses,
        languages: this.selectedLanguages,
        humanBonusFeat: this.selectedHumanBonusFeat,
        traits: this.selectedRaceData ? this.selectedRaceData.traits : []
      };
    },
    onRaceChange(newRace) {
      this.selectedRace = newRace;
      this.resetAbilitySelections();
      this.resetFavoredClasses();
      this.resetLanguages();
      this.resetHumanBonusFeat();
      this.checkCompletion();
    },
    resetAbilitySelections() {
      const raceData = this.selectedRaceData;
      if (!raceData) return;
      
      // Set fixed ability adjustments
      if (raceData.abilityAdjustments.increases.fixed) {
        this.selectedIncreases = [...raceData.abilityAdjustments.increases.abilities];
      } else {
        this.selectedIncreases = [];
      }
      
      if (raceData.abilityAdjustments.decreases.fixed) {
        this.selectedDecreases = [...raceData.abilityAdjustments.decreases.abilities];
      } else {
        this.selectedDecreases = [];
      }
    },
    resetFavoredClasses() {
      this.selectedFavoredClasses = [];
    },
    resetLanguages() {
      this.selectedLanguages = [];
    },
    resetHumanBonusFeat() {
      this.selectedHumanBonusFeat = null;
    },
    onIncreaseChange(ability) {
      const raceData = this.selectedRaceData;
      if (!raceData || raceData.abilityAdjustments.increases.fixed) return;
      
      const index = this.selectedIncreases.indexOf(ability);
      if (index > -1) {
        this.selectedIncreases.splice(index, 1);
      } else if (this.selectedIncreases.length < raceData.abilityAdjustments.increases.count) {
        this.selectedIncreases.push(ability);
      }
      this.checkCompletion();
    },
    onDecreaseChange(ability) {
      const raceData = this.selectedRaceData;
      if (!raceData || raceData.abilityAdjustments.decreases.fixed) return;
      
      const index = this.selectedDecreases.indexOf(ability);
      if (index > -1) {
        this.selectedDecreases.splice(index, 1);
      } else if (this.selectedDecreases.length < raceData.abilityAdjustments.decreases.count) {
        this.selectedDecreases.push(ability);
      }
      this.checkCompletion();
    },
    onFavoredClassChange(classes) {
      this.selectedFavoredClasses = classes;
      this.checkCompletion();
    },
    onLanguagesChange(languages) {
      this.selectedLanguages = languages;
      this.checkCompletion();
    },
    onLanguagesCompletionChange(isComplete) {
      // Language component handles its own completion logic
      this.checkCompletion();
    },
    onHumanBonusFeatChange(featName) {
      this.selectedHumanBonusFeat = featName;
      this.checkCompletion();
    },
    checkCompletion() {
      this.$emit('step-complete', this.isStepComplete);
    }
  },
  async mounted() {
    // Load external data first
    await this.loadData();
    
    this.resetAbilitySelections();
    this.resetFavoredClasses();
    this.resetLanguages();
    this.resetHumanBonusFeat();
    this.checkCompletion();
  },
  template: `
    <div>
      <div class="row" v-if="races.length > 0">
        <div class="col-12 col-lg-6">
          <available-races-card
            :races="races"
            :selected-race="selectedRace"
            @race-changed="onRaceChange"
          ></available-races-card>
          
          <ability-adjustments-card
            :selected-race-data="selectedRaceData"
            :selected-increases="selectedIncreases"
            :selected-decreases="selectedDecreases"
            :abilities="abilities"
            @increase-changed="onIncreaseChange"
            @decrease-changed="onDecreaseChange"
          ></ability-adjustments-card>
          
          <favored-class-card
            :selected-race-data="selectedRaceData"
            :selected-favored-classes="selectedFavoredClasses"
            @favored-class-changed="onFavoredClassChange"
          ></favored-class-card>
          
          <language-selector
            :selected-race-data="selectedRaceData"
            :selected-languages="selectedLanguages"
            :selected-increases="selectedIncreases"
            :selected-decreases="selectedDecreases"
            @languages-changed="onLanguagesChange"
            @completion-changed="onLanguagesCompletionChange"
          ></language-selector>
        </div>
        
        <div class="col-12 col-lg-6">
          <racial-traits-card
            :selected-race-data="selectedRaceData"
          ></racial-traits-card>
          
          <human-bonus-feat
            v-if="selectedRace === 'Human'"
            :selected-bonus-feat="selectedHumanBonusFeat"
            :ability-scores="currentAbilityScores"
            @feat-selected="onHumanBonusFeatChange"
          ></human-bonus-feat>
        </div>
      </div>
      
      <div v-else class="text-center">
        <i class="fas fa-spinner fa-spin"></i> Loading races...
      </div>
    </div>
  `
});