Vue.component('selection-grid', {
  props: {
    items: {
      type: Array,
      required: true
    },
    selectedItem: {
      type: [String, Object],
      default: null
    },
    displayMode: {
      type: String,
      default: 'cards', // 'cards', 'list', 'radio'
      validator: value => ['cards', 'list', 'radio'].includes(value)
    },
    columns: {
      type: String,
      default: 'col-md-6 col-lg-4' // Bootstrap column classes for card mode
    },
    itemKey: {
      type: String,
      default: 'name' // Property to use as unique identifier
    },
    titleProperty: {
      type: String,
      default: 'name' // Property to display as title
    },
    descriptionProperty: {
      type: String,
      default: 'description' // Property to display as description
    },
    showDetails: {
      type: Boolean,
      default: false // Whether to show detail panel for list mode
    },
    multiSelect: {
      type: Boolean,
      default: false // Allow multiple selections
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyMessage: {
      type: String,
      default: 'No items available'
    }
  },
  data() {
    return {
      hoveredItem: null,
      localSelectedItem: this.multiSelect ? (Array.isArray(this.selectedItem) ? [...this.selectedItem] : []) : this.selectedItem
    };
  },
  watch: {
    selectedItem: {
      handler(newValue) {
        this.localSelectedItem = this.multiSelect ? (Array.isArray(newValue) ? [...newValue] : []) : newValue;
      },
      deep: true
    },
    localSelectedItem: {
      handler(newValue, oldValue) {
        // Only emit if the values actually changed to prevent infinite loops
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.$emit('selection-changed', newValue);
        }
      },
      deep: true
    }
  },
  computed: {
    displayedItem() {
      if (!this.showDetails) return null;
      const itemKey = this.hoveredItem || (this.multiSelect ? null : this.localSelectedItem);
      if (!itemKey) return null;
      return this.items.find(item => this.getItemKey(item) === itemKey) || null;
    },
    selectedCount() {
      return this.multiSelect ? this.localSelectedItem.length : (this.localSelectedItem ? 1 : 0);
    }
  },
  methods: {
    getItemKey(item) {
      return item[this.itemKey];
    },
    getItemTitle(item) {
      return item[this.titleProperty];
    },
    getItemDescription(item) {
      return item[this.descriptionProperty];
    },
    isSelected(item) {
      const itemKey = this.getItemKey(item);
      return this.multiSelect 
        ? this.localSelectedItem.includes(itemKey)
        : this.localSelectedItem === itemKey;
    },
    selectItem(item) {
      const itemKey = this.getItemKey(item);
      
      if (this.multiSelect) {
        const index = this.localSelectedItem.indexOf(itemKey);
        if (index > -1) {
          this.localSelectedItem.splice(index, 1);
        } else {
          this.localSelectedItem.push(itemKey);
        }
      } else {
        this.localSelectedItem = itemKey;
      }
      
      this.$emit('item-selected', item);
    },
    onItemHover(item) {
      this.hoveredItem = this.getItemKey(item);
    },
    onItemLeave() {
      this.hoveredItem = null;
    },
    getCardClasses(item) {
      const baseClasses = ['card', 'h-100'];
      
      if (this.isSelected(item)) {
        baseClasses.push('border-primary', 'bg-light');
      }
      
      if (this.hoveredItem === this.getItemKey(item) && !this.isSelected(item)) {
        baseClasses.push('border-secondary');
      }
      
      return baseClasses.join(' ');
    },
    getListItemClasses(item) {
      const baseClasses = ['list-group-item', 'list-group-item-action'];
      
      if (this.isSelected(item)) {
        baseClasses.push('active');
      } else if (this.hoveredItem === this.getItemKey(item)) {
        baseClasses.push('list-group-item-primary');
      }
      
      return baseClasses.join(' ');
    }
  },
  template: `
    <div class="selection-grid">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <i class="fas fa-spinner fa-spin"></i> Loading...
      </div>
      
      <!-- Empty State -->
      <div v-else-if="items.length === 0" class="alert alert-info">
        <i class="fas fa-info-circle"></i> {{ emptyMessage }}
      </div>
      
      <!-- Cards Mode -->
      <div v-else-if="displayMode === 'cards'" class="row">
        <div 
          v-for="item in items" 
          :key="getItemKey(item)"
          :class="columns"
          class="mb-3"
        >
          <div 
            :id="getItemKey(item) + '-selector'"
            :class="getCardClasses(item)"
            @click="selectItem(item)"
            @mouseenter="onItemHover(item)"
            @mouseleave="onItemLeave"
            style="cursor: pointer;"
          >
            <div class="card-body">
              <h6 class="card-title">
                {{ getItemTitle(item) }}
                <i v-if="isSelected(item)" class="fas fa-check float-end text-primary"></i>
              </h6>
              <p v-if="getItemDescription(item)" class="card-text small">
                {{ getItemDescription(item) }}
              </p>
              <slot name="card-content" :item="item"></slot>
            </div>
          </div>
        </div>
      </div>
      
      <!-- List Mode (with optional detail panel) -->
      <div v-else-if="displayMode === 'list'" class="row">
        <div :class="showDetails ? 'col-md-6' : 'col-12'">
          <div class="list-group">
            <button
              v-for="item in items"
              :key="getItemKey(item)"
              type="button"
              :class="getListItemClasses(item)"
              @click="selectItem(item)"
              @mouseenter="onItemHover(item)"
              @mouseleave="onItemLeave"
            >
              <div class="d-flex w-100 justify-content-between align-items-center">
                <div class="flex-grow-1">
                  <h6 class="mb-0">{{ getItemTitle(item) }}</h6>
                  <p v-if="getItemDescription(item) && !showDetails" class="mb-0 small text-muted">
                    {{ getItemDescription(item) }}
                  </p>
                </div>
                <i v-if="isSelected(item)" :class="isSelected(item) ? 'fas fa-check text-white' : 'far fa-circle'"></i>
                <i v-else-if="multiSelect" class="far fa-square"></i>
              </div>
              <slot name="list-content" :item="item"></slot>
            </button>
          </div>
        </div>
        
        <!-- Detail Panel -->
        <div v-if="showDetails" class="col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <h6 class="mb-0">
                {{ displayedItem ? getItemTitle(displayedItem) : 'Select an Item' }}
              </h6>
            </div>
            <div class="card-body">
              <div v-if="displayedItem">
                <p v-if="getItemDescription(displayedItem)" class="mb-2">
                  {{ getItemDescription(displayedItem) }}
                </p>
                <slot name="detail-content" :item="displayedItem"></slot>
              </div>
              <p v-else class="text-muted mb-0">
                Click on an item from the list to see its details.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Radio Mode -->
      <div v-else-if="displayMode === 'radio'" class="form-check-container">
        <div 
          v-for="item in items" 
          :key="getItemKey(item)" 
          class="form-check mb-2"
        >
          <input 
            class="form-check-input" 
            :type="multiSelect ? 'checkbox' : 'radio'" 
            :value="getItemKey(item)" 
            v-model="localSelectedItem"
            :id="'item-' + getItemKey(item).toLowerCase().replace(/[^a-z0-9]/g, '')"
            :name="multiSelect ? undefined : 'selection-grid-radio'"
          >
          <label 
            class="form-check-label fw-semibold" 
            :for="'item-' + getItemKey(item).toLowerCase().replace(/[^a-z0-9]/g, '')"
          >
            {{ getItemTitle(item) }}
            <span v-if="getItemDescription(item)" class="text-muted small d-block">
              {{ getItemDescription(item) }}
            </span>
          </label>
          <slot name="radio-content" :item="item"></slot>
        </div>
      </div>
      
      <!-- Selection Summary (for multiSelect) -->
      <div v-if="multiSelect && selectedCount > 0" class="mt-3 alert alert-info">
        <i class="fas fa-info-circle"></i> 
        {{ selectedCount }} item{{ selectedCount > 1 ? 's' : '' }} selected
      </div>
    </div>
  `
});