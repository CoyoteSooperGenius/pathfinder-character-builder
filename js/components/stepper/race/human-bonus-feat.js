Vue.component('human-bonus-feat', {
  template: `
    <div class="card mt-3">
      <div class="card-header">
        <h6 class="mb-0">
          <i class="fas fa-star me-2"></i>Human Bonus Feat
        </h6>
      </div>
      <div class="card-body">
        <p class="text-muted small mb-3">
          Humans select one extra feat at 1st level. Choose from the available feats below.
        </p>
        
        <feat-selector
          :feats="availableFeats"
          :selected-feat="selectedBonusFeat"
          title=""
          description="Choose a feat:"
          display-mode="list"
          :show-details="true"
          :loading="generalFeats.length === 0"
          empty-message="No feats available with your current ability scores."
          :filter-by-prerequisites="true"
          @feat-selected="selectBonusFeat"
        />
      </div>
    </div>
  `,
  props: {
    selectedBonusFeat: {
      type: String,
      default: null
    },
    abilityScores: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      generalFeats: []
    };
  },
  computed: {
    availableFeats() {
      // Filter feats based on prerequisites
      return this.generalFeats.filter(feat => {
        return this.meetsPrerequisites(feat);
      });
    }
  },
  methods: {
    async loadFeats() {
      try {
        const featsResponse = await fetch('data/feats.json');
        const featsData = await featsResponse.json();
        this.generalFeats = featsData.generalFeats || [];
      } catch (error) {
        console.error('Error loading feats data:', error);
        alert('Error loading feats data. Please refresh the page.');
      }
    },
    meetsPrerequisites(feat) {
      if (!feat.prerequisites || feat.prerequisites.length === 0) {
        return true;
      }
      
      for (const prereq of feat.prerequisites) {
        if (prereq.type === 'ability') {
          const abilityScore = this.abilityScores[prereq.ability] || 10;
          if (abilityScore < prereq.value) {
            return false;
          }
        } else if (prereq.type === 'bab') {
          // At 1st level, BAB is always 0 or 1 depending on class, assume 1 for humans
          if (prereq.value > 1) {
            return false;
          }
        } else if (prereq.type === 'feat') {
          // For 1st level, assume no other feats are available as prerequisites
          return false;
        }
      }
      
      return true;
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