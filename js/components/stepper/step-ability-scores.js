Vue.component('step-ability-scores', {
  data() {
    return {
      method: '',
      isComplete: false,
      abilityScores: null
    };
  },
  methods: {
    onMethodComplete(data) {
      this.isComplete = data.isComplete;
      this.abilityScores = data.abilityScores;
      this.$emit('step-complete', this.isComplete);
    },
    onMethodIncomplete() {
      this.isComplete = false;
      this.abilityScores = null;
      this.$emit('step-complete', false);
    },
    getAbilityScores() {
      return this.abilityScores;
    }
  },
  watch: {
    method() {
      this.isComplete = false;
      this.abilityScores = null;
      this.$emit('step-complete', false);
    }
  },
  template: `
    <div class="mb-4">
      <label for="ability-method" class="form-label fw-bold">Ability Score Method:</label>
      <select id="ability-method" v-model="method" class="form-select mb-3">
        <option disabled value="">Select a method</option>
        <option value="roll">Roll the Dice</option>
        <option value="array">Standard Array</option>
        <option value="point-buy">Point Buy</option>
      </select>
      <div v-if="method === 'roll'" class="mt-3">
        <roll-dice-method @complete="onMethodComplete" @incomplete="onMethodIncomplete"></roll-dice-method>
      </div>
      <div v-if="method === 'array'" class="mt-3">
        <standard-array-method @complete="onMethodComplete" @incomplete="onMethodIncomplete"></standard-array-method>
      </div>
      <div v-if="method === 'point-buy'" class="mt-3">
        <point-buy-method @complete="onMethodComplete" @incomplete="onMethodIncomplete"></point-buy-method>
      </div>
    </div>
  `
});