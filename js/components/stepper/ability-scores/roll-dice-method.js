Vue.component('roll-dice-method', {
  data() {
    return {
      abilities: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      rolledValues: [null, null, null, null, null, null],
      currentValues: [0, 0, 0, 0, 0, 0],
      rolledUsed: [false, false, false, false, false, false]
    };
  },
  methods: {
    roll4d6DropLowest() {
      return Array(4).fill(0).map(() => Math.floor(Math.random() * 6) + 1)
        .sort((a, b) => a - b)
        .slice(1)
        .reduce((sum, val) => sum + val, 0);
    },
    rollAllAbilities() {
      const rolls = this.abilities.map(() => this.roll4d6DropLowest());
      this.rolledValues = rolls.sort((a, b) => b - a); // Sort descending
      this.rolledUsed = [false, false, false, false, false, false];
      this.currentValues = [0, 0, 0, 0, 0, 0];
      this.checkCompletion();
    },
    resetScores() {
      this.currentValues = [0, 0, 0, 0, 0, 0];
      this.rolledUsed = [false, false, false, false, false, false];
      this.checkCompletion();
    },
    handleDragStart(idx) {
      if (this.rolledUsed[idx]) return;
      event.dataTransfer.setData('text/plain', idx);
    },
    handleDrop(currentIdx) {
      const rolledIdx = event.dataTransfer.getData('text/plain');
      if (
        this.currentValues[currentIdx] === 0 &&
        !this.rolledUsed[rolledIdx] &&
        this.rolledValues[rolledIdx] !== null
      ) {
        this.$set(this.currentValues, currentIdx, this.rolledValues[rolledIdx]);
        this.$set(this.rolledUsed, rolledIdx, true);
        this.checkCompletion();
      }
    },
    allowDrop(currentIdx) {
      if (this.currentValues[currentIdx] === 0) event.preventDefault();
    },
    getBonus(score) {
      if (score === null || score === 0) return '';
      const bonus = Math.floor((score - 10) / 2);
      return (bonus >= 0 ? '+' : '') + bonus;
    },
    checkCompletion() {
      const hasRolledValues = this.rolledValues.some(value => value !== null);
      const isComplete = hasRolledValues && this.currentValues.every(value => value !== 0);
      if (isComplete) {
        const abilityScores = {
          method: 'roll-dice',
          rolled: this.rolledValues.filter(v => v !== null),
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
        <button @click="rollAllAbilities" class="btn btn-primary me-2">Roll Dice</button>
        <button @click="resetScores" class="btn btn-secondary">Reset Scores</button>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-striped w-auto mx-auto">
          <thead class="table-light">
            <tr>
              <th>Ability</th>
              <th>Current Value<br><small>(Bonus)</small></th>
              <th>Rolled Value<br><small>(Bonus)</small></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ability, idx) in abilities" :key="ability">
              <td class="fw-semibold">{{ ability }}</td>
              <td
                @dragover="allowDrop(idx)"
                @drop="handleDrop(idx)"
                style="min-width: 60px; background: #f8f9fa;"
              >
                {{ currentValues[idx] }}
                <span v-if="currentValues[idx] !== 0">
                  (<strong>{{ getBonus(currentValues[idx]) }}</strong>)
                </span>
              </td>
              <td>
                <span
                  v-if="rolledValues[idx] !== null"
                  :draggable="!rolledUsed[idx]"
                  @dragstart="handleDragStart(idx)"
                  :style="{ opacity: rolledUsed[idx] ? 0.5 : 1, cursor: rolledUsed[idx] ? 'not-allowed' : 'grab' }"
                >
                  {{ rolledValues[idx] }}
                  <span>
                    (<strong>{{ getBonus(rolledValues[idx]) }}</strong>)
                  </span>
                </span>
                <span v-else>—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
});