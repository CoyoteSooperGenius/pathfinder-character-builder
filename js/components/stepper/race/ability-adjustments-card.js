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
    handleIncreaseChange(selectedAbilities) {
      // Find which ability was toggled and emit individual change
      const added = selectedAbilities.find(ability => !this.selectedIncreases.includes(ability));
      const removed = this.selectedIncreases.find(ability => !selectedAbilities.includes(ability));
      
      // Emit the ability that changed
      const changedAbility = added || removed;
      if (changedAbility) {
        this.$emit('increase-changed', changedAbility);
      }
    },
    handleDecreaseChange(selectedAbilities) {
      // Find which ability was toggled and emit individual change
      const added = selectedAbilities.find(ability => !this.selectedDecreases.includes(ability));
      const removed = this.selectedDecreases.find(ability => !selectedAbilities.includes(ability));
      
      // Emit the ability that changed
      const changedAbility = added || removed;
      if (changedAbility) {
        this.$emit('decrease-changed', changedAbility);
      }
    },
    toggleAbilityAdjustments() {
      this.showAbilityAdjustments = !this.showAbilityAdjustments;
    }
  },
  template: `
    <div class="card">
      <div class="card-header cursor-pointer" @click="toggleAbilityAdjustments">
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
          
          <checkbox-group
            :items="abilities"
            :selected-items="selectedIncreases"
            :max-selections="selectedRaceData.abilityAdjustments.increases.count"
            :disabled="selectedRaceData.abilityAdjustments.increases.fixed"
            :show-counter="!selectedRaceData.abilityAdjustments.increases.fixed"
            counter-label="Selected"
            columns="col-4 col-sm-2"
            layout="grid"
            group-name="ability-increases"
            @selection-changed="handleIncreaseChange"
          />
        </div>
        
        <div v-if="selectedRaceData.abilityAdjustments.decreases.count > 0">
          <h6 class="text-danger">Ability Score Decreases (-2)</h6>
          <small class="text-muted d-block mb-2">
            {{ selectedRaceData.abilityAdjustments.decreases.fixed ? 'Fixed by race' : 'Select ' + selectedRaceData.abilityAdjustments.decreases.count }}
          </small>
          
          <checkbox-group
            :items="abilities"
            :selected-items="selectedDecreases"
            :max-selections="selectedRaceData.abilityAdjustments.decreases.count"
            :disabled="selectedRaceData.abilityAdjustments.decreases.fixed"
            :show-counter="!selectedRaceData.abilityAdjustments.decreases.fixed"
            counter-label="Selected"
            columns="col-4 col-sm-2"
            layout="grid"
            group-name="ability-decreases"
            @selection-changed="handleDecreaseChange"
          />
        </div>
        
        <div v-if="selectedRaceData.abilityAdjustments.increases.count === 0 && selectedRaceData.abilityAdjustments.decreases.count === 0" class="text-muted">
          This race has no ability score adjustments.
        </div>
      </div>
    </div>
  `
});