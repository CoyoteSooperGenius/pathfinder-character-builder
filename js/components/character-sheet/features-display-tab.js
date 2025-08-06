Vue.component('features-display-tab', {
  props: {
    basicInfo: {
      type: Object,
      default: () => ({})
    },
    feats: {
      type: Array,
      default: () => []
    },
    skills: {
      type: Array,
      default: () => []
    }
  },
  template: `
    <div class="row g-3">
      <!-- Class & Features -->
      <div class="col-lg-4">
        <class-features-display
          :basic-info="basicInfo"
        />
      </div>
      
      <!-- Feats -->
      <div class="col-lg-4">
        <feats-display
          :feats="feats"
        />
      </div>
      
      <!-- Skills -->
      <div class="col-lg-4">
        <skills-display
          :skills="skills"
          :basic-info="basicInfo"
        />
      </div>
    </div>
  `
});