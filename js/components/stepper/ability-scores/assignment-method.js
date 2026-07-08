// Assignment Method Component
// Handles both Standard Array and Dice Roll methods (they share assignment logic)

Vue.component('assignment-method', {
  props: {
    character: {
      type: Object,
      required: true
    },
    method: {
      type: String,
      required: true,
      validator: value => ['standardArray', 'diceRoll'].includes(value)
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // Dice rolling state
      rolledValues: [],
      diceAssignments: {
        strength: null,
        dexterity: null,
        constitution: null,
        intelligence: null,
        wisdom: null,
        charisma: null
      },
      selectedDiceIndex: null,

      // Standard Array state
      standardArray: [15, 14, 13, 12, 10, 8],
      standardArrayValues: [],
      standardArrayAssignments: {
        strength: null,
        dexterity: null,
        constitution: null,
        intelligence: null,
        wisdom: null,
        charisma: null
      },
      selectedStandardIndex: null,

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

    // Determine which values pool to show based on method
    valuesPool() {
      return this.method === 'standardArray' ? this.standardArrayValues : this.rolledValues;
    },

    // Determine which selected index to use
    selectedIndex() {
      return this.method === 'standardArray' ? this.selectedStandardIndex : this.selectedDiceIndex;
    },

    // Determine title based on method
    cardTitle() {
      return this.method === 'standardArray' ? 'Standard Array Assignment' : 'Roll 4d6, Drop Lowest';
    },

    // Determine instruction text based on method
    instructionText() {
      return this.method === 'standardArray'
        ? 'Assign these standard values to your abilities'
        : 'Roll 6 sets of dice, then drag or click to assign to abilities';
    },

    // Complete when every ability has a value assigned for the current method
    isComplete() {
      const assignments = this.method === 'standardArray' ? this.standardArrayAssignments : this.diceAssignments;
      return Object.values(assignments).every(assignment => assignment !== null);
    }
  },

  watch: {
    isActive: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.initializeMethod();
        }
      }
    },

    method: {
      immediate: true,
      handler() {
        if (this.isActive) {
          this.initializeMethod();
        }
      }
    },

    isComplete: {
      immediate: true,
      handler(complete) {
        this.$emit('completion-changed', complete);
      }
    }
  },

  methods: {
    initializeMethod() {
      if (this.method === 'standardArray') {
        this.initializeStandardArray();
      } else if (this.method === 'diceRoll') {
        this.rollAbilityScores();
      }
    },

    initializeStandardArray() {
      this.standardArrayValues = this.standardArray.map((value, index) => ({
        id: index,
        value: value,
        assigned: false
      }));

      this.standardArrayAssignments = {
        strength: null,
        dexterity: null,
        constitution: null,
        intelligence: null,
        wisdom: null,
        charisma: null
      };

      const resetScores = {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      };
      this.updateCharacterScores(resetScores);
    },

    rollAbilityScores() {
      this.diceAssignments = {
        strength: null,
        dexterity: null,
        constitution: null,
        intelligence: null,
        wisdom: null,
        charisma: null
      };

      this.rolledValues = [];
      for (let i = 0; i < 6; i++) {
        const rolls = [];
        for (let j = 0; j < 4; j++) {
          rolls.push(Math.floor(Math.random() * 6) + 1);
        }
        rolls.sort((a, b) => b - a);
        const value = rolls[0] + rolls[1] + rolls[2];

        this.rolledValues.push({
          id: i,
          value: value,
          rolls: rolls,
          assigned: false
        });
      }

      this.rolledValues.sort((a, b) => b.value - a.value);

      const resetScores = {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      };
      this.updateCharacterScores(resetScores);
    },

    // Dice rolling methods
    selectDiceValue(diceIndex) {
      if (this.rolledValues[diceIndex].assigned) {
        return;
      }
      this.selectedDiceIndex = this.selectedDiceIndex === diceIndex ? null : diceIndex;
    },

    assignDiceValue(diceIndex, ability) {
      if (this.diceAssignments[ability] !== null) {
        const oldDiceIndex = this.diceAssignments[ability];
        this.rolledValues[oldDiceIndex].assigned = false;
      }

      for (const [abilityName, assignedDiceIndex] of Object.entries(this.diceAssignments)) {
        if (assignedDiceIndex === diceIndex) {
          this.diceAssignments[abilityName] = null;
        }
      }

      this.diceAssignments[ability] = diceIndex;
      this.rolledValues[diceIndex].assigned = true;

      this.updateDiceCharacterScores();
    },

    unassignDiceValue(ability) {
      if (this.diceAssignments[ability] !== null) {
        const diceIndex = this.diceAssignments[ability];
        this.rolledValues[diceIndex].assigned = false;
        this.diceAssignments[ability] = null;
        this.updateDiceCharacterScores();
      }
    },

    updateDiceCharacterScores() {
      const scores = {};
      for (const ability of Object.keys(this.abilityNames)) {
        const diceIndex = this.diceAssignments[ability];
        scores[ability] = diceIndex !== null ? this.rolledValues[diceIndex].value : 10;
      }
      this.updateCharacterScores(scores);
    },

    getAssignedDiceValue(ability) {
      const diceIndex = this.diceAssignments[ability];
      return diceIndex !== null ? this.rolledValues[diceIndex] : null;
    },

    // Standard Array methods
    selectStandardValue(standardIndex) {
      if (this.standardArrayValues[standardIndex].assigned) {
        return;
      }
      this.selectedStandardIndex = this.selectedStandardIndex === standardIndex ? null : standardIndex;
    },

    assignStandardValue(standardIndex, ability) {
      if (this.standardArrayAssignments[ability] !== null) {
        const oldStandardIndex = this.standardArrayAssignments[ability];
        this.standardArrayValues[oldStandardIndex].assigned = false;
      }

      for (const [abilityName, assignedStandardIndex] of Object.entries(this.standardArrayAssignments)) {
        if (assignedStandardIndex === standardIndex) {
          this.standardArrayAssignments[abilityName] = null;
        }
      }

      this.standardArrayAssignments[ability] = standardIndex;
      this.standardArrayValues[standardIndex].assigned = true;

      this.updateStandardCharacterScores();
    },

    unassignStandardValue(ability) {
      if (this.standardArrayAssignments[ability] !== null) {
        const standardIndex = this.standardArrayAssignments[ability];
        this.standardArrayValues[standardIndex].assigned = false;
        this.standardArrayAssignments[ability] = null;
        this.updateStandardCharacterScores();
      }
    },

    updateStandardCharacterScores() {
      const scores = {};
      for (const ability of Object.keys(this.abilityNames)) {
        const standardIndex = this.standardArrayAssignments[ability];
        scores[ability] = standardIndex !== null ? this.standardArrayValues[standardIndex].value : 10;
      }
      this.updateCharacterScores(scores);
    },

    getAssignedStandardValue(ability) {
      const standardIndex = this.standardArrayAssignments[ability];
      return standardIndex !== null ? this.standardArrayValues[standardIndex] : null;
    },

    // Common assignment method
    assignToAbility(ability) {
      if (this.method === 'diceRoll' && this.selectedDiceIndex !== null) {
        this.assignDiceValue(this.selectedDiceIndex, ability);
        this.selectedDiceIndex = null;
      } else if (this.method === 'standardArray' && this.selectedStandardIndex !== null) {
        this.assignStandardValue(this.selectedStandardIndex, ability);
        this.selectedStandardIndex = null;
      }
    },

    // Drag and drop handlers
    onDragStart(event, diceIndex) {
      if (this.rolledValues[diceIndex].assigned) {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData('diceIndex', diceIndex.toString());
      event.dataTransfer.effectAllowed = 'move';
    },

    onStandardDragStart(event, standardIndex) {
      if (this.standardArrayValues[standardIndex].assigned) {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData('standardIndex', standardIndex.toString());
      event.dataTransfer.effectAllowed = 'move';
    },

    onDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },

    onDrop(event, ability) {
      event.preventDefault();
      const diceIndex = parseInt(event.dataTransfer.getData('diceIndex'));
      const standardIndex = parseInt(event.dataTransfer.getData('standardIndex'));

      if (!isNaN(diceIndex)) {
        this.assignDiceValue(diceIndex, ability);
      } else if (!isNaN(standardIndex)) {
        this.assignStandardValue(standardIndex, ability);
      }
    },

    updateCharacterScores(scores) {
      Object.assign(this.character.abilityScores, scores);
      this.$emit('scores-changed');
    },

    getModifierText(modifier) {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    },

    // Method-specific helpers
    selectValue(index) {
      if (this.method === 'standardArray') {
        this.selectStandardValue(index);
      } else {
        this.selectDiceValue(index);
      }
    },

    getAssignedValue(ability) {
      return this.method === 'standardArray' 
        ? this.getAssignedStandardValue(ability)
        : this.getAssignedDiceValue(ability);
    },

    unassignValue(ability) {
      if (this.method === 'standardArray') {
        this.unassignStandardValue(ability);
      } else {
        this.unassignDiceValue(ability);
      }
    }
  },

  template: `
    <div v-if="isActive" class="assignment-method">
      <div class="mb-4">
        <div>
          <pf-card :title="cardTitle">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span>{{ instructionText }}</span>
              <pf-button 
                v-if="method === 'diceRoll'"
                variant="secondary" 
                icon="fa-dice" 
                @click="rollAbilityScores"
              >
                {{ rolledValues.length ? 'Reroll All' : 'Roll Dice' }}
              </pf-button>
            </div>
            
            <!-- Values Pool -->
            <div v-if="valuesPool.length" class="mb-4">
              <h6 class="mb-3">
                {{ method === 'standardArray' ? 'Standard Array Values' : 'Rolled Values' }}
                <small class="text-muted">(drag to ability or click to select, then click ability)</small>
              </h6>
              <div class="d-flex flex-wrap gap-2">
                <div 
                  v-for="(value, index) in valuesPool" 
                  :key="value.id"
                  :class="[
                    'dice-value', 'pf-btn', 'position-relative',
                    value.assigned ? 'pf-btn--outline-secondary' :
                    selectedIndex === index ? 'pf-btn--warning' : 'pf-btn--primary'
                  ]"
                  :style="{
                    cursor: value.assigned ? 'not-allowed' : 'grab',
                    minWidth: '70px',
                    opacity: value.assigned ? 0.6 : 1
                  }"
                  :draggable="!value.assigned"
                  @click="selectValue(index)"
                  @dragstart="method === 'standardArray' ? onStandardDragStart($event, index) : onDragStart($event, index)"
                >
                  <div class="fw-bold">{{ value.value }}</div>
                  <small 
                    :class="[
                      'd-block',
                      value.assigned ? 'text-muted' : 'text-white'
                    ]"
                    style="text-shadow: 0 0 2px rgba(0,0,0,0.5);"
                  >
                    {{ method === 'standardArray' ? 'Standard' : value.rolls.join(',') }}
                  </small>
                  <small v-if="value.assigned" class="d-block text-success">
                    <i class="fas fa-check"></i> Used
                  </small>
                  <small v-else-if="selectedIndex === index" class="d-block text-dark">
                    <i class="fas fa-hand-pointer"></i> Selected
                  </small>
                </div>
              </div>
              <div v-if="selectedIndex !== null" class="mt-2 text-info">
                <small>
                  <i class="fas fa-info-circle"></i> 
                  Selected value {{ valuesPool[selectedIndex]?.value }}. Click an ability score to assign it.
                </small>
              </div>
            </div>
            
            <!-- Ability Score Assignment Grid -->
            <div v-if="valuesPool.length" class="pf-grid pf-grid--2">
              <div v-for="ability in Object.keys(abilityNames)" :key="ability">
                <div 
                  :class="[
                    'ability-score-control', 'p-3', 'border', 'rounded',
                    selectedIndex !== null && !getAssignedValue(ability) ? 'drop-target' : ''
                  ]"
                  :style="{
                    cursor: selectedIndex !== null ? 'pointer' : 'default',
                    transition: 'all 0.2s ease'
                  }"
                  @click="assignToAbility(ability)"
                  @dragover="onDragOver"
                  @drop="onDrop($event, ability)"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="flex-grow-1">
                      <strong>{{ abilityNames[ability] }}</strong>
                      <br>
                      <small class="text-muted">{{ abilityDescriptions[ability] }}</small>
                      <div v-if="selectedIndex !== null && !getAssignedValue(ability)" class="mt-1">
                        <small class="text-primary">
                          <i class="fas fa-arrow-down"></i> Click to assign {{ valuesPool[selectedIndex]?.value }}
                        </small>
                      </div>
                    </div>
                    <div class="text-center">
                      <div class="h4 mb-0">{{ currentScores[ability] }}</div>
                      <small class="text-muted">({{ getModifierText(abilityModifiers[ability]) }})</small>
                      <div v-if="getAssignedValue(ability)" class="mt-2">
                        <small class="text-success d-block">
                          {{ method === 'standardArray' ? 'Standard Array Value' : 'Rolls: ' + getAssignedValue(ability).rolls.join(', ') }}
                        </small>
                        <pf-button 
                          variant="danger" 
                          size="sm" 
                          icon="fa-times"
                          @click.stop="unassignValue(ability)"
                        >
                          Remove
                        </pf-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </pf-card>
        </div>
      </div>
    </div>
  `
});