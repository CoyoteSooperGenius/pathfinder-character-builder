// Feats Component
// Step 5 in character creation - handles feat selection

Vue.component('feats-step', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  template: `
    <div class="feats-step">
      <div class="row">
        <div class="col-12">
          <h3>
            <i class="fas fa-star me-2"></i>
            Step 5: Feats
          </h3>
          <p class="text-muted">
            Choose feats to customize your character's abilities.
          </p>
        </div>
      </div>

      <div class="text-center py-5">
        <i class="fas fa-star text-muted" style="font-size: 4rem;"></i>
        <h4 class="mt-3 text-muted">Feats Coming Soon</h4>
        <p class="text-muted">This step will allow you to select character feats.</p>
      </div>
    </div>
  `
});