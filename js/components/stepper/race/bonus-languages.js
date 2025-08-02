Vue.component('bonus-languages', {
  props: {
    raceName: {
      type: String,
      required: true
    },
    selectedBonusLanguages: {
      type: Array,
      default: () => []
    },
    intelligenceModifier: {
      type: Number,
      default: 0
    }
  },
  computed: {
    availableBonusLanguages() {
      return LanguageData.getAvailableBonusLanguages(this.raceName);
    },
    bonusLanguageCount() {
      return Math.max(0, this.intelligenceModifier);
    },
    canSelectMore() {
      return this.selectedBonusLanguages.length < this.bonusLanguageCount;
    },
    showBonusLanguages() {
      return this.bonusLanguageCount > 0 && this.availableBonusLanguages.length > 0;
    }
  },
  methods: {
    toggleBonusLanguage(language) {
      const currentSelection = [...this.selectedBonusLanguages];
      const index = currentSelection.indexOf(language);
      
      if (index > -1) {
        // Remove language
        currentSelection.splice(index, 1);
      } else if (this.canSelectMore) {
        // Add language
        currentSelection.push(language);
      }
      
      this.$emit('bonus-languages-changed', currentSelection);
    },
    isLanguageSelected(language) {
      return this.selectedBonusLanguages.includes(language);
    }
  },
  template: `
    <div v-if="showBonusLanguages" class="mb-3">
      <h6 class="mb-2">
        <i class="fas fa-plus-circle text-success me-1"></i>
        Bonus Languages
        <small class="text-muted ms-2">(Choose {{ bonusLanguageCount }})</small>
      </h6>
      <small class="text-muted d-block mb-2">
        +{{ intelligenceModifier }} Intelligence modifier grants {{ bonusLanguageCount }} bonus language{{ bonusLanguageCount !== 1 ? 's' : '' }}
      </small>
      
      <div class="row">
        <div 
          v-for="language in availableBonusLanguages" 
          :key="'bonus-' + language" 
          class="col-6 col-md-4 col-lg-6 mb-2"
        >
          <div class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              :id="'bonus-lang-' + language"
              :value="language"
              :checked="isLanguageSelected(language)"
              :disabled="!isLanguageSelected(language) && !canSelectMore"
              @change="toggleBonusLanguage(language)"
            />
            <label 
              class="form-check-label" 
              :for="'bonus-lang-' + language"
              :class="{ 'text-muted': !isLanguageSelected(language) && !canSelectMore }"
            >
              {{ language }}
            </label>
          </div>
        </div>
      </div>
      
      <div class="mt-2">
        <small class="text-muted">
          Selected: {{ selectedBonusLanguages.length }} / {{ bonusLanguageCount }}
        </small>
      </div>
    </div>
    
    <div v-else-if="bonusLanguageCount === 0" class="mb-3">
      <small class="text-muted">
        No bonus languages (Intelligence modifier: {{ intelligenceModifier >= 0 ? '+' : '' }}{{ intelligenceModifier }})
      </small>
    </div>
  `
});