Vue.component('first-level-options', {
  props: {
    selectedClass: {
      type: String,
      required: true
    },
    selectedBonusFeat: {
      type: String,
      default: null
    },
    selectedArcaneBond: {
      type: String,
      default: null
    },
    selectedFamiliar: {
      type: String,
      default: null
    },
    selectedBondedObject: {
      type: String,
      default: null
    },
    selectedWeapon: {
      type: String,
      default: null
    },
    selectedArcaneSchool: {
      type: String,
      default: null
    },
    selectedSpells: {
      type: Array,
      default: () => []
    },
    selectedOppositionSchools: {
      type: Array,
      default: () => []
    },
    selectedCantrips: {
      type: Array,
      default: () => []
    },
    selectedFirstLevelSpells: {
      type: Array,
      default: () => []
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
    },
    onArcaneBondSelected(bondType) {
      this.$emit('arcane-bond-selected', bondType);
    },
    onFamiliarSelected(familiarName) {
      this.$emit('familiar-selected', familiarName);
    },
    onBondedObjectSelected(objectType) {
      this.$emit('bonded-object-selected', objectType);
    },
    onWeaponSelected(weaponName) {
      this.$emit('weapon-selected', weaponName);
    },
    onArcaneSchoolSelected(school) {
      this.$emit('arcane-school-selected', school);
    },
    onOppositionSchoolsSelected(schools) {
      this.$emit('opposition-schools-selected', schools);
    },
    onSpellsSelected(spells) {
      this.$emit('spells-selected', spells);
    },
    onBardSpellsChanged(spellsData) {
      this.$emit('bard-spells-changed', spellsData);
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
        
        <!-- Wizard Options Selection -->
        <div v-else-if="selectedClass === 'Wizard'" class="mb-3">
          <wizard-options
            :selected-arcane-bond="selectedArcaneBond"
            :selected-familiar="selectedFamiliar"
            :selected-bonded-object="selectedBondedObject"
            :selected-weapon="selectedWeapon"
            :selected-arcane-school="selectedArcaneSchool"
            :selected-opposition-schools="selectedOppositionSchools"
            :selected-spells="selectedSpells"
            @arcane-bond-selected="onArcaneBondSelected"
            @familiar-selected="onFamiliarSelected"
            @bonded-object-selected="onBondedObjectSelected"
            @weapon-selected="onWeaponSelected"
            @arcane-school-selected="onArcaneSchoolSelected"
            @opposition-schools-selected="onOppositionSchoolsSelected"
            @spells-selected="onSpellsSelected">
          </wizard-options>
        </div>
        
        <!-- Bard Spell Selection -->
        <div v-else-if="selectedClass === 'Bard'" class="mb-3">
          <bard-options
            :class-data="{
              selectedCantrips: selectedCantrips,
              selectedFirstLevelSpells: selectedFirstLevelSpells
            }"
            @spells-changed="onBardSpellsChanged">
          </bard-options>
        </div>
        
        <!-- Classes with Automatic Features (No Choices Needed) -->
        <div v-else-if="selectedClass === 'Barbarian' || selectedClass === 'Paladin' || selectedClass === 'Rogue'" class="alert alert-success">
          <i class="fas fa-check-circle me-2"></i>
          <strong>Ready to Go!</strong> {{ selectedClass }}s automatically gain all their 1st level abilities. 
          Check the Character Sheet to see your class features and abilities.
        </div>
        
        <!-- Placeholder for other spellcaster classes -->
        <div v-else-if="isSpellcaster && selectedClass !== 'Wizard' && selectedClass !== 'Bard'" class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          <strong>Coming Soon:</strong> Spell selection for {{ selectedClass }} will be implemented here.
        </div>
        
        <!-- Placeholder for specialization classes -->
        <div v-else-if="hasSpecialization && selectedClass !== 'Wizard'" class="alert alert-info">
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