// Shared Components Index
// Include this file to load all shared utility components

// Load all shared components in dependency order

// Basic utility components
document.write('<script src="js/components/shared/pf-button.js"></script>');
document.write('<script src="js/components/shared/pf-card.js"></script>');
document.write('<script src="js/components/shared/pf-modal.js"></script>');
document.write('<script src="js/components/shared/pf-alert.js"></script>');

// Complex components that may depend on basic components
document.write('<script src="js/components/shared/selection-grid.js"></script>');
document.write('<script src="js/components/shared/character-summary.js"></script>');
document.write('<script src="js/components/shared/character-stepper.js"></script>');

console.log('Shared components loaded successfully');