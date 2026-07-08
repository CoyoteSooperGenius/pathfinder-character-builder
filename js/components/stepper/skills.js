// Skills Component
// Step 4 in character creation - handles skill point allocation

Vue.component('skills-step', {
  props: {
    character: {
      type: Object,
      required: true
    }
  },

  template: `
    <div class="skills-step">
      <div>
        <div>
          <h3>
            <i class="fas fa-tools me-2"></i>
            Step 4: Skills
          </h3>
          <p class="text-muted">
            Allocate skill points and select skill proficiencies.
          </p>
        </div>
      </div>

      <div class="text-center py-5">
        <i class="fas fa-tools text-muted" style="font-size: 4rem;"></i>
        <h4 class="mt-3 text-muted">Skills Coming Soon</h4>
        <p class="text-muted">This step will allow you to allocate skill points and training.</p>
      </div>
    </div>
  `
});