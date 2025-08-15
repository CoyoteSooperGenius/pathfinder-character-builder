// Character Creation Stepper Component
// Navigation component for the 9-step character creation wizard

Vue.component('character-stepper', {
  props: {
    currentStep: {
      type: Number,
      required: true,
      validator: (value) => value >= 1 && value <= 9
    },
    character: {
      type: Object,
      required: true
    },
    allowSkipping: {
      type: Boolean,
      default: false
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    vertical: {
      type: Boolean,
      default: false
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      steps: [
        { 
          number: 1, 
          name: 'Ability Scores', 
          icon: 'fa-dumbbell',
          description: 'Determine your character\'s six ability scores'
        },
        { 
          number: 2, 
          name: 'Concept', 
          icon: 'fa-lightbulb',
          description: 'Define your character\'s background and personality'
        },
        { 
          number: 3, 
          name: 'Race', 
          icon: 'fa-users',
          description: 'Choose your character\'s race and racial traits'
        },
        { 
          number: 4, 
          name: 'Class', 
          icon: 'fa-sword',
          description: 'Select your character\'s class and features'
        },
        { 
          number: 5, 
          name: 'Skills', 
          icon: 'fa-tools',
          description: 'Allocate skill points and select proficiencies'
        },
        { 
          number: 6, 
          name: 'Feats', 
          icon: 'fa-star',
          description: 'Choose feats to customize your character'
        },
        { 
          number: 7, 
          name: 'Equipment', 
          icon: 'fa-shield-alt',
          description: 'Select starting equipment and gear'
        },
        { 
          number: 8, 
          name: 'Spells', 
          icon: 'fa-magic',
          description: 'Choose spells if your class can cast them'
        },
        { 
          number: 9, 
          name: 'Details', 
          icon: 'fa-id-card',
          description: 'Add personal details and finalize character'
        }
      ]
    };
  },
  
  computed: {
    progressPercentage() {
      return Math.round(((this.currentStep - 1) / 8) * 100);
    },
    
    canGoNext() {
      return this.currentStep < 9 && (this.allowSkipping || this.isStepComplete(this.currentStep));
    },
    
    canGoPrevious() {
      return this.currentStep > 1;
    },
    
    canFinish() {
      return this.currentStep === 9 && this.isStepComplete(9);
    }
  },
  
  methods: {
    isStepComplete(stepNumber) {
      switch (stepNumber) {
        case 1: return this.isAbilityScoresComplete();
        case 2: return this.isConceptComplete();
        case 3: return this.isRaceComplete();
        case 4: return this.isClassComplete();
        case 5: return this.isSkillsComplete();
        case 6: return this.isFeatsComplete();
        case 7: return this.isEquipmentComplete();
        case 8: return this.isSpellsComplete();
        case 9: return this.isDetailsComplete();
        default: return false;
      }
    },
    
    isStepAccessible(stepNumber) {
      if (this.allowSkipping) return true;
      
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
    
    getStepClasses(stepNumber) {
      const status = this.getStepStatus(stepNumber);
      const classes = ['step'];
      
      if (this.vertical) {
        classes.push('step-vertical');
      } else {
        classes.push('step-horizontal');
      }
      
      classes.push(`step-${status}`);
      
      if (this.isStepAccessible(stepNumber)) {
        classes.push('step-clickable');
      }
      
      return classes.join(' ');
    },
    
    getStepIcon(stepNumber) {
      const step = this.steps[stepNumber - 1];
      const status = this.getStepStatus(stepNumber);
      
      if (status === 'completed') {
        return 'fa-check-circle';
      } else if (status === 'current') {
        return step.icon;
      } else {
        return step.icon;
      }
    },
    
    goToStep(stepNumber) {
      if (this.isStepAccessible(stepNumber) && stepNumber !== this.currentStep) {
        this.$emit('step-changed', stepNumber);
      }
    },
    
    nextStep() {
      if (this.canGoNext) {
        this.$emit('step-changed', this.currentStep + 1);
      } else if (this.currentStep === 9) {
        this.finishCharacter();
      }
    },
    
    previousStep() {
      if (this.canGoPrevious) {
        this.$emit('step-changed', this.currentStep - 1);
      }
    },
    
    finishCharacter() {
      this.$emit('character-complete');
    },
    
    // Step completion methods (simplified)
    isAbilityScoresComplete() {
      return this.character.abilityScores && 
             Object.values(this.character.abilityScores).every(score => GameUtils.isValidAbilityScore(score));
    },
    
    isConceptComplete() {
      return this.character.concept && this.character.concept.trim().length > 0;
    },
    
    isRaceComplete() {
      return this.character.race !== null && this.character.race !== undefined;
    },
    
    isClassComplete() {
      return this.character.characterClass !== null && this.character.characterClass !== undefined;
    },
    
    isSkillsComplete() {
      return true; // Can be completed with 0 skills
    },
    
    isFeatsComplete() {
      return true; // Can be completed with 0 feats
    },
    
    isEquipmentComplete() {
      return true; // Can be completed with starting equipment
    },
    
    isSpellsComplete() {
      return true; // Not all classes have spells
    },
    
    isDetailsComplete() {
      return this.character.name && 
             this.character.name.first && 
             this.character.name.first.trim().length > 0 &&
             this.character.name.last && 
             this.character.name.last.trim().length > 0;
    }
  },
  
  template: `
    <div class="character-stepper">
      <!-- Progress Bar -->
      <div v-if="showProgress && !vertical" class="progress-container mb-4">
        <div class="progress">
          <div 
            class="progress-bar bg-success" 
            role="progressbar" 
            :style="{ width: progressPercentage + '%' }"
            :aria-valuenow="progressPercentage"
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
        <div class="mt-2 d-flex justify-content-between">
          <small class="text-muted">Step {{ currentStep }} of 9</small>
          <small class="text-muted">{{ progressPercentage }}% Complete</small>
        </div>
      </div>
      
      <!-- Steps Navigation -->
      <div :class="vertical ? 'steps-vertical' : 'steps-horizontal'">
        <div 
          v-for="step in steps" 
          :key="step.number"
          :class="getStepClasses(step.number)"
          @click="goToStep(step.number)"
        >
          <!-- Step Circle -->
          <div class="step-circle">
            <i :class="['fas', getStepIcon(step.number)]"></i>
          </div>
          
          <!-- Step Content -->
          <div v-if="!compact" class="step-content">
            <div class="step-title">{{ step.name }}</div>
            <div v-if="!vertical" class="step-description">{{ step.description }}</div>
          </div>
          
          <!-- Step Connector (for horizontal layout) -->
          <div v-if="!vertical && step.number < 9" class="step-connector"></div>
        </div>
      </div>
      
      <!-- Navigation Buttons -->
      <div class="navigation-buttons mt-4">
        <div class="d-flex justify-content-between">
          <pf-button 
            variant="outline-secondary"
            :disabled="!canGoPrevious"
            @click="previousStep"
            icon="fa-arrow-left"
          >
            Previous
          </pf-button>
          
          <div class="step-info text-center flex-grow-1 mx-3">
            <h5 class="mb-1">{{ steps[currentStep - 1].name }}</h5>
            <p class="text-muted small mb-0">{{ steps[currentStep - 1].description }}</p>
          </div>
          
          <pf-button 
            v-if="currentStep < 9"
            variant="primary"
            :disabled="!canGoNext"
            @click="nextStep"
            icon="fa-arrow-right"
            icon-position="right"
          >
            Next
          </pf-button>
          
          <pf-button 
            v-else
            variant="success"
            :disabled="!canFinish"
            @click="finishCharacter"
            icon="fa-check"
          >
            Complete Character
          </pf-button>
        </div>
      </div>
    </div>
    
    <!-- Custom CSS -->
    <style scoped>
    .character-stepper {
      width: 100%;
    }
    
    .steps-horizontal {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
    }
    
    .steps-vertical {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .step {
      display: flex;
      align-items: center;
      position: relative;
      flex: 1;
    }
    
    .step-horizontal {
      flex-direction: column;
      text-align: center;
      min-width: 100px;
    }
    
    .step-vertical {
      flex-direction: row;
      text-align: left;
    }
    
    .step-clickable {
      cursor: pointer;
    }
    
    .step-clickable:hover .step-circle {
      transform: scale(1.1);
      transition: transform 0.2s;
    }
    
    .step-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      border: 2px solid;
      transition: all 0.3s;
      z-index: 2;
      position: relative;
    }
    
    .step-completed .step-circle {
      background-color: #198754;
      border-color: #198754;
      color: white;
    }
    
    .step-current .step-circle {
      background-color: #0d6efd;
      border-color: #0d6efd;
      color: white;
      animation: pulse 2s infinite;
    }
    
    .step-accessible .step-circle {
      background-color: white;
      border-color: #6c757d;
      color: #6c757d;
    }
    
    .step-disabled .step-circle {
      background-color: #f8f9fa;
      border-color: #dee2e6;
      color: #dee2e6;
    }
    
    .step-content {
      margin-top: 0.5rem;
    }
    
    .step-vertical .step-content {
      margin-top: 0;
      margin-left: 1rem;
    }
    
    .step-title {
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.2;
    }
    
    .step-description {
      font-size: 0.75rem;
      color: #6c757d;
      margin-top: 0.25rem;
      line-height: 1.2;
    }
    
    .step-connector {
      position: absolute;
      top: 20px;
      left: 50%;
      width: 100%;
      height: 2px;
      background-color: #dee2e6;
      z-index: 1;
    }
    
    .step-completed + .step .step-connector {
      background-color: #198754;
    }
    
    .navigation-buttons {
      border-top: 1px solid #dee2e6;
      padding-top: 1rem;
    }
    
    .step-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(13, 110, 253, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(13, 110, 253, 0);
      }
    }
    
    @media (max-width: 768px) {
      .steps-horizontal {
        flex-wrap: wrap;
        gap: 1rem;
      }
      
      .step-horizontal {
        min-width: 80px;
        flex: 1 1 calc(33.333% - 1rem);
      }
      
      .step-connector {
        display: none;
      }
      
      .step-description {
        display: none;
      }
    }
    </style>
  `
});