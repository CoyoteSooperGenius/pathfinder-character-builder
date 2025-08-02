Vue.component('favored-class-card', {
  props: {
    selectedRaceData: {
      type: Object,
      required: true
    },
    selectedFavoredClasses: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      availableClasses: [
        'Barbarian',
        'Bard',
        'Cleric',
        'Druid',
        'Fighter',
        'Monk',
        'Paladin',
        'Ranger',
        'Rogue',
        'Sorcerer',
        'Wizard'
      ]
    };
  },
  computed: {
    allowedSelections() {
      // Half-Elves can select 2 favored classes, all others select 1
      return this.selectedRaceData.name === 'Half-Elf' ? 2 : 1;
    },
    isMultiSelect() {
      return this.allowedSelections > 1;
    }
  },
  methods: {
    onClassChange(className) {
      if (this.isMultiSelect) {
        this.handleMultiSelect(className);
      } else {
        this.handleSingleSelect(className);
      }
    },
    handleSingleSelect(className) {
      this.$emit('favored-class-changed', [className]);
    },
    handleMultiSelect(className) {
      const currentSelections = [...this.selectedFavoredClasses];
      const index = currentSelections.indexOf(className);
      
      if (index > -1) {
        // Remove if already selected
        currentSelections.splice(index, 1);
      } else if (currentSelections.length < this.allowedSelections) {
        // Add if under limit
        currentSelections.push(className);
      }
      
      this.$emit('favored-class-changed', currentSelections);
    },
    isClassDisabled(className) {
      if (!this.isMultiSelect) return false;
      
      return !this.selectedFavoredClasses.includes(className) && 
             this.selectedFavoredClasses.length >= this.allowedSelections;
    }
  },
  template: `
    <collapsible-card 
      title="Favored Class" 
      :initially-expanded="true"
      card-classes="mt-3"
    >
      <div class="mb-2">
        <small class="text-muted">
          {{ isMultiSelect ? 'Select ' + allowedSelections + ' favored classes' : 'Select 1 favored class' }}
        </small>
      </div>
      
      <div v-if="isMultiSelect" class="mb-3">
        <div class="row">
          <div v-for="className in availableClasses" :key="className" class="col-6 col-md-4 col-lg-6 mb-2">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                :value="className"
                :checked="selectedFavoredClasses.includes(className)"
                @change="onClassChange(className)"
                :disabled="isClassDisabled(className)"
                :id="'favored-class-' + className.toLowerCase()"
              >
              <label class="form-check-label" :for="'favored-class-' + className.toLowerCase()">
                {{ className }}
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else>
        <div class="row">
          <div v-for="className in availableClasses" :key="className" class="col-6 col-md-4 col-lg-6 mb-2">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="radio" 
                :value="className"
                :checked="selectedFavoredClasses.includes(className)"
                @change="onClassChange(className)"
                :id="'favored-class-' + className.toLowerCase()"
                name="favoredClass"
              >
              <label class="form-check-label" :for="'favored-class-' + className.toLowerCase()">
                {{ className }}
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="selectedFavoredClasses.length > 0" class="mt-3">
        <strong>Selected:</strong> {{ selectedFavoredClasses.join(', ') }}
      </div>
    </collapsible-card>
  `
});