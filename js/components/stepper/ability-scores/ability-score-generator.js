// Ability Score Generator Component
// Handles all ability score generation methods (Point Buy, Standard Array, Dice Rolling, Manual Entry)

Vue.component('ability-score-generator', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      selectedMethod: this.character.abilityScoreMethod || 'pointBuy',

      // Completion state reported up by each method component
      methodCompletion: {
        pointBuy: false,
        assignment: false,
        manual: false
      }
    };
  },

  computed: {
    // Completion of whichever method is currently selected
    isComplete() {
      switch (this.selectedMethod) {
        case 'pointBuy':
          return this.methodCompletion.pointBuy;
        case 'standardArray':
        case 'diceRoll':
          return this.methodCompletion.assignment;
        case 'manual':
          return this.methodCompletion.manual;
        default:
          return false;
      }
    }
  },

  watch: {
    selectedMethod(newMethod) {
      this.updateCharacterMethod(newMethod);
    },

    isComplete: {
      immediate: true,
      handler(complete) {
        this.$emit('completion-changed', complete);
      }
    }
  },

  mounted() {
    this.updateCharacterMethod(this.selectedMethod);
  },

  methods: {
    // Handle method change from child component
    onMethodChanged(method) {
      this.selectedMethod = method;
    },

    // Handle scores changed from child components
    onScoresChanged() {
      this.$emit('scores-changed');
    },

    // Handle completion state reported by a method component
    onMethodCompletionChanged(methodKey, complete) {
      this.methodCompletion[methodKey] = complete;
    },

    updateCharacterMethod(method) {
      this.character.abilityScoreMethod = method;
    }
  },

  template: `
    <div class="ability-score-generator">
      <!-- Generation Method Selection -->
      <generation-method-selector
        :selected-method="selectedMethod"
        @method-changed="onMethodChanged"
      ></generation-method-selector>

      <!-- Point Buy Method -->
      <point-buy-method
        :character="character"
        :is-active="selectedMethod === 'pointBuy'"
        @scores-changed="onScoresChanged"
        @completion-changed="onMethodCompletionChanged('pointBuy', $event)"
      ></point-buy-method>

      <!-- Assignment Method (Standard Array + Dice Roll) -->
      <assignment-method
        :character="character"
        :method="selectedMethod === 'standardArray' || selectedMethod === 'diceRoll' ? selectedMethod : 'standardArray'"
        :is-active="selectedMethod === 'standardArray' || selectedMethod === 'diceRoll'"
        @scores-changed="onScoresChanged"
        @completion-changed="onMethodCompletionChanged('assignment', $event)"
      ></assignment-method>

      <!-- Manual Entry Method -->
      <manual-entry-method
        :character="character"
        :is-active="selectedMethod === 'manual'"
        @scores-changed="onScoresChanged"
        @completion-changed="onMethodCompletionChanged('manual', $event)"
      ></manual-entry-method>
    </div>
  `
});
