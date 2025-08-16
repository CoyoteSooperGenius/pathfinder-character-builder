// Ability Scores Summary Component
// Displays final ability scores with modifiers in a clean grid layout

Vue.component('ability-scores-summary', {
  props: {
    character: {
      type: Object,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      // Make GameUtils available to the template
      GameUtils: window.GameUtils
    };
  },

  template: `
    <div v-if="isVisible" class="ability-scores-summary mt-4 pt-4 border-top">
      <h6 class="mb-3">Final Ability Scores</h6>
      <div class="row g-2">
        <div v-for="(score, ability) in character.abilityScores" :key="ability" class="col-md-2 col-sm-4 col-6">
          <div class="text-center p-2 bg-light rounded">
            <div class="fw-bold text-capitalize">{{ ability }}</div>
            <div class="h5 mb-0">{{ score }}</div>
            <small class="text-muted">({{ GameUtils.calculateAbilityModifier(score) >= 0 ? '+' : '' }}{{ GameUtils.calculateAbilityModifier(score) }})</small>
          </div>
        </div>
      </div>
    </div>
  `
});