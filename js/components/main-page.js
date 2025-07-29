Vue.component('main-page', {
  template: `
    <div class="container text-center py-4">
      <h1 class="display-4 mb-3">Pathfinder 1st Edition Character Generator</h1>
      <p class="lead mb-4">
        Welcome to the Pathfinder Character Generator!<br>
        Create and manage your Pathfinder 1st Edition RPG characters easily, right in your browser.
      </p>
      <div class="d-flex justify-content-center gap-3 mb-4">
        <button @click="loadComponent" class="btn btn-outline-primary">Load Character</button>
        <button @click="$emit('create-character')" class="btn btn-primary">Create Character</button>
      </div>
      <footer class="mt-5">
        <hr>
        <small class="text-muted">
          All saved characters are stored in your browser's local storage.<br>
          No cloud storage is used.
        </small>
      </footer>
    </div>
  `,
  methods: {
    loadComponent() {
      alert("This functionality hasn't been implemented yet.");
    }
  }
});