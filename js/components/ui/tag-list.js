Vue.component('tag-list', {
  props: {
    // Array of items to display as tags
    items: {
      type: Array,
      default: () => []
    },
    // Display mode: 'badges', 'pills', 'labels', 'chips', 'buttons'
    mode: {
      type: String,
      default: 'badges',
      validator: value => ['badges', 'pills', 'labels', 'chips', 'buttons'].includes(value)
    },
    // Size variant: 'small', 'normal', 'large'
    size: {
      type: String,
      default: 'normal',
      validator: value => ['small', 'normal', 'large'].includes(value)
    },
    // Default variant for all tags: 'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark'
    variant: {
      type: String,
      default: 'secondary',
      validator: value => ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark'].includes(value)
    },
    // Layout: 'wrap', 'nowrap', 'vertical'
    layout: {
      type: String,
      default: 'wrap',
      validator: value => ['wrap', 'nowrap', 'vertical'].includes(value)
    },
    // Property name for the display text (if items are objects)
    textProperty: {
      type: String,
      default: 'text'
    },
    // Property name for the variant/color (if items are objects)
    variantProperty: {
      type: String,
      default: 'variant'
    },
    // Property name for the value/badge content (if items are objects)
    valueProperty: {
      type: String,
      default: 'value'
    },
    // Property name for custom CSS classes (if items are objects)
    classProperty: {
      type: String,
      default: 'class'
    },
    // Property name for icons (if items are objects)
    iconProperty: {
      type: String,
      default: 'icon'
    },
    // Property name for tooltips (if items are objects)
    tooltipProperty: {
      type: String,
      default: 'tooltip'
    },
    // Whether tags are clickable
    clickable: {
      type: Boolean,
      default: false
    },
    // Whether tags are removable
    removable: {
      type: Boolean,
      default: false
    },
    // Maximum number of tags to show (with "show more" option)
    maxVisible: {
      type: Number,
      default: null
    },
    // Custom separator for inline display
    separator: {
      type: String,
      default: ''
    },
    // Whether to show icons
    showIcons: {
      type: Boolean,
      default: false
    },
    // Whether to show values as badges on the tags
    showValues: {
      type: Boolean,
      default: false
    },
    // Empty state message
    emptyMessage: {
      type: String,
      default: 'No items'
    },
    // Whether to show empty state
    showEmpty: {
      type: Boolean,
      default: true
    },
    // Custom CSS classes
    customClasses: {
      type: String,
      default: ''
    },
    // Gap between items
    gap: {
      type: String,
      default: '1',
      validator: value => ['0', '1', '2', '3', '4', '5'].includes(value)
    }
  },
  data() {
    return {
      showAll: false
    };
  },
  computed: {
    // Process items into standardized format
    processedItems() {
      if (!this.items || this.items.length === 0) return [];
      
      return this.items.map((item, index) => {
        if (typeof item === 'string') {
          return {
            id: index,
            text: item,
            variant: this.variant,
            value: null,
            icon: null,
            tooltip: null,
            class: '',
            clickable: this.clickable,
            removable: this.removable
          };
        } else if (typeof item === 'object' && item !== null) {
          return {
            id: item.id || index,
            text: item[this.textProperty] || item.name || item.label || item.toString(),
            variant: item[this.variantProperty] || this.variant,
            value: item[this.valueProperty] || null,
            icon: item[this.iconProperty] || null,
            tooltip: item[this.tooltipProperty] || null,
            class: item[this.classProperty] || '',
            clickable: item.clickable !== undefined ? item.clickable : this.clickable,
            removable: item.removable !== undefined ? item.removable : this.removable,
            raw: item
          };
        } else {
          return {
            id: index,
            text: item.toString(),
            variant: this.variant,
            value: null,
            icon: null,
            tooltip: null,
            class: '',
            clickable: this.clickable,
            removable: this.removable
          };
        }
      });
    },
    
    // Items to display (considering maxVisible)
    displayedItems() {
      if (!this.maxVisible || this.showAll) {
        return this.processedItems;
      }
      return this.processedItems.slice(0, this.maxVisible);
    },
    
    // Hidden items count
    hiddenCount() {
      if (!this.maxVisible || this.showAll) return 0;
      return Math.max(0, this.processedItems.length - this.maxVisible);
    },
    
    // Container CSS classes
    containerClasses() {
      const classes = ['tag-list'];
      
      if (this.mode !== 'badges') {
        classes.push(`tag-list-${this.mode}`);
      }
      
      if (this.size !== 'normal') {
        classes.push(`tag-list-${this.size}`);
      }
      
      if (this.layout !== 'wrap') {
        classes.push(`tag-list-${this.layout}`);
      }
      
      if (this.customClasses) {
        classes.push(this.customClasses);
      }
      
      return classes.join(' ');
    },
    
    // Wrapper CSS classes for layout
    wrapperClasses() {
      const classes = [];
      
      if (this.layout === 'wrap') {
        classes.push('d-flex', 'flex-wrap');
      } else if (this.layout === 'nowrap') {
        classes.push('d-flex', 'flex-nowrap');
      } else if (this.layout === 'vertical') {
        classes.push('d-flex', 'flex-column');
      }
      
      if (this.gap && this.layout !== 'vertical') {
        classes.push(`gap-${this.gap}`);
      }
      
      return classes.join(' ');
    }
  },
  methods: {
    // Get tag CSS classes
    getTagClasses(item) {
      const classes = [];
      
      // Base classes based on mode
      if (this.mode === 'badges') {
        classes.push('badge');
      } else if (this.mode === 'pills') {
        classes.push('badge', 'rounded-pill');
      } else if (this.mode === 'labels') {
        classes.push('btn', 'btn-outline-' + item.variant);
      } else if (this.mode === 'chips') {
        classes.push('badge', 'rounded-3');
      } else if (this.mode === 'buttons') {
        classes.push('btn', 'btn-' + item.variant);
      }
      
      // Variant classes
      if (this.mode === 'badges' || this.mode === 'pills' || this.mode === 'chips') {
        classes.push('bg-' + item.variant);
      }
      
      // Size classes
      if (this.size === 'small') {
        if (this.mode === 'buttons' || this.mode === 'labels') {
          classes.push('btn-sm');
        } else {
          classes.push('small');
        }
      } else if (this.size === 'large') {
        if (this.mode === 'buttons' || this.mode === 'labels') {
          classes.push('btn-lg');
        } else {
          classes.push('fs-6');
        }
      }
      
      // Interactive classes
      if (item.clickable) {
        classes.push('cursor-pointer');
        if (this.mode === 'badges' || this.mode === 'pills' || this.mode === 'chips') {
          classes.push('user-select-none');
        }
      }
      
      // Custom classes
      if (item.class) {
        classes.push(item.class);
      }
      
      return classes.join(' ');
    },
    
    // Handle tag click
    onTagClick(item, index) {
      if (item.clickable) {
        this.$emit('tag-click', item.raw || item.text, index, item);
      }
    },
    
    // Handle tag removal
    onTagRemove(item, index) {
      this.$emit('tag-remove', item.raw || item.text, index, item);
    },
    
    // Toggle show all
    toggleShowAll() {
      this.showAll = !this.showAll;
      this.$emit('toggle-show-all', this.showAll);
    },
    
    // Get margin classes for vertical layout
    getMarginClass(index) {
      if (this.layout === 'vertical' && this.gap && index < this.displayedItems.length - 1) {
        return `mb-${this.gap}`;
      }
      return '';
    }
  },
  template: `
    <div :class="containerClasses">
      <!-- Main tag container -->
      <div v-if="processedItems.length > 0" :class="wrapperClasses">
        <!-- Individual tags -->
        <span 
          v-for="(item, index) in displayedItems" 
          :key="item.id"
          :class="[getTagClasses(item), getMarginClass(index)]"
          :title="item.tooltip"
          @click="onTagClick(item, index)"
        >
          <!-- Icon -->
          <i v-if="showIcons && item.icon" :class="item.icon + ' me-1'"></i>
          
          <!-- Text content -->
          <span>{{ item.text }}</span>
          
          <!-- Value badge -->
          <span v-if="showValues && item.value !== null && item.value !== undefined" 
                class="badge bg-light text-dark ms-1">
            {{ item.value }}
          </span>
          
          <!-- Remove button -->
          <button v-if="item.removable" 
                  type="button" 
                  class="btn-close btn-close-white ms-1"
                  :class="{ 'btn-close': item.variant === 'light' || item.variant === 'warning' }"
                  @click.stop="onTagRemove(item, index)"
                  :aria-label="'Remove ' + item.text">
          </button>
          
          <!-- Separator -->
          <span v-if="separator && index < displayedItems.length - 1" class="text-muted mx-1">{{ separator }}</span>
        </span>
        
        <!-- Separators are handled inline with tags when separator is provided -->
        
        <!-- Show more/less button -->
        <button v-if="maxVisible && hiddenCount > 0 || showAll" 
                type="button"
                class="btn btn-sm btn-outline-secondary"
                @click="toggleShowAll">
          <span v-if="!showAll">
            +{{ hiddenCount }} more
          </span>
          <span v-else>
            Show less
          </span>
        </button>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="showEmpty" class="text-muted">
        <i class="fas fa-tags me-1"></i>{{ emptyMessage }}
      </div>
    </div>
  `,
  style: `
    <style scoped>
    .tag-list {
      /* Base styling */
    }
    
    .tag-list-small {
      font-size: 0.875rem;
    }
    
    .tag-list-large {
      font-size: 1.1rem;
    }
    
    .tag-list-vertical .badge,
    .tag-list-vertical .btn {
      display: inline-block;
      width: auto;
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
    
    .cursor-pointer:hover {
      opacity: 0.8;
      transform: translateY(-1px);
      transition: all 0.2s ease;
    }
    
    /* Prevent text selection on clickable badges */
    .user-select-none {
      user-select: none;
    }
    
    /* Ensure proper spacing for removable tags */
    .btn-close {
      font-size: 0.7em;
      padding: 0;
      width: 0.8em;
      height: 0.8em;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .tag-list-nowrap {
        overflow-x: auto;
        white-space: nowrap;
      }
      
      .tag-list-small {
        font-size: 0.8rem;
      }
    }
    </style>
  `
});