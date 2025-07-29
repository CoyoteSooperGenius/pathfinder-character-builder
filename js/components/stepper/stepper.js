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
        <component :is="steps[currentStep].component"></component>
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
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    finish() {
      this.$emit('finished');
    }
  }
});