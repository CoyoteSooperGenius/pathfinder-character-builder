Vue.component('background-display-tab', {
  props: {
    basicInfo: {
      type: Object,
      default: () => ({})
    },
    traits: {
      type: Array,
      default: () => []
    },
    languages: {
      type: Array,
      default: () => []
    }
  },
  template: `
    <div class="row g-3">
      <!-- Race & Traits -->
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-users me-2"></i>Race & Traits</h6>
          </div>
          <div class="card-body">
            <div v-if="basicInfo.race" class="mb-3">
              <h6 class="text-primary">{{ basicInfo.race }}</h6>
            </div>
            
            <div v-if="traits.length > 0">
              <h6 class="small fw-bold text-muted mb-2">Racial Traits</h6>
              <div v-for="trait in traits" :key="trait.label" class="trait-item mb-2">
                <div class="fw-semibold">{{ trait.label }}</div>
                <div class="small text-muted">{{ trait.description }}</div>
              </div>
            </div>
            <div v-else class="text-muted">
              No racial traits yet.
            </div>
          </div>
        </div>
      </div>
      
      <!-- Languages -->
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-comment me-2"></i>Languages</h6>
          </div>
          <div class="card-body">
            <tag-list
              :items="languages"
              mode="badges"
              variant="secondary"
              layout="wrap"
              size="normal"
              :show-empty="true"
              empty-message="No languages selected yet."
              gap="1"
            />
          </div>
        </div>
      </div>
    </div>
  `,
  style: `
    <style scoped>
    .trait-item {
      padding: 0.5rem;
      background: var(--bs-light);
      border-radius: 0.375rem;
    }
    </style>
  `
});