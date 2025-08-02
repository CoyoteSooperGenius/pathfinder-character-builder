Vue.component('point-buy-method', {
  data() {
    return {
      totalPoints: 20,
      currentScores: {
        STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10
      },
      pointBuyOptions: [
        { value: 15, label: '15 Points (Low Fantasy)' },
        { value: 20, label: '20 Points (Standard Fantasy)' },
        { value: 25, label: '25 Points (High Fantasy)' },
        { value: 30, label: '30 Points (Epic Fantasy)' }
      ]
    };
  },
  methods: {
    onPointBuyChange() {
      this.resetScores();
    },
    resetScores() {
      this.currentScores = {
        STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10
      };
    },
    setAll14s() {
      this.currentScores = {
        STR: 14, DEX: 14, CON: 14, INT: 14, WIS: 14, CHA: 14
      };
      
      // Calculate points needed for six 14s (6 * 5 = 30 points)
      const pointsNeeded = 6 * AbilityCalculator.getPointBuyCost(14);
      
      // If we don't have enough points, automatically increase to 30 points (Epic Fantasy)
      if (pointsNeeded > this.totalPoints) {
        this.totalPoints = 30;
      }
    },
    onScoresChanged(newScores) {
      this.currentScores = { ...newScores };
      this.checkCompletion();
    },
    checkCompletion() {
      const totalCost = AbilityCalculator.calculatePointBuyTotal(this.currentScores);
      const isComplete = totalCost === this.totalPoints;
      
      if (isComplete) {
        const abilityScores = {
          method: 'point-buy',
          totalPoints: this.totalPoints,
          scores: { ...this.currentScores }
        };
        this.$emit('complete', { isComplete: true, abilityScores });
      } else {
        this.$emit('incomplete');
      }
    }
  },
  template: `
    <div>
      <div class="mb-3">
        <label for="point-buy-total" class="form-label fw-bold">Point Buy Total:</label>
        <select id="point-buy-total" v-model="totalPoints" @change="onPointBuyChange" class="form-select mb-3">
          <option v-for="option in pointBuyOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <div class="mb-3">
        <div class="d-flex gap-2">
          <button @click="setAll14s" class="btn btn-success">Quick Set (All 14s)</button>
        </div>
      </div>
      
      <ability-score-adjuster
        :scores="currentScores"
        mode="point-buy"
        :total-points="totalPoints"
        :base-score="10"
        :min-score="7"
        :max-score="18"
        :show-modifiers="true"
        :show-point-costs="true"
        :show-remaining-points="true"
        layout="table"
        @scores-changed="onScoresChanged"
      />
    </div>
  `
});