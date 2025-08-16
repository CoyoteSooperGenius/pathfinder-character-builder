// Pathfinder Ability Scores Component
// Step 1 in character creation - handles ability score generation and assignment

Vue.component('ability-scores-step', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      selectedMethod: this.character.abilityScoreMethod || 'pointBuy',
      pointBuyBudget: 25,
      pointBuySpent: 0,
      generatedScores: [],
      standardArray: [15, 14, 13, 12, 10, 8],
      tempScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },
      
      // Point buy costs (3.5e/PF1e standard)
      pointBuyCosts: {
        7: -4, 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 3, 14: 5, 15: 7, 16: 10, 17: 13, 18: 17
      },

      abilityNames: {
        strength: 'Strength',
        dexterity: 'Dexterity', 
        constitution: 'Constitution',
        intelligence: 'Intelligence',
        wisdom: 'Wisdom',
        charisma: 'Charisma'
      },

      abilityDescriptions: {
        strength: 'Physical power, affects melee attack rolls, damage, carrying capacity',
        dexterity: 'Agility and reflexes, affects AC, ranged attacks, initiative, Reflex saves',
        constitution: 'Health and stamina, affects hit points and Fortitude saves',
        intelligence: 'Reasoning ability, affects skill points and knowledge skills',
        wisdom: 'Awareness and insight, affects Will saves and Wisdom-based skills',
        charisma: 'Force of personality, affects social skills and some spellcasting'
      }
    };
  },

  computed: {
    currentScores() {
      if (this.selectedMethod === 'manual') {
        return this.tempScores;
      }
      return this.character.abilityScores;
    },

    abilityModifiers() {
      return GameUtils.calculateAbilityModifiers(this.currentScores);
    },

    pointBuyRemaining() {
      return this.pointBuyBudget - this.pointBuySpent;
    },

    canAffordIncrease() {
      const result = {};
      for (const ability of Object.keys(this.abilityNames)) {
        const currentScore = this.currentScores[ability];
        const nextScore = currentScore + 1;
        const cost = this.pointBuyCosts[nextScore] - this.pointBuyCosts[currentScore];
        result[ability] = currentScore < 18 && cost <= this.pointBuyRemaining;
      }
      return result;
    },

    canAffordDecrease() {
      const result = {};
      for (const ability of Object.keys(this.abilityNames)) {
        const currentScore = this.currentScores[ability];
        result[ability] = currentScore > 7;
      }
      return result;
    },

    isValidConfiguration() {
      if (this.selectedMethod === 'pointBuy') {
        return this.pointBuyRemaining >= 0;
      }
      return Object.values(this.currentScores).every(score => GameUtils.isValidAbilityScore(score));
    }
  },

  watch: {
    selectedMethod(newMethod) {
      this.initializeMethod(newMethod);
    },

    currentScores: {
      handler() {
        if (this.selectedMethod === 'pointBuy') {
          this.calculatePointBuySpent();
        }
        this.$emit('scores-changed', this.currentScores);
      },
      deep: true
    }
  },

  mounted() {
    this.initializeMethod(this.selectedMethod);
  },

  methods: {
    initializeMethod(method) {
      switch (method) {
        case 'pointBuy':
          this.initializePointBuy();
          break;
        case 'standardArray':
          this.initializeStandardArray();
          break;
        case 'diceRoll':
          this.rollAbilityScores();
          break;
        case 'manual':
          this.initializeManual();
          break;
      }
      this.updateCharacterMethod(method);
    },

    initializePointBuy() {
      // Start with all 10s for point buy
      const scores = {};
      for (const ability of Object.keys(this.abilityNames)) {
        scores[ability] = 10;
      }
      this.updateCharacterScores(scores);
      this.calculatePointBuySpent();
    },

    initializeStandardArray() {
      // Set all scores to 10, user will assign standard array values
      const scores = {};
      for (const ability of Object.keys(this.abilityNames)) {
        scores[ability] = 10;
      }
      this.updateCharacterScores(scores);
    },

    initializeManual() {
      // Copy current scores to temp for editing
      this.tempScores = { ...this.character.abilityScores };
    },

    rollAbilityScores() {
      const scores = {};
      this.generatedScores = [];
      
      for (const ability of Object.keys(this.abilityNames)) {
        const rolls = [];
        // Roll 4d6, drop lowest
        for (let i = 0; i < 4; i++) {
          rolls.push(Math.floor(Math.random() * 6) + 1);
        }
        rolls.sort((a, b) => b - a);
        const score = rolls[0] + rolls[1] + rolls[2];
        scores[ability] = score;
        this.generatedScores.push({
          ability: ability,
          score: score,
          rolls: rolls
        });
      }
      
      this.updateCharacterScores(scores);
    },

    updateCharacterScores(scores) {
      Object.assign(this.character.abilityScores, scores);
    },

    updateCharacterMethod(method) {
      this.character.abilityScoreMethod = method;
    },

    // Point Buy Methods
    increaseScore(ability) {
      if (!this.canAffordIncrease[ability]) return;
      
      const currentScore = this.character.abilityScores[ability];
      this.character.abilityScores[ability] = currentScore + 1;
    },

    decreaseScore(ability) {
      if (!this.canAffordDecrease[ability]) return;
      
      const currentScore = this.character.abilityScores[ability];
      this.character.abilityScores[ability] = currentScore - 1;
    },

    calculatePointBuySpent() {
      let spent = 0;
      for (const ability of Object.keys(this.abilityNames)) {
        const score = this.character.abilityScores[ability];
        spent += this.pointBuyCosts[score] || 0;
      }
      this.pointBuySpent = spent;
    },

    // Standard Array Methods
    assignArrayValue(ability, value) {
      // Check if value is already assigned to another ability
      const currentAssignments = Object.entries(this.character.abilityScores)
        .filter(([key, val]) => key !== ability && this.standardArray.includes(val));
      
      if (currentAssignments.some(([key, val]) => val === value)) {
        // Swap the values
        const otherAbility = currentAssignments.find(([key, val]) => val === value)[0];
        this.character.abilityScores[otherAbility] = this.character.abilityScores[ability];
      }
      
      this.character.abilityScores[ability] = value;
    },

    // Manual entry methods
    setManualScore(ability, value) {
      const numValue = parseInt(value);
      if (GameUtils.isValidAbilityScore(numValue)) {
        this.tempScores[ability] = numValue;
      }
    },

    applyManualScores() {
      this.updateCharacterScores(this.tempScores);
    },

    // Utility methods
    getModifierText(modifier) {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    },

    getPointCost(score) {
      return this.pointBuyCosts[score] || 0;
    }
  },

  template: `
    <div class="ability-scores-step">
      <div class="row">
        <div class="col-12">
          <h3>
            <i class="fas fa-fist-raised me-2"></i>
            Step 1: Ability Scores
          </h3>
          <p class="text-muted">
            Determine your character's six ability scores using one of the methods below.
          </p>
        </div>
      </div>

      <!-- Method Selection -->
      <div class="row mb-4">
        <div class="col-12">
          <pf-card title="Generation Method">
            <div class="row g-3">
              <div class="col-md-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    v-model="selectedMethod" 
                    value="pointBuy"
                    id="method-pointbuy"
                  >
                  <label class="form-check-label" for="method-pointbuy">
                    <strong>Point Buy</strong><br>
                    <small class="text-muted">Spend {{ pointBuyBudget }} points to customize scores</small>
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    v-model="selectedMethod" 
                    value="standardArray"
                    id="method-standard"
                  >
                  <label class="form-check-label" for="method-standard">
                    <strong>Standard Array</strong><br>
                    <small class="text-muted">Assign preset values: 15, 14, 13, 12, 10, 8</small>
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    v-model="selectedMethod" 
                    value="diceRoll"
                    id="method-dice"
                  >
                  <label class="form-check-label" for="method-dice">
                    <strong>Roll Dice</strong><br>
                    <small class="text-muted">Roll 4d6, drop lowest for each ability</small>
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    v-model="selectedMethod" 
                    value="manual"
                    id="method-manual"
                  >
                  <label class="form-check-label" for="method-manual">
                    <strong>Manual Entry</strong><br>
                    <small class="text-muted">Enter custom ability scores</small>
                  </label>
                </div>
              </div>
            </div>
          </pf-card>
        </div>
      </div>

      <!-- Point Buy Method -->
      <div v-if="selectedMethod === 'pointBuy'" class="row mb-4">
        <div class="col-12">
          <pf-card title="Point Buy System">
            <template #subtitle>
              <span :class="pointBuyRemaining < 0 ? 'text-danger' : 'text-success'">
                {{ pointBuyRemaining }} points remaining
              </span>
            </template>
            
            <div class="row g-3">
              <div v-for="ability in Object.keys(abilityNames)" :key="ability" class="col-md-6">
                <div class="ability-score-control d-flex align-items-center justify-content-between p-3 border rounded">
                  <div class="ability-info">
                    <strong>{{ abilityNames[ability] }}</strong>
                    <br>
                    <small class="text-muted">{{ abilityDescriptions[ability] }}</small>
                  </div>
                  <div class="ability-controls d-flex align-items-center">
                    <pf-button 
                      size="sm" 
                      variant="outline-secondary"
                      :disabled="!canAffordDecrease[ability]"
                      @click="decreaseScore(ability)"
                    >
                      <i class="fas fa-minus"></i>
                    </pf-button>
                    <div class="mx-3 text-center">
                      <div class="h5 mb-0">{{ currentScores[ability] }}</div>
                      <small class="text-muted">({{ getModifierText(abilityModifiers[ability]) }})</small>
                      <br>
                      <small class="badge bg-secondary">{{ getPointCost(currentScores[ability]) }} pts</small>
                    </div>
                    <pf-button 
                      size="sm" 
                      variant="outline-secondary"
                      :disabled="!canAffordIncrease[ability]"
                      @click="increaseScore(ability)"
                    >
                      <i class="fas fa-plus"></i>
                    </pf-button>
                  </div>
                </div>
              </div>
            </div>
          </pf-card>
        </div>
      </div>

      <!-- Standard Array Method -->
      <div v-if="selectedMethod === 'standardArray'" class="row mb-4">
        <div class="col-12">
          <pf-card title="Standard Array Assignment">
            <template #subtitle>
              Assign these values to your abilities: {{ standardArray.join(', ') }}
            </template>
            
            <div class="row g-3">
              <div v-for="ability in Object.keys(abilityNames)" :key="ability" class="col-md-6">
                <div class="ability-score-control p-3 border rounded">
                  <div class="mb-2">
                    <strong>{{ abilityNames[ability] }}</strong>
                    <br>
                    <small class="text-muted">{{ abilityDescriptions[ability] }}</small>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <select 
                      class="form-select"
                      :value="currentScores[ability]"
                      @change="assignArrayValue(ability, parseInt($event.target.value))"
                    >
                      <option value="10">Select value...</option>
                      <option v-for="value in standardArray" :key="value" :value="value">
                        {{ value }} ({{ getModifierText(GameUtils.calculateAbilityModifier(value)) }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </pf-card>
        </div>
      </div>

      <!-- Dice Roll Method -->
      <div v-if="selectedMethod === 'diceRoll'" class="row mb-4">
        <div class="col-12">
          <pf-card title="Rolled Ability Scores">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span>Roll 4d6, drop lowest for each ability score</span>
              <pf-button variant="secondary" icon="fa-dice" @click="rollAbilityScores">
                Reroll All
              </pf-button>
            </div>
            
            <div class="row g-3">
              <div v-for="ability in Object.keys(abilityNames)" :key="ability" class="col-md-6">
                <div class="ability-score-control p-3 border rounded">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ abilityNames[ability] }}</strong>
                      <br>
                      <small class="text-muted">{{ abilityDescriptions[ability] }}</small>
                    </div>
                    <div class="text-center">
                      <div class="h4 mb-0">{{ currentScores[ability] }}</div>
                      <small class="text-muted">({{ getModifierText(abilityModifiers[ability]) }})</small>
                      <div v-if="generatedScores.length">
                        <small class="text-muted">
                          Rolls: {{ generatedScores.find(s => s.ability === ability)?.rolls.join(', ') }}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </pf-card>
        </div>
      </div>

      <!-- Manual Entry Method -->
      <div v-if="selectedMethod === 'manual'" class="row mb-4">
        <div class="col-12">
          <pf-card title="Manual Entry">
            <template #subtitle>
              Enter ability scores between 3 and 25
            </template>
            
            <div class="row g-3">
              <div v-for="ability in Object.keys(abilityNames)" :key="ability" class="col-md-6">
                <div class="ability-score-control p-3 border rounded">
                  <div class="mb-2">
                    <strong>{{ abilityNames[ability] }}</strong>
                    <br>
                    <small class="text-muted">{{ abilityDescriptions[ability] }}</small>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <input 
                      type="number" 
                      class="form-control"
                      min="3" 
                      max="25"
                      :value="tempScores[ability]"
                      @input="setManualScore(ability, $event.target.value)"
                    >
                    <div class="ms-3 text-center">
                      <small class="text-muted">({{ getModifierText(GameUtils.calculateAbilityModifier(tempScores[ability])) }})</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-3">
              <pf-button variant="primary" @click="applyManualScores">
                Apply Scores
              </pf-button>
            </div>
          </pf-card>
        </div>
      </div>

      <!-- Ability Score Summary -->
      <div class="row">
        <div class="col-12">
          <pf-card title="Ability Score Summary" :variant="isValidConfiguration ? 'success' : 'warning'">
            <div class="row g-3 text-center">
              <div v-for="ability in Object.keys(abilityNames)" :key="ability" class="col-md-2">
                <div class="ability-summary">
                  <div class="h6 mb-1">{{ abilityNames[ability] }}</div>
                  <div class="h4 text-primary">{{ currentScores[ability] }}</div>
                  <div class="text-muted small">{{ getModifierText(abilityModifiers[ability]) }}</div>
                </div>
              </div>
            </div>
            
            <div v-if="!isValidConfiguration" class="alert alert-warning mt-3 mb-0">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <span v-if="selectedMethod === 'pointBuy' && pointBuyRemaining < 0">
                You have overspent your point budget by {{ Math.abs(pointBuyRemaining) }} points.
              </span>
              <span v-else>
                Please ensure all ability scores are between 3 and 25.
              </span>
            </div>
          </pf-card>
        </div>
      </div>
    </div>
  `
});