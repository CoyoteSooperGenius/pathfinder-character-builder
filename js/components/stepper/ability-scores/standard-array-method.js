Vue.component('standard-array-method', {
  data() {
    return {
      abilities: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      standardValues: [
        { total: 15, index: 0 },
        { total: 14, index: 1 },
        { total: 13, index: 2 },
        { total: 12, index: 3 },
        { total: 10, index: 4 },
        { total: 8, index: 5 }
      ],
      assignedScores: {
        STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
      }
    };
  },
  computed: {
    isComplete() {
      return Object.values(this.assignedScores).every(score => score !== null);
    },
    arraySummary() {
      const scores = this.standardValues.map(s => s.total);
      return {
        total: scores.reduce((sum, score) => sum + score, 0),
        average: (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1),
        highest: Math.max(...scores),
        lowest: Math.min(...scores)
      };
    }
  },
  methods: {
    assignScore(ability, standardIndex) {
      // Clear any previous assignment for this ability
      this.$set(this.assignedScores, ability, null);
      
      // Clear any other ability that might have this score assigned
      Object.keys(this.assignedScores).forEach(ab => {
        if (this.assignedScores[ab] && this.assignedScores[ab].index === standardIndex) {
          this.$set(this.assignedScores, ab, null);
        }
      });
      
      // Assign the score with both value and index tracking
      this.$set(this.assignedScores, ability, {
        value: this.standardValues[standardIndex].total,
        index: standardIndex
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
    
    quickAssignDescending() {
      // Auto-assign highest scores to STR, DEX, CON, INT, WIS, CHA in order
      // Standard array is already in descending order: [15, 14, 13, 12, 10, 8]
      this.abilities.forEach((ability, index) => {
        if (this.standardValues[index]) {
          this.$set(this.assignedScores, ability, {
            value: this.standardValues[index].total,
            index: this.standardValues[index].index
          });
        }
      });
      this.checkCompletion();
    },
    
    isScoreAvailable(standardIndex) {
      return !Object.values(this.assignedScores).some(assigned => assigned && assigned.index === standardIndex);
    },
    
    getBonus(score) {
      if (score === null || score === 0) return '';
      const bonus = Math.floor((score - 10) / 2);
      return (bonus >= 0 ? '+' : '') + bonus;
    },
    
    checkCompletion() {
      if (this.isComplete) {
        // Convert back to simple scores object for compatibility
        const finalScores = {};
        Object.keys(this.assignedScores).forEach(ability => {
          finalScores[ability] = this.assignedScores[ability] ? this.assignedScores[ability].value : null;
        });
        
        const abilityScores = {
          method: 'standard-array',
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
            @click="quickAssignDescending" 
            class="btn btn-success"
          >
            <i class="fas fa-magic me-1"></i>Quick Assign
          </button>
          <button 
            @click="resetScores" 
            class="btn btn-secondary"
          >
            <i class="fas fa-undo me-1"></i>Reset Assignments
          </button>
        </div>
      </div>

      <!-- Array Summary -->
      <div class="mb-4">
        <div class="alert alert-info">
          <div class="row text-center">
            <div class="col-6 col-md-3">
              <div class="fw-bold">Total</div>
              <div>{{ arraySummary.total }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="fw-bold">Average</div>
              <div>{{ arraySummary.average }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="fw-bold">Highest</div>
              <div class="text-success">{{ arraySummary.highest }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="fw-bold">Lowest</div>
              <div class="text-danger">{{ arraySummary.lowest }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Information -->
      <div class="text-center text-muted mb-4">
        <i class="fas fa-info-circle me-2"></i>
        <strong>Standard Array:</strong> Use the fixed ability scores [15, 14, 13, 12, 10, 8] and assign them to abilities.
      </div>

      <!-- Main Interface -->
      <div class="row">
        <!-- Available Scores -->
        <div class="col-md-6 mb-4">
          <h6 class="mb-3">
            <i class="fas fa-list-ol me-2"></i>Standard Array Scores
          </h6>
          <div class="row">
            <div 
              v-for="(score, index) in standardValues" 
              :key="index"
              class="col-6 col-lg-4 mb-3"
            >
              <div 
                class="card h-100 text-center"
                :class="{ 
                  'border-muted': !isScoreAvailable(index),
                  'border-primary': isScoreAvailable(index)
                }"
              >
                <div class="card-body py-2">
                  <div 
                    class="display-6 fw-bold"
                    :class="{ 
                      'text-muted': !isScoreAvailable(index),
                      'text-primary': isScoreAvailable(index)
                    }"
                  >
                    {{ score.total }}
                  </div>
                  <div class="small">
                    {{ getBonus(score.total) }}
                  </div>
                  <div v-if="!isScoreAvailable(index)" class="small text-muted">
                    <i class="fas fa-check"></i> Assigned
                  </div>
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
                    <!-- Assignment buttons for each standard array score -->
                    <div class="d-flex flex-wrap gap-1 w-120">
                      <button 
                        v-for="(score, scoreIndex) in standardValues" 
                        :key="scoreIndex"
                        @click="assignScore(ability, scoreIndex)"
                        :disabled="!isScoreAvailable(scoreIndex) && (!assignedScores[ability] || assignedScores[ability].index !== scoreIndex)"
                        :class="{ 
                          'btn-primary': assignedScores[ability] && assignedScores[ability].index === scoreIndex,
                          'btn-outline-primary': (!assignedScores[ability] || assignedScores[ability].index !== scoreIndex) && isScoreAvailable(scoreIndex),
                          'btn-outline-secondary': !isScoreAvailable(scoreIndex) && (!assignedScores[ability] || assignedScores[ability].index !== scoreIndex)
                        }"
                        class="btn btn-sm w-min-35"
                        :title="'Assign ' + score.total + ' (' + getBonus(score.total) + ')'"
                      >
                        {{ score.total }}
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

      <!-- Completion Status -->
      <div v-if="!isComplete" class="alert alert-warning">
        <i class="fas fa-exclamation-triangle me-2"></i>
        Please assign all standard array scores to abilities to continue.
      </div>
      
      <div v-if="isComplete" class="alert alert-success">
        <i class="fas fa-check-circle me-2"></i>
        All ability scores assigned! You can continue to the next step.
      </div>
    </div>
  `
});