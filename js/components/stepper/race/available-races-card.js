Vue.component('available-races-card', {
  props: {
    races: {
      type: Array,
      required: true
    },
    selectedRace: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localSelectedRace: this.selectedRace
    };
  },
  watch: {
    selectedRace(newValue) {
      this.localSelectedRace = newValue;
    },
    localSelectedRace(newValue) {
      this.$emit('race-changed', newValue);
    }
  },
  template: `
    <div class="card mb-3">
      <div class="card-header">
        <h5 class="mb-0">Available Races</h5>
      </div>
      <div class="card-body">
        <div class="form-check-container">
          <div 
            v-for="race in races" 
            :key="race.name" 
            class="form-check mb-2"
          >
            <input 
              class="form-check-input" 
              type="radio" 
              :value="race.name" 
              v-model="localSelectedRace"
              :id="'race-' + race.name.toLowerCase().replace(/[^a-z]/g, '')"
              name="selectedRace"
            >
            <label 
              class="form-check-label fw-semibold" 
              :for="'race-' + race.name.toLowerCase().replace(/[^a-z]/g, '')"
            >
              {{ race.name }}
            </label>
          </div>
        </div>
      </div>
    </div>
  `
});