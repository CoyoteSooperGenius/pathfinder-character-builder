Vue.component('ability-score-adjuster', {
  props: {
    // Current ability scores object { STR: 10, DEX: 12, ... }
    scores: {
      type: Object,
      default: () => ({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 })
    },
    // Adjustment mode: 'point-buy', 'racial', 'item-bonus', 'manual'
    mode: {
      type: String,
      default: 'manual',
      validator: value => ['point-buy', 'racial', 'item-bonus', 'manual'].includes(value)
    },
    // Available abilities to adjust
    abilities: {
      type: Array,
      default: () => ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    // For point-buy mode: total points available
    totalPoints: {
      type: Number,
      default: 20
    },
    // For point-buy mode: base score (before spending points)
    baseScore: {
      type: Number,
      default: 10
    },
    // Minimum allowed score
    minScore: {
      type: Number,
      default: 3
    },
    // Maximum allowed score  
    maxScore: {
      type: Number,
      default: 18
    },
    // For racial mode: adjustment values { STR: +2, CON: -2, ... }
    racialAdjustments: {
      type: Object,
      default: () => ({})
    },
    // Whether to show ability modifiers
    showModifiers: {
      type: Boolean,
      default: true
    },
    // Whether to show point costs (point-buy mode)
    showPointCosts: {
      type: Boolean,
      default: true
    },
    // Whether adjustments are disabled
    disabled: {
      type: Boolean,
      default: false
    },
    // Custom title
    title: {
      type: String,
      default: ''
    },
    // Description text
    description: {
      type: String,
      default: ''
    },
    // Display layout: 'table', 'cards', 'compact'
    layout: {
      type: String,
      default: 'table',
      validator: value => ['table', 'cards', 'compact'].includes(value)
    },
    // Whether to show remaining points indicator
    showRemainingPoints: {
      type: Boolean,
      default: true
    },
    // Custom CSS classes
    customClasses: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localScores: { ...this.scores },
      abilityNames: {
        STR: 'Strength',
        DEX: 'Dexterity', 
        CON: 'Constitution',
        INT: 'Intelligence',
        WIS: 'Wisdom',
        CHA: 'Charisma'
      }
    };
  },
  watch: {
    scores: {
      handler(newScores) {
        this.localScores = { ...newScores };
      },
      deep: true
    },
    localScores: {
      handler(newScores, oldScores) {
        if (JSON.stringify(newScores) !== JSON.stringify(oldScores)) {
          this.$emit('scores-changed', { ...newScores });
          this.$emit('ability-scores-updated', { ...newScores });
        }
      },
      deep: true
    }
  },
  computed: {
    // Calculate remaining points for point-buy mode
    remainingPoints() {
      if (this.mode !== 'point-buy') return 0;
      
      const usedPoints = this.abilities.reduce((total, ability) => {
        const score = this.localScores[ability] || this.baseScore;
        return total + this.getPointCost(score);
      }, 0);
      
      return this.totalPoints - usedPoints;
    },
    
    // Check if point allocation is valid
    isValidPointBuy() {
      return this.mode !== 'point-buy' || this.remainingPoints >= 0;
    },
    
    // Check if all scores are within valid range
    isValidScores() {
      return this.abilities.every(ability => {
        const score = this.localScores[ability] || this.baseScore;
        return score >= this.minScore && score <= this.maxScore;
      });
    },
    
    // Overall validation status
    isValid() {
      return this.isValidPointBuy && this.isValidScores;
    },
    
    // Get validation CSS classes
    validationClasses() {
      const classes = [];
      
      if (this.mode === 'point-buy') {
        if (this.remainingPoints < 0) {
          classes.push('border-danger');
        } else if (this.remainingPoints === 0) {
          classes.push('border-success');
        } else {
          classes.push('border-warning');
        }
      }
      
      return classes.join(' ');
    }
  },
  methods: {
    // Get ability modifier
    getModifier(score) {
      return AbilityCalculator.getModifier(score || this.baseScore);
    },
    
    // Get point cost for a score (point-buy mode)
    getPointCost(score) {
      if (this.mode !== 'point-buy') return 0;
      return AbilityCalculator.getPointBuyCost(score || this.baseScore);
    },
    
    // Calculate cost difference for an adjustment
    getCostDifference(ability, delta) {
      if (this.mode !== 'point-buy') return 0;
      
      const currentScore = this.localScores[ability] || this.baseScore;
      const newScore = currentScore + delta;
      
      return this.getPointCost(newScore) - this.getPointCost(currentScore);
    },
    
    // Check if an ability can be increased
    canIncrease(ability) {
      if (this.disabled) return false;
      
      const currentScore = this.localScores[ability] || this.baseScore;
      
      // Check maximum score limit
      if (currentScore >= this.maxScore) return false;
      
      // For point-buy, check if we have enough points
      if (this.mode === 'point-buy') {
        const costDifference = this.getCostDifference(ability, 1);
        return this.remainingPoints >= costDifference;
      }
      
      return true;
    },
    
    // Check if an ability can be decreased
    canDecrease(ability) {
      if (this.disabled) return false;
      
      const currentScore = this.localScores[ability] || this.baseScore;
      return currentScore > this.minScore;
    },
    
    // Increase an ability score
    increaseAbility(ability) {
      if (!this.canIncrease(ability)) return;
      
      const currentScore = this.localScores[ability] || this.baseScore;
      this.$set(this.localScores, ability, currentScore + 1);
      
      this.$emit('ability-increased', {
        ability: ability,
        newScore: currentScore + 1,
        oldScore: currentScore
      });
    },
    
    // Decrease an ability score
    decreaseAbility(ability) {
      if (!this.canDecrease(ability)) return;
      
      const currentScore = this.localScores[ability] || this.baseScore;
      this.$set(this.localScores, ability, currentScore - 1);
      
      this.$emit('ability-decreased', {
        ability: ability,
        newScore: currentScore - 1,
        oldScore: currentScore
      });
    },
    
    // Set specific ability score
    setAbilityScore(ability, score) {
      const newScore = Math.max(this.minScore, Math.min(this.maxScore, score));
      this.$set(this.localScores, ability, newScore);
      
      this.$emit('ability-set', {
        ability: ability,
        newScore: newScore,
        oldScore: this.localScores[ability]
      });
    },
    
    // Reset all scores to base values
    resetScores() {
      this.abilities.forEach(ability => {
        this.$set(this.localScores, ability, this.baseScore);
      });
      
      this.$emit('scores-reset', { ...this.localScores });
    },
    
    // Get racial adjustment for an ability
    getRacialAdjustment(ability) {
      return this.racialAdjustments[ability] || 0;
    },
    
    // Get final score including racial adjustments
    getFinalScore(ability) {
      const baseScore = this.localScores[ability] || this.baseScore;
      const racialAdj = this.getRacialAdjustment(ability);
      return baseScore + racialAdj;
    },
    
    // Format modifier display
    formatModifier(score) {
      const modifier = this.getModifier(score);
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    },
    
    // Get ability button classes
    getButtonClasses(ability, type) {
      const baseClasses = ['btn', 'btn-sm'];
      
      if (type === 'increase') {
        baseClasses.push(this.canIncrease(ability) ? 'btn-success' : 'btn-outline-secondary');
      } else {
        baseClasses.push(this.canDecrease(ability) ? 'btn-danger' : 'btn-outline-secondary');
      }
      
      return baseClasses.join(' ');
    },
    
    // Get score display classes
    getScoreClasses(ability) {
      const classes = ['text-center', 'fw-bold'];
      
      const racialAdj = this.getRacialAdjustment(ability);
      if (racialAdj > 0) {
        classes.push('text-success');
      } else if (racialAdj < 0) {
        classes.push('text-danger');
      }
      
      return classes.join(' ');
    }
  },
  template: `
    <div class="ability-score-adjuster" :class="customClasses + ' ' + validationClasses">
      <!-- Header -->
      <div v-if="title || description" class="adjuster-header mb-3">
        <h6 v-if="title" class="mb-1">{{ title }}</h6>
        <p v-if="description" class="text-muted small mb-0">{{ description }}</p>
      </div>
      
      <!-- Point Buy Status -->
      <div v-if="mode === 'point-buy' && showRemainingPoints" class="point-buy-status mb-3">
        <div class="alert" :class="remainingPoints === 0 ? 'alert-success' : remainingPoints < 0 ? 'alert-danger' : 'alert-warning'">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>Remaining Points: {{ remainingPoints }}</strong>
              <span v-if="remainingPoints < 0" class="ms-2">
                <i class="fas fa-exclamation-triangle"></i> Over budget!
              </span>
              <span v-else-if="remainingPoints === 0" class="ms-2">
                <i class="fas fa-check-circle"></i> Complete!
              </span>
            </div>
            <button 
              type="button" 
              class="btn btn-sm btn-outline-secondary"
              @click="resetScores"
              :disabled="disabled"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <!-- Table Layout -->
      <div v-if="layout === 'table'" class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>Ability</th>
              <th class="text-center">Score</th>
              <th v-if="showModifiers" class="text-center">Modifier</th>
              <th v-if="mode === 'point-buy' && showPointCosts" class="text-center">Point Cost</th>
              <th v-if="mode === 'racial'" class="text-center">Racial Adj.</th>
              <th v-if="mode === 'racial'" class="text-center">Final Score</th>
              <th class="text-center">Adjust</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ability in abilities" :key="ability">
              <!-- Ability Name -->
              <td class="align-middle">
                <strong>{{ ability }}</strong>
                <div class="small text-muted">{{ abilityNames[ability] }}</div>
              </td>
              
              <!-- Current Score -->
              <td class="text-center align-middle" :class="getScoreClasses(ability)">
                {{ localScores[ability] || baseScore }}
              </td>
              
              <!-- Modifier -->
              <td v-if="showModifiers" class="text-center align-middle">
                <span class="badge bg-secondary">
                  {{ formatModifier(mode === 'racial' ? getFinalScore(ability) : (localScores[ability] || baseScore)) }}
                </span>
              </td>
              
              <!-- Point Cost -->
              <td v-if="mode === 'point-buy' && showPointCosts" class="text-center align-middle">
                <small class="text-muted">{{ getPointCost(localScores[ability] || baseScore) }}</small>
              </td>
              
              <!-- Racial Adjustment -->
              <td v-if="mode === 'racial'" class="text-center align-middle">
                <span v-if="getRacialAdjustment(ability) !== 0" 
                      :class="getRacialAdjustment(ability) > 0 ? 'text-success' : 'text-danger'">
                  {{ getRacialAdjustment(ability) > 0 ? '+' : '' }}{{ getRacialAdjustment(ability) }}
                </span>
                <span v-else class="text-muted">—</span>
              </td>
              
              <!-- Final Score (with racial) -->
              <td v-if="mode === 'racial'" class="text-center align-middle">
                <strong>{{ getFinalScore(ability) }}</strong>
              </td>
              
              <!-- Adjustment Controls -->
              <td class="text-center align-middle">
                <div class="btn-group" role="group">
                  <button 
                    type="button"
                    :class="getButtonClasses(ability, 'decrease')"
                    @click="decreaseAbility(ability)"
                    :disabled="!canDecrease(ability)"
                    :title="'Decrease ' + abilityNames[ability]"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <button 
                    type="button"
                    :class="getButtonClasses(ability, 'increase')"
                    @click="increaseAbility(ability)"
                    :disabled="!canIncrease(ability)"
                    :title="'Increase ' + abilityNames[ability]"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Cards Layout -->
      <div v-else-if="layout === 'cards'" class="row">
        <div v-for="ability in abilities" :key="ability" class="col-md-6 col-lg-4 mb-3">
          <div class="card h-100">
            <div class="card-header">
              <h6 class="card-title mb-0">
                {{ ability }} - {{ abilityNames[ability] }}
              </h6>
            </div>
            <div class="card-body text-center">
              <!-- Score Display -->
              <div class="mb-3">
                <div class="display-6" :class="getScoreClasses(ability)">
                  {{ localScores[ability] || baseScore }}
                </div>
                <div v-if="showModifiers" class="mt-1">
                  <span class="badge bg-secondary fs-6">
                    {{ formatModifier(mode === 'racial' ? getFinalScore(ability) : (localScores[ability] || baseScore)) }}
                  </span>
                </div>
              </div>
              
              <!-- Additional Info -->
              <div v-if="mode === 'point-buy' && showPointCosts" class="small text-muted mb-2">
                Cost: {{ getPointCost(localScores[ability] || baseScore) }} points
              </div>
              
              <div v-if="mode === 'racial' && getRacialAdjustment(ability) !== 0" class="small mb-2">
                <span :class="getRacialAdjustment(ability) > 0 ? 'text-success' : 'text-danger'">
                  Racial: {{ getRacialAdjustment(ability) > 0 ? '+' : '' }}{{ getRacialAdjustment(ability) }}
                </span>
                <div class="fw-bold">Final: {{ getFinalScore(ability) }}</div>
              </div>
              
              <!-- Adjustment Controls -->
              <div class="btn-group" role="group">
                <button 
                  type="button"
                  :class="getButtonClasses(ability, 'decrease')"
                  @click="decreaseAbility(ability)"
                  :disabled="!canDecrease(ability)"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <button 
                  type="button"
                  :class="getButtonClasses(ability, 'increase')"
                  @click="increaseAbility(ability)"
                  :disabled="!canIncrease(ability)"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Compact Layout -->
      <div v-else-if="layout === 'compact'" class="compact-layout">
        <div v-for="ability in abilities" :key="ability" class="d-flex align-items-center justify-content-between mb-2 p-2 border rounded">
          <div class="flex-grow-1">
            <strong>{{ ability }}</strong>
            <small class="text-muted ms-1">{{ abilityNames[ability] }}</small>
          </div>
          
          <div class="d-flex align-items-center">
            <div class="text-center me-3">
              <div class="fw-bold" :class="getScoreClasses(ability)">
                {{ localScores[ability] || baseScore }}
              </div>
              <div v-if="showModifiers" class="small">
                {{ formatModifier(mode === 'racial' ? getFinalScore(ability) : (localScores[ability] || baseScore)) }}
              </div>
            </div>
            
            <div class="btn-group btn-group-sm" role="group">
              <button 
                type="button"
                :class="getButtonClasses(ability, 'decrease')"
                @click="decreaseAbility(ability)"
                :disabled="!canDecrease(ability)"
              >
                <i class="fas fa-minus"></i>
              </button>
              <button 
                type="button"
                :class="getButtonClasses(ability, 'increase')"
                @click="increaseAbility(ability)"
                :disabled="!canIncrease(ability)"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Validation Messages -->
      <div v-if="!isValid" class="validation-messages mt-3">
        <div v-if="mode === 'point-buy' && remainingPoints < 0" class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-1"></i>
          You are {{ Math.abs(remainingPoints) }} point{{ Math.abs(remainingPoints) > 1 ? 's' : '' }} over budget.
        </div>
      </div>
      
      <!-- Additional Content Slot -->
      <div class="adjuster-footer mt-3">
        <slot name="footer" :scores="localScores" :isValid="isValid" :remainingPoints="remainingPoints"></slot>
      </div>
    </div>
  `
});