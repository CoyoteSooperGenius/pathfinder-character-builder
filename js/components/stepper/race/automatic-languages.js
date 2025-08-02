Vue.component('automatic-languages', {
  props: {
    raceName: {
      type: String,
      required: true
    }
  },
  computed: {
    automaticLanguages() {
      return LanguageData.getAutomaticLanguages(this.raceName);
    }
  },
  template: `
    <div class="mb-3">
      <h6 class="mb-2">
        <i class="fas fa-star text-warning me-1"></i>
        Automatic Languages
      </h6>
      <div class="d-flex flex-wrap gap-1">
        <span 
          v-for="language in automaticLanguages" 
          :key="'auto-' + language"
          class="badge bg-info"
        >
          {{ language }}
        </span>
      </div>
      <small class="text-muted d-block mt-1">
        All {{ raceName }} characters automatically know these languages.
      </small>
    </div>
  `
});