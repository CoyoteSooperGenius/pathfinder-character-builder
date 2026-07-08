// Pathfinder Button Component
// Standardized button component with Bootstrap styling and common variations

Vue.component('pf-button', {
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'right'].includes(value)
    }
  },
  
  computed: {
    buttonClasses() {
      const classes = ['pf-btn'];

      // Variant
      if (this.outline) {
        classes.push(`pf-btn--outline-${this.variant}`);
      } else {
        classes.push(`pf-btn--${this.variant}`);
      }

      // Size
      if (this.size === 'sm') classes.push('pf-btn--sm');
      if (this.size === 'lg') classes.push('pf-btn--lg');

      // Block
      if (this.block) classes.push('pf-btn--block');

      return classes.join(' ');
    }
  },
  
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event);
      }
    }
  },
  
  template: `
    <button 
      :class="buttonClasses"
      :disabled="disabled || loading"
      @click="handleClick"
      type="button"
    >
      <span v-if="loading" class="pf-spinner pf-spinner--sm me-2" role="status" aria-hidden="true"></span>
      <i v-else-if="icon && iconPosition === 'left'" :class="['fas', icon, 'me-2']"></i>
      <slot></slot>
      <i v-if="icon && iconPosition === 'right'" :class="['fas', icon, 'ms-2']"></i>
    </button>
  `
});