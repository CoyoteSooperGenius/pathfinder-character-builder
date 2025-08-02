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
    handleClassChange(selectedClasses) {
      this.$emit('favored-class-changed', selectedClasses);
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
      
      <checkbox-group
        :items="availableClasses"
        :selected-items="selectedFavoredClasses"
        :allow-multiple="isMultiSelect"
        :max-selections="allowedSelections"
        :show-counter="isMultiSelect"
        counter-label="Selected"
        columns="col-6 col-md-4 col-lg-6"
        layout="grid"
        group-name="favored-classes"
        @selection-changed="handleClassChange"
      >
        <template #selected-items="{ selectedItems }">
          <div v-if="selectedItems.length > 0" class="mt-3">
            <strong>Selected:</strong> {{ selectedItems.join(', ') }}
          </div>
        </template>
      </checkbox-group>
    </collapsible-card>
  `
});