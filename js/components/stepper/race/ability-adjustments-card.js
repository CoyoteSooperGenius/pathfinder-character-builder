Vue.component('ability-adjustments-card', {
  props: {
    selectedRaceData: {
      type: Object,
      required: true
    },
    selectedIncreases: {
      type: Array,
      required: true
    },
    selectedDecreases: {
      type: Array,
      required: true
    },
    abilities: {
      type: Array,
      default: () => ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    }
  },
  data() {
    return {
      showAbilityAdjustments: true
    };
  },
  methods: {
    onIncreaseChange(ability) {
      this.$emit('increase-changed', ability);
    },
    onDecreaseChange(ability) {
      this.$emit('decrease-changed', ability);
    },
    toggleAbilityAdjustments() {
      this.showAbilityAdjustments = !this.showAbilityAdjustments;
    },
    isIncreaseDisabled(ability) {
      const raceData = this.selectedRaceData;
      if (raceData.abilityAdjustments.increases.fixed) return true;
      
      return !this.selectedIncreases.includes(ability) && 
             this.selectedIncreases.length >= raceData.abilityAdjustments.increases.count;
    },
    isDecreaseDisabled(ability) {
      const raceData = this.selectedRaceData;
      if (raceData.abilityAdjustments.decreases.fixed) return true;
      
      return !this.selectedDecreases.includes(ability) && 
             this.selectedDecreases.length >= raceData.abilityAdjustments.decreases.count;
    }
  },
  template: `
    <div class="card">
      <div class="card-header" style="cursor: pointer;" @click="toggleAbilityAdjustments">
        <h5 class="mb-0 d-flex justify-content-between align-items-center">
          Ability Score Adjustments
          <i :class="showAbilityAdjustments ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </h5>
      </div>
      <div v-show="showAbilityAdjustments" class="card-body">
        <div v-if="selectedRaceData.abilityAdjustments.increases.count > 0" class="mb-3">
          <h6 class="text-success">Ability Score Increases (+2)</h6>
          <small class="text-muted d-block mb-2">
            {{ selectedRaceData.abilityAdjustments.increases.fixed ? 'Fixed by race' : 'Select ' + selectedRaceData.abilityAdjustments.increases.count }}
          </small>
          <div class="row">
            <div v-for="ability in abilities" :key="'inc-' + ability" class="col-4 col-sm-2">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :value="ability"
                  :checked="selectedIncreases.includes(ability)"
                  @change="onIncreaseChange(ability)"
                  :disabled="isIncreaseDisabled(ability)"
                  :id="'increase-' + ability"
                >
                <label class="form-check-label" :for="'increase-' + ability">
                  {{ ability }}
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="selectedRaceData.abilityAdjustments.decreases.count > 0">
          <h6 class="text-danger">Ability Score Decreases (-2)</h6>
          <small class="text-muted d-block mb-2">
            {{ selectedRaceData.abilityAdjustments.decreases.fixed ? 'Fixed by race' : 'Select ' + selectedRaceData.abilityAdjustments.decreases.count }}
          </small>
          <div class="row">
            <div v-for="ability in abilities" :key="'dec-' + ability" class="col-4 col-sm-2">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :value="ability"
                  :checked="selectedDecreases.includes(ability)"
                  @change="onDecreaseChange(ability)"
                  :disabled="isDecreaseDisabled(ability)"
                  :id="'decrease-' + ability"
                >
                <label class="form-check-label" :for="'decrease-' + ability">
                  {{ ability }}
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="selectedRaceData.abilityAdjustments.increases.count === 0 && selectedRaceData.abilityAdjustments.decreases.count === 0" class="text-muted">
          This race has no ability score adjustments.
        </div>
      </div>
    </div>
  `
});