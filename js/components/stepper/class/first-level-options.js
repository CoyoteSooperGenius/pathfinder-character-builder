Vue.component('first-level-options', {
  props: {
    selectedClass: {
      type: String,
      required: true
    },
    selectedBonusFeat: {
      type: String,
      default: null
    }
  },
  computed: {
    isSpellcaster() {
      const spellcasters = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Wizard'];
      return spellcasters.includes(this.selectedClass);
    },
    hasSpecialization() {
      const specializationClasses = ['Cleric', 'Druid', 'Ranger', 'Sorcerer', 'Wizard'];
      return specializationClasses.includes(this.selectedClass);
    },
    specializationText() {
      const texts = {
        'Cleric': 'Choose two domains that reflect your deity\'s portfolio.',
        'Druid': 'Choose either an animal companion or a domain.',
        'Ranger': 'Choose a favored enemy and combat style.',
        'Sorcerer': 'Choose a bloodline that determines your magical heritage.',
        'Wizard': 'Choose an arcane school to specialize in.'
      };
      return texts[this.selectedClass] || '';
    }
  },
  methods: {
    onFeatSelected(featName) {
      this.$emit('feat-selected', featName);
    }
  },
  template: `
    <div v-if="selectedClass" class="card">
      <div class="card-header">
        <h5 class="mb-0">1st Level Options</h5>
      </div>
      <div class="card-body">
        <!-- Fighter Bonus Feat Selection -->
        <div v-if="selectedClass === 'Fighter'" class="mb-3">
          <fighter-bonus-feat 
            :selected-bonus-feat="selectedBonusFeat" 
            @feat-selected="onFeatSelected">
          </fighter-bonus-feat>
        </div>
        
        <!-- Placeholder for other spellcaster classes -->
        <div v-else-if="isSpellcaster" class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          <strong>Coming Soon:</strong> Spell selection for {{ selectedClass }} will be implemented here.
        </div>
        
        <!-- Placeholder for specialization classes -->
        <div v-else-if="hasSpecialization" class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          <strong>Coming Soon:</strong> {{ specializationText }}
        </div>
        
        <!-- Placeholder for other classes -->
        <div v-else class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          <strong>Coming Soon:</strong> 1st level class-specific options for {{ selectedClass }} will be implemented here.
        </div>
      </div>
    </div>
  `
});