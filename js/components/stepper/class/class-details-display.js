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
    }
  },
  template: `
    <div v-if="selectedClass && hasClassData" class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">{{ selectedClass }} Details</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h6>Class Features</h6>
            <ul class="list-unstyled">
              <li v-for="feature in classData.classFeatures" :key="feature">
                <i class="fas fa-check text-success me-2"></i>{{ feature }}
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <h6>Proficiencies</h6>
            <div class="mb-2">
              <strong>Weapons:</strong> {{ classData.weaponProficiencies }}
            </div>
            <div class="mb-2">
              <strong>Armor:</strong> {{ classData.armorProficiencies }}
            </div>
            <div class="mb-2">
              <strong>Class Skills:</strong> {{ classData.classSkills ? classData.classSkills.join(', ') : '—' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});