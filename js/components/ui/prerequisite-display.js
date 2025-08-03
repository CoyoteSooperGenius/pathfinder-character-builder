Vue.component('prerequisite-display', {
  props: {
    // Array of prerequisite objects
    prerequisites: {
      type: Array,
      default: () => []
    },
    // Display mode: 'list', 'compact', 'detailed', 'inline'
    mode: {
      type: String,
      default: 'list',
      validator: value => ['list', 'compact', 'detailed', 'inline'].includes(value)
    },
    // Whether to show status icons (met/unmet)
    showStatus: {
      type: Boolean,
      default: true
    },
    // Whether to show only unmet prerequisites
    showOnlyUnmet: {
      type: Boolean,
      default: false
    },
    // Override character data for checking
    characterData: {
      type: Object,
      default: null
    },
    // Custom title for the prerequisites section
    title: {
      type: String,
      default: 'Prerequisites'
    },
    // Whether to show the title
    showTitle: {
      type: Boolean,
      default: true
    },
    // Size variant: 'small', 'normal', 'large'
    size: {
      type: String,
      default: 'normal',
      validator: value => ['small', 'normal', 'large'].includes(value)
    },
    // Custom CSS classes
    customClasses: {
      type: String,
      default: ''
    },
    // Whether to show the "No prerequisites" message
    showNoPrerequisites: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // Get character data for prerequisite checking
    characterDataForChecking() {
      return this.characterData || PrerequisiteChecker.getCharacterData();
    },
    
    // Enhanced prerequisites with status
    prerequisitesWithStatus() {
      return this.prerequisites.map(prereq => {
        const meets = PrerequisiteChecker.meetsPrerequisite(prereq, this.characterDataForChecking);
        return {
          ...prereq,
          meets,
          formatted: PrerequisiteChecker.formatPrerequisite(prereq),
          statusIcon: meets ? 'fas fa-check-circle' : 'fas fa-times-circle',
          statusClass: meets ? 'text-success' : 'text-danger'
        };
      });
    },
    
    // Filtered prerequisites based on showOnlyUnmet
    displayedPrerequisites() {
      if (this.showOnlyUnmet) {
        return this.prerequisitesWithStatus.filter(prereq => !prereq.meets);
      }
      return this.prerequisitesWithStatus;
    },
    
    // Check if all prerequisites are met
    allPrerequisitesMet() {
      return this.prerequisitesWithStatus.every(prereq => prereq.meets);
    },
    
    // Count of unmet prerequisites
    unmetCount() {
      return this.prerequisitesWithStatus.filter(prereq => !prereq.meets).length;
    },
    
    // CSS classes for the component
    componentClasses() {
      const classes = ['prerequisite-display'];
      
      if (this.size !== 'normal') {
        classes.push(`prerequisite-display-${this.size}`);
      }
      
      if (this.mode !== 'list') {
        classes.push(`prerequisite-display-${this.mode}`);
      }
      
      if (this.customClasses) {
        classes.push(this.customClasses);
      }
      
      return classes.join(' ');
    },
    
    // Icon for the title
    titleIcon() {
      if (this.prerequisites.length === 0) {
        return 'fas fa-check-circle text-success';
      }
      return this.allPrerequisitesMet ? 'fas fa-check-circle text-success' : 'fas fa-list-check text-muted';
    }
  },
  methods: {
    // Format prerequisite description with enhanced details
    getPrerequisiteDescription(prereq) {
      const baseDesc = prereq.formatted;
      
      if (this.mode === 'detailed') {
        // Add additional context for detailed mode
        switch (prereq.type) {
          case 'ability':
            const currentScore = this.characterDataForChecking.abilityScores[prereq.ability] || 10;
            return `${baseDesc} (Current: ${currentScore})`;
          case 'bab':
            const currentBab = this.characterDataForChecking.bab || 0;
            return `${baseDesc} (Current: +${currentBab})`;
          case 'level':
            const currentLevel = this.characterDataForChecking.level || 1;
            return `${baseDesc} (Current: ${currentLevel})`;
          case 'skill':
            const skillRanks = this.characterDataForChecking.skills?.[prereq.skill] || 0;
            return `${baseDesc} (Current: ${skillRanks} ranks)`;
          default:
            return baseDesc;
        }
      }
      
      return baseDesc;
    },
    
    // Get tooltip text for prerequisites
    getTooltip(prereq) {
      if (!prereq.meets) {
        return `Requirement not met: ${prereq.formatted}`;
      }
      return `Requirement met: ${prereq.formatted}`;
    }
  },
  template: `
    <div :class="componentClasses">
      <!-- Title Section -->
      <div v-if="showTitle && (prerequisites.length > 0 || showNoPrerequisites)" class="prerequisite-title mb-2">
        <h6 :class="size === 'small' ? 'small fw-bold mb-1' : 'fw-bold mb-2'">
          <i :class="titleIcon + ' me-1'"></i>{{ title }}:
          <span v-if="prerequisites.length > 0 && showStatus" class="ms-2">
            <small :class="allPrerequisitesMet ? 'text-success' : 'text-warning'">
              {{ allPrerequisitesMet ? 'All met' : unmetCount + ' unmet' }}
            </small>
          </span>
        </h6>
      </div>
      
      <!-- No Prerequisites Message -->
      <div v-if="prerequisites.length === 0 && showNoPrerequisites" class="no-prerequisites">
        <span :class="size === 'small' ? 'small text-success' : 'text-success'">
          <i class="fas fa-check me-1"></i>None
        </span>
      </div>
      
      <!-- Prerequisites Content -->
      <div v-else-if="displayedPrerequisites.length > 0">
        <!-- List Mode -->
        <ul v-if="mode === 'list'" :class="size === 'small' ? 'list-unstyled small mb-0' : 'list-unstyled mb-0'">
          <li 
            v-for="prereq in displayedPrerequisites" 
            :key="prereq.type + prereq.ability + prereq.value + prereq.feat + prereq.skill"
            class="d-flex align-items-center mb-1"
            :title="showStatus ? getTooltip(prereq) : ''"
          >
            <i v-if="showStatus" :class="prereq.statusIcon + ' me-2 ' + prereq.statusClass"></i>
            <span>{{ getPrerequisiteDescription(prereq) }}</span>
          </li>
        </ul>
        
        <!-- Compact Mode -->
        <div v-else-if="mode === 'compact'" :class="size === 'small' ? 'small' : ''">
          <span v-if="showStatus" class="me-2">
            <i :class="allPrerequisitesMet ? 'fas fa-check text-success' : 'fas fa-times text-danger'"></i>
          </span>
          <span class="text-muted">
            {{ prerequisites.length }} requirement{{ prerequisites.length > 1 ? 's' : '' }}
            <span v-if="!allPrerequisitesMet && showStatus"> ({{ unmetCount }} unmet)</span>
          </span>
        </div>
        
        <!-- Inline Mode -->
        <div v-else-if="mode === 'inline'" :class="size === 'small' ? 'small' : ''">
          <span 
            v-for="(prereq, index) in displayedPrerequisites" 
            :key="prereq.type + prereq.ability + prereq.value + prereq.feat + prereq.skill"
            :title="showStatus ? getTooltip(prereq) : ''"
          >
            <i v-if="showStatus" :class="prereq.statusIcon + ' me-1 ' + prereq.statusClass"></i>
            <span>{{ getPrerequisiteDescription(prereq) }}</span>
            <span v-if="index < displayedPrerequisites.length - 1" class="text-muted mx-1">•</span>
          </span>
        </div>
        
        <!-- Detailed Mode -->
        <div v-else-if="mode === 'detailed'" class="detailed-prerequisites">
          <div 
            v-for="prereq in displayedPrerequisites"
            :key="prereq.type + prereq.ability + prereq.value + prereq.feat + prereq.skill"
            :class="[
              'prerequisite-item p-2 mb-2 border rounded',
              prereq.meets ? 'border-success bg-light' : 'border-danger bg-light'
            ]"
          >
            <div class="d-flex align-items-center">
              <i v-if="showStatus" :class="prereq.statusIcon + ' me-2 ' + prereq.statusClass"></i>
              <div class="flex-grow-1">
                <div :class="size === 'small' ? 'small fw-semibold' : 'fw-semibold'">
                  {{ getPrerequisiteDescription(prereq) }}
                </div>
                <div v-if="!prereq.meets" :class="size === 'small' ? 'small text-danger' : 'small text-danger'">
                  This requirement is not currently met.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Show Only Unmet Message -->
      <div v-else-if="showOnlyUnmet && unmetCount === 0" class="all-met-message">
        <span :class="size === 'small' ? 'small text-success' : 'text-success'">
          <i class="fas fa-check-circle me-1"></i>All requirements met
        </span>
      </div>
    </div>
  `,
  style: `
    <style scoped>
    .prerequisite-display {
      /* Base styling */
    }
    
    .prerequisite-display-small {
      font-size: 0.875rem;
    }
    
    .prerequisite-display-large .prerequisite-title h6 {
      font-size: 1.1rem;
    }
    
    .prerequisite-display-compact {
      display: inline-block;
    }
    
    .prerequisite-display-inline {
      display: inline-block;
    }
    
    .prerequisite-item {
      transition: all 0.2s ease;
    }
    
    .prerequisite-item:hover {
      transform: translateY(-1px);
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .no-prerequisites,
    .all-met-message {
      font-style: italic;
    }
    
    @media (max-width: 768px) {
      .prerequisite-display-detailed .prerequisite-item {
        padding: 0.5rem;
      }
    }
    </style>
  `
});