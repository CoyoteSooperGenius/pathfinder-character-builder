Vue.component('racial-traits-card', {
  props: {
    selectedRaceData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // showRacialTraits now handled by collapsible-card
    };
  },
  methods: {
    // toggleRacialTraits removed - handled by collapsible-card
  },
  template: `
    <collapsible-card 
      :title="selectedRaceData.name + ' Racial Traits'"
      :initially-expanded="true"
    >
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
    </collapsible-card>
  `
});