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
      // Completion state reported up by the generator for the selected method
      isComplete: false
    };
  },

  methods: {
    handleScoresChanged() {
      // Emit event to parent when scores change
      this.$emit('scores-changed');
    },

    handleCompletionChanged(complete) {
      this.isComplete = complete;
      this.$emit('completion-changed', complete);
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
          @completion-changed="handleCompletionChanged"
        ></ability-score-generator>
      </pf-card>
    </div>
  `
});
