Vue.component('point-buy-method', {
  data() {
    return {
      abilities: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      currentValues: [10, 10, 10, 10, 10, 10],
      totalPoints: 20,
      remainingPoints: 20,
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
      this.currentValues = [10, 10, 10, 10, 10, 10];
      this.remainingPoints = this.totalPoints;
      this.checkCompletion();
    },
    getPointCost(score) {
      // Point buy costs for Pathfinder
      const costs = {
        3: -16, 4: -12, 5: -9, 6: -6, 7: -4, 8: -2, 9: -1, 10: 0,
        11: 1, 12: 2, 13: 3, 14: 5, 15: 7, 16: 10, 17: 13, 18: 17
      };
      return costs[score] || 0;
    },
    increaseAbility(idx) {
      if (this.canIncrease(idx)) {
        const currentCost = this.getPointCost(this.currentValues[idx]);
        const newCost = this.getPointCost(this.currentValues[idx] + 1);
        const costDifference = newCost - currentCost;
        
        this.currentValues[idx]++;
        this.remainingPoints -= costDifference;
        this.checkCompletion();
      }
    },
    decreaseAbility(idx) {
      if (this.canDecrease(idx)) {
        const currentCost = this.getPointCost(this.currentValues[idx]);
        const newCost = this.getPointCost(this.currentValues[idx] - 1);
        const costDifference = currentCost - newCost;
        
        this.currentValues[idx]--;
        this.remainingPoints += costDifference;
        this.checkCompletion();
      }
    },
    canIncrease(idx) {
      if (this.currentValues[idx] >= 18) return false;
      
      const currentCost = this.getPointCost(this.currentValues[idx]);
      const newCost = this.getPointCost(this.currentValues[idx] + 1);
      const costDifference = newCost - currentCost;
      
      return this.remainingPoints >= costDifference;
    },
    canDecrease(idx) {
      return this.currentValues[idx] > 3;
    },
    getBonus(score) {
      if (score === null || score === 0) return '';
      const bonus = Math.floor((score - 10) / 2);
      return (bonus >= 0 ? '+' : '') + bonus;
    },
    checkCompletion() {
      const isComplete = this.remainingPoints === 0;
      if (isComplete) {
        const abilityScores = {
          method: 'point-buy',
          totalPoints: this.totalPoints,
          scores: {
            STR: this.currentValues[0],
            DEX: this.currentValues[1],
            CON: this.currentValues[2],
            INT: this.currentValues[3],
            WIS: this.currentValues[4],
            CHA: this.currentValues[5]
          }
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
        <div class="alert alert-info">
          <strong>Remaining Points: {{ remainingPoints }}</strong>
        </div>
        <button @click="resetScores" class="btn btn-secondary">Reset Scores</button>
      </div>
      
      <div class="table-responsive">
        <table class="table table-bordered table-striped w-auto mx-auto">
          <thead class="table-light">
            <tr>
              <th>Ability</th>
              <th>Current Value<br><small>(Bonus)</small></th>
              <th class="text-center">Adjust Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ability, idx) in abilities" :key="ability">
              <td class="fw-semibold">{{ ability }}</td>
              <td style="min-width: 60px; background: #f8f9fa;">
                {{ currentValues[idx] }}
                <span>
                  (<strong>{{ getBonus(currentValues[idx]) }}</strong>)
                </span>
              </td>
              <td class="text-center">
                <div class="btn-group" role="group">
                  <button 
                    @click="decreaseAbility(idx)"
                    :disabled="!canDecrease(idx)"
                    class="btn btn-danger btn-sm"
                    type="button"
                  >
                    −
                  </button>
                  <button 
                    @click="increaseAbility(idx)"
                    :disabled="!canIncrease(idx)"
                    class="btn btn-success btn-sm"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
});