Vue.component('feats-display', {
  props: {
    feats: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    featsBySource() {
      // Group feats by source for better organization
      const grouped = {};
      this.feats.forEach(feat => {
        const source = feat.source || 'Unknown';
        if (!grouped[source]) {
          grouped[source] = [];
        }
        grouped[source].push(feat);
      });
      return grouped;
    },
    
    hasFeats() {
      return this.feats && this.feats.length > 0;
    }
  },
  template: `
    <div class="card h-100">
      <div class="card-header">
        <h6 class="mb-0">
          <i class="fas fa-star me-2"></i>Feats
          <span v-if="hasFeats" class="badge bg-primary ms-2">{{ feats.length }}</span>
        </h6>
      </div>
      <div class="card-body">
        <div v-if="hasFeats">
          <!-- Display feats grouped by source -->
          <div v-for="(sourceFeats, source) in featsBySource" :key="source" class="feat-source-group mb-3">
            <div v-if="Object.keys(featsBySource).length > 1" class="feat-source-header mb-2">
              <small class="text-muted fw-semibold">{{ source }}</small>
            </div>
            
            <div v-for="feat in sourceFeats" :key="feat.label" class="feat-item mb-2">
              <div class="d-flex justify-content-between align-items-start">
                <div class="feat-content flex-grow-1">
                  <div class="fw-semibold">{{ feat.label }}</div>
                  <div class="small text-muted">{{ feat.description }}</div>
                </div>
                <small v-if="Object.keys(featsBySource).length === 1" class="text-muted ms-2 flex-shrink-0">
                  {{ feat.source }}
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-else class="empty-state text-center py-3">
          <i class="fas fa-star text-muted mb-2" style="font-size: 2rem; opacity: 0.3;"></i>
          <div class="text-muted">
            <div class="fw-semibold">No feats selected yet</div>
            <div class="small">Feats will appear here as you progress through character creation</div>
          </div>
        </div>
      </div>
    </div>
  `,
  style: `
    <style scoped>
    .feat-item {
      padding: 0.75rem;
      background: var(--bs-light);
      border-radius: 0.375rem;
      border: 1px solid var(--bs-border-color);
      transition: all 0.2s ease;
    }
    
    .feat-item:hover {
      background: var(--bs-primary-bg-subtle);
      border-color: var(--bs-primary-border-subtle);
      transform: translateY(-1px);
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .feat-source-group:last-child {
      margin-bottom: 0 !important;
    }
    
    .feat-source-header {
      border-bottom: 1px solid var(--bs-border-color);
      padding-bottom: 0.25rem;
    }
    
    .feat-content {
      min-width: 0; /* Prevents flex item from overflowing */
    }
    
    .empty-state {
      padding: 2rem 1rem;
    }
    </style>
  `
});