Vue.component('roll-dice-method', {
  data() {
    return {
      abilities: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      rolledValues: [null, null, null, null, null, null],
      currentValues: [null, null, null, null, null, null]
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
      this.rolledValues = this.abilities.map(() => this.roll4d6DropLowest());
      this.currentValues = [...this.rolledValues];
    }
  },
  template: `
    <div>
      <button @click="rollAllAbilities" class="btn btn-primary mb-3">Roll Dice</button>
      <div class="table-responsive">
        <table class="table table-bordered table-striped w-auto mx-auto">
          <thead class="table-light">
            <tr>
              <th>Ability</th>
              <th>Current Value</th>
              <th>Rolled Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ability, idx) in abilities" :key="ability">
              <td class="fw-semibold">{{ ability }}</td>
              <td>{{ currentValues[idx] !== null ? currentValues[idx] : '—' }}</td>
              <td>{{ rolledValues[idx] !== null ? rolledValues[idx] : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
});