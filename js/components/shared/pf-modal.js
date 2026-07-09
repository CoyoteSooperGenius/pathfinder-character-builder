// Pathfinder Modal Component
// Self-contained modal (no Bootstrap JS) with Vue.js integration

// Shared scroll-lock accounting: the body class is only removed when the
// last open modal releases it, so stacked modals can't clobber each other
const PfModalScrollLock = {
  count: 0,
  acquire() {
    this.count++;
    document.body.classList.add('pf-modal-open');
  },
  release() {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0) {
      document.body.classList.remove('pf-modal-open');
    }
  }
};

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
      isOpen: false,
      previouslyFocused: null
    };
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
        if (visible) {
          this.openModal();
        } else {
          this.closeModal();
        }
      }
    }
  },

  beforeDestroy() {
    this.closeModal();
  },

  methods: {
    openModal() {
      if (this.isOpen) return;
      this.isOpen = true;
      PfModalScrollLock.acquire();
      // Esc/Tab listener lives on document because focus may sit anywhere
      // inside the dialog
      document.addEventListener('keydown', this.handleKeydown);
      // Move focus into the dialog and remember where it came from
      this.previouslyFocused = document.activeElement;
      this.$nextTick(() => {
        if (this.$refs.content) {
          this.$refs.content.focus();
        }
      });
      this.$emit('show');
    },

    closeModal() {
      if (!this.isOpen) return;
      this.isOpen = false;
      PfModalScrollLock.release();
      document.removeEventListener('keydown', this.handleKeydown);
      if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
        this.previouslyFocused.focus();
      }
      this.previouslyFocused = null;
    },

    handleHide() {
      this.$emit('hide');
    },

    handleKeydown(event) {
      if (event.key === 'Escape' && this.keyboard) {
        this.handleHide();
      } else if (event.key === 'Tab') {
        this.containFocus(event);
      }
    },

    // Keep Tab cycling inside the dialog while the modal is open
    containFocus(event) {
      const root = this.$refs.content;
      if (!root) return;

      const focusables = root.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!root.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === root)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
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
        <div ref="content" class="pf-modal__content" tabindex="-1">
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
