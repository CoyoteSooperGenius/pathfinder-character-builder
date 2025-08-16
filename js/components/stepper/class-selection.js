// Class Selection Component
// Step 3 in character creation - handles class selection and class features

Vue.component('class-selection-step', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  template: `
    <div class="class-selection-step">
      <div class="row">
        <div class="col-12">
          <h3>
            <i class="fas fa-shield-alt me-2"></i>
            Step 3: Class Selection
          </h3>
          <p class="text-muted">
            Select your character's class and configure class-specific features.
          </p>
        </div>
      </div>

      <div class="text-center py-5">
        <i class="fas fa-shield-alt text-muted" style="font-size: 4rem;"></i>
        <h4 class="mt-3 text-muted">Class Selection Coming Soon</h4>
        <p class="text-muted">This step will allow you to select from core Pathfinder 1e classes.</p>
      </div>
    </div>
  `
});