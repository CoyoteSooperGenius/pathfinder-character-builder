// Simple Character Creation Stepper Component
// Clean, vertical sidebar navigation for character creation steps

Vue.component('simple-stepper', {
  props: {
    currentStep: {
      type: Number,
      required: true,
      validator: (value) => value >= 1 && value <= 8
    },
    character: {
      type: Object,
      required: true
    },
    isStepComplete: {
      type: Function,
      required: true
    }
  },
  
  data() {
    return {
      steps: [
        { 
          number: 1, 
          name: 'Ability Scores', 
          icon: 'fa-fist-raised',
          description: 'STR, DEX, CON, INT, WIS, CHA'
        },
        { 
          number: 2, 
          name: 'Race', 
          icon: 'fa-users',
          description: 'Racial traits & bonuses'
        },
        { 
          number: 3, 
          name: 'Class', 
          icon: 'fa-shield-alt',
          description: 'Class features & abilities'
        },
        { 
          number: 4, 
          name: 'Skills', 
          icon: 'fa-tools',
          description: 'Skill points & training'
        },
        { 
          number: 5, 
          name: 'Feats', 
          icon: 'fa-star',
          description: 'Special abilities'
        },
        { 
          number: 6, 
          name: 'Equipment', 
          icon: 'fa-sword',
          description: 'Gear & weapons'
        },
        { 
          number: 7, 
          name: 'Spells', 
          icon: 'fa-magic',
          description: 'Spellcasting (if applicable)'
        },
        { 
          number: 8, 
          name: 'Details', 
          icon: 'fa-id-card',
          description: 'Name, appearance, and background'
        }
      ]
    };
  },
  
  computed: {
    progressPercentage() {
      let completed = 0;
      for (let i = 1; i <= 8; i++) {
        if (this.isStepComplete(i)) completed++;
      }
      return Math.round((completed / 8) * 100);
    },
    
    completedSteps() {
      let count = 0;
      for (let i = 1; i <= 8; i++) {
        if (this.isStepComplete(i)) count++;
      }
      return count;
    }
  },
  
  methods: {
    
    isStepAccessible(stepNumber) {
      // Can access current step or any completed step
      if (stepNumber <= this.currentStep) return true;
      
      // Can access next step if current step is complete
      return stepNumber === this.currentStep + 1 && this.isStepComplete(this.currentStep);
    },
    
    getStepStatus(stepNumber) {
      if (this.isStepComplete(stepNumber)) {
        return 'completed';
      } else if (stepNumber === this.currentStep) {
        return 'current';
      } else if (this.isStepAccessible(stepNumber)) {
        return 'accessible';
      } else {
        return 'disabled';
      }
    },
    
    goToStep(stepNumber) {
      if (this.isStepAccessible(stepNumber) && stepNumber !== this.currentStep) {
        this.$emit('step-changed', stepNumber);
      }
    }
  },
  
  template: `
    <div class="pf-stepper pf-stepper--rail">
      <!-- Progress Overview -->
      <div class="mb-3">
        <div class="pf-progress mb-2">
          <div
            class="pf-progress__bar pf-progress__bar--success"
            role="progressbar"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="d-flex justify-content-between">
          <small class="text-muted">{{ completedSteps }} of 8 complete</small>
          <small class="text-muted">{{ progressPercentage }}%</small>
        </div>
      </div>

      <!-- Steps List -->
      <div class="pf-stepper__steps">
        <div
          v-for="step in steps"
          :key="step.number"
          :class="[
            'pf-stepper__step',
            'pf-stepper__step--' + getStepStatus(step.number),
            { 'pf-stepper__step--clickable': isStepAccessible(step.number) }
          ]"
          @click="goToStep(step.number)"
        >
          <div class="pf-stepper__icon">
            <i v-if="isStepComplete(step.number)" class="fas fa-check"></i>
            <i v-else-if="step.number === currentStep" :class="['fas', step.icon]"></i>
            <span v-else>{{ step.number }}</span>
          </div>
          <div>
            <div class="pf-stepper__name">{{ step.name }}</div>
            <div class="pf-stepper__desc">{{ step.description }}</div>
          </div>
        </div>
      </div>

      <!-- Current step callout, shown only in the horizontal mobile mode -->
      <div class="pf-stepper__current-label">
        Step {{ currentStep }} of 8 — {{ steps[currentStep - 1].name }}
      </div>
    </div>
  `
});