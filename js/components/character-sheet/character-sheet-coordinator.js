Vue.component('character-sheet-coordinator', {
  props: {
    character: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      characterName: 'Untitled Character',
      skills: [],
      feats: [],
      equipment: [],
      traits: []
    };
  },
  methods: {
    updateFromLocalStorage() {
      // Update character name from basic info
      const basicInfo = CharacterDataService.getBasicInfo();
      if (basicInfo && basicInfo.name) {
        this.characterName = basicInfo.name;
      }

      // Update skills (placeholder for when skills are implemented)
      this.skills = [];

      // Update feats
      this.updateFeats();

      // Update equipment (placeholder)
      this.equipment = [];

      // Update traits
      this.updateTraits();

      // Tell child components to update
      this.$refs.characterBasics?.updateBasicInfo();
      this.$refs.abilityScores?.updateAbilityScores();
      this.$refs.characterDetails?.updateDetails();
    },
    updateFeats() {
      const basicInfo = CharacterDataService.getBasicInfo();
      this.feats = [];
      
      // Add fighter bonus feat (if selected)
      if (basicInfo && basicInfo.class === 'Fighter' && basicInfo.bonusFeat) {
        this.feats.push({
          label: basicInfo.bonusFeat,
          description: 'Fighter bonus feat selected at 1st level.'
        });
      }
      
      // Add human bonus feat placeholder (only if no feat selected yet)
      // For Human Fighters, the fighter bonus feat IS their human bonus feat
      if (basicInfo && basicInfo.race === 'Human' && !basicInfo.bonusFeat) {
        this.feats.push({
          label: 'Human Bonus Feat',
          description: 'Humans select one extra feat at 1st level (selection pending).'
        });
      }
    },
    updateTraits() {
      const traitsData = CharacterDataService.getTraits();
      console.log('Raw traits data from localStorage:', traitsData);
      this.traits = [];
      
      if (traitsData && traitsData.racialTraits) {
        console.log('Processing racial traits:', traitsData.racialTraits);
        this.traits = traitsData.racialTraits.map(trait => {
          console.log('Processing trait:', trait);
          return {
            label: trait.Label,
            description: trait.Description
          };
        });
        console.log('Final formatted traits:', this.traits);
      } else {
        console.log('No racial traits found in localStorage');
      }
    },
    updateAbilityScores() {
      // Called by parent when ability scores change
      this.$refs.abilityScores?.updateAbilityScores();
    }
  },
  mounted() {
    this.updateFromLocalStorage();
  },
  template: `
    <div class="character-sheet-container">
      <div class="mb-4 text-center">
        <h2 class="display-5 fw-bold">{{ characterName }}</h2>
      </div>
      <div class="row g-4">
        <character-basics ref="characterBasics"></character-basics>
        
        <ability-scores-display ref="abilityScores"></ability-scores-display>
        
        <character-list-display 
          title="Skills" 
          icon="fas fa-tools"
          :items="skills"
          empty-message="No skills allocated yet."
        ></character-list-display>
        
        <character-list-display 
          title="Feats" 
          icon="fas fa-star"
          :items="feats"
          empty-message="No feats selected yet."
        ></character-list-display>
        
        <character-list-display 
          title="Equipment" 
          icon="fas fa-sword"
          :items="equipment"
          empty-message="No equipment purchased yet."
        ></character-list-display>
        
        <character-details ref="characterDetails"></character-details>
        
        <character-list-display 
          title="Traits" 
          icon="fas fa-magic"
          :items="traits"
          empty-message="No racial traits yet."
        ></character-list-display>
      </div>
    </div>
  `
});