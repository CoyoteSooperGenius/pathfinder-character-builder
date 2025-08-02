Vue.component('fighter-bonus-feat', {
  template: `
    <div>
      <h6>Fighter Bonus Feat</h6>
      <p class="text-muted mb-3">Choose a combat feat from the list below:</p>
      
      <selection-grid
        :items="availableFeats"
        :selected-item="selectedBonusFeat"
        display-mode="list"
        item-key="name"
        title-property="name"
        description-property="description"
        :show-details="true"
        :loading="fighterBonusFeats.length === 0"
        empty-message="No feats available with your current ability scores and level."
        @selection-changed="selectBonusFeat"
        @item-selected="selectBonusFeat"
      >
        <template #detail-content="{ item }">
          <div v-if="item.prerequisites && item.prerequisites.length > 0" class="small text-muted">
            <strong>Prerequisites:</strong>
            <ul class="mb-0 ps-3">
              <li v-for="prereq in item.prerequisites" :key="prereq.type + prereq.ability + prereq.value">
                {{ formatPrerequisite(prereq) }}
              </li>
            </ul>
          </div>
          <div v-else class="small text-muted">
            <strong>Prerequisites:</strong> None
          </div>
        </template>
      </selection-grid>
      
      <div v-if="filteredOutCount > 0" class="text-muted small mt-2">
        <i class="fas fa-info-circle"></i> {{ filteredOutCount }} feat{{ filteredOutCount > 1 ? 's' : '' }} hidden due to unmet prerequisites
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
      fighterBonusFeats: []
    };
  },
  computed: {
    availableFeats() {
      return PrerequisiteChecker.filterByPrerequisites(this.fighterBonusFeats);
    },
    filteredOutCount() {
      return this.fighterBonusFeats.length - this.availableFeats.length;
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
    formatPrerequisite(prereq) {
      return PrerequisiteChecker.formatPrerequisite(prereq);
    },
    selectBonusFeat(featNameOrObject) {
      // Handle both string (from selection-changed) and object (from item-selected)
      const featName = typeof featNameOrObject === 'string' ? featNameOrObject : featNameOrObject.name;
      this.$emit('feat-selected', featName);
    }
  },
  async mounted() {
    await this.loadFeats();
  }
});