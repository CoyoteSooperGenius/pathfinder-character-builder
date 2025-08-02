Vue.component('language-selector', {
  props: {
    selectedRaceData: {
      type: Object,
      required: true
    },
    selectedLanguages: {
      type: Array,
      required: true
    },
    selectedIncreases: {
      type: Array,
      default: () => []
    },
    selectedDecreases: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // Remove showLanguages - now handled by collapsible-card
    };
  },
  computed: {
    raceName() {
      return this.selectedRaceData.name;
    },
    intelligenceModifier() {
      return AbilityCalculator.getIntelligenceModifier(
        this.selectedRaceData, 
        this.selectedIncreases, 
        this.selectedDecreases
      );
    },
    automaticLanguages() {
      return LanguageData.getAutomaticLanguages(this.raceName);
    },
    selectedBonusLanguages() {
      return this.selectedLanguages.filter(lang => !this.automaticLanguages.includes(lang));
    },
    allSelectedLanguages() {
      // Combine automatic and selected bonus languages
      const allLanguages = [...this.automaticLanguages];
      
      // Add selected bonus languages
      this.selectedBonusLanguages.forEach(lang => {
        if (!allLanguages.includes(lang)) {
          allLanguages.push(lang);
        }
      });
      
      return allLanguages;
    },
    isComplete() {
      const validation = LanguageData.validateLanguageSelection(
        this.raceName, 
        this.allSelectedLanguages, 
        this.intelligenceModifier
      );
      return validation.isValid;
    }
  },
  methods: {
    onBonusLanguagesChanged(newBonusLanguages) {
      // Combine automatic languages with the new bonus languages
      const combinedLanguages = [...this.automaticLanguages];
      newBonusLanguages.forEach(lang => {
        if (!combinedLanguages.includes(lang)) {
          combinedLanguages.push(lang);
        }
      });
      
      // Emit the complete language list (automatic + bonus)
      this.$emit('languages-changed', combinedLanguages);
    }
  },
  watch: {
    // Watch for changes that affect automatic languages
    raceName: {
      handler() {
        this.$emit('languages-changed', this.allSelectedLanguages);
      },
      immediate: true
    },
    // Watch for intelligence modifier changes
    intelligenceModifier() {
      // If Intelligence modifier decreases, we might need to remove some bonus languages
      const maxBonus = Math.max(0, this.intelligenceModifier);
      if (this.selectedBonusLanguages.length > maxBonus) {
        // Keep only the first N bonus languages
        const trimmedBonus = this.selectedBonusLanguages.slice(0, maxBonus);
        this.onBonusLanguagesChanged(trimmedBonus);
      } else {
        this.$emit('languages-changed', this.allSelectedLanguages);
      }
    },
    selectedIncreases() {
      this.$emit('languages-changed', this.allSelectedLanguages);
    },
    selectedDecreases() {
      this.$emit('languages-changed', this.allSelectedLanguages);
    },
    isComplete: {
      handler(newValue) {
        this.$emit('completion-changed', newValue);
      },
      immediate: true
    }
  },
  template: `
    <collapsible-card 
      title="Languages" 
      :initially-expanded="true"
      card-classes="mt-3"
    >
      <automatic-languages 
        :race-name="raceName"
      ></automatic-languages>
      
      <bonus-languages
        :race-name="raceName"
        :selected-bonus-languages="selectedBonusLanguages"
        :intelligence-modifier="intelligenceModifier"
        @bonus-languages-changed="onBonusLanguagesChanged"
      ></bonus-languages>
      
      <language-summary
        :race-name="raceName"
        :selected-languages="allSelectedLanguages"
      ></language-summary>
    </collapsible-card>
  `
});