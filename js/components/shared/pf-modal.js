// Pathfinder Modal Component
// Bootstrap modal wrapper with Vue.js integration

Vue.component('pf-modal', {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    centered: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    backdrop: {
      type: [Boolean, String],
      default: true,
      validator: (value) => value === true || value === false || value === 'static'
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    headerClass: {
      type: String,
      default: ''
    },
    bodyClass: {
      type: String,
      default: ''
    },
    footerClass: {
      type: String,
      default: ''
    },
    hideHeader: {
      type: Boolean,
      default: false
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    hideCloseButton: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      modalInstance: null
    };
  },
  
  computed: {
    modalClasses() {
      const classes = ['modal-dialog'];
      
      if (this.size !== 'md') {
        classes.push(`modal-${this.size}`);
      }
      
      if (this.centered) {
        classes.push('modal-dialog-centered');
      }
      
      if (this.scrollable) {
        classes.push('modal-dialog-scrollable');
      }
      
      return classes.join(' ');
    },
    
    hasHeader() {
      return !this.hideHeader && (this.title || this.$slots.header);
    },
    
    hasFooter() {
      return !this.hideFooter && this.$slots.footer;
    }
  },
  
  watch: {
    show(newValue) {
      if (newValue) {
        this.showModal();
      } else {
        this.hideModal();
      }
    }
  },
  
  methods: {
    showModal() {
      if (this.modalInstance) {
        this.modalInstance.show();
      }
    },
    
    hideModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },
    
    handleHide() {
      this.$emit('hide');
    },
    
    handleShow() {
      this.$emit('show');
    },
    
    handleKeydown(event) {
      if (event.key === 'Escape' && this.keyboard) {
        this.handleHide();
      }
    },
    
    handleBackdropClick(event) {
      if (event.target === this.$refs.modal && this.backdrop === true) {
        this.handleHide();
      }
    }
  },
  
  mounted() {
    // Initialize Bootstrap modal
    const modalEl = this.$refs.modal;
    if (window.bootstrap && window.bootstrap.Modal) {
      this.modalInstance = new window.bootstrap.Modal(modalEl, {
        backdrop: this.backdrop,
        keyboard: this.keyboard
      });
      
      modalEl.addEventListener('hide.bs.modal', this.handleHide);
      modalEl.addEventListener('show.bs.modal', this.handleShow);
    }
    
    // Show modal if initially visible
    if (this.show) {
      this.$nextTick(() => {
        this.showModal();
      });
    }
  },
  
  beforeDestroy() {
    if (this.modalInstance) {
      const modalEl = this.$refs.modal;
      modalEl.removeEventListener('hide.bs.modal', this.handleHide);
      modalEl.removeEventListener('show.bs.modal', this.handleShow);
      this.modalInstance.dispose();
    }
  },
  
  template: `
    <div 
      ref="modal"
      class="modal fade" 
      tabindex="-1" 
      aria-hidden="true"
      @keydown="handleKeydown"
      @click="handleBackdropClick"
    >
      <div :class="modalClasses">
        <div class="modal-content">
          <!-- Header -->
          <div 
            v-if="hasHeader"
            :class="['modal-header', headerClass]"
          >
            <slot name="header">
              <h5 class="modal-title">{{ title }}</h5>
            </slot>
            <button 
              v-if="!hideCloseButton"
              type="button" 
              class="btn-close" 
              aria-label="Close"
              @click="handleHide"
            ></button>
          </div>
          
          <!-- Body -->
          <div :class="['modal-body', bodyClass]">
            <slot></slot>
          </div>
          
          <!-- Footer -->
          <div 
            v-if="hasFooter"
            :class="['modal-footer', footerClass]"
          >
            <slot name="footer">
              <pf-button variant="secondary" @click="handleHide">
                Close
              </pf-button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  `
});