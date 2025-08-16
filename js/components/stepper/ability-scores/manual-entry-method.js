// Manual Entry Method Component
// Handles manual ability score entry with validation

Vue.component('manual-entry-method', {
  props: {
    character: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // Manual entry state
      tempScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },

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

  watch: {
    isActive: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.initializeManual();
        }
      }
    }
  },

  methods: {
    initializeManual() {
      this.tempScores = { ...this.character.abilityScores };
    },

    setManualScore(ability, value) {
      const numValue = parseInt(value);
      if (GameUtils.isValidAbilityScore(numValue)) {
        this.tempScores[ability] = numValue;
      }
    },

    applyManualScores() {
      this.updateCharacterScores(this.tempScores);
    },

    updateCharacterScores(scores) {
      Object.assign(this.character.abilityScores, scores);
      this.$emit('scores-changed');
    },

    getModifierText(modifier) {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }
  },

  template: `
    <div v-if="isActive" class="manual-entry-method">
      <div class="row mb-4">
        <div class="col-12">
          <pf-card title="Manual Entry">
            <template #subtitle>
              Enter ability scores between 3 and 25
            </template>
            
            <div class="row g-3">
              <div v-for="ability in Object.keys(abilityNames)" :key="ability" class="col-md-6">
                <div class="ability-score-control p-3 border rounded">
                  <div class="mb-2">
                    <strong>{{ abilityNames[ability] }}</strong>
                    <br>
                    <small class="text-muted">{{ abilityDescriptions[ability] }}</small>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <input 
                      type="number" 
                      class="form-control me-3" 
                      :value="tempScores[ability]"
                      @input="setManualScore(ability, $event.target.value)"
                      min="3" 
                      max="25"
                      style="max-width: 80px;"
                    >
                    <div class="text-center">
                      <div class="h5 mb-0">{{ tempScores[ability] }}</div>
                      <small class="text-muted">({{ getModifierText(GameUtils.calculateAbilityModifier(tempScores[ability])) }})</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="d-flex justify-content-end mt-3">
              <pf-button variant="primary" @click="applyManualScores">
                Apply Scores
              </pf-button>
            </div>
          </pf-card>
        </div>
      </div>
    </div>
  `
});