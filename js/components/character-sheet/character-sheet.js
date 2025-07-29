Vue.component('character-sheet', { 
  data() {
    return {
      sheetSections: [
        {
          title: 'Basics',
          listKey: 'basics',
          fields: [
            { label: 'Name', key: 'name', value: 'Valeros' },
            { label: 'Race', key: 'race', value: 'Human' },
            { label: 'Class', key: 'class', value: 'Fighter' },
            { label: 'Level', key: 'level', value: 1 },
            { label: 'Alignment', key: 'alignment', value: 'Neutral Good' },
          ]
        },
        {
          title: 'Ability Scores',
          listKey: 'abilities',
          fields: [
            { label: 'STR', key: 'abilities.str', value: 10, bonus: 0 },
            { label: 'DEX', key: 'abilities.dex', value: 10, bonus: 0 },
            { label: 'CON', key: 'abilities.con', value: 10, bonus: 0 },
            { label: 'INT', key: 'abilities.int', value: 10, bonus: 0 },
            { label: 'WIS', key: 'abilities.wis', value: 10, bonus: 0 },
            { label: 'CHA', key: 'abilities.cha', value: 10, bonus: 0 }
          ]
        },
        {
          title: 'Skills',
          listKey: 'skills',
          listFields: [
            { label: 'Riding', key: 'riding', value: '5' },
            { label: 'Athletics', key: 'athletics', value: '3' },
            { label: 'Perception', key: 'perception', value: '2' },
          ]
        },
        {
          title: 'Feats',
          listKey: 'feats',
          listFields: [
            { label: 'Weapon Focus', key: 'weaponFocus', value: 'Longsword' },
            { label: 'Power Attack', key: 'powerAttack', value: 'Yes' }
          ]
        },
        {
          title: 'Equipment',
          listKey: 'equipment',
          listFields: [
            { label: 'Longsword', key: 'longsword', cost: '7gp', weight: '3 lbs' },
            { label: 'Shield', key: 'shield', cost: '5gp', weight: '6 lbs' },
            { label: 'Chainmail', key: 'chainmail', cost: '150gp', weight: '40 lbs' },
            { label: 'Backpack', key: 'backpack', cost: '2gp', weight: '2 lbs' }
          ]
        },
        {
          title: 'Details',
          fields: [
            { label: 'Background', key: 'background', value: 'A seasoned mercenary who fights for justice and gold.' },
            { label: 'Notes', key: 'notes', value: 'Prefers melee combat. Loyal to friends.'}
          ]
        }
      ]
    };
  },
  methods: {
    getValue(key, def) {
      // No character object, just return the default value
      return def ?? '—';
    }
  },
  template: `
    <div class="character-sheet-container">
      <div class="mb-4 text-center">
        <h2 class="display-5 fw-bold">{{ sheetSections[0].fields[0].value }}</h2>
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
                      {{ getValue(field.key, field.value) }} 
                      <span class="badge bg-secondary ms-1">
                        {{ field.bonus >= 0 ? '+' : '' }}{{ field.bonus }}
                      </span>
                    </span>
                    <span v-else>
                      {{ getValue(field.key, field.value) }}
                    </span>
                  </span>
                </li>
              </ul>
              <!-- Render listFields (Skills, Feats, Equipment) -->
              <ul v-if="section.listFields" class="list-group list-group-flush">
                <li v-for="item in section.listFields" :key="item.label" class="list-group-item">
                  <span class="fw-semibold">{{ item.label }}</span>:
                  <span v-if="item.value !== undefined">{{ getValue(item.key, item.value) }}</span>
                  <span v-if="item.cost" class="text-muted ms-2">| Cost: {{ item.cost }}</span>
                  <span v-if="item.weight" class="text-muted ms-2">| Weight: {{ item.weight }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  mounted() {
    // You can add logic here if needed
  }
});