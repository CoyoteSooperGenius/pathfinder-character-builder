// Race Selection Component
// Step 2 in character creation - handles race selection and racial traits

Vue.component('race-selection-step', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  template: `
    <div class="race-selection-step">
      <div class="row">
        <div class="col-12">
          <h3>
            <i class="fas fa-users me-2"></i>
            Step 2: Race Selection
          </h3>
          <p class="text-muted">
            Choose your character's race and apply racial traits and bonuses.
          </p>
        </div>
      </div>

      <div class="text-center py-5">
        <i class="fas fa-users text-muted" style="font-size: 4rem;"></i>
        <h4 class="mt-3 text-muted">Race Selection Coming Soon</h4>
        <p class="text-muted">This step will allow you to select from core Pathfinder 1e races.</p>
      </div>
    </div>
  `
});