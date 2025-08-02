Vue.component('character-details', {
  data() {
    return {
      details: {
        background: '',
        languages: '',
        notes: ''
      }
    };
  },
  methods: {
    updateDetails() {
      const data = CharacterDataService.getDetails();
      if (data) {
        this.details.background = data.background || '';
        this.details.notes = data.notes || '';
        
        if (data.languages && Array.isArray(data.languages)) {
          this.details.languages = data.languages.join(', ');
        } else {
          this.details.languages = data.languages || '';
        }
      }
    }
  },
  mounted() {
    this.updateDetails();
  },
  template: `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-scroll me-2"></i>Details
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-2">
            <div class="col-12">
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Background:</span>
                <span>{{ details.background || '—' }}</span>
              </div>
            </div>
            <div class="col-12">
              <div class="mb-2">
                <span class="fw-semibold">Languages:</span>
              </div>
              <div class="small">
                {{ details.languages || '—' }}
              </div>
            </div>
            <div class="col-12" v-if="details.notes">
              <div class="mb-2">
                <span class="fw-semibold">Notes:</span>
              </div>
              <div class="small">
                {{ details.notes }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});