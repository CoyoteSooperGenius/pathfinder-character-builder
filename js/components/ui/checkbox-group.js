Vue.component('checkbox-group', {
  props: {
    items: {
      type: Array,
      required: true
    },
    selectedItems: {
      type: Array,
      default: () => []
    },
    itemKey: {
      type: String,
      default: 'value' // Property to use as unique identifier/value
    },
    labelProperty: {
      type: String,
      default: 'label' // Property to display as label
    },
    allowMultiple: {
      type: Boolean,
      default: true // Allow multiple selections (checkbox vs radio)
    },
    maxSelections: {
      type: Number,
      default: null // Maximum number of selections allowed
    },
    minSelections: {
      type: Number,
      default: 0 // Minimum number of selections required
    },
    columns: {
      type: String,
      default: 'col-6 col-md-4 col-lg-6' // Bootstrap column classes for grid layout
    },
    showCounter: {
      type: Boolean,
      default: false // Show selection counter
    },
    counterLabel: {
      type: String,
      default: 'Selected' // Label for counter
    },
    disabled: {
      type: Boolean,
      default: false // Disable entire group
    },
    groupName: {
      type: String,
      default: null // Name for radio group (auto-generated if not provided)
    },
    layout: {
      type: String,
      default: 'grid', // 'grid', 'list', 'inline'
      validator: value => ['grid', 'list', 'inline'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyMessage: {
      type: String,
      default: 'No options available'
    }
  },
  data() {
    return {
      localSelectedItems: [...this.selectedItems],
      radioGroupName: this.groupName || `checkbox-group-${Math.random().toString(36).substr(2, 9)}`
    };
  },
  watch: {
    selectedItems: {
      handler(newValue) {
        this.localSelectedItems = [...newValue];
      },
      deep: true
    },
    localSelectedItems: {
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
    hasMaxLimit() {
      return this.maxSelections !== null && this.maxSelections > 0;
    },
    isAtMaxLimit() {
      return this.hasMaxLimit && this.localSelectedItems.length >= this.maxSelections;
    },
    isAtMinLimit() {
      return this.localSelectedItems.length >= this.minSelections;
    },
    selectionCount() {
      return this.localSelectedItems.length;
    },
    canSelectMore() {
      return !this.hasMaxLimit || !this.isAtMaxLimit;
    },
    formattedItems() {
      // Normalize items to have consistent structure
      return this.items.map(item => {
        if (typeof item === 'string') {
          return { [this.itemKey]: item, [this.labelProperty]: item };
        }
        return item;
      });
    },
    gridClasses() {
      return this.layout === 'grid' ? this.columns : '';
    }
  },
  methods: {
    getItemValue(item) {
      return item[this.itemKey];
    },
    getItemLabel(item) {
      return item[this.labelProperty];
    },
    isItemSelected(item) {
      const itemValue = this.getItemValue(item);
      return this.localSelectedItems.includes(itemValue);
    },
    isItemDisabled(item) {
      if (this.disabled) return true;
      
      const isSelected = this.isItemSelected(item);
      
      // If item is selected, it's never disabled (so it can be unselected)
      if (isSelected) return false;
      
      // If not selected and we're at max limit, disable it
      if (this.isAtMaxLimit) return true;
      
      return false;
    },
    toggleItem(item) {
      if (this.disabled || this.isItemDisabled(item)) return;
      
      const itemValue = this.getItemValue(item);
      const isCurrentlySelected = this.isItemSelected(item);
      
      if (this.allowMultiple) {
        this.handleMultipleSelection(itemValue, isCurrentlySelected);
      } else {
        this.handleSingleSelection(itemValue);
      }
      
      this.$emit('item-toggled', {
        item: item,
        value: itemValue,
        selected: !isCurrentlySelected,
        allSelected: this.localSelectedItems
      });
    },
    handleMultipleSelection(itemValue, isCurrentlySelected) {
      const newSelection = [...this.localSelectedItems];
      
      if (isCurrentlySelected) {
        // Remove item
        const index = newSelection.indexOf(itemValue);
        if (index > -1) {
          newSelection.splice(index, 1);
        }
      } else {
        // Add item (if not at max limit)
        if (this.canSelectMore) {
          newSelection.push(itemValue);
        }
      }
      
      this.localSelectedItems = newSelection;
    },
    handleSingleSelection(itemValue) {
      this.localSelectedItems = [itemValue];
    },
    selectAll() {
      if (!this.allowMultiple || this.disabled) return;
      
      const allValues = this.formattedItems.map(item => this.getItemValue(item));
      const limitedValues = this.hasMaxLimit 
        ? allValues.slice(0, this.maxSelections)
        : allValues;
      
      this.localSelectedItems = limitedValues;
      this.$emit('select-all', limitedValues);
    },
    clearAll() {
      if (this.disabled) return;
      
      this.localSelectedItems = [];
      this.$emit('clear-all');
    },
    getItemId(item) {
      const value = this.getItemValue(item);
      return `${this.radioGroupName}-${value}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
    },
    getItemClasses(item) {
      const classes = ['form-check'];
      
      if (this.layout === 'inline') {
        classes.push('form-check-inline');
      }
      
      if (this.isItemDisabled(item)) {
        classes.push('disabled');
      }
      
      return classes.join(' ');
    },
    getLabelClasses(item) {
      const classes = ['form-check-label'];
      
      if (this.isItemDisabled(item)) {
        classes.push('text-muted');
      }
      
      return classes.join(' ');
    }
  },
  template: `
    <div class="checkbox-group">
      <!-- Loading State -->
      <div v-if="loading" class="text-center text-muted">
        <i class="fas fa-spinner fa-spin"></i> Loading options...
      </div>
      
      <!-- Empty State -->
      <div v-else-if="formattedItems.length === 0" class="text-muted">
        <i class="fas fa-info-circle"></i> {{ emptyMessage }}
      </div>
      
      <!-- Checkbox/Radio Group -->
      <div v-else>
        <!-- Grid Layout -->
        <div v-if="layout === 'grid'" class="row">
          <div 
            v-for="item in formattedItems" 
            :key="getItemValue(item)"
            :class="gridClasses"
            class="mb-2"
          >
            <div :class="getItemClasses(item)">
              <input 
                class="form-check-input" 
                :type="allowMultiple ? 'checkbox' : 'radio'"
                :id="getItemId(item)"
                :value="getItemValue(item)"
                :checked="isItemSelected(item)"
                :disabled="isItemDisabled(item)"
                :name="allowMultiple ? undefined : radioGroupName"
                @change="toggleItem(item)"
              />
              <label 
                :class="getLabelClasses(item)"
                :for="getItemId(item)"
              >
                {{ getItemLabel(item) }}
              </label>
            </div>
          </div>
        </div>
        
        <!-- List Layout -->
        <div v-else-if="layout === 'list'" class="list-group">
          <div 
            v-for="item in formattedItems" 
            :key="getItemValue(item)"
            class="list-group-item"
          >
            <div :class="getItemClasses(item)">
              <input 
                class="form-check-input me-2" 
                :type="allowMultiple ? 'checkbox' : 'radio'"
                :id="getItemId(item)"
                :value="getItemValue(item)"
                :checked="isItemSelected(item)"
                :disabled="isItemDisabled(item)"
                :name="allowMultiple ? undefined : radioGroupName"
                @change="toggleItem(item)"
              />
              <label 
                :class="getLabelClasses(item)"
                :for="getItemId(item)"
              >
                {{ getItemLabel(item) }}
              </label>
            </div>
          </div>
        </div>
        
        <!-- Inline Layout -->
        <div v-else-if="layout === 'inline'">
          <div 
            v-for="item in formattedItems" 
            :key="getItemValue(item)"
            :class="getItemClasses(item)"
          >
            <input 
              class="form-check-input" 
              :type="allowMultiple ? 'checkbox' : 'radio'"
              :id="getItemId(item)"
              :value="getItemValue(item)"
              :checked="isItemSelected(item)"
              :disabled="isItemDisabled(item)"
              :name="allowMultiple ? undefined : radioGroupName"
              @change="toggleItem(item)"
            />
            <label 
              :class="getLabelClasses(item)"
              :for="getItemId(item)"
            >
              {{ getItemLabel(item) }}
            </label>
          </div>
        </div>
        
        <!-- Selection Info -->
        <div v-if="showCounter || hasMaxLimit || minSelections > 0" class="mt-2">
          <small class="text-muted">
            <span v-if="showCounter">
              {{ counterLabel }}: {{ selectionCount }}
            </span>
            <span v-if="hasMaxLimit">
              {{ showCounter ? ' / ' : '' }}{{ maxSelections }}
              <span v-if="isAtMaxLimit" class="text-warning">
                <i class="fas fa-exclamation-triangle ms-1"></i> Maximum reached
              </span>
            </span>
            <span v-if="minSelections > 0 && !isAtMinLimit" class="text-info">
              <i class="fas fa-info-circle ms-1"></i> 
              Select at least {{ minSelections }} option{{ minSelections > 1 ? 's' : '' }}
            </span>
          </small>
        </div>
        
        <!-- Action Buttons -->
        <div v-if="allowMultiple && formattedItems.length > 1" class="mt-2">
          <button 
            type="button" 
            class="btn btn-sm btn-outline-primary me-2"
            @click="selectAll"
            :disabled="disabled || isAtMaxLimit"
          >
            Select All{{ hasMaxLimit ? ' (' + maxSelections + ')' : '' }}
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-outline-secondary"
            @click="clearAll"
            :disabled="disabled || selectionCount === 0"
          >
            Clear All
          </button>
        </div>
        
        <!-- Selected Items Display -->
        <div v-if="localSelectedItems.length > 0" class="mt-2">
          <slot name="selected-items" :selectedItems="localSelectedItems">
            <div class="small">
              <strong>Selected:</strong> 
              <span class="text-muted">{{ localSelectedItems.join(', ') }}</span>
            </div>
          </slot>
        </div>
      </div>
    </div>
  `
});