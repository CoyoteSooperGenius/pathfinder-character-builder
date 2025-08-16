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
    <div class="simple-stepper" style="
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      border: 1px solid #dee2e6;
    ">
      <!-- Progress Overview -->
      <div class="stepper-progress mb-4">
        <div class="progress mb-2" style="height: 8px;">
          <div 
            class="progress-bar bg-success" 
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
      <div class="stepper-steps" style="position: relative;">
        <div 
          v-for="step in steps" 
          :key="step.number"
          :class="[
            'stepper-step', 
            'stepper-step-' + getStepStatus(step.number),
            { 'stepper-step-clickable': isStepAccessible(step.number) }
          ]"
          @click="goToStep(step.number)"
          style="position: relative; margin-bottom: 1.5rem;"
          :style="{ marginBottom: step.number === 9 ? '0' : '1.5rem' }"
        >
          <div 
            class="stepper-step-inner"
            :style="{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              background: getStepStatus(step.number) === 'current' ? 'rgba(13, 110, 253, 0.05)' :
                         getStepStatus(step.number) === 'completed' ? 'rgba(25, 135, 84, 0.05)' :
                         getStepStatus(step.number) === 'disabled' ? '#f8f9fa' : 'white',
              border: '2px solid ' + 
                      (getStepStatus(step.number) === 'current' ? '#0d6efd' :
                       getStepStatus(step.number) === 'completed' ? '#198754' : 'transparent'),
              boxShadow: getStepStatus(step.number) === 'current' ? '0 2px 8px rgba(13, 110, 253, 0.2)' : 'none',
              cursor: isStepAccessible(step.number) ? 'pointer' : 'default',
              opacity: getStepStatus(step.number) === 'disabled' ? '0.5' : '1'
            }"
          >
            <!-- Step Number/Icon -->
            <div 
              class="stepper-step-icon"
              :style="{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                flexShrink: '0',
                marginRight: '1rem',
                background: getStepStatus(step.number) === 'current' ? '#0d6efd' :
                           getStepStatus(step.number) === 'completed' ? '#198754' : '#e9ecef',
                color: (getStepStatus(step.number) === 'current' || getStepStatus(step.number) === 'completed') ? 'white' : '#6c757d',
                border: (getStepStatus(step.number) === 'accessible' || getStepStatus(step.number) === 'disabled') ? '2px solid #dee2e6' : 'none'
              }"
            >
              <i v-if="isStepComplete(step.number)" class="fas fa-check"></i>
              <i v-else-if="step.number === currentStep" :class="['fas', step.icon]"></i>
              <span v-else style="font-size: 0.9rem; font-weight: 600;">{{ step.number }}</span>
            </div>
            
            <!-- Step Content -->
            <div class="stepper-step-content" style="flex-grow: 1;">
              <div 
                class="stepper-step-name"
                :style="{
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  marginBottom: '0.25rem',
                  color: getStepStatus(step.number) === 'current' ? '#0d6efd' :
                         getStepStatus(step.number) === 'completed' ? '#198754' : '#212529'
                }"
              >
                {{ step.name }}
              </div>
              <div 
                class="stepper-step-description d-none d-md-block"
                style="font-size: 0.8rem; color: #6c757d; line-height: 1.2;"
              >
                {{ step.description }}
              </div>
            </div>
          </div>
          
          <!-- Connector Line -->
          <div 
            v-if="step.number < 8" 
            class="stepper-step-connector"
            :style="{
              position: 'absolute',
              left: '1.5rem',
              top: 'calc(100% - 1.5rem)',
              width: '2px',
              height: '1.5rem',
              background: isStepComplete(step.number) ? '#198754' : '#dee2e6',
              transform: 'translateX(-50%)'
            }"
          ></div>
        </div>
      </div>
    </div>
  `
});