// Pathfinder Card Component
// Reusable card component with header, body, and footer sections

Vue.component('pf-card', {
  props: {
    title: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    },
    collapsible: {
      type: Boolean,
      default: false
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: null,
      validator: (value) => !value || ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(value)
    },
    headerClass: {
      type: String,
      default: ''
    },
    bodyClass: {
      type: String,
      default: ''
    },
    noPadding: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      isCollapsed: this.collapsed
    };
  },
  
  watch: {
    collapsed(newValue) {
      this.isCollapsed = newValue;
    }
  },
  
  computed: {
    cardClasses() {
      const classes = ['pf-card'];
      if (this.variant) {
        classes.push(`pf-card--${this.variant}`);
      }
      return classes.join(' ');
    },

    headerClasses() {
      const classes = ['pf-card__header'];
      if (this.collapsible) {
        classes.push('cursor-pointer');
      }
      if (this.headerClass) {
        classes.push(this.headerClass);
      }
      return classes.join(' ');
    },

    bodyClasses() {
      const classes = this.noPadding ? [] : ['pf-card__body'];
      if (this.bodyClass) {
        classes.push(this.bodyClass);
      }
      return classes.join(' ');
    },
    
    hasHeader() {
      return this.title || this.subtitle || this.$slots.header || this.$slots.subtitle;
    },
    
    hasFooter() {
      return this.$slots.footer;
    }
  },
  
  methods: {
    toggleCollapse() {
      if (this.collapsible) {
        this.isCollapsed = !this.isCollapsed;
        this.$emit('toggle', this.isCollapsed);
      }
    }
  },
  
  template: `
    <div :class="cardClasses">
      <!-- Header -->
      <div 
        v-if="hasHeader"
        :class="headerClasses"
        @click="toggleCollapse"
      >
        <slot name="header">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 v-if="title" class="pf-card__title">{{ title }}</h5>
              <h6 v-if="subtitle || $slots.subtitle" class="pf-card__subtitle">
                <slot name="subtitle">{{ subtitle }}</slot>
              </h6>
            </div>
            <i 
              v-if="collapsible" 
              :class="['fas', isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up']"
            ></i>
          </div>
        </slot>
      </div>
      
      <!-- Body -->
      <div 
        v-if="!isCollapsed"
        :class="bodyClasses"
      >
        <div v-if="loading" class="text-center py-4">
          <div class="pf-spinner" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <slot v-else></slot>
      </div>

      <!-- Footer -->
      <div
        v-if="hasFooter && !isCollapsed"
        class="pf-card__footer"
      >
        <slot name="footer"></slot>
      </div>
    </div>
  `
});