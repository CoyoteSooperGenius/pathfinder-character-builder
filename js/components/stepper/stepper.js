Vue.component('stepper', {
  template: `
    <div class="stepper">
      <div class="mb-4 text-center">
        <h2 class="fw-bold">{{ steps[currentStep].title }}</h2>
        <div class="progress my-3" style="height: 20px;">
          <div 
            class="progress-bar bg-primary" 
            role="progressbar" 
            :style="{ width: ((currentStep + 1) / steps.length * 100) + '%' }" 
            :aria-valuenow="currentStep + 1" 
            :aria-valuemin="1" 
            :aria-valuemax="steps.length">
            Step {{ currentStep + 1 }} of {{ steps.length }}
          </div>
        </div>
      </div>
      <div class="step-content mb-4">
        <component 
          :is="steps[currentStep].component" 
          @step-complete="onStepComplete"
          ref="currentStepComponent">
        </component>
      </div>
      <div class="d-flex justify-content-between">
        <button 
          v-if="currentStep > 0" 
          @click="prevStep" 
          class="btn btn-outline-secondary"
        >
          Back
        </button>
        <div class="flex-grow-1"></div>
        <button 
          v-if="currentStep < steps.length - 1" 
          @click="nextStep" 
          class="btn btn-primary"
          :disabled="!canProceed"
        >
          Next
        </button>
        <button 
          v-if="currentStep === steps.length - 1" 
          @click="finish" 
          class="btn btn-success"
        >
          Finish
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      currentStep: 0,
      canProceed: true,
      steps: [
        { title: 'Determine Ability Scores', component: 'step-ability-scores' },
        { title: 'Pick Your Race', component: 'step-race' },
        { title: 'Pick Your Class', component: 'step-class' },
        { title: 'Pick Skills', component: 'step-skills' },
        { title: 'Pick Feats', component: 'step-feats' },
        { title: 'Buy Equipment', component: 'step-equipment' },
        { title: 'Finishing Details', component: 'step-details' }
      ]
    };
  },
  methods: {
    onStepComplete(isComplete) {
      this.canProceed = isComplete;
    },
    nextStep() {
      if (this.currentStep < this.steps.length - 1 && this.canProceed) {
        // Save ability scores if we're leaving the ability scores step
        if (this.currentStep === 0) {
          this.saveAbilityScores();
        }
        this.currentStep++;
        this.canProceed = true; // Reset for next step
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.canProceed = this.currentStep > 0; // Allow going back except from ability scores
      }
    },
    saveAbilityScores() {
      if (this.$refs.currentStepComponent && this.$refs.currentStepComponent.getAbilityScores) {
        const abilityScores = this.$refs.currentStepComponent.getAbilityScores();
        localStorage.setItem('currentAbilityScores', JSON.stringify(abilityScores));
      }
    },
    finish() {
      this.$emit('finished');
    }
  },
  mounted() {
    // Start with Next disabled for ability scores step
    this.canProceed = false;
  }
});