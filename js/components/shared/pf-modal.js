// Pathfinder Modal Component
// Self-contained modal (no Bootstrap JS) with Vue.js integration

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

  computed: {
    dialogClasses() {
      const classes = ['pf-modal__dialog'];

      if (this.size !== 'md') {
        classes.push(`pf-modal__dialog--${this.size}`);
      }

      if (this.centered) {
        classes.push('pf-modal__dialog--centered');
      }

      if (this.scrollable) {
        classes.push('pf-modal__dialog--scrollable');
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
    show: {
      immediate: true,
      handler(visible) {
        // Lock page scroll while any modal is open; Esc listener lives on
        // document because focus may sit anywhere inside the dialog
        document.body.classList.toggle('pf-modal-open', visible);
        if (visible) {
          document.addEventListener('keydown', this.handleKeydown);
          this.$emit('show');
        } else {
          document.removeEventListener('keydown', this.handleKeydown);
        }
      }
    }
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.body.classList.remove('pf-modal-open');
  },

  methods: {
    handleHide() {
      this.$emit('hide');
    },

    handleKeydown(event) {
      if (event.key === 'Escape' && this.keyboard) {
        this.handleHide();
      }
    },

    handleBackdropClick() {
      if (this.backdrop === true) {
        this.handleHide();
      }
    }
  },

  template: `
    <div
      v-if="show"
      class="pf-modal"
      role="dialog"
      aria-modal="true"
      @click.self="handleBackdropClick"
    >
      <div :class="dialogClasses">
        <div class="pf-modal__content">
          <!-- Header -->
          <div
            v-if="hasHeader"
            :class="['pf-modal__header', headerClass]"
          >
            <slot name="header">
              <h5 class="pf-modal__title">{{ title }}</h5>
            </slot>
            <button
              v-if="!hideCloseButton"
              type="button"
              class="pf-close"
              aria-label="Close"
              @click="handleHide"
            ><i class="fas fa-xmark"></i></button>
          </div>

          <!-- Body -->
          <div :class="['pf-modal__body', bodyClass]">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div
            v-if="hasFooter"
            :class="['pf-modal__footer', footerClass]"
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
