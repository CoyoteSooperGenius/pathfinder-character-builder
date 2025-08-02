Vue.component('language-summary', {
  props: {
    raceName: {
      type: String,
      required: true
    },
    selectedLanguages: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    automaticLanguages() {
      return LanguageData.getAutomaticLanguages(this.raceName);
    },
    bonusLanguages() {
      return this.selectedLanguages.filter(lang => !this.automaticLanguages.includes(lang));
    },
    hasLanguages() {
      return this.selectedLanguages.length > 0;
    }
  },
  methods: {
    getLanguageCategory(language) {
      return LanguageData.getLanguageCategory(this.raceName, language);
    }
  },
  template: `
    <div v-if="hasLanguages" class="mt-3">
      <strong>All Known Languages:</strong>
      <div class="d-flex flex-wrap gap-1 mt-1">
        <span 
          v-for="language in selectedLanguages" 
          :key="'known-' + language"
          :class="[
            'badge', 
            getLanguageCategory(language) === 'automatic' ? 'bg-info' : 'bg-success'
          ]"
          :title="getLanguageCategory(language) === 'automatic' ? 'Automatic language' : 'Bonus language'"
        >
          {{ language }}
        </span>
      </div>
      <div class="mt-2">
        <small class="text-muted">
          <i class="badge bg-info me-1"></i> Automatic ({{ automaticLanguages.length }})
          <i class="badge bg-success ms-2 me-1"></i> Bonus ({{ bonusLanguages.length }})
          <span class="ms-2">Total: {{ selectedLanguages.length }}</span>
        </small>
      </div>
    </div>
  `
});