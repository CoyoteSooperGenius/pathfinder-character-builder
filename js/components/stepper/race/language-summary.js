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
    },
    languageItems() {
      return this.selectedLanguages.map(language => ({
        text: language,
        variant: this.getLanguageCategory(language) === 'automatic' ? 'info' : 'success',
        tooltip: this.getLanguageCategory(language) === 'automatic' ? 'Automatic language' : 'Bonus language'
      }));
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
      <tag-list
        :items="languageItems"
        mode="badges"
        layout="wrap"
        size="normal"
        gap="1"
        class="mt-1"
      />
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