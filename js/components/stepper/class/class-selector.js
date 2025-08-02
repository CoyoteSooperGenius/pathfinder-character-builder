Vue.component('class-selector', {
  props: {
    selectedClass: {
      type: String,
      default: null
    },
    showClassSelection: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      coreClasses: []
    };
  },
  methods: {
    async loadClasses() {
      try {
        const classesResponse = await fetch('data/classes.json');
        const classesData = await classesResponse.json();
        this.coreClasses = classesData.coreClasses;
      } catch (error) {
        console.error('Error loading classes data:', error);
        alert('Error loading class data. Please refresh the page.');
      }
    },
    selectClass(className) {
      this.$emit('class-selected', className);
    },
    toggleClassSelection() {
      this.$emit('toggle-selection');
    }
  },
  async mounted() {
    await this.loadClasses();
  },
  template: `
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
              :id="classOption.name + '-selector'"
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
  `
});