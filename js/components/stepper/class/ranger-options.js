Vue.component('ranger-options', {
  template: `
    <div>
      <!-- Automatic Features Display -->
      <div class="card mb-3">
        <div class="card-header bg-success text-white">
          <h6 class="mb-0">
            <i class="fas fa-check-circle me-2"></i>
            Automatic Ranger Features
          </h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="feature-item mb-3">
                <h6 class="text-success mb-2">
                  <i class="fas fa-paw me-1"></i>
                  Track
                </h6>
                <p class="small text-muted mb-0">
                  A ranger adds half his level (minimum 1) to Survival skill checks made to follow tracks.
                  <strong>Current Bonus: +1</strong>
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="feature-item mb-3">
                <h6 class="text-success mb-2">
                  <i class="fas fa-comments me-1"></i>
                  Wild Empathy
                </h6>
                <p class="small text-muted mb-0">
                  A ranger can improve the initial attitude of an animal. This works like a Diplomacy check to improve the attitude of a person.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Favored Enemy Selection -->
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="fas fa-crosshairs me-2"></i>
            Choose Favored Enemy
          </h6>
        </div>
        <div class="card-body">
          <p class="text-muted mb-3">
            Select a type of creature as your favored enemy. You gain a +2 bonus on Bluff, Knowledge, Perception, 
            Sense Motive, and Survival checks against creatures of your selected type. Likewise, you get a +2 bonus 
            on weapon attack and damage rolls against them.
          </p>

          <!-- Enemy Type Selection -->
          <div class="mb-4">
            <label class="form-label fw-bold">Favored Enemy Type:</label>
            <div class="row">
              <div v-for="enemy in favoredEnemies" :key="enemy.type" class="col-md-6 col-lg-4 mb-2">
                <div 
                  class="card h-100 enemy-type-card" 
                  :class="{ 'border-primary bg-light': selectedFavoredEnemyType === enemy.type }"
                  @click="selectEnemyType(enemy.type)"
                  style="cursor: pointer;"
                >
                  <div class="card-body p-2">
                    <div class="d-flex align-items-center">
                      <input 
                        type="radio" 
                        :id="'enemy-' + enemy.type.toLowerCase()" 
                        :value="enemy.type" 
                        :checked="selectedFavoredEnemyType === enemy.type"
                        class="form-check-input me-2"
                        @change="onEnemyTypeChange"
                      >
                      <div class="flex-grow-1">
                        <h6 class="card-title mb-1 small">{{ enemy.type }}</h6>
                        <p class="card-text small text-muted mb-0" style="font-size: 0.75rem;">
                          {{ enemy.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Subtype Selection (if applicable) -->
          <div v-if="selectedEnemyData && selectedEnemyData.subtypes && selectedEnemyData.subtypes.length > 0" class="mb-3">
            <label class="form-label fw-bold">Choose Subtype:</label>
            <p class="text-muted small mb-2">
              {{ selectedEnemyData.type }} has multiple subtypes. Choose one specific subtype to focus on.
            </p>
            <div class="row">
              <div v-for="subtype in selectedEnemyData.subtypes" :key="subtype" class="col-md-6 col-lg-4 mb-2">
                <div class="form-check">
                  <input 
                    type="radio" 
                    :id="'subtype-' + subtype.toLowerCase()" 
                    :value="subtype" 
                    :checked="selectedFavoredEnemySubtype === subtype"
                    class="form-check-input"
                    @change="onSubtypeChange"
                  >
                  <label :for="'subtype-' + subtype.toLowerCase()" class="form-check-label">
                    {{ subtype }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Selection Summary -->
          <div v-if="selectedFavoredEnemyType" class="alert alert-info">
            <h6 class="alert-heading mb-2">
              <i class="fas fa-info-circle me-2"></i>
              Your Favored Enemy
            </h6>
            <p class="mb-0">
              <strong>{{ selectedFavoredEnemyType }}</strong>
              <span v-if="selectedFavoredEnemySubtype"> ({{ selectedFavoredEnemySubtype }})</span>
            </p>
            <hr class="my-2">
            <p class="mb-0 small">
              <strong>Benefits:</strong> +2 bonus on Bluff, Knowledge, Perception, Sense Motive, and Survival checks, 
              plus +2 bonus on attack and damage rolls against 
              {{ selectedFavoredEnemySubtype ? selectedFavoredEnemySubtype.toLowerCase() : selectedFavoredEnemyType.toLowerCase() }} 
              creatures.
            </p>
          </div>

          <!-- Validation Message -->
          <div v-if="!isSelectionComplete" class="alert alert-warning">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <span v-if="!selectedFavoredEnemyType">
              Please select a favored enemy type to continue.
            </span>
            <span v-else-if="selectedEnemyData && selectedEnemyData.subtypes.length > 0 && !selectedFavoredEnemySubtype">
              Please select a specific subtype for {{ selectedFavoredEnemyType }} to continue.
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    favoredEnemies: {
      type: Array,
      default: () => []
    },
    selectedFavoredEnemyType: {
      type: String,
      default: null
    },
    selectedFavoredEnemySubtype: {
      type: String,
      default: null
    }
  },
  computed: {
    selectedEnemyData() {
      return this.favoredEnemies.find(e => e.type === this.selectedFavoredEnemyType) || null;
    },
    isSelectionComplete() {
      if (!this.selectedFavoredEnemyType) return false;
      
      // If the selected enemy has subtypes, we need a subtype selected
      if (this.selectedEnemyData && this.selectedEnemyData.subtypes && this.selectedEnemyData.subtypes.length > 0) {
        return !!this.selectedFavoredEnemySubtype;
      }
      
      // If no subtypes exist, just having the type is enough
      return true;
    }
  },
  methods: {
    selectEnemyType(enemyType) {
      // Reset subtype when changing type
      this.$emit('favored-enemy-type-selected', enemyType);
      this.$emit('favored-enemy-subtype-selected', null);
    },
    onEnemyTypeChange(event) {
      const enemyType = event.target.value;
      this.$emit('favored-enemy-type-selected', enemyType);
    },
    onSubtypeChange(event) {
      const subtype = event.target.value;
      this.$emit('favored-enemy-subtype-selected', subtype);
    }
  }
});