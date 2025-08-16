// Equipment Component
// Step 6 in character creation - handles equipment and gear selection

Vue.component('equipment-step', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  template: `
    <div class="equipment-step">
      <div class="row">
        <div class="col-12">
          <h3>
            <i class="fas fa-sword me-2"></i>
            Step 6: Equipment
          </h3>
          <p class="text-muted">
            Select starting equipment, weapons, armor, and gear.
          </p>
        </div>
      </div>

      <div class="text-center py-5">
        <i class="fas fa-sword text-muted" style="font-size: 4rem;"></i>
        <h4 class="mt-3 text-muted">Equipment Coming Soon</h4>
        <p class="text-muted">This step will allow you to select starting equipment and gear.</p>
      </div>
    </div>
  `
});