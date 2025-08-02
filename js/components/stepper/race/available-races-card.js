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
  methods: {
    handleRaceSelection(raceNameOrObject) {
      // Handle both string (from selection-changed) and object (from item-selected)
      const raceName = typeof raceNameOrObject === 'string' ? raceNameOrObject : raceNameOrObject.name;
      this.localSelectedRace = raceName;
    }
  },
  template: `
    <div class="card mb-3">
      <div class="card-header">
        <h5 class="mb-0">Available Races</h5>
      </div>
      <div class="card-body">
        <selection-grid
          :items="races"
          :selected-item="localSelectedRace"
          display-mode="radio"
          item-key="name"
          title-property="name"
          description-property="description"
          :loading="races.length === 0"
          empty-message="No races available"
          @selection-changed="handleRaceSelection"
          @item-selected="handleRaceSelection"
        />
      </div>
    </div>
  `
});