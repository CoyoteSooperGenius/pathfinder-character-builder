Vue.component('character-sheet', { 
  data() {
    return {
      sheetSections: [
        {
          title: 'Basics',
          listKey: 'basics',
          fields: [
            { label: 'Name', key: 'name', value: '' },
            { label: 'Race', key: 'race', value: '' },
            { label: 'Class', key: 'class', value: '' },
            { label: 'Level', key: 'level', value: '' },
            { label: 'Alignment', key: 'alignment', value: '' },
            { label: 'Favored Class(es)', key: 'favoredClasses', value: '' }
          ]
        },
        {
          title: 'Ability Scores',
          listKey: 'abilities',
          fields: [
            { label: 'STR', key: 'abilities.str', value: '', bonus: '' },
            { label: 'DEX', key: 'abilities.dex', value: '', bonus: '' },
            { label: 'CON', key: 'abilities.con', value: '', bonus: '' },
            { label: 'INT', key: 'abilities.int', value: '', bonus: '' },
            { label: 'WIS', key: 'abilities.wis', value: '', bonus: '' },
            { label: 'CHA', key: 'abilities.cha', value: '', bonus: '' }
          ]
        },
        {
          title: 'Skills',
          listKey: 'skills',
          listFields: []
        },
        {
          title: 'Feats',
          listKey: 'feats',
          listFields: []
        },
        {
          title: 'Equipment',
          listKey: 'equipment',
          listFields: []
        },
        {
          title: 'Details',
          listKey: 'details',
          fields: [
            { label: 'Background', key: 'background', value: '' },
            { label: 'Languages', key: 'languages', value: '' },
            { label: 'Notes', key: 'notes', value: ''}
          ]
        },
        {
          title: 'Traits',
          listKey: 'traits',
          listFields: []
        }
      ]
    };
  },
  methods: {
    getValue(key, def) {
      return def || '—';
    },
    updateAbilityScores() {
      const abilityData = CharacterDataService.getAbilityScores();
      if (abilityData && abilityData.scores) {
        const abilitiesSection = this.sheetSections.find(section => section.listKey === 'abilities');
        
        if (abilitiesSection) {
          abilitiesSection.fields.forEach(field => {
            const abilityName = field.label;
            const score = abilityData.scores[abilityName];
            if (score !== undefined) {
              field.value = score;
              field.bonus = AbilityCalculator.formatAbilityScore(score);
            }
          });
        }
      }
    },
    updateBasicInfo() {
      const savedBasicInfo = localStorage.getItem('currentBasicInfo');
      if (savedBasicInfo) {
        try {
          const basicInfo = JSON.parse(savedBasicInfo);
          const basicsSection = this.sheetSections.find(section => section.listKey === 'basics');
          
          if (basicsSection) {
            // Update race
            const raceField = basicsSection.fields.find(field => field.key === 'race');
            if (raceField) {
              raceField.value = basicInfo.race || '';
            }
            
            // Update favored classes
            const favoredClassField = basicsSection.fields.find(field => field.key === 'favoredClasses');
            if (favoredClassField && basicInfo.favoredClasses) {
              favoredClassField.value = basicInfo.favoredClasses.join(', ');
            }
          }
        } catch (e) {
          console.warn('Error parsing basic info from localStorage:', e);
        }
      }
    },
    updateDetails() {
      const savedDetails = localStorage.getItem('currentDetails');
      if (savedDetails) {
        try {
          const details = JSON.parse(savedDetails);
          const detailsSection = this.sheetSections.find(section => section.listKey === 'details');
          
          if (detailsSection) {
            // Update languages
            const languagesField = detailsSection.fields.find(field => field.key === 'languages');
            if (languagesField && details.languages) {
              languagesField.value = details.languages.join(', ');
            }
          }
        } catch (e) {
          console.warn('Error parsing details from localStorage:', e);
        }
      }
    },
    updateTraits() {
      const savedTraits = localStorage.getItem('currentTraits');
      if (savedTraits) {
        try {
          const traitsData = JSON.parse(savedTraits);
          const traitsSection = this.sheetSections.find(section => section.listKey === 'traits');
          
          if (traitsSection && traitsData.racialTraits) {
            traitsSection.listFields = traitsData.racialTraits.map(trait => ({
              label: trait.Label,
              description: trait.Description,
              type: 'racial'
            }));
          }
        } catch (e) {
          console.warn('Error parsing traits from localStorage:', e);
        }
      }
    },
    updateFromLocalStorage() {
      // Update all sections from localStorage using CharacterDataService
      this.updateAbilityScores();
      this.updateBasicInfo();
      this.updateDetails();
      this.updateTraits();
    },
    calculateBonus(score) {
      return AbilityCalculator.getModifier(score);
    }
  },
  template: `
    <div class="character-sheet-container">
      <div class="mb-4 text-center">
        <h2 class="display-5 fw-bold">{{ sheetSections[0].fields[0].value || 'Untitled Character' }}</h2>
      </div>
      <div class="row g-4">
        <div 
          v-for="section in sheetSections" 
          :key="section.title" 
          class="col-12 col-md-6"
        >
          <div class="card h-100 shadow-sm">
            <div class="card-header bg-primary text-white">
              <h3 class="h5 mb-0">{{ section.title }}</h3>
            </div>
            <div class="card-body">
              <!-- Render fields (Basics, Ability Scores, Details) -->
              <ul v-if="section.fields" class="list-group list-group-flush">
                <li v-for="field in section.fields" :key="field.label" class="list-group-item d-flex justify-content-between align-items-center">
                  <span class="fw-semibold">{{ field.label }}</span>
                  <span>
                    <span v-if="field.bonus !== undefined">
                      {{ getValue(field.key, field.value) || '—' }} 
                      <span v-if="field.bonus !== ''" class="badge bg-secondary ms-1">
                        {{ field.bonus }}
                      </span>
                    </span>
                    <span v-else>
                      {{ getValue(field.key, field.value) || '—' }}
                    </span>
                  </span>
                </li>
              </ul>
              <!-- Render listFields (Skills, Feats, Equipment, Traits) -->
              <div v-if="section.listFields !== undefined">
                <div v-if="section.listFields.length === 0" class="text-muted">
                  No {{ section.title.toLowerCase() }} selected yet.
                </div>
                <div v-for="item in section.listFields" :key="item.label" class="mb-3 p-2 border rounded">
                  <div class="fw-semibold text-primary">{{ item.label }}</div>
                  <div v-if="item.description" class="small text-muted mt-1">{{ item.description }}</div>
                  <div v-if="item.value !== undefined" class="small">{{ getValue(item.key, item.value) }}</div>
                  <div v-if="item.cost || item.weight" class="small text-muted">
                    <span v-if="item.cost">Cost: {{ item.cost }}</span>
                    <span v-if="item.cost && item.weight"> | </span>
                    <span v-if="item.weight">Weight: {{ item.weight }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  mounted() {
    this.updateFromLocalStorage();
  }
});