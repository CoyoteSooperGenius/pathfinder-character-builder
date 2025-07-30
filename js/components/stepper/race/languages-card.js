Vue.component('languages-card', {
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
      showLanguages: true,
      allLanguages: [
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
      raceLanguageData: {
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
      }
    };
  },
  computed: {
    intelligenceModifier() {
      // Get base Intelligence from localStorage
      const savedScores = localStorage.getItem('currentAbilityScores');
      let baseIntelligence = 10; // Default if no saved scores
      
      if (savedScores) {
        try {
          const abilityData = JSON.parse(savedScores);
          // Access the nested scores object
          baseIntelligence = abilityData.scores?.INT || 10;
        } catch (e) {
          console.warn('Error parsing ability scores from localStorage:', e);
        }
      }
      
      // Apply racial adjustments
      const raceData = this.selectedRaceData;
      
      // Check for fixed increases
      if (raceData.abilityAdjustments.increases.fixed) {
        if (raceData.abilityAdjustments.increases.abilities && 
            raceData.abilityAdjustments.increases.abilities.includes('INT')) {
          baseIntelligence += 2;
        }
      } else {
        // Check player-selected increases
        if (this.selectedIncreases.includes('INT')) {
          baseIntelligence += 2;
        }
      }
      
      // Check for fixed decreases
      if (raceData.abilityAdjustments.decreases.fixed) {
        if (raceData.abilityAdjustments.decreases.abilities && 
            raceData.abilityAdjustments.decreases.abilities.includes('INT')) {
          baseIntelligence -= 2;
        }
      } else {
        // Check player-selected decreases
        if (this.selectedDecreases.includes('INT')) {
          baseIntelligence -= 2;
        }
      }
      
      // Calculate modifier
      return Math.floor((baseIntelligence - 10) / 2);
    },
    racialLanguages() {
      const raceName = this.selectedRaceData.name;
      const raceLanguages = this.raceLanguageData[raceName];
      
      if (!raceLanguages) return ['Common'];
      
      // Everyone gets Common + their racial automatic languages
      return ['Common', ...raceLanguages.automatic];
    },
    availableBonusLanguages() {
      const raceName = this.selectedRaceData.name;
      const raceLanguages = this.raceLanguageData[raceName];
      
      if (!raceLanguages) return [];
      
      // If race has "any" available languages
      if (raceLanguages.available === 'any') {
        return this.allLanguages.filter(lang => !this.racialLanguages.includes(lang));
      }
      
      // Otherwise use the specific available languages for this race
      return raceLanguages.available.filter(lang => !this.racialLanguages.includes(lang));
    },
    bonusLanguageCount() {
      return Math.max(0, this.intelligenceModifier);
    },
    totalLanguagesAllowed() {
      return this.racialLanguages.length + this.bonusLanguageCount;
    },
    selectedBonusLanguages() {
      return this.selectedLanguages.filter(lang => 
        !this.racialLanguages.includes(lang)
      );
    }
  },
  methods: {
    onLanguageChange(language) {
      // Can't change racial languages
      if (this.racialLanguages.includes(language)) return;
      
      const currentBonus = this.selectedBonusLanguages;
      const index = currentBonus.indexOf(language);
      
      let newBonusLanguages;
      if (index > -1) {
        // Remove language
        newBonusLanguages = currentBonus.filter(lang => lang !== language);
      } else if (currentBonus.length < this.bonusLanguageCount) {
        // Add language if under limit
        newBonusLanguages = [...currentBonus, language];
      } else {
        return; // Can't add more
      }
      
      // Combine racial and bonus languages
      const allLanguages = [...this.racialLanguages, ...newBonusLanguages];
      this.$emit('languages-changed', allLanguages);
    },
    isLanguageDisabled(language) {
      // Racial languages are always selected and disabled
      if (this.racialLanguages.includes(language)) return true;
      
      // Bonus languages are disabled if at limit and not selected
      return !this.selectedBonusLanguages.includes(language) && 
             this.selectedBonusLanguages.length >= this.bonusLanguageCount;
    },
    toggleLanguages() {
      this.showLanguages = !this.showLanguages;
    }
  },
  mounted() {
    // Initialize with racial languages
    this.$emit('languages-changed', this.racialLanguages);
  },
  watch: {
    racialLanguages: {
      handler(newRacialLanguages) {
        // Reset to just racial languages when race changes
        this.$emit('languages-changed', newRacialLanguages);
      },
      immediate: true
    },
    intelligenceModifier() {
      // Recalculate languages when Intelligence modifier changes
      // Reset to racial languages and let user reselect bonus languages
      this.$emit('languages-changed', this.racialLanguages);
    },
    selectedIncreases() {
      // Watch for changes in ability increases
      this.$emit('languages-changed', this.racialLanguages);
    },
    selectedDecreases() {
      // Watch for changes in ability decreases
      this.$emit('languages-changed', this.racialLanguages);
    }
  },
  template: `
    <div class="card mt-3">
      <div class="card-header" style="cursor: pointer;" @click="toggleLanguages">
        <h5 class="mb-0 d-flex justify-content-between align-items-center">
          Languages
          <i :class="showLanguages ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </h5>
      </div>
      <div v-show="showLanguages" class="card-body">
        <div class="mb-3">
          <h6 class="text-info">Racial Languages (Automatic)</h6>
          <div class="d-flex flex-wrap gap-2">
            <span 
              v-for="language in racialLanguages" 
              :key="'racial-' + language"
              class="badge bg-info"
            >
              {{ language }}
            </span>
          </div>
        </div>
        
        <div v-if="bonusLanguageCount > 0" class="mb-3">
          <h6 class="text-success">
            Bonus Languages 
            <small class="text-muted">({{ selectedBonusLanguages.length }}/{{ bonusLanguageCount }} selected)</small>
          </h6>
          <small class="text-muted d-block mb-2">
            +{{ intelligenceModifier }} Intelligence modifier grants {{ bonusLanguageCount }} bonus language{{ bonusLanguageCount !== 1 ? 's' : '' }}
          </small>
          
          <div class="row">
            <div v-for="language in availableBonusLanguages" :key="'bonus-' + language" class="col-6 col-md-4 col-lg-6 mb-2">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :value="language"
                  :checked="selectedBonusLanguages.includes(language)"
                  @change="onLanguageChange(language)"
                  :disabled="isLanguageDisabled(language)"
                  :id="'bonus-language-' + language.toLowerCase()"
                >
                <label class="form-check-label" :for="'bonus-language-' + language.toLowerCase()">
                  {{ language }}
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="mb-3">
          <small class="text-muted">
            No bonus languages (Intelligence modifier: {{ intelligenceModifier >= 0 ? '+' : '' }}{{ intelligenceModifier }})
          </small>
        </div>
        
        <div v-if="selectedLanguages.length > 0" class="mt-3">
          <strong>All Known Languages:</strong>
          <div class="d-flex flex-wrap gap-1 mt-1">
            <span 
              v-for="language in selectedLanguages" 
              :key="'known-' + language"
              :class="['badge', racialLanguages.includes(language) ? 'bg-info' : 'bg-success']"
            >
              {{ language }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `
});