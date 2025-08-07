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
                      :key="spell.name || spell" 
                      class="col-md-6"
                    >
                      <div class="spell-item p-2 border rounded bg-light">
                        <!-- Handle rich spell objects (new format) -->
                        <div v-if="spell.name" class="fw-semibold small">{{ spell.name }}</div>
                        <!-- Handle legacy string format (old saves) -->
                        <div v-else class="fw-semibold small">{{ spell }}</div>
                        
                        <!-- Show additional details for rich spell objects -->
                        <div v-if="spell.school" class="text-muted small">{{ spell.school }}</div>
                        <div v-if="spell.description" class="small">{{ spell.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-muted">
                  No 1st-level spells in spellbook yet.
                </div>
              </div>
              
              <!-- Bard Spellbook -->
              <div v-else-if="basicInfo.class === 'Bard'">
                <!-- Spells Known vs Per Day Info -->
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <div class="card border-primary">
                      <div class="card-header bg-primary text-white">
                        <h6 class="mb-0"><i class="fas fa-brain me-2"></i>Known Spells</h6>
                      </div>
                      <div class="card-body">
                        <div class="text-center">
                          <div class="small text-muted mb-1">Cantrips</div>
                          <div class="h4 mb-2 text-primary">{{ (basicInfo.selectedCantrips || []).length }}/4</div>
                          <div class="small text-muted mb-1">1st Level</div>
                          <div class="h4 mb-0 text-primary">{{ (basicInfo.selectedFirstLevelSpells || []).length }}/2</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card border-success">
                      <div class="card-header bg-success text-white">
                        <h6 class="mb-0"><i class="fas fa-magic me-2"></i>Per Day</h6>
                      </div>
                      <div class="card-body">
                        <div class="text-center">
                          <div class="small text-muted mb-1">Cantrips</div>
                          <div class="h4 mb-2 text-success">∞</div>
                          <div class="small text-muted mb-1">1st Level</div>
                          <div class="h4 mb-0 text-success">1</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Known Cantrips -->
                <div v-if="basicInfo.selectedCantrips && basicInfo.selectedCantrips.length > 0" class="mb-4">
                  <h6 class="text-primary mb-2">Known Cantrips (0-level)</h6>
                  <div class="row g-2">
                    <div 
                      v-for="cantrip in basicInfo.selectedCantrips" 
                      :key="'cantrip-' + cantrip.name" 
                      class="col-md-6"
                    >
                      <div class="spell-item p-2 border rounded bg-light">
                        <div class="fw-semibold small">{{ cantrip.name }}</div>
                        <div class="text-muted small">{{ cantrip.school }}</div>
                        <div class="small">{{ cantrip.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Known 1st Level Spells -->
                <div v-if="basicInfo.selectedFirstLevelSpells && basicInfo.selectedFirstLevelSpells.length > 0">
                  <h6 class="text-primary mb-2">Known 1st-Level Spells</h6>
                  <div class="row g-2">
                    <div 
                      v-for="spell in basicInfo.selectedFirstLevelSpells" 
                      :key="'spell-' + spell.name" 
                      class="col-md-6"
                    >
                      <div class="spell-item p-2 border rounded bg-light">
                        <div class="fw-semibold small">{{ spell.name }}</div>
                        <div class="text-muted small">{{ spell.school }}</div>
                        <div class="small">{{ spell.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="(!basicInfo.selectedCantrips || basicInfo.selectedCantrips.length === 0) && 
                          (!basicInfo.selectedFirstLevelSpells || basicInfo.selectedFirstLevelSpells.length === 0)" 
                     class="text-muted">
                  No spells known yet. Complete spell selection in the Class step.
                </div>
              </div>
              
              <!-- Placeholder for other spellcaster classes -->
              <div v-else-if="isSpellcaster && basicInfo.class !== 'Wizard' && basicInfo.class !== 'Bard'" class="text-muted">
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