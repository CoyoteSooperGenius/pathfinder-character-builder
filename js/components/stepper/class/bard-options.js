Vue.component('bard-options', {
  props: {
    classData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      availableCantrips: [],
      availableFirstLevelSpells: [],
      selectedSpells: {
        cantrips: [],
        firstLevel: []
      },
      spellsLoaded: false
    };
  },
  computed: {
    spellSelections() {
      return [
        {
          type: 'cantrips',
          label: 'Cantrips (0-level)',
          icon: 'fa-sparkles',
          count: 4,
          description: 'Choose 4 cantrips (0-level spells) that your bard knows. You can cast these cantrips at will.',
          spells: this.availableCantrips
        },
        {
          type: 'firstLevel',
          label: '1st Level Spells',
          icon: 'fa-magic',
          count: 2,
          description: 'Choose 2 1st-level spells that your bard knows. You can cast 1 of these spells per day.',
          spells: this.availableFirstLevelSpells
        }
      ];
    },
    isComplete() {
      return this.selectedSpells.cantrips.length === 4 && 
             this.selectedSpells.firstLevel.length === 2;
    }
  },
  watch: {
    selectedSpells: {
      handler() {
        this.$emit('spells-changed', {
          selectedCantrips: this.selectedSpells.cantrips,
          selectedFirstLevelSpells: this.selectedSpells.firstLevel
        });
      },
      deep: true
    },
    isComplete() {
      this.$emit('completion-changed', this.isComplete);
    }
  },
  async mounted() {
    await this.loadSpells();
    this.loadFromClassData();
  },
  methods: {
    async loadSpells() {
      try {
        const response = await fetch('data/spells.json');
        const data = await response.json();
        
        this.availableCantrips = data.bardSpells.cantrips || [];
        this.availableFirstLevelSpells = data.bardSpells.firstLevel || [];
        this.spellsLoaded = true;
      } catch (error) {
        console.error('Error loading spells:', error);
        this.spellsLoaded = true; // Still show interface even if loading fails
      }
    },
    
    loadFromClassData() {
      if (this.classData.selectedCantrips) {
        this.selectedSpells.cantrips = [...this.classData.selectedCantrips];
      }
      if (this.classData.selectedFirstLevelSpells) {
        this.selectedSpells.firstLevel = [...this.classData.selectedFirstLevelSpells];
      }
    },
    
    onSpellsChanged(newSelections) {
      this.selectedSpells = newSelections;
    }
  },
  template: `
    <spell-selector
      :spell-selections="spellSelections"
      :selected-spells="selectedSpells"
      :loading="!spellsLoaded"
      class-name="Bard"
      @spells-changed="onSpellsChanged"
    />
  `
});