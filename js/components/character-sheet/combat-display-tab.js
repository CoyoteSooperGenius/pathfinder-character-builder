Vue.component('combat-display-tab', {
  props: {
    derivedStats: {
      type: Object,
      default: () => ({})
    },
    abilityScores: {
      type: Object,
      default: () => ({})
    },
    basicInfo: {
      type: Object,
      default: () => ({})
    },
    isSpellcaster: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <div>
      <div class="row g-3">
        <!-- Combat Stats -->
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header">
              <h6 class="mb-0"><i class="fas fa-shield-alt me-2"></i>Combat Statistics</h6>
            </div>
            <div class="card-body">
              <!-- Combat Stats using stat-block component -->
              <stat-block
                type="combat"
                :character-data="{ derivedStats, abilityScores }"
                layout="grid"
                :columns="2"
                :show-modifiers="true"
                :show-labels="true"
                :show-icons="true"
                :use-colors="true"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Spellbook Section (for spellcasters) -->
      <div v-if="isSpellcaster" class="row g-3 mt-2">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0"><i class="fas fa-book-open me-2"></i>Spellbook</h6>
            </div>
            <div class="card-body">
              <!-- Wizard Spellbook -->
              <div v-if="basicInfo.class === 'Wizard'">
                <!-- Cantrips -->
                <div class="mb-4">
                  <h6 class="text-primary mb-2">Cantrips (0-level)</h6>
                  <div class="alert alert-info small mb-0">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>All wizard cantrips:</strong> 
                    Acid Splash, Arcane Mark, Bleed, Dancing Lights, Daze, Detect Magic, Detect Poison, 
                    Disrupt Undead, Flare, Ghost Sound, Light, Mage Hand, Mending, Message, Open/Close, 
                    Prestidigitation, Ray of Frost, Read Magic, Resistance, Touch of Fatigue
                  </div>
                </div>
                
                <!-- 1st Level Spells -->
                <div v-if="basicInfo.startingSpells && basicInfo.startingSpells.length > 0">
                  <h6 class="text-primary mb-2">1st-Level Spells</h6>
                  <div class="row g-2">
                    <div 
                      v-for="spell in basicInfo.startingSpells" 
                      :key="spell" 
                      class="col-md-4 col-sm-6"
                    >
                      <div class="spell-item p-2 border rounded bg-light">
                        <div class="fw-semibold small">{{ spell }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-muted">
                  No 1st-level spells in spellbook yet.
                </div>
              </div>
              
              <!-- Placeholder for other spellcaster classes -->
              <div v-else-if="isSpellcaster" class="text-muted">
                <i class="fas fa-info-circle me-2"></i>
                Spellbook for {{ basicInfo.class }} will be available when spell selection is implemented.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  style: `
    <style scoped>
    .spell-item {
      transition: all 0.2s ease;
    }
    
    .spell-item:hover {
      background-color: var(--bs-primary) !important;
      color: white !important;
      transform: translateY(-1px);
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    </style>
  `
});