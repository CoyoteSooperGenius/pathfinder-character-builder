// Character Summary Component
// Displays current character state and progress through creation steps

Vue.component('character-summary', {
  props: {
    character: {
      type: Object,
      required: true
    },
    currentStep: {
      type: Number,
      default: 1
    },
    // Optional completion source: the wizard passes its own isStepComplete
    // (same pattern as simple-stepper) so the panel matches the stepper
    // exactly; standalone usages fall back to the simplified checks below
    isStepComplete: {
      type: Function,
      default: null
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    showDetails: {
      type: Boolean,
      default: true
    },
    compact: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    characterName() {
      return GameUtils.getCharacterFullName(this.character.name) || 'Unnamed Character';
    },

    abilityModifiers() {
      if (!this.character.abilityScores) return {};
      return GameUtils.calculateAbilityModifiers(this.character.abilityScores);
    },

    raceName() {
      if (!this.character.race) return 'No race selected';
      return typeof this.character.race === 'string' ? this.character.race : this.character.race.name;
    },

    className() {
      if (!this.character.characterClass) return 'No class selected';
      return typeof this.character.characterClass === 'string' ? this.character.characterClass : this.character.characterClass.name;
    },

    characterLevel() {
      return this.character.level || 1;
    },

    hitPoints() {
      return this.character.hitPoints || 0;
    },

    armorClass() {
      return this.character.armorClass || 10;
    },

    initiative() {
      return this.character.initiative || 0;
    },

    completionSteps() {
      const steps = [
        { step: 1, name: 'Ability Scores', fallback: this.isAbilityScoresComplete },
        { step: 2, name: 'Race', fallback: this.isRaceComplete },
        { step: 3, name: 'Class', fallback: this.isClassComplete },
        { step: 4, name: 'Skills', fallback: this.isSkillsComplete },
        { step: 5, name: 'Feats', fallback: this.isFeatsComplete },
        { step: 6, name: 'Equipment', fallback: this.isEquipmentComplete },
        { step: 7, name: 'Spells', fallback: this.isSpellsComplete },
        { step: 8, name: 'Details', fallback: this.isDetailsComplete }
      ];
      return steps.map(({ step, name, fallback }) => ({
        step,
        name,
        completed: this.isStepComplete ? this.isStepComplete(step) : fallback()
      }));
    },

    completionPercentage() {
      const completed = this.completionSteps.filter(step => step.completed).length;
      return Math.round((completed / this.completionSteps.length) * 100);
    },

    isCharacterComplete() {
      return this.completionSteps.every(step => step.completed);
    }
  },

  methods: {
    formatModifier(modifier) {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    },

    // Step completion methods (simplified fallbacks for standalone usage)
    isAbilityScoresComplete() {
      if (!this.character.abilityScores) return false;
      return Object.values(this.character.abilityScores).every(score =>
        GameUtils.isValidAbilityScore(score)
      );
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
    },

    getStepIcon(step) {
      if (step.completed) {
        return 'fa-check-circle text-success';
      } else if (step.step === this.currentStep) {
        return 'fa-arrow-circle-right text-primary';
      } else {
        return 'fa-circle text-muted';
      }
    },

    editCharacter() {
      this.$emit('edit-character');
    }
  },

  template: `
    <pf-card
      :title="compact ? null : 'Character Summary'"
      :variant="isCharacterComplete ? 'success' : 'info'"
      :class="{ 'mb-3': !compact }"
    >
      <!-- Character Header -->
      <div class="character-header mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-1">{{ characterName }}</h4>
            <p class="text-muted small mb-0">
              Level {{ characterLevel }} {{ raceName }} {{ className }}
            </p>
          </div>
          <div v-if="editable" class="text-end">
            <pf-button
              variant="primary"
              outline
              size="sm"
              icon="fa-edit"
              @click="editCharacter"
            >
              Edit
            </pf-button>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="showProgress && !isCharacterComplete" class="mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <small class="text-muted">Creation Progress</small>
          <small class="text-muted">{{ completionPercentage }}%</small>
        </div>
        <div class="pf-progress">
          <div
            class="pf-progress__bar"
            role="progressbar"
            :style="{ width: completionPercentage + '%' }"
            :aria-valuenow="completionPercentage"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      <!-- Character Stats (if details are shown and character has basic info) -->
      <div v-if="showDetails && (isRaceComplete() || isClassComplete())" class="pf-grid pf-grid--pairs gap-2 mb-3">
        <div class="stat-block text-center">
          <div class="stat-value">{{ hitPoints }}</div>
          <div class="stat-label">Hit Points</div>
        </div>
        <div class="stat-block text-center">
          <div class="stat-value">{{ armorClass }}</div>
          <div class="stat-label">Armor Class</div>
        </div>
        <div class="stat-block text-center">
          <div class="stat-value">{{ formatModifier(initiative) }}</div>
          <div class="stat-label">Initiative</div>
        </div>
        <div class="stat-block text-center">
          <div class="stat-value">{{ character.baseAttackBonus || 0 }}</div>
          <div class="stat-label">Base Attack</div>
        </div>
      </div>

      <!-- Ability Scores -->
      <div v-if="showDetails && character.abilityScores && !compact" class="mb-3">
        <h6 class="mb-2">Ability Scores</h6>
        <div class="pf-grid pf-grid--abilities gap-2">
          <div v-for="(score, ability) in character.abilityScores" :key="ability" class="text-center">
            <div class="ability-score">
              <div class="score">{{ score }}</div>
              <div class="modifier">{{ formatModifier(abilityModifiers[ability] || 0) }}</div>
            </div>
            <small class="ability-name">{{ ability.substring(0, 3).toUpperCase() }}</small>
          </div>
        </div>
      </div>

      <!-- Concept (if provided) -->
      <div v-if="showDetails && isConceptComplete() && !compact" class="mb-3">
        <h6 class="mb-2">Character Concept</h6>
        <p class="text-muted small">{{ character.concept }}</p>
      </div>

      <!-- Step Completion List -->
      <div v-if="!compact && showProgress" class="completion-steps">
        <h6 class="mb-2">Creation Steps</h6>
        <div class="pf-grid pf-grid--pairs gap-1">
          <div
            v-for="step in completionSteps"
            :key="step.step"
            class="d-flex align-items-center"
          >
            <i :class="['fas', getStepIcon(step), 'me-2']"></i>
            <small :class="{ 'fw-bold': step.step === currentStep }">
              {{ step.name }}
            </small>
          </div>
        </div>
      </div>

      <!-- Character Complete Badge -->
      <div v-if="isCharacterComplete" class="text-center mt-3">
        <div class="badge bg-success fs-6">
          <i class="fas fa-check me-1"></i>
          Character Creation Complete
        </div>
      </div>
    </pf-card>
  `
});
