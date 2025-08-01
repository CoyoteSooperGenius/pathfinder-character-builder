Vue.component('fighter-bonus-feat', {
  template: `
    <div>
      <h6>Fighter Bonus Feat</h6>
      <p class="text-muted mb-3">Choose a combat feat from the list below:</p>
      
      <div class="row" v-if="fighterBonusFeats.length > 0">
        <!-- Feat List -->
        <div class="col-md-6">
          <div class="list-group">
            <button
              v-for="feat in fighterBonusFeats"
              :key="feat.name"
              type="button"
              class="list-group-item list-group-item-action"
              :class="{ 
                'active': selectedBonusFeat === feat.name,
                'list-group-item-primary': hoveredFeat === feat.name && selectedBonusFeat !== feat.name
              }"
              @click="selectBonusFeat(feat.name)"
              @mouseenter="hoveredFeat = feat.name"
              @mouseleave="hoveredFeat = null"
            >
              <div class="d-flex w-100 justify-content-between align-items-center">
                <h6 class="mb-0">{{ feat.name }}</h6>
                <i v-if="selectedBonusFeat === feat.name" class="fas fa-check text-white"></i>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Description Panel -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <h6 class="mb-0">
                {{ displayedFeat ? displayedFeat.name : 'Select a Feat' }}
              </h6>
            </div>
            <div class="card-body">
              <p v-if="displayedFeat" class="mb-0">
                {{ displayedFeat.description }}
              </p>
              <p v-else class="text-muted mb-0">
                Click on a feat from the list to see its description.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center">
        <i class="fas fa-spinner fa-spin"></i> Loading feats...
      </div>
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
      fighterBonusFeats: [],
      hoveredFeat: null
    };
  },
  computed: {
    displayedFeat() {
      // Show description for hovered feat, or selected feat, or null
      const featName = this.hoveredFeat || this.selectedBonusFeat;
      return this.fighterBonusFeats.find(feat => feat.name === featName) || null;
    }
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
    selectBonusFeat(featName) {
      this.$emit('feat-selected', featName);
    }
  },
  async mounted() {
    await this.loadFeats();
  }
});