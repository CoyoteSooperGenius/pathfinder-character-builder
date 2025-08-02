Vue.component('progress-indicator', {
  props: {
    // Current progress value
    current: {
      type: Number,
      default: 0
    },
    // Maximum value (for percentage calculation)
    max: {
      type: Number,
      default: 100
    },
    // Minimum value 
    min: {
      type: Number,
      default: 0
    },
    // Display mode for the indicator
    mode: {
      type: String,
      default: 'bar', // 'bar', 'circle', 'steps', 'badge', 'icon'
      validator: value => ['bar', 'circle', 'steps', 'badge', 'icon'].includes(value)
    },
    // Size variant
    size: {
      type: String,
      default: 'medium', // 'small', 'medium', 'large'
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    // Color variant
    variant: {
      type: String,
      default: 'primary', // 'primary', 'success', 'warning', 'danger', 'info'
      validator: value => ['primary', 'success', 'warning', 'danger', 'info', 'secondary'].includes(value)
    },
    // Show percentage text
    showPercentage: {
      type: Boolean,
      default: false
    },
    // Show current/max text
    showFraction: {
      type: Boolean,
      default: false
    },
    // Custom label text
    label: {
      type: String,
      default: ''
    },
    // For steps mode - array of step labels
    steps: {
      type: Array,
      default: () => []
    },
    // For steps mode - which steps are completed
    completedSteps: {
      type: Array,
      default: () => []
    },
    // Whether progress is indeterminate (loading)
    indeterminate: {
      type: Boolean,
      default: false
    },
    // Custom CSS classes
    customClasses: {
      type: String,
      default: ''
    },
    // Whether to animate progress changes
    animated: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // Calculate percentage (0-100)
    percentage() {
      if (this.max <= this.min) return 0;
      const range = this.max - this.min;
      const value = Math.max(this.min, Math.min(this.max, this.current));
      return Math.round(((value - this.min) / range) * 100);
    },
    
    // Get appropriate Bootstrap classes
    progressBarClasses() {
      const classes = ['progress-bar'];
      
      if (this.variant !== 'primary') {
        classes.push(`bg-${this.variant}`);
      }
      
      if (this.animated && !this.indeterminate) {
        classes.push('progress-bar-animated');
      }
      
      if (this.indeterminate) {
        classes.push('progress-bar-striped', 'progress-bar-animated');
      }
      
      return classes.join(' ');
    },
    
    // Get size-specific classes
    sizeClasses() {
      const sizeMap = {
        small: { height: '8px', fontSize: '0.75rem' },
        medium: { height: '20px', fontSize: '0.875rem' },
        large: { height: '32px', fontSize: '1rem' }
      };
      return sizeMap[this.size] || sizeMap.medium;
    },
    
    // Badge classes
    badgeClasses() {
      return `badge bg-${this.variant} ${this.customClasses}`;
    },
    
    // Icon for completion status
    statusIcon() {
      if (this.percentage >= 100) {
        return 'fas fa-check-circle';
      } else if (this.percentage >= 50) {
        return 'fas fa-clock';
      } else if (this.percentage > 0) {
        return 'fas fa-play-circle';
      } else {
        return 'far fa-circle';
      }
    },
    
    // Status color for icons
    statusColor() {
      if (this.percentage >= 100) {
        return 'text-success';
      } else if (this.percentage >= 50) {
        return 'text-warning';
      } else if (this.percentage > 0) {
        return 'text-primary';
      } else {
        return 'text-muted';
      }
    },
    
    // Formatted text for display
    displayText() {
      if (this.label) {
        return this.label;
      } else if (this.showFraction) {
        return `${this.current} / ${this.max}`;
      } else if (this.showPercentage) {
        return `${this.percentage}%`;
      }
      return '';
    }
  },
  methods: {
    // Check if a step is completed
    isStepCompleted(stepIndex) {
      return this.completedSteps.includes(stepIndex);
    },
    
    // Check if a step is current
    isStepCurrent(stepIndex) {
      return stepIndex === this.current;
    },
    
    // Get step classes
    getStepClasses(stepIndex) {
      const classes = ['step-item'];
      
      if (this.isStepCompleted(stepIndex)) {
        classes.push('completed');
      } else if (this.isStepCurrent(stepIndex)) {
        classes.push('current');
      } else {
        classes.push('pending');
      }
      
      return classes.join(' ');
    }
  },
  template: `
    <div class="progress-indicator" :class="customClasses">
      <!-- Progress Bar Mode -->
      <div v-if="mode === 'bar'" class="progress-bar-container">
        <div 
          class="progress" 
          :style="{ height: sizeClasses.height }"
        >
          <div 
            :class="progressBarClasses"
            role="progressbar" 
            :style="{ width: indeterminate ? '100%' : percentage + '%' }"
            :aria-valuenow="current" 
            :aria-valuemin="min" 
            :aria-valuemax="max"
          >
            <span v-if="displayText && size !== 'small'" :style="{ fontSize: sizeClasses.fontSize }">
              {{ displayText }}
            </span>
          </div>
        </div>
        <div v-if="displayText && size === 'small'" class="mt-1 small text-center">
          {{ displayText }}
        </div>
      </div>
      
      <!-- Circle Mode -->
      <div v-else-if="mode === 'circle'" class="circle-progress d-flex align-items-center justify-content-center">
        <div class="position-relative">
          <svg 
            :width="size === 'small' ? 40 : size === 'large' ? 80 : 60" 
            :height="size === 'small' ? 40 : size === 'large' ? 80 : 60"
            class="circular-progress"
          >
            <!-- Background circle -->
            <circle
              :cx="size === 'small' ? 20 : size === 'large' ? 40 : 30"
              :cy="size === 'small' ? 20 : size === 'large' ? 40 : 30"
              :r="size === 'small' ? 16 : size === 'large' ? 32 : 24"
              fill="none"
              stroke="#e9ecef"
              :stroke-width="size === 'small' ? 3 : 4"
            />
            <!-- Progress circle -->
            <circle
              :cx="size === 'small' ? 20 : size === 'large' ? 40 : 30"
              :cy="size === 'small' ? 20 : size === 'large' ? 40 : 30"
              :r="size === 'small' ? 16 : size === 'large' ? 32 : 24"
              fill="none"
              :stroke="variant === 'primary' ? '#0d6efd' : variant === 'success' ? '#198754' : '#ffc107'"
              :stroke-width="size === 'small' ? 3 : 4"
              stroke-linecap="round"
              :stroke-dasharray="(size === 'small' ? 100 : size === 'large' ? 200 : 150)"
              :stroke-dashoffset="(size === 'small' ? 100 : size === 'large' ? 200 : 150) * (1 - percentage / 100)"
              :class="animated ? 'progress-animation' : ''"
            />
          </svg>
          <div 
            class="position-absolute top-50 start-50 translate-middle text-center"
            :style="{ fontSize: size === 'small' ? '0.7rem' : size === 'large' ? '1.1rem' : '0.9rem' }"
          >
            {{ displayText || percentage + '%' }}
          </div>
        </div>
      </div>
      
      <!-- Steps Mode -->
      <div v-else-if="mode === 'steps'" class="steps-progress">
        <div class="steps-container d-flex align-items-center">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="step-wrapper d-flex align-items-center"
          >
            <!-- Step circle -->
            <div :class="getStepClasses(index)" class="step-circle d-flex align-items-center justify-content-center">
              <i v-if="isStepCompleted(index)" class="fas fa-check text-white"></i>
              <span v-else-if="isStepCurrent(index)" class="text-white fw-bold">{{ index + 1 }}</span>
              <span v-else class="text-muted">{{ index + 1 }}</span>
            </div>
            
            <!-- Step label -->
            <div v-if="step" class="step-label ms-2" :class="isStepCurrent(index) ? 'fw-bold' : ''">
              {{ step }}
            </div>
            
            <!-- Connector line -->
            <div 
              v-if="index < steps.length - 1" 
              class="step-connector mx-3"
              :class="isStepCompleted(index) ? 'completed' : 'pending'"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- Badge Mode -->
      <div v-else-if="mode === 'badge'" class="badge-progress">
        <span :class="badgeClasses">
          {{ displayText || (percentage + '%') }}
        </span>
      </div>
      
      <!-- Icon Mode -->
      <div v-else-if="mode === 'icon'" class="icon-progress d-flex align-items-center">
        <i :class="statusIcon + ' ' + statusColor" :style="{ fontSize: sizeClasses.fontSize }"></i>
        <span v-if="displayText" class="ms-2">{{ displayText }}</span>
      </div>
    </div>
  `,
  style: `
    <style scoped>
    .circular-progress {
      transform: rotate(-90deg);
    }
    
    .progress-animation {
      transition: stroke-dashoffset 0.5s ease-in-out;
    }
    
    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid;
    }
    
    .step-item.completed .step-circle {
      background-color: var(--bs-success);
      border-color: var(--bs-success);
    }
    
    .step-item.current .step-circle {
      background-color: var(--bs-primary);
      border-color: var(--bs-primary);
    }
    
    .step-item.pending .step-circle {
      background-color: transparent;
      border-color: var(--bs-secondary);
    }
    
    .step-connector {
      height: 2px;
      min-width: 20px;
      background-color: var(--bs-secondary);
    }
    
    .step-connector.completed {
      background-color: var(--bs-success);
    }
    
    .steps-container {
      flex-wrap: wrap;
    }
    
    @media (max-width: 768px) {
      .steps-container {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .step-wrapper {
        margin-bottom: 1rem;
      }
      
      .step-connector {
        display: none;
      }
    }
    </style>
  `
});