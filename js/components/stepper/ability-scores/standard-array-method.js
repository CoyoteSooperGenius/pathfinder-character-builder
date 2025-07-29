Vue.component('standard-array-method', {
  data() {
    return {
      abilities: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      standardValues: [15, 14, 13, 12, 10, 8],
      currentValues: [0, 0, 0, 0, 0, 0],
      standardUsed: [false, false, false, false, false, false]
    };
  },
  methods: {
    resetScores() {
      this.currentValues = [0, 0, 0, 0, 0, 0];
      this.standardUsed = [false, false, false, false, false, false];
      this.checkCompletion();
    },
    handleDragStart(idx) {
      if (this.standardUsed[idx]) return;
      event.dataTransfer.setData('text/plain', idx);
    },
    handleDrop(currentIdx) {
      const standardIdx = event.dataTransfer.getData('text/plain');
      if (
        this.currentValues[currentIdx] === 0 &&
        !this.standardUsed[standardIdx] &&
        this.standardValues[standardIdx] !== null
      ) {
        this.$set(this.currentValues, currentIdx, this.standardValues[standardIdx]);
        this.$set(this.standardUsed, standardIdx, true);
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
      const isComplete = this.currentValues.every(value => value !== 0);
      if (isComplete) {
        const abilityScores = {
          method: 'standard-array',
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
        <button @click="resetScores" class="btn btn-secondary">Reset Scores</button>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-striped w-auto mx-auto">
          <thead class="table-light">
            <tr>
              <th>Ability</th>
              <th>Current Value<br><small>(Bonus)</small></th>
              <th>Standard Array<br><small>(Bonus)</small></th>
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
                  :draggable="!standardUsed[idx]"
                  @dragstart="handleDragStart(idx)"
                  :style="{ opacity: standardUsed[idx] ? 0.5 : 1, cursor: standardUsed[idx] ? 'not-allowed' : 'grab' }"
                >
                  {{ standardValues[idx] }}
                  <span>
                    (<strong>{{ getBonus(standardValues[idx]) }}</strong>)
                  </span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
});