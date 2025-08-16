// Ability Score Generator Component
// Handles all ability score generation methods (Point Buy, Standard Array, Dice Rolling, Manual Entry)

Vue.component('ability-score-generator', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      selectedMethod: this.character.abilityScoreMethod || 'pointBuy',
      
      
      
      
      // Make GameUtils available to the template
      GameUtils: window.GameUtils,
      
      // Ability information
      abilityNames: {
        strength: 'Strength',
        dexterity: 'Dexterity', 
        constitution: 'Constitution',
        intelligence: 'Intelligence',
        wisdom: 'Wisdom',
        charisma: 'Charisma'
      },
      
      abilityDescriptions: {
        strength: 'Physical power, affects melee attack rolls, damage, carrying capacity',
        dexterity: 'Agility and reflexes, affects AC, ranged attacks, initiative',
        constitution: 'Health and stamina, affects hit points and fortitude saves',
        intelligence: 'Reasoning and memory, affects skill points and knowledge',
        wisdom: 'Awareness and insight, affects perception and will saves',
        charisma: 'Force of personality, affects social skills and spell DCs'
      }
    };
  },

  computed: {
    currentScores() {
      return this.character.abilityScores;
    },

    abilityModifiers() {
      return GameUtils.calculateAbilityModifiers(this.currentScores);
    },

  },

  watch: {
    selectedMethod(newMethod) {
      this.initializeMethod(newMethod);
      this.updateCharacterMethod(newMethod);
    }
  },

  mounted() {
    this.initializeMethod(this.selectedMethod);
  },

  methods: {
    // Handle method change from child component
    onMethodChanged(method) {
      this.selectedMethod = method;
      this.initializeMethod(method);
      this.updateCharacterMethod(method);
    },

    // Handle scores changed from child components
    onScoresChanged() {
      this.$emit('scores-changed');
    },

    // Initialization methods
    initializeMethod(method) {
      switch (method) {
        case 'pointBuy':
          // Point Buy initialization is handled by the component
          break;
        case 'standardArray':
          // Standard Array initialization is handled by the component
          break;
        case 'diceRoll':
          // Dice Roll initialization is handled by the component
          break;
        case 'manual':
          // Manual entry initialization is handled by the component
          break;
      }
    },





    updateCharacterScores(scores) {
      Object.assign(this.character.abilityScores, scores);
      this.$emit('scores-changed');
    },
    
    updateCharacterMethod(method) {
      this.character.abilityScoreMethod = method;
    },




    // Utility methods
    getModifierText(modifier) {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }
  },

  template: `
    <div class="ability-score-generator">
      <!-- Generation Method Selection -->
      <generation-method-selector
        :selected-method="selectedMethod"
        @method-changed="onMethodChanged"
      ></generation-method-selector>

      <!-- Point Buy Method -->
      <point-buy-method
        :character="character"
        :is-active="selectedMethod === 'pointBuy'"
        @scores-changed="onScoresChanged"
      ></point-buy-method>

      <!-- Assignment Method (Standard Array + Dice Roll) -->
      <assignment-method
        :character="character"
        :method="selectedMethod"
        :is-active="selectedMethod === 'standardArray' || selectedMethod === 'diceRoll'"
        @scores-changed="onScoresChanged"
      ></assignment-method>

      <!-- Manual Entry Method -->
      <manual-entry-method
        :character="character"
        :is-active="selectedMethod === 'manual'"
        @scores-changed="onScoresChanged"
      ></manual-entry-method>
    </div>
  `
});