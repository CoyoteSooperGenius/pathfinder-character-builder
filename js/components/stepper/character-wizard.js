// Character Creation Wizard Component
// Handles the entire character creation workflow with stepper navigation and step content

Vue.component('character-wizard', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      currentStep: 1
    };
  },

  computed: {
    // Check if character creation step is complete
    isStepComplete() {
      return (step) => {
        switch (step) {
          case 1: return this.isAbilityScoresComplete();
          case 2: return this.isRaceComplete();
          case 3: return this.isClassComplete();
          case 4: return this.isSkillsComplete();
          case 5: return this.isFeatsComplete();
          case 6: return this.isEquipmentComplete();
          case 7: return this.isSpellsComplete();
          case 8: return this.isDetailsComplete();
          default: return false;
        }
      };
    },

    canGoNext() {
      return this.currentStep < 8 && this.isStepComplete(this.currentStep);
    },

    canGoPrevious() {
      return this.currentStep > 1;
    },

    canFinish() {
      return this.currentStep === 8 && this.isStepComplete(8);
    }
  },

  mounted() {
    // Set initial step based on character completion
    this.currentStep = this.getNextIncompleteStep();
  },

  methods: {
    // Navigation methods
    goToStep(stepNumber) {
      if (stepNumber >= 1 && stepNumber <= 8) {
        this.currentStep = stepNumber;
        this.$emit('step-changed', stepNumber);
      }
    },

    nextStep() {
      if (this.canGoNext) {
        this.currentStep++;
        this.$emit('step-changed', this.currentStep);
      } else if (this.canFinish) {
        this.completeCharacter();
      }
    },

    previousStep() {
      if (this.canGoPrevious) {
        this.currentStep--;
        this.$emit('step-changed', this.currentStep);
      }
    },

    completeCharacter() {
      this.$emit('character-complete');
    },

    getNextIncompleteStep() {
      for (let step = 1; step <= 8; step++) {
        if (!this.isStepComplete(step)) {
          return step;
        }
      }
      return 8; // If all steps are complete, go to final step
    },

    // Character data update handlers
    handleAbilityScoresChanged() {
      this.$emit('character-updated');
    },

    handleRaceChanged() {
      this.$emit('character-updated');
    },

    handleClassChanged() {
      this.$emit('character-updated');
    },

    handleSkillsChanged() {
      this.$emit('character-updated');
    },

    handleFeatsChanged() {
      this.$emit('character-updated');
    },

    handleEquipmentChanged() {
      this.$emit('character-updated');
    },

    handleSpellsChanged() {
      this.$emit('character-updated');
    },

    handleDetailsChanged() {
      this.$emit('character-updated');
    },

    // Step completion validation methods
    isAbilityScoresComplete() {
      if (!this.character.abilityScores) return false;
      return Object.values(this.character.abilityScores).every(score => GameUtils.isValidAbilityScore(score));
    },

    isRaceComplete() {
      return this.character.race !== null && this.character.race !== undefined;
    },

    isClassComplete() {
      return this.character.characterClass !== null && this.character.characterClass !== undefined;
    },

    isSkillsComplete() {
      return true; // Can be completed with 0 skills allocated
    },

    isFeatsComplete() {
      return true; // Can be completed with 0 feats selected
    },

    isEquipmentComplete() {
      return true; // Can be completed with starting equipment
    },

    isSpellsComplete() {
      return true; // Not all classes have spells
    },

    isDetailsComplete() {
      return this.character.name.first.trim().length > 0 && 
             this.character.name.last.trim().length > 0;
    }
  },

  template: `
    <div class="character-wizard">
      <!-- Main Layout: Stepper + Content -->
      <div class="row">
        <!-- Left Sidebar: Stepper Navigation -->
        <div class="col-lg-3 col-md-4">
          <div class="character-creation-stepper sticky-top">
            <simple-stepper 
              :current-step="currentStep"
              :character="character"
              :is-step-complete="isStepComplete"
              @step-changed="goToStep"
            ></simple-stepper>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-lg-9 col-md-8">
          <div class="character-creation-content">
            <!-- Step 1: Ability Scores -->
            <ability-scores-step 
              v-if="currentStep === 1"
              :character="character"
              @scores-changed="handleAbilityScoresChanged"
            ></ability-scores-step>

            <!-- Step 2: Race Selection -->
            <race-selection-step 
              v-else-if="currentStep === 2"
              :character="character"
              @race-changed="handleRaceChanged"
            ></race-selection-step>

            <!-- Step 3: Class Selection -->
            <class-selection-step 
              v-else-if="currentStep === 3"
              :character="character"
              @class-changed="handleClassChanged"
            ></class-selection-step>

            <!-- Step 4: Skills -->
            <skills-step 
              v-else-if="currentStep === 4"
              :character="character"
              @skills-changed="handleSkillsChanged"
            ></skills-step>

            <!-- Step 5: Feats -->
            <feats-step 
              v-else-if="currentStep === 5"
              :character="character"
              @feats-changed="handleFeatsChanged"
            ></feats-step>

            <!-- Step 6: Equipment -->
            <equipment-step 
              v-else-if="currentStep === 6"
              :character="character"
              @equipment-changed="handleEquipmentChanged"
            ></equipment-step>

            <!-- Step 7: Spells -->
            <spells-step 
              v-else-if="currentStep === 7"
              :character="character"
              @spells-changed="handleSpellsChanged"
            ></spells-step>

            <!-- Step 8: Character Details -->
            <character-details-step 
              v-else-if="currentStep === 8"
              :character="character"
              @details-changed="handleDetailsChanged"
            ></character-details-step>
          </div>

          <!-- Navigation Buttons -->
          <div class="d-flex justify-content-between mt-4 pt-3 border-top">
            <pf-button 
              variant="outline-secondary" 
              icon="fa-arrow-left"
              :disabled="!canGoPrevious"
              @click="previousStep"
            >
              Previous
            </pf-button>
            
            <pf-button 
              variant="primary" 
              :icon="currentStep === 8 ? 'fa-check' : 'fa-arrow-right'"
              :icon-position="currentStep === 8 ? 'left' : 'right'"
              :disabled="currentStep < 8 && !canGoNext"
              @click="nextStep"
            >
              {{ currentStep === 8 ? 'Complete Character' : 'Next' }}
            </pf-button>
          </div>
        </div>
      </div>
    </div>
  `
});