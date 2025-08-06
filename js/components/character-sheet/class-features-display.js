Vue.component('class-features-display', {
  props: {
    basicInfo: {
      type: Object,
      default: () => ({})
    }
  },
  template: `
    <div class="card h-100">
      <div class="card-header">
        <h6 class="mb-0"><i class="fas fa-graduation-cap me-2"></i>Class & Features</h6>
      </div>
      <div class="card-body">
        <div v-if="basicInfo.class" class="mb-3">
          <h6 class="text-primary">{{ basicInfo.class }} {{ basicInfo.level }}</h6>
          
          <!-- Wizard-specific information -->
          <div v-if="basicInfo.class === 'Wizard'" class="mt-3">
            <!-- Arcane Bond -->
            <div v-if="basicInfo.arcaneBond" class="mb-2">
              <strong class="small text-muted">Arcane Bond:</strong>
              <div class="small">
                {{ basicInfo.arcaneBond === 'familiar' ? 'Familiar' : 'Bonded Object' }}
                <span v-if="basicInfo.familiar"> ({{ basicInfo.familiar }})</span>
                <span v-if="basicInfo.bondedObject"> ({{ basicInfo.bondedObject }}<span v-if="basicInfo.weapon">: {{ basicInfo.weapon }}</span>)</span>
              </div>
            </div>
            
            <!-- Arcane School -->
            <div v-if="basicInfo.arcaneSchool" class="mb-2">
              <strong class="small text-muted">Arcane School:</strong>
              <div class="small">{{ basicInfo.arcaneSchool }}</div>
              <div v-if="basicInfo.oppositionSchools && basicInfo.oppositionSchools.length > 0" class="small text-muted">
                Opposition: {{ basicInfo.oppositionSchools.join(', ') }}
              </div>
            </div>
          </div>
          
          <!-- Fighter-specific information -->
          <div v-if="basicInfo.class === 'Fighter' && basicInfo.bonusFeat" class="mt-3">
            <div class="mb-2">
              <strong class="small text-muted">Bonus Feat:</strong>
              <div class="small">{{ basicInfo.bonusFeat }}</div>
            </div>
          </div>
          
          <!-- Barbarian-specific information -->
          <div v-if="basicInfo.class === 'Barbarian'" class="mt-3">
            <div class="small text-success">
              <i class="fas fa-info-circle me-1"></i>
              All class features gained automatically at 1st level
            </div>
          </div>
          
          <!-- Paladin-specific information -->
          <div v-if="basicInfo.class === 'Paladin'" class="mt-3">
            <div class="small text-success">
              <i class="fas fa-info-circle me-1"></i>
              All class features gained automatically at 1st level
            </div>
          </div>
          
          <!-- Rogue-specific information -->
          <div v-if="basicInfo.class === 'Rogue'" class="mt-3">
            <div class="small text-success">
              <i class="fas fa-info-circle me-1"></i>
              All class features gained automatically at 1st level
            </div>
          </div>
          
          <!-- Placeholder for other classes -->
          <div v-else-if="isUnimplementedClass" class="mt-3">
            <div class="small text-info">
              <i class="fas fa-hourglass-half me-1"></i>
              {{ basicInfo.class }} class features will be available when implemented
            </div>
          </div>
        </div>
        
        <!-- Class Features -->
        <div v-if="basicInfo.classData && basicInfo.classData.classFeatures">
          <h6 class="small fw-bold text-muted mb-2">Class Features</h6>
          <div v-for="feature in basicInfo.classData.classFeatures" :key="feature" class="class-feature-item mb-2">
            <div class="small">{{ feature }}</div>
          </div>
        </div>
        
        <!-- Proficiencies -->
        <div v-if="basicInfo.classData" class="mt-3">
          <h6 class="small fw-bold text-muted mb-2">Proficiencies</h6>
          <div class="small mb-1">
            <strong>Weapons:</strong> {{ basicInfo.classData.weaponProficiencies || 'None' }}
          </div>
          <div class="small mb-1">
            <strong>Armor:</strong> {{ basicInfo.classData.armorProficiencies || 'None' }}
          </div>
        </div>
        
        <div v-if="!basicInfo.class" class="text-muted">
          No class selected yet.
        </div>
      </div>
    </div>
  `,
  computed: {
    isUnimplementedClass() {
      const implementedClasses = ['Fighter', 'Wizard', 'Barbarian', 'Paladin', 'Rogue'];
      return this.basicInfo.class && !implementedClasses.includes(this.basicInfo.class);
    }
  },
  style: `
    <style scoped>
    .class-feature-item {
      padding: 0.5rem;
      background: var(--bs-light);
      border-radius: 0.375rem;
    }
    </style>
  `
});