Vue.component('class-step-coordinator', {
  data() {
    return {
      selectedClass: null,
      showClassSelection: true,
      selectedBonusFeat: null,
      selectedArcaneBond: null,
      selectedFamiliar: null,
      selectedBondedObject: null,
      selectedWeapon: null,
      selectedArcaneSchool: null,
      selectedOppositionSchools: [],
      selectedSpells: [],
      coreClasses: []
    };
  },
  computed: {
    selectedClassData() {
      return this.coreClasses.find(c => c.name === this.selectedClass) || {};
    },
    isStepComplete() {
      // For Fighter, need both class and bonus feat selected
      if (this.selectedClass === 'Fighter') {
        return !!(this.selectedClass && this.selectedBonusFeat);
      } else if (this.selectedClass === 'Wizard') {
        // For Wizard, need class, arcane bond, arcane school, and 3 spells selected
        // If familiar is chosen, also need familiar selection
        // If bonded object is chosen, need bonded object selection (and weapon name if weapon is chosen)
        const needsFamiliar = this.selectedArcaneBond === 'familiar' && !this.selectedFamiliar;
        const needsBondedObject = this.selectedArcaneBond === 'bonded_object' && !this.selectedBondedObject;
        const needsWeapon = this.selectedBondedObject === 'Weapon' && !this.selectedWeapon;
        const needsOppositionSchools = this.selectedArcaneSchool && 
                                      this.selectedArcaneSchool !== 'Universalist' && 
                                      this.selectedOppositionSchools.length !== 2;
        
        // Calculate required spell count based on Intelligence
        const requiredSpellCount = this.getRequiredSpellCount();
        const needsSpells = this.selectedSpells.length !== requiredSpellCount;
        
        return !!(this.selectedClass && 
                 this.selectedArcaneBond && 
                 this.selectedArcaneSchool && 
                 !needsSpells &&
                 !needsFamiliar &&
                 !needsBondedObject &&
                 !needsWeapon &&
                 !needsOppositionSchools);
      } else {
        // For other classes, just need class selected (until their 1st level options are implemented)
        return !!this.selectedClass;
      }
    }
  },
  methods: {
    async loadData() {
      try {
        // Load classes data
        const classesResponse = await fetch('data/classes.json');
        const classesData = await classesResponse.json();
        this.coreClasses = classesData.coreClasses;
        
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading class data. Please refresh the page.');
      }
    },
    onClassSelected(className) {
      this.selectedClass = className;
      this.selectedBonusFeat = null; // Reset feat selection when changing class
      this.selectedArcaneBond = null; // Reset wizard selections when changing class
      this.selectedFamiliar = null;
      this.selectedBondedObject = null;
      this.selectedWeapon = null;
      this.selectedArcaneSchool = null;
      this.selectedOppositionSchools = [];
      this.selectedSpells = [];
      this.showClassSelection = false;
      this.updateStepComplete();
    },
    onToggleSelection() {
      this.showClassSelection = !this.showClassSelection;
    },
    onFeatSelected(featName) {
      this.selectedBonusFeat = featName;
      this.updateStepComplete();
    },
    onArcaneBondSelected(bondType) {
      this.selectedArcaneBond = bondType;
      // Reset selections if bond type changes
      if (bondType !== 'familiar') {
        this.selectedFamiliar = null;
      }
      if (bondType !== 'bonded_object') {
        this.selectedBondedObject = null;
        this.selectedWeapon = null;
      }
      this.updateStepComplete();
    },
    onFamiliarSelected(familiarName) {
      this.selectedFamiliar = familiarName;
      this.updateStepComplete();
    },
    onBondedObjectSelected(objectType) {
      this.selectedBondedObject = objectType;
      // Reset weapon selection if object type changes
      if (objectType !== 'Weapon') {
        this.selectedWeapon = null;
      }
      this.updateStepComplete();
    },
    onWeaponSelected(weaponName) {
      this.selectedWeapon = weaponName;
      this.updateStepComplete();
    },
    onArcaneSchoolSelected(school) {
      this.selectedArcaneSchool = school;
      // Reset opposition schools when changing arcane school
      this.selectedOppositionSchools = [];
      this.updateStepComplete();
    },
    onOppositionSchoolsSelected(schools) {
      this.selectedOppositionSchools = schools;
      this.updateStepComplete();
    },
    onSpellsSelected(spells) {
      this.selectedSpells = spells;
      this.updateStepComplete();
    },
    updateStepComplete() {
      this.$emit('step-complete', this.isStepComplete);
    },
    getRequiredSpellCount() {
      // Get current ability scores from localStorage
      const abilityScores = JSON.parse(localStorage.getItem('currentAbilityScores') || '{}');
      let intelligence = 10; // Default fallback
      
      // Try both 'Intelligence' and 'INT' as the key
      if (abilityScores && abilityScores.scores) {
        if (abilityScores.scores.Intelligence) {
          intelligence = abilityScores.scores.Intelligence;
        } else if (abilityScores.scores.INT) {
          intelligence = abilityScores.scores.INT;
        }
      }
      
      // Calculate Intelligence bonus (score - 10) / 2, rounded down
      const intBonus = Math.floor((intelligence - 10) / 2);
      
      // Base 3 spells + Intelligence bonus, minimum 0
      return Math.max(0, 3 + intBonus);
    },
    getClassData() {
      if (!this.selectedClass) return null;
      
      const data = {
        selectedClass: this.selectedClass,
        classData: this.selectedClassData
      };
      
      
      // Add Fighter-specific data
      if (this.selectedClass === 'Fighter' && this.selectedBonusFeat) {
        data.bonusFeat = this.selectedBonusFeat;
      }
      
      // Add Wizard-specific data
      if (this.selectedClass === 'Wizard') {
        if (this.selectedArcaneBond) data.arcaneBond = this.selectedArcaneBond;
        if (this.selectedFamiliar) data.familiar = this.selectedFamiliar;
        if (this.selectedBondedObject) data.bondedObject = this.selectedBondedObject;
        if (this.selectedWeapon) data.weapon = this.selectedWeapon;
        if (this.selectedArcaneSchool) data.arcaneSchool = this.selectedArcaneSchool;
        if (this.selectedOppositionSchools.length > 0) data.oppositionSchools = this.selectedOppositionSchools;
        if (this.selectedSpells.length > 0) data.startingSpells = this.selectedSpells;
      }
      
      return data;
    }
  },
  watch: {
    isStepComplete: {
      handler(newValue) {
        this.$emit('step-complete', newValue);
      },
      immediate: true
    }
  },
  async mounted() {
    // Load external data first
    await this.loadData();
    
    // Check if we already have saved data
    const savedBasicInfo = CharacterDataService.getBasicInfo();
    if (savedBasicInfo) {
      if (savedBasicInfo.class) {
        this.selectedClass = savedBasicInfo.class;
        this.showClassSelection = false;
      }
      
      if (savedBasicInfo.bonusFeat) {
        this.selectedBonusFeat = savedBasicInfo.bonusFeat;
      }
      
      // Restore Wizard options if saved
      if (savedBasicInfo.arcaneBond) {
        this.selectedArcaneBond = savedBasicInfo.arcaneBond;
      }
      if (savedBasicInfo.familiar) {
        this.selectedFamiliar = savedBasicInfo.familiar;
      }
      if (savedBasicInfo.bondedObject) {
        this.selectedBondedObject = savedBasicInfo.bondedObject;
      }
      if (savedBasicInfo.weapon) {
        this.selectedWeapon = savedBasicInfo.weapon;
      }
      if (savedBasicInfo.arcaneSchool) {
        this.selectedArcaneSchool = savedBasicInfo.arcaneSchool;
      }
      if (savedBasicInfo.oppositionSchools) {
        this.selectedOppositionSchools = savedBasicInfo.oppositionSchools;
      }
      if (savedBasicInfo.startingSpells) {
        this.selectedSpells = savedBasicInfo.startingSpells;
      }
    }
    
    this.updateStepComplete();
  },
  template: `
    <div>
      <class-selector
        :selected-class="selectedClass"
        :show-class-selection="showClassSelection"
        @class-selected="onClassSelected"
        @toggle-selection="onToggleSelection"
      ></class-selector>

      <class-details-display
        v-if="selectedClass"
        :selected-class="selectedClass"
        :class-data="selectedClassData"
      ></class-details-display>

      <first-level-options
        v-if="selectedClass"
        :selected-class="selectedClass"
        :selected-bonus-feat="selectedBonusFeat"
        :selected-arcane-bond="selectedArcaneBond"
        :selected-familiar="selectedFamiliar"
        :selected-bonded-object="selectedBondedObject"
        :selected-weapon="selectedWeapon"
        :selected-arcane-school="selectedArcaneSchool"
        :selected-opposition-schools="selectedOppositionSchools"
        :selected-spells="selectedSpells"
        @feat-selected="onFeatSelected"
        @arcane-bond-selected="onArcaneBondSelected"
        @familiar-selected="onFamiliarSelected"
        @bonded-object-selected="onBondedObjectSelected"
        @weapon-selected="onWeaponSelected"
        @arcane-school-selected="onArcaneSchoolSelected"
        @opposition-schools-selected="onOppositionSchoolsSelected"
        @spells-selected="onSpellsSelected"
      ></first-level-options>
    </div>
  `
});