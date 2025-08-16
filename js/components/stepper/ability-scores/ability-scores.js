// Pathfinder Ability Scores Component
// Step 1 in character creation - uses ability-score-generator component

Vue.component('ability-scores-step', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      // Make GameUtils available to the template
      GameUtils: window.GameUtils
    };
  },

  computed: {
    // Check if ability scores are valid and complete
    isComplete() {
      return Object.values(this.character.abilityScores).every(score => GameUtils.isValidAbilityScore(score));
    }
  },

  methods: {
    handleScoresChanged() {
      // Emit event to parent when scores change
      this.$emit('scores-changed');
    }
  },

  template: `
    <div class="ability-scores-step">
      <pf-card title="Ability Scores">
        <template #subtitle>
          <div class="d-flex align-items-center gap-2">
            <span>Generate your character's six core abilities</span>
            <span v-if="isComplete" class="badge bg-success">
              <i class="fas fa-check"></i> Complete
            </span>
          </div>
        </template>
        
        <!-- Use the ability score generator component -->
        <ability-score-generator 
          :character="character"
          @scores-changed="handleScoresChanged"
        ></ability-score-generator>
        
        <!-- Character Sheet Summary (if scores are set) -->
        <ability-scores-summary
          :character="character"
          :is-visible="isComplete"
        ></ability-scores-summary>
      </pf-card>
    </div>
  `
});