Vue.component('collapsible-card', {
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    initiallyExpanded: {
      type: Boolean,
      default: true
    },
    cardClasses: {
      type: String,
      default: ''
    },
    headerClasses: {
      type: String,
      default: ''
    },
    bodyClasses: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isExpanded: this.initiallyExpanded
    };
  },
  computed: {
    chevronIcon() {
      return this.isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
    },
    fullCardClasses() {
      const baseClasses = 'card';
      return this.cardClasses ? `${baseClasses} ${this.cardClasses}` : baseClasses;
    },
    fullHeaderClasses() {
      const baseClasses = 'card-header';
      return this.headerClasses ? `${baseClasses} ${this.headerClasses}` : baseClasses;
    },
    fullBodyClasses() {
      const baseClasses = 'card-body';
      return this.bodyClasses ? `${baseClasses} ${this.bodyClasses}` : baseClasses;
    }
  },
  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
      this.$emit('toggle', this.isExpanded);
    }
  },
  watch: {
    isExpanded: {
      handler(newValue) {
        this.$emit('expansion-changed', newValue);
      },
      immediate: true
    }
  },
  template: `
    <div :class="fullCardClasses">
      <div 
        :class="fullHeaderClasses" 
        @click="toggle" 
        style="cursor: pointer;"
      >
        <h5 class="mb-0 d-flex justify-content-between align-items-center">
          <span class="d-flex align-items-center">
            <i v-if="icon" :class="icon + ' me-2'"></i>
            {{ title }}
          </span>
          <i :class="chevronIcon"></i>
        </h5>
      </div>
      <div 
        v-show="isExpanded" 
        :class="fullBodyClasses"
      >
        <slot></slot>
      </div>
    </div>
  `
});