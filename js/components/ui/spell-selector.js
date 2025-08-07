Vue.component('spell-selector', {
  props: {
    // Spell selection configuration
    spellSelections: {
      type: Array,
      required: true,
      // Format: [
      //   { type: 'cantrips', label: 'Cantrips', count: 4, description: '...', spells: [...] },
      //   { type: 'firstLevel', label: '1st Level Spells', count: 2, description: '...', spells: [...] }
      // ]
    },
    // Current selections
    selectedSpells: {
      type: Object,
      default: () => ({})
      // Format: { cantrips: [...], firstLevel: [...] }
    },
    // Loading state
    loading: {
      type: Boolean,
      default: false
    },
    // Class name for context
    className: {
      type: String,
      default: 'Spellcaster'
    }
  },
  computed: {
    isComplete() {
      return this.spellSelections.every(selection => 
        (this.selectedSpells[selection.type] || []).length === selection.count
      );
    }
  },
  methods: {
    selectSpell(selectionType, spell) {
      const currentSelections = this.selectedSpells[selectionType] || [];
      const selectionConfig = this.spellSelections.find(s => s.type === selectionType);
      
      if (currentSelections.length >= selectionConfig.count) {
        return; // Already at maximum
      }
      
      if (!currentSelections.find(s => s.name === spell.name)) {
        const newSelections = { ...this.selectedSpells };
        newSelections[selectionType] = [...currentSelections, spell];
        this.$emit('spells-changed', newSelections);
      }
    },
    
    removeSpell(selectionType, spell) {
      const currentSelections = this.selectedSpells[selectionType] || [];
      const index = currentSelections.findIndex(s => s.name === spell.name);
      
      if (index > -1) {
        const newSelections = { ...this.selectedSpells };
        newSelections[selectionType] = currentSelections.filter((_, i) => i !== index);
        this.$emit('spells-changed', newSelections);
      }
    },
    
    getSelectedCount(selectionType) {
      return (this.selectedSpells[selectionType] || []).length;
    },
    
    getAvailableSpells(selectionType) {
      const selectionConfig = this.spellSelections.find(s => s.type === selectionType);
      const selectedSpells = this.selectedSpells[selectionType] || [];
      
      return selectionConfig.spells.filter(spell => 
        !selectedSpells.find(s => s.name === spell.name)
      );
    }
  },
  template: `
    <div class="spell-selector">
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading spells...</span>
        </div>
        <p class="mt-2 text-muted">Loading spell data...</p>
      </div>
      
      <div v-else>
        <div v-for="selection in spellSelections" :key="selection.type" class="spell-selection-section mb-4">
          <div class="card">
            <div class="card-header bg-primary-subtle border-primary-border-subtle">
              <h6 class="mb-0">
                <i class="fas me-2" :class="selection.icon || 'fa-magic'"></i>
                {{ selection.label }} ({{ getSelectedCount(selection.type) }}/{{ selection.count }})
              </h6>
            </div>
            <div class="card-body">
              <p v-if="selection.description" class="text-muted small mb-3">
                {{ selection.description }}
              </p>
              
              <!-- Selected Spells -->
              <div v-if="getSelectedCount(selection.type) > 0" class="selected-spells mb-3">
                <div class="fw-semibold text-success mb-2">
                  <i class="fas fa-check me-1"></i>
                  Selected {{ selection.label }} ({{ getSelectedCount(selection.type) }}/{{ selection.count }}):
                </div>
                <div class="row g-2">
                  <div v-for="spell in selectedSpells[selection.type]" 
                       :key="'selected-' + selection.type + '-' + spell.name" 
                       class="col-md-6">
                    <div class="spell-card selected p-3 border-2 rounded-3 bg-success-subtle border-success shadow-sm mb-2">
                      <div class="d-flex justify-content-between align-items-start">
                        <div class="spell-info lh-14">
                          <div class="fw-semibold mb-1">{{ spell.name }}</div>
                          <div class="small text-muted mb-1">{{ spell.school }}</div>
                          <div class="small mb-0">{{ spell.description }}</div>
                        </div>
                        <button @click="removeSpell(selection.type, spell)" 
                                class="btn btn-outline-danger btn-sm">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Available Spells -->
              <div v-if="getSelectedCount(selection.type) < selection.count" class="available-spells">
                <div class="fw-semibold mb-2">Available {{ selection.label }}:</div>
                <div class="row g-2">
                  <div v-for="spell in getAvailableSpells(selection.type)" 
                       :key="'available-' + selection.type + '-' + spell.name"
                       class="col-md-6">
                    <div class="spell-card available p-3 border-2 rounded-3 bg-light border-secondary shadow-sm mb-2 cursor-pointer"
                         @click="selectSpell(selection.type, spell)">
                      <div class="spell-info lh-14">
                        <div class="fw-semibold mb-1">{{ spell.name }}</div>
                        <div class="small text-muted mb-1">{{ spell.school }}</div>
                        <div class="small mb-0">{{ spell.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else-if="getSelectedCount(selection.type) === selection.count" class="text-success">
                <i class="fas fa-check-circle me-2"></i>
                All {{ selection.label.toLowerCase() }} selected!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});