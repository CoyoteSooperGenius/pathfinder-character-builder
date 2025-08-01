Vue.component('step-class', {
  template: `
    <div>
      <!-- Class Selection Section -->
      <div class="card mb-4">
        <div class="card-header" @click="toggleClassSelection" style="cursor: pointer;">
          <h5 class="mb-0">
            Available Classes
            <i class="fas" :class="showClassSelection ? 'fa-chevron-up' : 'fa-chevron-down'" style="float: right;"></i>
          </h5>
        </div>
        <div class="card-body" v-show="showClassSelection">
          <div class="row" v-if="coreClasses.length > 0">
            <div 
              v-for="classOption in coreClasses" 
              :key="classOption.name"
              class="col-md-6 col-lg-4 mb-3"
            >
              <div 
                class="card h-100 class-option"
                :class="{ 'border-primary bg-light': selectedClass === classOption.name }"
                @click="selectClass(classOption.name)"
                style="cursor: pointer;"
              >
                <div class="card-body">
                  <h6 class="card-title">{{ classOption.name }}</h6>
                  <p class="card-text small">{{ classOption.description }}</p>
                  <div class="small text-muted">
                    <strong>Hit Die:</strong> d{{ classOption.hitDie }}<br>
                    <strong>Skill Points:</strong> {{ classOption.skillPoints }}<br>
                    <strong>BAB:</strong> {{ classOption.baseAttackBonus }}<br>
                    <strong>Saves:</strong> Fort {{ classOption.saves.fortitude }}, Ref {{ classOption.saves.reflex }}, Will {{ classOption.saves.will }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center">
            <i class="fas fa-spinner fa-spin"></i> Loading classes...
          </div>
        </div>
      </div>

      <!-- Selected Class Details -->
      <div v-if="selectedClass" class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">{{ selectedClass }} Details</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h6>Class Features</h6>
              <ul class="list-unstyled">
                <li v-for="feature in getSelectedClassData().classFeatures" :key="feature">
                  <i class="fas fa-check text-success me-2"></i>{{ feature }}
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <h6>Proficiencies</h6>
              <div class="mb-2">
                <strong>Weapons:</strong> {{ getSelectedClassData().weaponProficiencies }}
              </div>
              <div class="mb-2">
                <strong>Armor:</strong> {{ getSelectedClassData().armorProficiencies }}
              </div>
              <div class="mb-2">
                <strong>Class Skills:</strong> {{ getSelectedClassData().classSkills.join(', ') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 1st Level Options -->
      <div v-if="selectedClass" class="card">
        <div class="card-header">
          <h5 class="mb-0">1st Level Options</h5>
        </div>
        <div class="card-body">
          <!-- Fighter Bonus Feat Selection -->
          <div v-if="selectedClass === 'Fighter'" class="mb-3">
            <fighter-bonus-feat 
              :selected-bonus-feat="selectedBonusFeat" 
              @feat-selected="onFeatSelected">
            </fighter-bonus-feat>
          </div>
          
          <!-- Placeholder for other classes -->
          <div v-else-if="isSpellcaster()" class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Coming Soon:</strong> Spell selection for {{ selectedClass }} will be implemented here.
          </div>
          
          <div v-else-if="hasSpecialization()" class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Coming Soon:</strong> {{ getSpecializationText() }}
          </div>
          
          <div v-else class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Coming Soon:</strong> 1st level class-specific options for {{ selectedClass }} will be implemented here.
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      selectedClass: null,
      showClassSelection: true,
      selectedBonusFeat: null,
      coreClasses: []
    };
  },
  methods: {
    async loadData() {
      try {
        // Load classes data
        const classesResponse = await fetch('data/classes.json');
        const classesData = await classesResponse.json();
        this.coreClasses = classesData.coreClasses;
        
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading class data. Please refresh the page.');
      }
    },
    selectClass(className) {
      this.selectedClass = className;
      this.selectedBonusFeat = null; // Reset feat selection when changing class
      this.showClassSelection = false;
      this.updateStepComplete();
    },
    onFeatSelected(featName) {
      this.selectedBonusFeat = featName;
      this.updateStepComplete();
    },
    updateStepComplete() {
      // For Fighter, need both class and bonus feat selected
      if (this.selectedClass === 'Fighter') {
        this.$emit('step-complete', this.selectedClass && this.selectedBonusFeat);
      } else {
        // For other classes, just need class selected (until their 1st level options are implemented)
        this.$emit('step-complete', !!this.selectedClass);
      }
    },
    toggleClassSelection() {
      this.showClassSelection = !this.showClassSelection;
    },
    getSelectedClassData() {
      return this.coreClasses.find(c => c.name === this.selectedClass) || {};
    },
    isSpellcaster() {
      const spellcasters = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Wizard'];
      return spellcasters.includes(this.selectedClass);
    },
    hasSpecialization() {
      const specializationClasses = ['Cleric', 'Druid', 'Ranger', 'Sorcerer', 'Wizard'];
      return specializationClasses.includes(this.selectedClass);
    },
    getSpecializationText() {
      const texts = {
        'Cleric': 'Choose two domains that reflect your deity\'s portfolio.',
        'Druid': 'Choose either an animal companion or a domain.',
        'Ranger': 'Choose a favored enemy and combat style.',
        'Sorcerer': 'Choose a bloodline that determines your magical heritage.',
        'Wizard': 'Choose an arcane school to specialize in.'
      };
      return texts[this.selectedClass] || '';
    },
    getClassData() {
      if (!this.selectedClass) return null;
      
      const data = {
        selectedClass: this.selectedClass,
        classData: this.getSelectedClassData()
      };
      
      // Add Fighter-specific data
      if (this.selectedClass === 'Fighter' && this.selectedBonusFeat) {
        data.bonusFeat = this.selectedBonusFeat;
      }
      
      return data;
    }
  },
  async mounted() {
    // Load external data first
    await this.loadData();
    
    // Check if we already have saved data
    const savedBasicInfo = localStorage.getItem('currentBasicInfo');
    if (savedBasicInfo) {
      try {
        const basicInfo = JSON.parse(savedBasicInfo);
        if (basicInfo.class) {
          this.selectedClass = basicInfo.class;
          this.showClassSelection = false;
          
          // Restore Fighter bonus feat if saved
          if (basicInfo.bonusFeat) {
            this.selectedBonusFeat = basicInfo.bonusFeat;
          }
        }
      } catch (e) {
        console.warn('Error loading saved class data:', e);
      }
    }
    
    this.updateStepComplete();
  }
});