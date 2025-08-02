Vue.component('feat-selector', {
  props: {
    // List of feats to choose from
    feats: {
      type: Array,
      default: () => []
    },
    // Currently selected feat(s)
    selectedFeat: {
      type: [String, Array],
      default: null
    },
    // Allow multiple feat selections
    allowMultiple: {
      type: Boolean,
      default: false
    },
    // Maximum number of feats that can be selected
    maxSelections: {
      type: Number,
      default: 1
    },
    // Minimum number of feats that must be selected
    minSelections: {
      type: Number,
      default: 0
    },
    // Title to display above the feat selector
    title: {
      type: String,
      default: 'Select Feat'
    },
    // Description text to display
    description: {
      type: String,
      default: ''
    },
    // Display mode for the selection grid
    displayMode: {
      type: String,
      default: 'list', // 'cards', 'list', 'radio'
      validator: value => ['cards', 'list', 'radio'].includes(value)
    },
    // Whether to show detail panel with prerequisites
    showDetails: {
      type: Boolean,
      default: true
    },
    // Whether to filter out feats with unmet prerequisites
    filterByPrerequisites: {
      type: Boolean,
      default: true
    },
    // Whether to show prerequisite status for each feat
    showPrerequisiteStatus: {
      type: Boolean,
      default: true
    },
    // Whether to show count of filtered feats
    showFilteredCount: {
      type: Boolean,
      default: true
    },
    // Custom CSS classes
    customClasses: {
      type: String,
      default: ''
    },
    // Loading state
    loading: {
      type: Boolean,
      default: false
    },
    // Empty message
    emptyMessage: {
      type: String,
      default: 'No feats available'
    },
    // Override character data for prerequisite checking
    characterData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      localSelectedFeat: this.allowMultiple 
        ? (Array.isArray(this.selectedFeat) ? [...this.selectedFeat] : [])
        : this.selectedFeat
    };
  },
  watch: {
    selectedFeat: {
      handler(newValue) {
        this.localSelectedFeat = this.allowMultiple 
          ? (Array.isArray(newValue) ? [...newValue] : [])
          : newValue;
      },
      deep: true
    },
    localSelectedFeat: {
      handler(newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.$emit('feat-selected', newValue);
          this.$emit('selection-changed', newValue);
        }
      },
      deep: true
    }
  },
  computed: {
    // Get character data for prerequisite checking
    characterDataForChecking() {
      return this.characterData || PrerequisiteChecker.getCharacterData();
    },
    
    // Filter feats based on prerequisites
    availableFeats() {
      if (!this.filterByPrerequisites) {
        return this.feats;
      }
      
      return PrerequisiteChecker.filterByPrerequisites(this.feats, this.characterDataForChecking);
    },
    
    // Count of feats filtered out due to prerequisites
    filteredOutCount() {
      return this.feats.length - this.availableFeats.length;
    },
    
    // Number of currently selected feats
    selectionCount() {
      return this.allowMultiple 
        ? (Array.isArray(this.localSelectedFeat) ? this.localSelectedFeat.length : 0)
        : (this.localSelectedFeat ? 1 : 0);
    },
    
    // Whether the minimum selection requirement is met
    meetsMinimum() {
      return this.selectionCount >= this.minSelections;
    },
    
    // Whether the maximum selection limit is reached
    isAtMaximum() {
      return this.selectionCount >= this.maxSelections;
    },
    
    // Validation status
    isValid() {
      return this.meetsMinimum && this.selectionCount <= this.maxSelections;
    },
    
    // Enhanced feats with prerequisite status
    featsWithStatus() {
      return this.feats.map(feat => {
        const meetsPrereqs = !feat.prerequisites || 
          PrerequisiteChecker.meetsAllPrerequisites(feat.prerequisites, this.characterDataForChecking);
        const unmetPrereqs = feat.prerequisites ? 
          PrerequisiteChecker.getUnmetPrerequisites(feat.prerequisites, this.characterDataForChecking) : [];
        
        return {
          ...feat,
          meetsPrerequisites: meetsPrereqs,
          unmetPrerequisites: unmetPrereqs,
          isAvailable: !this.filterByPrerequisites || meetsPrereqs
        };
      });
    }
  },
  methods: {
    // Handle feat selection from selection-grid
    onFeatSelected(featNameOrObject) {
      const featName = typeof featNameOrObject === 'string' ? featNameOrObject : featNameOrObject.name;
      
      if (this.allowMultiple) {
        this.handleMultipleSelection(featName);
      } else {
        this.localSelectedFeat = featName;
      }
      
      // Emit feat object for convenience
      const featObject = this.feats.find(f => f.name === featName);
      this.$emit('feat-chosen', featObject);
    },
    
    // Handle multiple feat selection
    handleMultipleSelection(featName) {
      const currentSelections = Array.isArray(this.localSelectedFeat) ? [...this.localSelectedFeat] : [];
      const index = currentSelections.indexOf(featName);
      
      if (index > -1) {
        // Remove feat
        currentSelections.splice(index, 1);
      } else {
        // Add feat (if not at max limit)
        if (currentSelections.length < this.maxSelections) {
          currentSelections.push(featName);
        }
      }
      
      this.localSelectedFeat = currentSelections;
    },
    
    // Format prerequisite for display
    formatPrerequisite(prerequisite) {
      return PrerequisiteChecker.formatPrerequisite(prerequisite);
    },
    
    // Check if character meets specific prerequisite
    meetsPrerequisite(prerequisite) {
      return PrerequisiteChecker.meetsPrerequisite(prerequisite, this.characterDataForChecking);
    },
    
    // Get prerequisite status icon and color
    getPrerequisiteStatus(prerequisite) {
      const meets = this.meetsPrerequisite(prerequisite);
      return {
        icon: meets ? 'fas fa-check-circle' : 'fas fa-times-circle',
        class: meets ? 'text-success' : 'text-danger',
        meets: meets
      };
    },
    
    // Clear all selections
    clearSelections() {
      this.localSelectedFeat = this.allowMultiple ? [] : null;
    },
    
    // Get selection validation classes
    getValidationClasses() {
      const classes = [];
      
      if (this.minSelections > 0 && !this.meetsMinimum) {
        classes.push('border-warning');
      } else if (this.isValid) {
        classes.push('border-success');
      }
      
      return classes.join(' ');
    }
  },
  template: `
    <div class="feat-selector" :class="customClasses + ' ' + getValidationClasses()">
      <!-- Header -->
      <div v-if="title || description" class="feat-selector-header mb-3">
        <h6 v-if="title" class="mb-1">{{ title }}</h6>
        <p v-if="description" class="text-muted mb-0">{{ description }}</p>
      </div>
      
      <!-- Selection Status -->
      <div v-if="allowMultiple && (minSelections > 0 || maxSelections > 1)" class="selection-status mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">
            Selected: {{ selectionCount }} / {{ maxSelections }}
          </small>
          <div class="d-flex align-items-center">
            <span v-if="!meetsMinimum" class="badge bg-warning text-dark me-2">
              <i class="fas fa-exclamation-triangle"></i>
              Need {{ minSelections - selectionCount }} more
            </span>
            <button 
              v-if="selectionCount > 0"
              type="button" 
              class="btn btn-sm btn-outline-secondary"
              @click="clearSelections"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      
      <!-- Feat Selection Grid -->
      <selection-grid
        :items="availableFeats"
        :selected-item="localSelectedFeat"
        :display-mode="displayMode"
        :show-details="showDetails"
        :multi-select="allowMultiple"
        item-key="name"
        title-property="name"
        description-property="description"
        :loading="loading"
        :empty-message="emptyMessage"
        @selection-changed="onFeatSelected"
        @item-selected="onFeatSelected"
      >
        <!-- Detail content slot for prerequisites -->
        <template #detail-content="{ item }">
          <div v-if="showPrerequisiteStatus">
            <!-- Prerequisites Section -->
            <div v-if="item.prerequisites && item.prerequisites.length > 0" class="prerequisites-section">
              <h6 class="small fw-bold mb-2">
                <i class="fas fa-list-check me-1"></i>Prerequisites:
              </h6>
              <ul class="list-unstyled mb-0">
                <li 
                  v-for="prereq in item.prerequisites" 
                  :key="prereq.type + prereq.ability + prereq.value + prereq.feat"
                  class="d-flex align-items-center mb-1"
                >
                  <i :class="getPrerequisiteStatus(prereq).icon + ' ' + getPrerequisiteStatus(prereq).class + ' me-2'"></i>
                  <span :class="getPrerequisiteStatus(prereq).meets ? '' : 'text-muted'">
                    {{ formatPrerequisite(prereq) }}
                  </span>
                </li>
              </ul>
            </div>
            <div v-else class="prerequisites-section">
              <h6 class="small fw-bold mb-2">
                <i class="fas fa-list-check me-1"></i>Prerequisites:
              </h6>
              <p class="text-muted small mb-0">
                <i class="fas fa-check-circle text-success me-1"></i>None
              </p>
            </div>
            
            <!-- Additional feat information slot -->
            <slot name="feat-details" :feat="item"></slot>
          </div>
          
          <!-- Fallback if prerequisite status is disabled -->
          <div v-else-if="item.prerequisites && item.prerequisites.length > 0" class="small text-muted">
            <strong>Prerequisites:</strong>
            <ul class="mb-0 ps-3">
              <li v-for="prereq in item.prerequisites" :key="prereq.type + prereq.ability + prereq.value">
                {{ formatPrerequisite(prereq) }}
              </li>
            </ul>
          </div>
          <div v-else class="small text-muted">
            <strong>Prerequisites:</strong> None
          </div>
        </template>
        
        <!-- List content slot for prerequisite indicators -->
        <template #list-content="{ item }">
          <div v-if="showPrerequisiteStatus && item.prerequisites && item.prerequisites.length > 0" class="mt-1">
            <small class="text-muted">
              <i class="fas fa-list-check me-1"></i>
              {{ item.prerequisites.length }} prerequisite{{ item.prerequisites.length > 1 ? 's' : '' }}
              <span v-if="!filterByPrerequisites">
                <span class="mx-1">•</span>
                <i :class="item.meetsPrerequisites ? 'fas fa-check text-success' : 'fas fa-times text-danger'"></i>
                {{ item.meetsPrerequisites ? 'Available' : 'Unavailable' }}
              </span>
            </small>
          </div>
        </template>
        
        <!-- Card content slot for prerequisite indicators -->
        <template #card-content="{ item }">
          <div v-if="showPrerequisiteStatus && item.prerequisites && item.prerequisites.length > 0" class="mt-2">
            <small class="text-muted">
              <i class="fas fa-list-check me-1"></i>
              {{ item.prerequisites.length }} prerequisite{{ item.prerequisites.length > 1 ? 's' : '' }}
              <span v-if="!filterByPrerequisites">
                <span class="mx-1">•</span>
                <i :class="item.meetsPrerequisites ? 'fas fa-check text-success' : 'fas fa-times text-danger'"></i>
                {{ item.meetsPrerequisites ? 'Available' : 'Unavailable' }}
              </span>
            </small>
          </div>
        </template>
      </selection-grid>
      
      <!-- Filtered Count Information -->
      <div v-if="showFilteredCount && filteredOutCount > 0" class="filtered-info mt-3">
        <div class="alert alert-info small mb-0">
          <i class="fas fa-info-circle me-1"></i>
          {{ filteredOutCount }} feat{{ filteredOutCount > 1 ? 's' : '' }} hidden due to unmet prerequisites
          <button 
            v-if="filterByPrerequisites"
            type="button" 
            class="btn btn-sm btn-outline-info ms-2"
            @click="$emit('show-all-feats')"
          >
            Show All Feats
          </button>
        </div>
      </div>
      
      <!-- Validation Messages -->
      <div v-if="!isValid" class="validation-messages mt-3">
        <div v-if="!meetsMinimum" class="alert alert-warning small mb-2">
          <i class="fas fa-exclamation-triangle me-1"></i>
          Please select at least {{ minSelections }} feat{{ minSelections > 1 ? 's' : '' }}.
        </div>
        <div v-if="selectionCount > maxSelections" class="alert alert-danger small mb-0">
          <i class="fas fa-times-circle me-1"></i>
          You can only select up to {{ maxSelections }} feat{{ maxSelections > 1 ? 's' : '' }}.
        </div>
      </div>
      
      <!-- Additional slots for custom content -->
      <div class="feat-selector-footer">
        <slot name="footer" :selectedFeat="localSelectedFeat" :isValid="isValid"></slot>
      </div>
    </div>
  `
});