Vue.component('character-summary-tab', {
  props: {
    basicInfoData: {
      type: Array,
      default: () => []
    },
    keyStatsData: {
      type: Array,
      default: () => []
    }
  },
  template: `
    <div class="card">
      <div class="card-header">
        <h6 class="mb-0"><i class="fas fa-user me-2"></i>Character Overview</h6>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <info-panel
              title="Basic Information"
              mode="section"
              size="small"
              :data="basicInfoData"
              data-type="table"
              :show-divider="false"
            />
          </div>
          
          <div class="col-md-6">
            <info-panel
              title="Key Stats"
              mode="section"
              size="small"
              :data="keyStatsData"
              data-type="grid"
              :list-config="{ keyProperty: 'key', valueProperty: 'value' }"
              :show-divider="false"
            />
          </div>
        </div>
      </div>
    </div>
  `
});