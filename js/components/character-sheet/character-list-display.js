Vue.component('character-list-display', {
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'fas fa-list'
    },
    items: {
      type: Array,
      default: () => []
    },
    emptyMessage: {
      type: String,
      default: 'None selected yet.'
    }
  },
  computed: {
    hasItems() {
      return this.items && this.items.length > 0;
    }
  },
  template: `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i :class="icon + ' me-2'"></i>{{ title }}
          </h5>
        </div>
        <div class="card-body">
          <div v-if="hasItems">
            <div 
              v-for="(item, index) in items" 
              :key="index" 
              class="mb-3 p-2 border rounded"
            >
              <div class="fw-semibold text-primary">{{ item.label || item.name }}</div>
              <div v-if="item.description" class="small text-muted mt-1">
                {{ item.description }}
              </div>
              <div v-if="item.value !== undefined" class="small">
                {{ item.value }}
              </div>
              <div v-if="item.cost || item.weight" class="small text-muted">
                <span v-if="item.cost">Cost: {{ item.cost }}</span>
                <span v-if="item.cost && item.weight"> | </span>
                <span v-if="item.weight">Weight: {{ item.weight }}</span>
              </div>
              <div v-if="item.ranks !== undefined" class="small">
                Ranks: {{ item.ranks }}
              </div>
            </div>
          </div>
          <div v-else class="text-muted text-center">
            {{ emptyMessage }}
          </div>
        </div>
      </div>
    </div>
  `
});