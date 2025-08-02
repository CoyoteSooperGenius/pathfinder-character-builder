Vue.component('ability-scores-display', {
  data() {
    return {
      abilities: [
        { name: 'STR', label: 'Strength', value: null },
        { name: 'DEX', label: 'Dexterity', value: null },
        { name: 'CON', label: 'Constitution', value: null },
        { name: 'INT', label: 'Intelligence', value: null },
        { name: 'WIS', label: 'Wisdom', value: null },
        { name: 'CHA', label: 'Charisma', value: null }
      ]
    };
  },
  computed: {
    hasAbilityScores() {
      return this.abilities.some(ability => ability.value !== null);
    }
  },
  methods: {
    updateAbilityScores() {
      const abilityData = CharacterDataService.getAbilityScores();
      if (abilityData && abilityData.scores) {
        this.abilities.forEach(ability => {
          const score = abilityData.scores[ability.name];
          ability.value = score !== undefined ? score : null;
        });
      }
    },
    getModifierText(score) {
      if (score === null || score === undefined) return '—';
      const modifier = AbilityCalculator.getModifier(score);
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }
  },
  mounted() {
    this.updateAbilityScores();
  },
  template: `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-fist-raised me-2"></i>Ability Scores
          </h5>
        </div>
        <div class="card-body">
          <div v-if="hasAbilityScores" class="row g-2">
            <div 
              v-for="ability in abilities" 
              :key="ability.name"
              class="col-6"
            >
              <div class="text-center border rounded p-2">
                <div class="fw-bold">{{ ability.name }}</div>
                <div class="fs-4 fw-bold text-primary">
                  {{ ability.value || '—' }}
                </div>
                <div class="small text-muted">
                  {{ getModifierText(ability.value) }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-muted text-center">
            No ability scores set yet.
          </div>
        </div>
      </div>
    </div>
  `
});