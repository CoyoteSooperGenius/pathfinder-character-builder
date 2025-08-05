Vue.component('class-selector', {
  props: {
    selectedClass: {
      type: String,
      default: null
    },
    showClassSelection: {
      type: Boolean,
      default: true
    },
    coreClasses: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectClass(classNameOrObject) {
      // Handle both string (from selection-changed) and object (from item-selected)
      const className = typeof classNameOrObject === 'string' ? classNameOrObject : classNameOrObject.name;
      this.$emit('class-selected', className);
    },
    toggleClassSelection() {
      this.$emit('toggle-selection');
    }
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
        <selection-grid
          :items="coreClasses"
          :selected-item="selectedClass"
          display-mode="cards"
          columns="col-md-6 col-lg-4"
          item-key="name"
          title-property="name"
          description-property="description"
          :loading="coreClasses.length === 0"
          empty-message="No classes available"
          @selection-changed="selectClass"
          @item-selected="selectClass"
        >
          <template #card-content="{ item }">
            <div class="small text-muted">
              <strong>Hit Die:</strong> d{{ item.hitDie }}<br>
              <strong>Skill Points:</strong> {{ item.skillPoints }}<br>
              <strong>BAB:</strong> {{ item.baseAttackBonus }}<br>
              <strong>Saves:</strong> Fort {{ item.saves.fortitude }}, Ref {{ item.saves.reflex }}, Will {{ item.saves.will }}
            </div>
          </template>
        </selection-grid>
      </div>
    </div>
  `
});