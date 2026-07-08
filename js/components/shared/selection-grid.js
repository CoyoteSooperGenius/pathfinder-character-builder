// Selection Grid Component
// Versatile component for displaying and selecting items in grid or list format

Vue.component('selection-grid', {
  props: {
    items: {
      type: Array,
      required: true
    },
    selectedItem: {
      type: [String, Object, Number],
      default: null
    },
    multiSelect: {
      type: Boolean,
      default: false
    },
    selectedItems: {
      type: Array,
      default: () => []
    },
    displayMode: {
      type: String,
      default: 'cards',
      validator: (value) => ['cards', 'list', 'table'].includes(value)
    },
    columns: {
      type: String,
      default: 'pf-grid--3'
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    titleProperty: {
      type: String,
      default: 'name'
    },
    descriptionProperty: {
      type: String,
      default: 'description'
    },
    imageProperty: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingMessage: {
      type: String,
      default: 'Loading...'
    },
    emptyMessage: {
      type: String,
      default: 'No items available'
    },
    searchable: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    filterProperty: {
      type: String,
      default: 'type'
    }
  },
  
  data() {
    return {
      searchQuery: '',
      selectedFilter: 'all'
    };
  },
  
  computed: {
    filteredItems() {
      let filtered = this.items;
      
      // Apply search filter
      if (this.searchable && this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
          this.getItemProperty(item, this.titleProperty).toLowerCase().includes(query) ||
          this.getItemProperty(item, this.descriptionProperty).toLowerCase().includes(query)
        );
      }
      
      // Apply category filter
      if (this.filterable && this.selectedFilter !== 'all') {
        filtered = filtered.filter(item => 
          this.getItemProperty(item, this.filterProperty) === this.selectedFilter
        );
      }
      
      return filtered;
    },
    
    filterOptions() {
      if (!this.filterable) return [];
      
      const options = new Set();
      this.items.forEach(item => {
        const filterValue = this.getItemProperty(item, this.filterProperty);
        if (filterValue) {
          options.add(filterValue);
        }
      });
      
      return Array.from(options).sort();
    },
    
    hasFilters() {
      return this.searchable || this.filterable;
    }
  },
  
  methods: {
    getItemProperty(item, property) {
      if (!property || !item) return '';
      return item[property] || '';
    },
    
    getItemKey(item) {
      return this.getItemProperty(item, this.itemKey);
    },
    
    isSelected(item) {
      if (this.multiSelect) {
        return this.selectedItems.some(selected => 
          this.getItemKey(selected) === this.getItemKey(item)
        );
      } else {
        if (typeof this.selectedItem === 'object' && this.selectedItem !== null) {
          return this.getItemKey(this.selectedItem) === this.getItemKey(item);
        }
        return this.selectedItem === this.getItemKey(item) || this.selectedItem === item;
      }
    },
    
    selectItem(item) {
      if (this.multiSelect) {
        const currentItems = [...this.selectedItems];
        const itemKey = this.getItemKey(item);
        const existingIndex = currentItems.findIndex(selected => 
          this.getItemKey(selected) === itemKey
        );
        
        if (existingIndex >= 0) {
          currentItems.splice(existingIndex, 1);
        } else {
          currentItems.push(item);
        }
        
        this.$emit('selection-changed', currentItems);
        this.$emit('items-selected', currentItems);
      } else {
        this.$emit('selection-changed', this.getItemKey(item));
        this.$emit('item-selected', item);
      }
    },
    
    getCardClasses(item) {
      const classes = ['pf-card', 'pf-card--selectable', 'h-100', 'selection-card'];
      if (this.isSelected(item)) {
        classes.push('pf-card--selected');
      }
      return classes.join(' ');
    },

    getListItemClasses(item) {
      const classes = ['pf-list__item', 'pf-list__item--action', 'selection-item'];
      if (this.isSelected(item)) {
        classes.push('pf-list__item--active');
      }
      return classes.join(' ');
    }
  },
  
  template: `
    <div class="selection-grid">
      <!-- Filters -->
      <div v-if="hasFilters" class="mb-3">
        <div class="pf-grid pf-grid--2">
          <div v-if="searchable">
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Search items..."
              >
            </div>
          </div>
          <div v-if="filterable">
            <select v-model="selectedFilter" class="form-select">
              <option value="all">All {{ filterProperty }}s</option>
              <option 
                v-for="option in filterOptions" 
                :key="option" 
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="pf-spinner" role="status">
          <span class="visually-hidden">{{ loadingMessage }}</span>
        </div>
        <div class="mt-2 text-muted">{{ loadingMessage }}</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredItems.length === 0" class="text-center py-5">
        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
        <p class="text-muted">{{ emptyMessage }}</p>
      </div>

      <!-- Cards Display -->
      <div v-else-if="displayMode === 'cards'" :class="['pf-grid', columns]">
        <div
          v-for="item in filteredItems"
          :key="getItemKey(item)"
        >
          <div
            :class="getCardClasses(item)"
            @click="selectItem(item)"
          >
            <div v-if="imageProperty && getItemProperty(item, imageProperty)" class="card-img-top-wrapper">
              <img 
                :src="getItemProperty(item, imageProperty)" 
                :alt="getItemProperty(item, titleProperty)"
                class="card-img-top"
                style="height: 200px; object-fit: cover;"
              >
            </div>
            
            <div class="pf-card__body">
              <h5 class="pf-card__title">
                {{ getItemProperty(item, titleProperty) }}
                <i v-if="isSelected(item)" class="fas fa-check-circle text-primary float-end"></i>
              </h5>

              <p v-if="getItemProperty(item, descriptionProperty)" class="text-muted">
                {{ getItemProperty(item, descriptionProperty) }}
              </p>
              
              <!-- Custom card content slot -->
              <slot name="card-content" :item="item"></slot>
            </div>
          </div>
        </div>
      </div>
      
      <!-- List Display -->
      <div v-else-if="displayMode === 'list'" class="pf-list">
        <div
          v-for="item in filteredItems"
          :key="getItemKey(item)"
          :class="getListItemClasses(item)"
          @click="selectItem(item)"
        >
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <h6 class="mb-1">{{ getItemProperty(item, titleProperty) }}</h6>
              <p v-if="getItemProperty(item, descriptionProperty)" class="mb-0 text-muted small">
                {{ getItemProperty(item, descriptionProperty) }}
              </p>
              
              <!-- Custom list content slot -->
              <slot name="list-content" :item="item"></slot>
            </div>
            <div>
              <i v-if="isSelected(item)" class="fas fa-check"></i>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Table Display -->
      <div v-else-if="displayMode === 'table'" class="table-responsive">
        <table class="pf-table pf-table--hover">
          <thead>
            <tr>
              <th v-if="multiSelect" width="50">
                <input type="checkbox" class="form-check-input">
              </th>
              <th>{{ titleProperty }}</th>
              <th v-if="descriptionProperty">{{ descriptionProperty }}</th>
              <slot name="table-headers"></slot>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredItems"
              :key="getItemKey(item)"
              @click="selectItem(item)"
              :class="{ 'pf-table__row--selected': isSelected(item) }"
            >
              <td v-if="multiSelect">
                <input 
                  type="checkbox" 
                  class="form-check-input"
                  :checked="isSelected(item)"
                  @change.stop="selectItem(item)"
                >
              </td>
              <td>{{ getItemProperty(item, titleProperty) }}</td>
              <td v-if="descriptionProperty">{{ getItemProperty(item, descriptionProperty) }}</td>
              
              <!-- Custom table content slot -->
              <slot name="table-content" :item="item"></slot>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
});