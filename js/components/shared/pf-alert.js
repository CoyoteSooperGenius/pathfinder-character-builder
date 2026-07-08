// Pathfinder Alert Component
// Bootstrap alert wrapper for displaying messages and notifications

Vue.component('pf-alert', {
  props: {
    variant: {
      type: String,
      default: 'info',
      validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(value)
    },
    dismissible: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: null
    },
    autoHide: {
      type: [Boolean, Number],
      default: false
    }
  },
  
  data() {
    return {
      visible: this.show,
      autoHideTimer: null
    };
  },
  
  computed: {
    alertClasses() {
      return ['pf-alert', `pf-alert--${this.variant}`].join(' ');
    },
    
    defaultIcon() {
      const iconMap = {
        success: 'fa-check-circle',
        danger: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle',
        primary: 'fa-info-circle',
        secondary: 'fa-info-circle',
        light: 'fa-info-circle',
        dark: 'fa-info-circle'
      };
      return this.icon || iconMap[this.variant];
    }
  },
  
  watch: {
    show(newValue) {
      this.visible = newValue;
      if (newValue && this.autoHide) {
        this.startAutoHide();
      }
    }
  },
  
  methods: {
    dismiss() {
      this.visible = false;
      this.clearAutoHide();
      this.$emit('dismissed');
    },
    
    startAutoHide() {
      this.clearAutoHide();
      const delay = typeof this.autoHide === 'number' ? this.autoHide : 5000;
      this.autoHideTimer = setTimeout(() => {
        this.dismiss();
      }, delay);
    },
    
    clearAutoHide() {
      if (this.autoHideTimer) {
        clearTimeout(this.autoHideTimer);
        this.autoHideTimer = null;
      }
    }
  },
  
  mounted() {
    if (this.visible && this.autoHide) {
      this.startAutoHide();
    }
  },
  
  beforeDestroy() {
    this.clearAutoHide();
  },
  
  template: `
    <div 
      v-if="visible"
      :class="alertClasses" 
      role="alert"
    >
      <div class="d-flex align-items-center">
        <i 
          v-if="defaultIcon" 
          :class="['fas', defaultIcon, 'me-2']"
        ></i>
        <div class="flex-grow-1">
          <slot></slot>
        </div>
        <button
          v-if="dismissible"
          type="button"
          class="pf-close"
          aria-label="Close"
          @click="dismiss"
        ><i class="fas fa-xmark"></i></button>
      </div>
    </div>
  `
});