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
        { step: 1, name: 'Ability Scores', completed: this.isAbilityScoresComplete() },
        { step: 2, name: 'Concept', completed: this.isConceptComplete() },
        { step: 3, name: 'Race', completed: this.isRaceComplete() },
        { step: 4, name: 'Class', completed: this.isClassComplete() },
        { step: 5, name: 'Skills', completed: this.isSkillsComplete() },
        { step: 6, name: 'Feats', completed: this.isFeatsComplete() },
        { step: 7, name: 'Equipment', completed: this.isEquipmentComplete() },
        { step: 8, name: 'Spells', completed: this.isSpellsComplete() },
        { step: 9, name: 'Details', completed: this.isDetailsComplete() }
      ];
      return steps;
    },
    
    completionPercentage() {
      const completed = this.completionSteps.filter(step => step.completed).length;
      return Math.round((completed / 9) * 100);
    },
    
    isCharacterComplete() {
      return this.completionSteps.every(step => step.completed);
    }
  },
  
  methods: {
    formatModifier(modifier) {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    },
    
    // Step completion methods (simplified versions)
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
            <p class="text-muted mb-0">
              Level {{ characterLevel }} {{ raceName }} {{ className }}
            </p>
          </div>
          <div v-if="editable" class="text-end">
            <pf-button 
              variant="outline-primary" 
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
          <small class="text-muted">Character Creation Progress</small>
          <small class="text-muted">{{ completionPercentage }}%</small>
        </div>
        <div class="progress">
          <div 
            class="progress-bar" 
            role="progressbar" 
            :style="{ width: completionPercentage + '%' }"
            :aria-valuenow="completionPercentage"
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
      </div>
      
      <!-- Character Stats (if details are shown and character has basic info) -->
      <div v-if="showDetails && (isRaceComplete || isClassComplete)" class="row mb-3">
        <div class="col-6 col-md-3 text-center">
          <div class="stat-block">
            <div class="stat-value">{{ hitPoints }}</div>
            <div class="stat-label">Hit Points</div>
          </div>
        </div>
        <div class="col-6 col-md-3 text-center">
          <div class="stat-block">
            <div class="stat-value">{{ armorClass }}</div>
            <div class="stat-label">Armor Class</div>
          </div>
        </div>
        <div class="col-6 col-md-3 text-center">
          <div class="stat-block">
            <div class="stat-value">{{ formatModifier(initiative) }}</div>
            <div class="stat-label">Initiative</div>
          </div>
        </div>
        <div class="col-6 col-md-3 text-center">
          <div class="stat-block">
            <div class="stat-value">{{ character.baseAttackBonus || 0 }}</div>
            <div class="stat-label">Base Attack</div>
          </div>
        </div>
      </div>
      
      <!-- Ability Scores (if completed) -->
      <div v-if="showDetails && isAbilityScoresComplete() && !compact" class="mb-3">
        <h6 class="mb-2">Ability Scores</h6>
        <div class="row g-2">
          <div v-for="(score, ability) in character.abilityScores" :key="ability" class="col-6 col-md-2">
            <div class="text-center">
              <div class="ability-score">
                <div class="score">{{ score }}</div>
                <div class="modifier">{{ formatModifier(abilityModifiers[ability] || 0) }}</div>
              </div>
              <small class="ability-name">{{ ability.substring(0, 3).toUpperCase() }}</small>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Concept (if provided) -->
      <div v-if="showDetails && isConceptComplete() && !compact" class="mb-3">
        <h6 class="mb-2">Character Concept</h6>
        <p class="text-muted small">{{ character.concept }}</p>
      </div>
      
      <!-- Step Completion List (compact view) -->
      <div v-if="!compact && showProgress" class="completion-steps">
        <h6 class="mb-2">Creation Steps</h6>
        <div class="row">
          <div 
            v-for="step in completionSteps" 
            :key="step.step"
            class="col-12 col-md-6 col-lg-4 mb-1"
          >
            <div class="d-flex align-items-center">
              <i :class="['fas', getStepIcon(step), 'me-2']"></i>
              <small :class="{ 'fw-bold': step.step === currentStep }">
                {{ step.name }}
              </small>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Character Complete Badge -->
      <div v-if="isCharacterComplete" class="text-center">
        <div class="badge bg-success fs-6">
          <i class="fas fa-check me-1"></i>
          Character Creation Complete
        </div>
      </div>
    </pf-card>
    
    <!-- Custom CSS -->
    <style scoped>
    .stat-block {
      padding: 0.5rem;
      border-radius: 0.375rem;
      background-color: rgba(13, 110, 253, 0.1);
    }
    
    .stat-value {
      font-size: 1.25rem;
      font-weight: bold;
      color: #0d6efd;
    }
    
    .stat-label {
      font-size: 0.75rem;
      color: #6c757d;
      text-transform: uppercase;
    }
    
    .ability-score {
      width: 50px;
      height: 50px;
      border: 2px solid #dee2e6;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.25rem;
      background-color: white;
    }
    
    .ability-score .score {
      font-size: 0.875rem;
      font-weight: bold;
      line-height: 1;
    }
    
    .ability-score .modifier {
      font-size: 0.625rem;
      color: #6c757d;
      line-height: 1;
    }
    
    .ability-name {
      font-size: 0.625rem;
      color: #6c757d;
      font-weight: 500;
    }
    </style>
  `
});