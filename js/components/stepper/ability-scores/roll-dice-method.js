Vue.component('roll-dice-method', {
  data() {
    return {
      abilities: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      rolledValues: [],
      assignedScores: {
        STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
      },
      isRolling: false,
      rollHistory: [], // Track individual dice rolls for each ability
      showRollDetails: false
    };
  },
  computed: {
    availableRolls() {
      // Get rolls that haven't been assigned yet using index-based tracking
      return this.rolledValues.filter((roll, index) => 
        !Object.values(this.assignedScores).some(assigned => assigned && assigned.index === index)
      );
    },
    isComplete() {
      return this.rolledValues.length > 0 && 
             Object.values(this.assignedScores).every(score => score !== null);
    },
    rollSummary() {
      if (this.rolledValues.length === 0) return null;
      const scores = this.rolledValues.map(r => r.total);
      return {
        total: scores.reduce((sum, score) => sum + score, 0),
        average: (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1),
        highest: Math.max(...scores),
        lowest: Math.min(...scores)
      };
    }
  },
  methods: {
    roll4d6DropLowest() {
      const dice = Array(4).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
      const sorted = [...dice].sort((a, b) => b - a);
      const kept = sorted.slice(0, 3);
      const dropped = sorted[3];
      const total = kept.reduce((sum, val) => sum + val, 0);
      
      return {
        allDice: dice,
        kept: kept,
        dropped: dropped,
        total: total
      };
    },
    
    async rollAllAbilities() {
      this.isRolling = true;
      this.rolledValues = [];
      this.assignedScores = {
        STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
      };
      
      // Animate rolling each ability score
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 200)); // Small delay for animation
        const roll = this.roll4d6DropLowest();
        this.rolledValues.push(roll);
      }
      
      // Don't sort to maintain index integrity - users can see values in roll order
      this.isRolling = false;
      this.checkCompletion();
    },
    
    rerollSingle(index) {
      if (this.isRolling) return;
      
      const newRoll = this.roll4d6DropLowest();
      
      // Check if this roll was assigned to an ability using index tracking
      const assignedAbility = Object.keys(this.assignedScores).find(
        ability => this.assignedScores[ability] && this.assignedScores[ability].index === index
      );
      
      // Update the roll
      this.$set(this.rolledValues, index, newRoll);
      
      // If it was assigned, clear the assignment
      if (assignedAbility) {
        this.$set(this.assignedScores, assignedAbility, null);
      }
      
      // Don't re-sort to maintain index integrity
      this.checkCompletion();
    },
    
    assignScore(ability, rollIndex) {
      // Clear any previous assignment for this ability
      this.$set(this.assignedScores, ability, null);
      
      // Clear any other ability that might have this roll assigned
      Object.keys(this.assignedScores).forEach(ab => {
        if (this.assignedScores[ab] && this.assignedScores[ab].index === rollIndex) {
          this.$set(this.assignedScores, ab, null);
        }
      });
      
      // Assign the score with both value and index tracking
      this.$set(this.assignedScores, ability, {
        value: this.rolledValues[rollIndex].total,
        index: rollIndex
      });
      this.checkCompletion();
    },
    
    clearAssignment(ability) {
      this.$set(this.assignedScores, ability, null);
      this.checkCompletion();
    },
    
    resetScores() {
      this.assignedScores = {
        STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
      };
      this.checkCompletion();
    },
    
    clearAll() {
      this.rolledValues = [];
      this.assignedScores = {
        STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
      };
      this.rollHistory = [];
      this.checkCompletion();
    },
    
    quickAssignDescending() {
      // Auto-assign highest scores to STR, DEX, CON, INT, WIS, CHA in order
      // Create array of {value, originalIndex} and sort by value
      const rollsWithIndex = this.rolledValues.map((roll, index) => ({
        value: roll.total,
        originalIndex: index
      })).sort((a, b) => b.value - a.value);
      
      this.abilities.forEach((ability, index) => {
        if (rollsWithIndex[index]) {
          this.$set(this.assignedScores, ability, {
            value: rollsWithIndex[index].value,
            index: rollsWithIndex[index].originalIndex
          });
        }
      });
      this.checkCompletion();
    },
    
    getBonus(score) {
      if (score === null || score === 0) return '';
      const bonus = Math.floor((score - 10) / 2);
      return (bonus >= 0 ? '+' : '') + bonus;
    },
    
    formatDiceRoll(roll) {
      return `[${roll.kept.join(', ')}] (dropped ${roll.dropped})`;
    },
    
    getRollByIndex(index) {
      return this.rolledValues[index];
    },
    
    isRollAvailable(rollIndex) {
      return !Object.values(this.assignedScores).some(assigned => assigned && assigned.index === rollIndex);
    },
    
    checkCompletion() {
      if (this.isComplete) {
        // Convert back to simple scores object for compatibility
        const finalScores = {};
        Object.keys(this.assignedScores).forEach(ability => {
          finalScores[ability] = this.assignedScores[ability] ? this.assignedScores[ability].value : null;
        });
        
        const abilityScores = {
          method: 'roll-dice',
          rolled: this.rolledValues.map(r => r.total),
          rollDetails: this.rolledValues,
          scores: finalScores
        };
        this.$emit('complete', { isComplete: true, abilityScores });
      } else {
        this.$emit('incomplete');
      }
    }
  },
  template: `
    <div>
      <!-- Control Buttons -->
      <div class="mb-4">
        <div class="d-flex flex-wrap gap-2">
          <button 
            @click="rollAllAbilities" 
            :disabled="isRolling"
            class="btn btn-primary"
          >
            <i v-if="isRolling" class="fas fa-spinner fa-spin me-1"></i>
            <i v-else class="fas fa-dice me-1"></i>
            {{ isRolling ? 'Rolling...' : (rolledValues.length > 0 ? 'Reroll All' : 'Roll Dice') }}
          </button>
          <button 
            v-if="rolledValues.length > 0"
            @click="quickAssignDescending" 
            class="btn btn-success"
            :disabled="isRolling"
          >
            <i class="fas fa-magic me-1"></i>Quick Assign
          </button>
          <button 
            v-if="rolledValues.length > 0"
            @click="resetScores" 
            class="btn btn-secondary"
            :disabled="isRolling"
          >
            <i class="fas fa-undo me-1"></i>Reset Assignments
          </button>
          <button 
            v-if="rolledValues.length > 0"
            @click="clearAll" 
            class="btn btn-outline-danger"
            :disabled="isRolling"
          >
            <i class="fas fa-trash me-1"></i>Clear All
          </button>
        </div>
      </div>

      <!-- Roll Summary -->
      <div v-if="rollSummary" class="mb-4">
        <div class="alert alert-info">
          <div class="row text-center">
            <div class="col-6 col-md-3">
              <div class="fw-bold">Total</div>
              <div>{{ rollSummary.total }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="fw-bold">Average</div>
              <div>{{ rollSummary.average }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="fw-bold">Highest</div>
              <div class="text-success">{{ rollSummary.highest }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="fw-bold">Lowest</div>
              <div class="text-danger">{{ rollSummary.lowest }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Rolls Yet -->
      <div v-if="rolledValues.length === 0 && !isRolling" class="text-center text-muted py-5">
        <i class="fas fa-dice fa-3x mb-3"></i>
        <h5>Roll 4d6 (drop lowest) for each ability</h5>
        <p>Click "Roll Dice" to generate your ability scores, then assign them to abilities.</p>
      </div>

      <!-- Rolling Animation -->
      <div v-if="isRolling" class="text-center text-muted py-5">
        <i class="fas fa-dice fa-spin fa-3x mb-3"></i>
        <h5>Rolling dice...</h5>
        <p>Generated {{ rolledValues.length }} of 6 ability scores</p>
      </div>

      <!-- Main Interface -->
      <div v-if="rolledValues.length > 0 && !isRolling" class="row">
        <!-- Available Rolls -->
        <div class="col-md-6 mb-4">
          <h6 class="mb-3">
            <i class="fas fa-dice me-2"></i>Available Rolls
            <small class="text-muted ms-2">(Click to view details)</small>
          </h6>
          <div class="row">
            <div 
              v-for="(roll, index) in rolledValues" 
              :key="index"
              class="col-6 col-lg-4 mb-3"
            >
              <div 
                class="card h-100 text-center"
                :class="{ 
                  'border-muted': !isRollAvailable(index),
                  'border-primary': isRollAvailable(index)
                } + ' cursor-pointer'"
                @click="showRollDetails = roll"
              >
                <div class="card-body py-2">
                  <div 
                    class="display-6 fw-bold"
                    :class="{ 
                      'text-muted': !isRollAvailable(index),
                      'text-primary': isRollAvailable(index)
                    }"
                  >
                    {{ roll.total }}
                  </div>
                  <div class="small">
                    {{ getBonus(roll.total) }}
                  </div>
                  <div v-if="!isRollAvailable(index)" class="small text-muted">
                    <i class="fas fa-check"></i> Assigned
                  </div>
                  <button 
                    v-if="isRollAvailable(index)"
                    @click.stop="rerollSingle(index)"
                    class="btn btn-sm btn-outline-secondary mt-1"
                    title="Reroll this score"
                  >
                    <i class="fas fa-redo"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ability Assignment -->
        <div class="col-md-6 mb-4">
          <h6 class="mb-3">
            <i class="fas fa-user-cog me-2"></i>Assign to Abilities
          </h6>
          <div class="list-group">
            <div 
              v-for="ability in abilities" 
              :key="ability"
              class="list-group-item"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                  <strong>{{ ability }}</strong>
                  <div class="small text-muted">
                    {{ ability === 'STR' ? 'Strength' : 
                       ability === 'DEX' ? 'Dexterity' :
                       ability === 'CON' ? 'Constitution' :
                       ability === 'INT' ? 'Intelligence' :
                       ability === 'WIS' ? 'Wisdom' : 'Charisma' }}
                  </div>
                </div>
                
                <div class="d-flex align-items-center">
                  <!-- Current Assignment -->
                  <div v-if="assignedScores[ability]" class="me-2 text-center">
                    <div class="fw-bold fs-5">{{ assignedScores[ability].value }}</div>
                    <div class="small">{{ getBonus(assignedScores[ability].value) }}</div>
                  </div>
                  <div v-else class="me-2 text-center text-muted">
                    <div class="fw-bold fs-5">—</div>
                    <div class="small">—</div>
                  </div>
                  
                  <!-- Assignment Controls -->
                  <div class="btn-group-vertical">
                    <!-- Simple button grid instead of dropdown for better compatibility -->
                    <div class="d-flex flex-wrap gap-1 w-120">
                      <button 
                        v-for="(roll, rollIndex) in rolledValues" 
                        :key="rollIndex"
                        @click="assignScore(ability, rollIndex)"
                        :disabled="!isRollAvailable(rollIndex) && (!assignedScores[ability] || assignedScores[ability].index !== rollIndex)"
                        :class="{ 
                          'btn-primary': assignedScores[ability] && assignedScores[ability].index === rollIndex,
                          'btn-outline-primary': (!assignedScores[ability] || assignedScores[ability].index !== rollIndex) && isRollAvailable(rollIndex),
                          'btn-outline-secondary': !isRollAvailable(rollIndex) && (!assignedScores[ability] || assignedScores[ability].index !== rollIndex)
                        }"
                        class="btn btn-sm w-min-35"
                        :title="'Assign ' + roll.total + ' (' + getBonus(roll.total) + ')'"
                      >
                        {{ roll.total }}
                      </button>
                    </div>
                    <button 
                      v-if="assignedScores[ability]"
                      @click="clearAssignment(ability)"
                      class="btn btn-sm btn-outline-danger mt-1"
                      title="Clear assignment"
                    >
                      <i class="fas fa-times"></i> Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Roll Details Modal -->
      <div v-if="showRollDetails" class="modal d-block bg-dark bg-opacity-50">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Roll Details</h5>
              <button type="button" class="btn-close" @click="showRollDetails = false"></button>
            </div>
            <div class="modal-body text-center">
              <div class="display-4 fw-bold text-primary mb-2">{{ showRollDetails.total }}</div>
              <div class="mb-3">Modifier: <span class="badge bg-secondary">{{ getBonus(showRollDetails.total) }}</span></div>
              
              <h6>Individual Dice:</h6>
              <div class="d-flex justify-content-center gap-2 mb-3">
                <span 
                  v-for="die in showRollDetails.kept" 
                  :key="'kept-' + die"
                  class="badge bg-success fs-6"
                >
                  {{ die }}
                </span>
                <span class="badge bg-danger fs-6 text-decoration-line-through">
                  {{ showRollDetails.dropped }}
                </span>
              </div>
              
              <small class="text-muted">
                Rolled: {{ showRollDetails.allDice.join(', ') }} 
                → Kept highest 3: {{ showRollDetails.kept.join(', ') }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Completion Status -->
      <div v-if="rolledValues.length > 0 && !isComplete" class="alert alert-warning">
        <i class="fas fa-exclamation-triangle me-2"></i>
        Please assign all rolled scores to abilities to continue.
      </div>
      
      <div v-if="isComplete" class="alert alert-success">
        <i class="fas fa-check-circle me-2"></i>
        All ability scores assigned! You can continue to the next step.
      </div>
    </div>
  `
});