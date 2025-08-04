Vue.component('class-details-display', {
  props: {
    selectedClass: {
      type: String,
      required: true
    },
    classData: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasClassData() {
      return this.classData && Object.keys(this.classData).length > 0;
    },
    // Prepare class features for list display
    classFeaturesData() {
      if (!this.classData.classFeatures) return [];
      return this.classData.classFeatures.map(feature => ({
        name: feature,
        icon: 'fas fa-check text-success'
      }));
    },
    
    // Prepare proficiencies for table display
    proficienciesData() {
      return [
        { key: 'weapons', label: 'Weapons', value: this.classData.weaponProficiencies },
        { key: 'armor', label: 'Armor', value: this.classData.armorProficiencies },
        { key: 'skills', label: 'Class Skills', value: this.classData.classSkills ? this.classData.classSkills.join(', ') : '—' }
      ];
    }
  },
  template: `
    <div v-if="selectedClass && hasClassData">
      <info-panel 
        :title="selectedClass + ' Details'"
        mode="card"
        class="mb-4"
      >
        <div class="row">
          <div class="col-md-6">
            <info-panel
              title="Class Features"
              mode="section"
              size="small"
              :data="classFeaturesData"
              data-type="list"
              :list-config="{ keyProperty: 'name', iconProperty: 'icon' }"
              :show-divider="false"
            />
          </div>
          <div class="col-md-6">
            <info-panel
              title="Proficiencies"
              mode="section"
              size="small"
              :data="proficienciesData"
              data-type="table"
              :show-divider="false"
            />
          </div>
        </div>
      </info-panel>
    </div>
  `
});