Vue.component('tab-navigation', {
  props: {
    activeTab: {
      type: String,
      default: 'abilities'
    },
    relevantSections: {
      type: Array,
      default: () => []
    },
    completedSteps: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tabsConfig() {
      return {
        summary: {
          label: 'Summary',
          icon: 'fas fa-user',
          completionKey: null // Summary doesn't have completion status
        },
        abilities: {
          label: 'Abilities',
          icon: 'fas fa-chart-bar',
          completionKey: 'abilities'
        },
        background: {
          label: 'Background',
          icon: 'fas fa-users',
          completionKey: 'background'
        },
        combat: {
          label: 'Combat',
          icon: 'fas fa-sword',
          completionKey: 'combat'
        },
        features: {
          label: 'Features',
          icon: 'fas fa-star',
          completionKey: 'features'
        }
      };
    }
  },
  methods: {
    selectTab(tabName) {
      this.$emit('tab-selected', tabName);
    },
    
    getSectionCompletionStatus(section) {
      switch (section) {
        case 'abilities':
          return this.completedSteps.includes(0) ? 'complete' : 'incomplete';
        case 'background':
          return this.completedSteps.includes(1) ? 'complete' : 'incomplete';
        case 'combat':
          return this.completedSteps.includes(2) ? 'complete' : 'incomplete';
        case 'features':
          return (this.completedSteps.includes(3) || this.completedSteps.includes(4)) ? 'complete' : 'incomplete';
        default:
          return 'incomplete';
      }
    },
    
    isTabComplete(tabKey) {
      const config = this.tabsConfig[tabKey];
      if (!config.completionKey) return false;
      return this.getSectionCompletionStatus(config.completionKey) === 'complete';
    }
  },
  template: `
    <div class="nav-tabs-container mb-3">
      <ul class="nav nav-tabs" role="tablist">
        <li 
          v-for="(config, tabKey) in tabsConfig" 
          :key="tabKey"
          v-show="relevantSections.includes(tabKey)"
          class="nav-item"
        >
          <button 
            class="nav-link position-relative"
            :class="{ 
              active: activeTab === tabKey,
              'text-success': isTabComplete(tabKey)
            }"
            @click="selectTab(tabKey)"
            type="button"
          >
            <i :class="config.icon + ' me-1'"></i>{{ config.label }}
            <i 
              v-if="isTabComplete(tabKey)" 
              class="fas fa-check-circle position-absolute top-0 start-100 translate-middle text-success small"
            ></i>
          </button>
        </li>
      </ul>
    </div>
  `,
  style: `
    <style scoped>
    .nav-tabs .nav-link {
      position: relative;
    }
    
    .nav-tabs .nav-link.text-success:not(.active) {
      border-color: var(--bs-success);
    }
    
    .nav-tabs .nav-link:hover {
      border-color: var(--bs-gray-300) var(--bs-gray-300) var(--bs-border-color);
    }
    
    .nav-tabs .nav-link.active {
      color: var(--bs-primary);
      background-color: var(--bs-body-bg);
      border-color: var(--bs-nav-tabs-border-color) var(--bs-nav-tabs-border-color) var(--bs-body-bg);
    }
    </style>
  `
});