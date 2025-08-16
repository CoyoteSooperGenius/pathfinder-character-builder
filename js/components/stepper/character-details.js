// Character Details Component
// Step 8 in character creation - handles final character details like name, appearance, etc.

Vue.component('character-details-step', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  template: `
    <div class="character-details-step">
      <div class="row">
        <div class="col-12">
          <h3>
            <i class="fas fa-id-card me-2"></i>
            Step 8: Character Details
          </h3>
          <p class="text-muted">
            Add personal details like name, appearance, and background to finalize your character.
          </p>
        </div>
      </div>

      <div class="text-center py-5">
        <i class="fas fa-id-card text-muted" style="font-size: 4rem;"></i>
        <h4 class="mt-3 text-muted">Character Details Coming Soon</h4>
        <p class="text-muted">This step will allow you to add character name, appearance, and background.</p>
      </div>
    </div>
  `
});