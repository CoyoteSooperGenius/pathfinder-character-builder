Vue.component('class-step-coordinator', {
  data() {
    return {
      selectedClass: null,
      showClassSelection: true,
      selectedBonusFeat: null,
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
    updateStepComplete() {
      this.$emit('step-complete', this.isStepComplete);
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
        @feat-selected="onFeatSelected"
      ></first-level-options>
    </div>
  `
});