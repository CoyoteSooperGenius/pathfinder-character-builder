Vue.component('character-basics', {
  data() {
    return {
      basicInfo: {
        name: '',
        race: '',
        class: '',
        level: '1',
        alignment: '',
        favoredClasses: ''
      }
    };
  },
  methods: {
    updateBasicInfo() {
      const data = CharacterDataService.getBasicInfo();
      if (data) {
        this.basicInfo.race = data.race || '';
        this.basicInfo.class = data.class || '';
        this.basicInfo.level = '1'; // Always 1st level for now
        
        if (data.favoredClasses && Array.isArray(data.favoredClasses)) {
          this.basicInfo.favoredClasses = data.favoredClasses.join(', ');
        }
      }
    }
  },
  mounted() {
    this.updateBasicInfo();
  },
  template: `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-user me-2"></i>Basics
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-2">
            <div class="col-12">
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Name:</span>
                <span>{{ basicInfo.name || '—' }}</span>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Race:</span>
                <span id="character-sheet-race">{{ basicInfo.race || '—' }}</span>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Class:</span>
                <span id="character-sheet-class">{{ basicInfo.class || '—' }}</span>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Level:</span>
                <span>{{ basicInfo.level }}</span>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Alignment:</span>
                <span>{{ basicInfo.alignment || '—' }}</span>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex justify-content-between">
                <span class="fw-semibold">Favored Class:</span>
                <span>{{ basicInfo.favoredClasses || '—' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});