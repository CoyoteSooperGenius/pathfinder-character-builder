// Point Buy Method Component
// Handles the Point Buy system for ability score generation

Vue.component('point-buy-method', {
  props: {
    character: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // Point Buy state
      pointBuyBudget: 25,
      pointBuySpent: 0,
      pointBuyLevels: {
        15: { name: 'Low Fantasy', description: 'Gritty, realistic campaigns' },
        20: { name: 'Standard Fantasy', description: 'Balanced heroic adventures' },
        25: { name: 'High Fantasy', description: 'Powerful heroes and epic quests' },
        30: { name: 'Epic Fantasy', description: 'Legendary heroes and cosmic threats' }
      },
      pointBuyCosts: {
        7: -4, 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 3, 14: 5, 15: 7, 16: 10, 17: 13, 18: 17
      },

      // Make GameUtils available to the template
      GameUtils: window.GameUtils,

      // Ability information
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
        dexterity: 'Agility and reflexes, affects AC, ranged attacks, initiative',
        constitution: 'Health and stamina, affects hit points and fortitude saves',
        intelligence: 'Reasoning and memory, affects skill points and knowledge',
        wisdom: 'Awareness and insight, affects perception and will saves',
        charisma: 'Force of personality, affects social skills and spell DCs'
      }
    };
  },

  computed: {
    currentScores() {
      return this.character.abilityScores;
    },

    abilityModifiers() {
      return GameUtils.calculateAbilityModifiers(this.currentScores);
    },

    pointBuyRemaining() {
      return this.pointBuyBudget - this.pointBuySpent;
    },

    currentFantasyLevel() {
      return this.pointBuyLevels[this.pointBuyBudget] || { name: 'Custom', description: 'Custom point buy level' };
    },

    totalPointsSpent() {
      return this.pointBuySpent;
    },

    canAffordIncrease() {
      const result = {};
      for (const ability of Object.keys(this.abilityNames)) {
        const currentScore = this.currentScores[ability];
        const newCost = this.pointBuyCosts[currentScore + 1] || 0;
        const currentCost = this.pointBuyCosts[currentScore] || 0;
        const additionalCost = newCost - currentCost;
        result[ability] = currentScore < 18 && this.pointBuyRemaining >= additionalCost;
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
    }
  },

  watch: {
    isActive: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.initializePointBuy();
        }
      }
    }
  },

  methods: {
    initializePointBuy() {
      const scores = {};
      for (const ability of Object.keys(this.abilityNames)) {
        scores[ability] = 10;
      }
      this.updateCharacterScores(scores);
      this.calculatePointBuySpent();
    },

    setPointBuyLevel(points) {
      this.pointBuyBudget = parseInt(points);
      if (this.pointBuySpent > this.pointBuyBudget) {
        this.initializePointBuy();
      }
    },

    increaseScore(ability) {
      if (!this.canAffordIncrease[ability]) return;

      const currentScore = this.character.abilityScores[ability];
      this.character.abilityScores[ability] = currentScore + 1;
      this.calculatePointBuySpent();
      this.$emit('scores-changed');
    },

    decreaseScore(ability) {
      if (!this.canAffordDecrease[ability]) return;

      const currentScore = this.character.abilityScores[ability];
      this.character.abilityScores[ability] = currentScore - 1;
      this.calculatePointBuySpent();
      this.$emit('scores-changed');
    },

    calculatePointBuySpent() {
      let spent = 0;
      for (const ability of Object.keys(this.abilityNames)) {
        const score = this.character.abilityScores[ability];
        spent += this.pointBuyCosts[score] || 0;
      }
      this.pointBuySpent = spent;
    },

    getPointCost(score) {
      return this.pointBuyCosts[score] || 0;
    },

    updateCharacterScores(scores) {
      Object.assign(this.character.abilityScores, scores);
      this.$emit('scores-changed');
    },

    getModifierText(modifier) {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }
  },

  template: `
    <div v-if="isActive" class="point-buy-method">
      <div class="row mb-4">
        <div class="col-12">
          <pf-card title="Point Buy System">
            <template #subtitle>
              <div class="d-flex flex-wrap align-items-center gap-3">
                <span class="badge bg-primary fs-6">{{ currentFantasyLevel.name }}</span>
                <span :class="pointBuyRemaining < 0 ? 'text-danger' : 'text-success'">
                  {{ totalPointsSpent }}/{{ pointBuyBudget }} points spent
                </span>
                <span :class="pointBuyRemaining < 0 ? 'text-danger' : 'text-muted'">
                  ({{ pointBuyRemaining }} remaining)
                </span>
              </div>
            </template>
            
            <!-- Point Buy Level Selector -->
            <div class="mb-4">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Fantasy Level:</label>
                  <select 
                    class="form-select" 
                    :value="pointBuyBudget" 
                    @change="setPointBuyLevel($event.target.value)"
                  >
                    <option 
                      v-for="(level, points) in pointBuyLevels" 
                      :key="points" 
                      :value="points"
                    >
                      {{ level.name }} ({{ points }} points)
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <small class="text-muted">
                    <strong>{{ currentFantasyLevel.name }}:</strong><br>
                    {{ currentFantasyLevel.description }}
                  </small>
                </div>
              </div>
            </div>
            
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
    </div>
  `
});