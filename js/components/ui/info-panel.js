Vue.component('info-panel', {
  props: {
    // Panel title
    title: {
      type: String,
      default: ''
    },
    // Icon for the title
    icon: {
      type: String,
      default: ''
    },
    // Panel display mode: 'card', 'section', 'compact'
    mode: {
      type: String,
      default: 'card',
      validator: value => ['card', 'section', 'compact'].includes(value)
    },
    // Panel variant: 'default', 'primary', 'secondary', 'success', 'info', 'warning', 'danger'
    variant: {
      type: String,
      default: 'default',
      validator: value => ['default', 'primary', 'secondary', 'success', 'info', 'warning', 'danger'].includes(value)
    },
    // Size variant: 'small', 'normal', 'large'
    size: {
      type: String,
      default: 'normal',
      validator: value => ['small', 'normal', 'large'].includes(value)
    },
    // Whether the panel is collapsible
    collapsible: {
      type: Boolean,
      default: false
    },
    // Initial collapsed state (only if collapsible)
    initiallyCollapsed: {
      type: Boolean,
      default: false
    },
    // Whether to show a divider under the title
    showDivider: {
      type: Boolean,
      default: true
    },
    // Custom CSS classes
    customClasses: {
      type: String,
      default: ''
    },
    // Data to display (for structured content)
    data: {
      type: [Object, Array],
      default: null
    },
    // Data display type: 'table', 'list', 'grid', 'custom'
    dataType: {
      type: String,
      default: 'custom',
      validator: value => ['table', 'list', 'grid', 'custom'].includes(value)
    },
    // For table mode: field configurations
    fields: {
      type: Array,
      default: () => []
    },
    // For list mode: item configurations
    listConfig: {
      type: Object,
      default: () => ({
        keyProperty: 'key',
        valueProperty: 'value',
        iconProperty: 'icon',
        descriptionProperty: 'description'
      })
    },
    // Whether to show empty state
    showEmpty: {
      type: Boolean,
      default: true
    },
    // Empty state message
    emptyMessage: {
      type: String,
      default: 'No data available'
    },
    // Loading state
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapsed: this.initiallyCollapsed
    };
  },
  computed: {
    // Panel wrapper classes
    panelClasses() {
      const classes = ['info-panel'];
      
      if (this.mode !== 'card') {
        classes.push(`info-panel-${this.mode}`);
      }
      
      if (this.size !== 'normal') {
        classes.push(`info-panel-${this.size}`);
      }
      
      if (this.variant !== 'default') {
        classes.push(`info-panel-${this.variant}`);
      }
      
      if (this.customClasses) {
        classes.push(this.customClasses);
      }
      
      return classes.join(' ');
    },
    
    // Header classes
    headerClasses() {
      const classes = [];
      
      if (this.mode === 'card') {
        classes.push('card-header');
        if (this.variant !== 'default') {
          classes.push(`bg-${this.variant}`, 'text-white');
        }
      } else {
        classes.push('info-panel-header');
      }
      
      if (this.collapsible) {
        classes.push('cursor-pointer');
      }
      
      return classes.join(' ');
    },
    
    // Body classes
    bodyClasses() {
      const classes = [];
      
      if (this.mode === 'card') {
        classes.push('card-body');
      } else {
        classes.push('info-panel-body');
      }
      
      if (this.size === 'small') {
        classes.push('p-2');
      } else if (this.size === 'large') {
        classes.push('p-4');
      }
      
      return classes.join(' ');
    },
    
    // Title element classes
    titleClasses() {
      const classes = ['mb-0'];
      
      if (this.size === 'small') {
        classes.push('h6');
      } else if (this.size === 'large') {
        classes.push('h4');
      } else {
        classes.push('h6');
      }
      
      return classes.join(' ');
    },
    
    // Processed data for display
    processedData() {
      if (!this.data) return null;
      
      if (this.dataType === 'table' && Array.isArray(this.data)) {
        return this.data;
      } else if (this.dataType === 'list' && Array.isArray(this.data)) {
        return this.data;
      } else if (this.dataType === 'table' && typeof this.data === 'object') {
        // Convert object to table format
        return Object.entries(this.data).map(([key, value]) => ({
          key,
          value,
          label: this.fields.find(f => f.key === key)?.label || key
        }));
      }
      
      return this.data;
    },
    
    // Check if panel has content
    hasContent() {
      return this.$slots.default || this.processedData || this.data;
    },
    
    // Toggle icon for collapsible panels
    toggleIcon() {
      return this.isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-down';
    }
  },
  methods: {
    // Toggle collapsed state
    toggleCollapsed() {
      if (this.collapsible) {
        this.isCollapsed = !this.isCollapsed;
        this.$emit('toggle', this.isCollapsed);
      }
    },
    
    // Get field value with formatting
    getFieldValue(item, field) {
      let value = item[field.key || field.property];
      
      if (field.formatter && typeof field.formatter === 'function') {
        value = field.formatter(value);
      } else if (field.type === 'boolean') {
        value = value ? 'Yes' : 'No';
      } else if (field.type === 'array' && Array.isArray(value)) {
        value = value.join(', ');
      }
      
      return value !== undefined && value !== null ? value : '—';
    },
    
    // Get item property for list display
    getItemProperty(item, property) {
      if (typeof property === 'string') {
        return item[property];
      } else if (typeof property === 'function') {
        return property(item);
      }
      return property;
    }
  },
  template: `
    <div :class="panelClasses">
      <!-- Card Mode -->
      <div v-if="mode === 'card'" class="card h-100">
        <!-- Card Header -->
        <div v-if="title" :class="headerClasses" @click="toggleCollapsed">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <i v-if="icon" :class="icon + ' me-2'"></i>
              <span :class="titleClasses">{{ title }}</span>
            </div>
            <i v-if="collapsible" :class="toggleIcon + ' ms-2'"></i>
          </div>
        </div>
        
        <!-- Card Body -->
        <div v-if="!isCollapsed" :class="bodyClasses">
          <!-- Loading State -->
          <div v-if="loading" class="d-flex justify-content-center py-3">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <!-- Content -->
          <div v-else>
            <!-- Table Data Display -->
            <div v-if="dataType === 'table' && processedData">
              <table class="table table-sm mb-0">
                <tbody>
                  <tr v-for="item in processedData" :key="item.key || item.label">
                    <td class="fw-semibold">{{ item.label || item.key }}:</td>
                    <td :id="item.id">{{ getFieldValue(item, { key: 'value' }) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- List Data Display -->
            <div v-else-if="dataType === 'list' && processedData">
              <ul class="list-unstyled mb-0">
                <li v-for="(item, index) in processedData" :key="index" class="mb-2">
                  <div class="d-flex align-items-start">
                    <i v-if="getItemProperty(item, listConfig.iconProperty)" 
                       :class="getItemProperty(item, listConfig.iconProperty) + ' me-2 mt-1'"></i>
                    <div class="flex-grow-1">
                      <div class="fw-semibold">
                        {{ getItemProperty(item, listConfig.keyProperty) || getItemProperty(item, listConfig.valueProperty) }}
                      </div>
                      <div v-if="getItemProperty(item, listConfig.descriptionProperty)" class="small text-muted">
                        {{ getItemProperty(item, listConfig.descriptionProperty) }}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <!-- Grid Data Display -->
            <div v-else-if="dataType === 'grid' && processedData">
              <div class="row g-2">
                <div v-for="(item, index) in processedData" :key="index" class="col-6 col-md-4">
                  <div class="text-center p-2 border rounded">
                    <div class="fw-bold">{{ getItemProperty(item, listConfig.keyProperty) }}</div>
                    <div class="small text-muted">{{ getItemProperty(item, listConfig.valueProperty) }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Custom Content Slot -->
            <div v-else-if="hasContent">
              <slot></slot>
            </div>
            
            <!-- Empty State -->
            <div v-else-if="showEmpty" class="text-muted text-center py-2">
              <i class="fas fa-info-circle me-1"></i>{{ emptyMessage }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Section Mode -->
      <div v-else-if="mode === 'section'">
        <!-- Section Header -->
        <div v-if="title" :class="headerClasses" @click="toggleCollapsed">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <i v-if="icon" :class="icon + ' me-2'"></i>
              <span :class="titleClasses + ' text-primary'">{{ title }}</span>
            </div>
            <i v-if="collapsible" :class="toggleIcon + ' ms-2'"></i>
          </div>
          <hr v-if="showDivider" class="mt-2 mb-3">
        </div>
        
        <!-- Section Content -->
        <div v-if="!isCollapsed" :class="bodyClasses">
          <!-- Same content structure as card mode -->
          <div v-if="loading" class="d-flex justify-content-center py-3">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else>
            <div v-if="dataType === 'table' && processedData">
              <table class="table table-sm mb-0">
                <tbody>
                  <tr v-for="item in processedData" :key="item.key || item.label">
                    <td class="fw-semibold">{{ item.label || item.key }}:</td>
                    <td :id="item.id">{{ getFieldValue(item, { key: 'value' }) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else-if="dataType === 'list' && processedData">
              <ul class="list-unstyled mb-0">
                <li v-for="(item, index) in processedData" :key="index" class="mb-2">
                  <div class="d-flex align-items-start">
                    <i v-if="getItemProperty(item, listConfig.iconProperty)" 
                       :class="getItemProperty(item, listConfig.iconProperty) + ' me-2 mt-1'"></i>
                    <div class="flex-grow-1">
                      <div class="fw-semibold">
                        {{ getItemProperty(item, listConfig.keyProperty) || getItemProperty(item, listConfig.valueProperty) }}
                      </div>
                      <div v-if="getItemProperty(item, listConfig.descriptionProperty)" class="small text-muted">
                        {{ getItemProperty(item, listConfig.descriptionProperty) }}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else-if="hasContent">
              <slot></slot>
            </div>
            <div v-else-if="showEmpty" class="text-muted text-center py-2">
              <i class="fas fa-info-circle me-1"></i>{{ emptyMessage }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Compact Mode -->
      <div v-else-if="mode === 'compact'" class="compact-panel">
        <div v-if="title" class="compact-header mb-2">
          <i v-if="icon" :class="icon + ' me-1'"></i>
          <span class="fw-bold">{{ title }}:</span>
        </div>
        <div class="compact-content">
          <slot></slot>
        </div>
      </div>
    </div>
  `,
  style: `
    <style scoped>
    .info-panel {
      /* Base styling */
    }
    
    .info-panel-small {
      font-size: 0.875rem;
    }
    
    .info-panel-large {
      font-size: 1.1rem;
    }
    
    .info-panel-primary .card-header {
      background-color: var(--bs-primary);
      color: white;
    }
    
    .info-panel-secondary .card-header {
      background-color: var(--bs-secondary);
      color: white;
    }
    
    .info-panel-success .card-header {
      background-color: var(--bs-success);
      color: white;
    }
    
    .info-panel-info .card-header {
      background-color: var(--bs-info);
      color: white;
    }
    
    .info-panel-warning .card-header {
      background-color: var(--bs-warning);
      color: white;
    }
    
    .info-panel-danger .card-header {
      background-color: var(--bs-danger);
      color: white;
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
    
    .cursor-pointer:hover {
      opacity: 0.8;
    }
    
    .info-panel-header {
      padding: 0.5rem 0;
    }
    
    .info-panel-body {
      padding: 1rem 0;
    }
    
    .compact-panel {
      display: inline-block;
    }
    
    .compact-header {
      font-size: 0.875rem;
    }
    
    .compact-content {
      font-size: 0.875rem;
    }
    
    /* Animation for collapsible panels */
    .card-body, .info-panel-body {
      transition: all 0.3s ease;
    }
    
    @media (max-width: 768px) {
      .info-panel-small {
        font-size: 0.8rem;
      }
      
      .table td {
        padding: 0.25rem 0.5rem;
      }
    }
    </style>
  `
});