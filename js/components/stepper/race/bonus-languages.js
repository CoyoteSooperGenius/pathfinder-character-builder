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
    showBonusLanguages() {
      return this.bonusLanguageCount > 0 && this.availableBonusLanguages.length > 0;
    }
  },
  methods: {
    handleLanguageChange(selectedLanguages) {
      this.$emit('bonus-languages-changed', selectedLanguages);
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
      
      <checkbox-group
        :items="availableBonusLanguages"
        :selected-items="selectedBonusLanguages"
        :max-selections="bonusLanguageCount"
        :show-counter="true"
        counter-label="Selected"
        columns="col-6 col-md-4 col-lg-6"
        layout="grid"
        group-name="bonus-languages"
        @selection-changed="handleLanguageChange"
      />
    </div>
    
    <div v-else-if="bonusLanguageCount === 0" class="mb-3">
      <small class="text-muted">
        No bonus languages (Intelligence modifier: {{ intelligenceModifier >= 0 ? '+' : '' }}{{ intelligenceModifier }})
      </small>
    </div>
  `
});