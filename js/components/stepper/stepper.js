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
      currentStep: 2,
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
        // Save data based on current step
        if (this.currentStep === 0) {
          this.saveAbilityScores();
          // Emit event to update character sheet
          this.$emit('ability-scores-saved');
        } else if (this.currentStep === 1) {
          this.saveRaceData();
          // Emit event to update character sheet with race data
          this.$emit('race-data-saved');
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
    saveRaceData() {
      if (this.$refs.currentStepComponent && this.$refs.currentStepComponent.getRaceData) {
        const raceData = this.$refs.currentStepComponent.getRaceData();
        
        // Update ability scores with racial adjustments
        this.updateAbilityScoresWithRacialAdjustments(raceData);
        
        // Save basic info (race and favored classes)
        this.saveBasicInfo(raceData);
        
        // Save languages
        this.saveLanguages(raceData.languages);
        
        // Save racial traits
        this.saveRacialTraits(raceData.traits);
      }
    },
    updateAbilityScoresWithRacialAdjustments(raceData) {
      const savedScores = localStorage.getItem('currentAbilityScores');
      if (savedScores) {
        try {
          const abilityData = JSON.parse(savedScores);
          
          // Apply racial increases
          raceData.selectedIncreases.forEach(ability => {
            abilityData.scores[ability] = (abilityData.scores[ability] || 10) + 2;
          });
          
          // Apply racial decreases
          raceData.selectedDecreases.forEach(ability => {
            abilityData.scores[ability] = (abilityData.scores[ability] || 10) - 2;
          });
          
          localStorage.setItem('currentAbilityScores', JSON.stringify(abilityData));
        } catch (e) {
          console.warn('Error updating ability scores with racial adjustments:', e);
        }
      }
    },
    saveBasicInfo(raceData) {
      const basicInfo = {
        race: raceData.selectedRace,
        favoredClasses: raceData.selectedFavoredClasses
      };
      localStorage.setItem('currentBasicInfo', JSON.stringify(basicInfo));
    },
    saveLanguages(languages) {
      const details = {
        languages: languages
      };
      localStorage.setItem('currentDetails', JSON.stringify(details));
    },
    saveRacialTraits(raceTraits) {
      // Convert race traits to trait objects with Label and Description
      const traits = raceTraits.map(trait => {
        const colonIndex = trait.indexOf(':');
        if (colonIndex > -1) {
          return {
            Label: trait.substring(0, colonIndex).trim(),
            Description: trait.substring(colonIndex + 1).trim()
          };
        } else {
          return {
            Label: trait.trim(),
            Description: ''
          };
        }
      });
      
      const traitsData = {
        racialTraits: traits
      };
      localStorage.setItem('currentTraits', JSON.stringify(traitsData));
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