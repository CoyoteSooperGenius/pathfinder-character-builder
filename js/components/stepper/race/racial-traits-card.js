Vue.component('racial-traits-card', {
  props: {
    selectedRaceData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showRacialTraits: true
    };
  },
  methods: {
    toggleRacialTraits() {
      this.showRacialTraits = !this.showRacialTraits;
    }
  },
  template: `
    <div class="card">
      <div class="card-header" style="cursor: pointer;" @click="toggleRacialTraits">
        <h5 class="mb-0 d-flex justify-content-between align-items-center">
          {{ selectedRaceData.name }} Racial Traits
          <i :class="showRacialTraits ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </h5>
      </div>
      <div v-show="showRacialTraits" class="card-body">
        <ul class="list-unstyled">
          <li 
            v-for="trait in selectedRaceData.traits" 
            :key="trait" 
            class="mb-3"
          >
            <strong>{{ trait.split(':')[0] }}:</strong>
            <span v-if="trait.includes(':')">{{ trait.split(':').slice(1).join(':') }}</span>
            <span v-else>{{ trait }}</span>
          </li>
        </ul>
      </div>
    </div>
  `
});