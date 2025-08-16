// Spells Component
// Step 7 in character creation - handles spell selection for spellcasting classes

Vue.component('spells-step', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  template: `
    <div class="spells-step">
      <div class="row">
        <div class="col-12">
          <h3>
            <i class="fas fa-magic me-2"></i>
            Step 7: Spells
          </h3>
          <p class="text-muted">
            Choose spells if your character class can cast them.
          </p>
        </div>
      </div>

      <div class="text-center py-5">
        <i class="fas fa-magic text-muted" style="font-size: 4rem;"></i>
        <h4 class="mt-3 text-muted">Spells Coming Soon</h4>
        <p class="text-muted">This step will allow spellcasting classes to select spells.</p>
      </div>
    </div>
  `
});