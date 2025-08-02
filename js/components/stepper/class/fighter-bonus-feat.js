Vue.component('fighter-bonus-feat', {
  template: `
    <div>
      <feat-selector
        :feats="fighterBonusFeats"
        :selected-feat="selectedBonusFeat"
        title="Fighter Bonus Feat"
        description="Choose a combat feat from the list below:"
        display-mode="list"
        :show-details="true"
        :loading="fighterBonusFeats.length === 0"
        empty-message="No feats available with your current ability scores and level."
        @feat-selected="selectBonusFeat"
      />
    </div>
  `,
  props: {
    selectedBonusFeat: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      fighterBonusFeats: []
    };
  },
  methods: {
    async loadFeats() {
      try {
        const featsResponse = await fetch('data/feats.json');
        const featsData = await featsResponse.json();
        this.fighterBonusFeats = featsData.fighterBonusFeats;
      } catch (error) {
        console.error('Error loading feats data:', error);
        alert('Error loading feats data. Please refresh the page.');
      }
    },
    selectBonusFeat(featNameOrObject) {
      // Handle both string (from feat-selected) and object (from feat-chosen)
      const featName = typeof featNameOrObject === 'string' ? featNameOrObject : featNameOrObject.name;
      this.$emit('feat-selected', featName);
    }
  },
  async mounted() {
    await this.loadFeats();
  }
});