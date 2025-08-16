# Shared Components

This directory contains reusable Vue.js components for the Pathfinder Character Generator.

## Loading Order

Components must be loaded in the following order in `index.html`:

### 1. Basic Utility Components
- `pf-button.js` - Standardized button component
- `pf-card.js` - Reusable card component
- `pf-modal.js` - Bootstrap modal wrapper
- `pf-alert.js` - Alert/notification component

### 2. Complex Components
- `selection-grid.js` - Item selection grid (depends on basic components)
- `character-summary.js` - Character state display (depends on pf-card)

## Usage

All components are globally registered with Vue.js and can be used in templates with kebab-case names:

```html
<pf-button variant="primary" @click="handleClick">Click Me</pf-button>
<pf-card title="Card Title">Card content</pf-card>
<selection-grid :items="items" @selection-changed="onSelect" />
<character-summary :character="currentCharacter" />
```

## Character Creation Components

Character creation components are located in `/js/components/stepper/` and handle the step-by-step character creation workflow. These are loaded separately and managed by the `character-wizard` component.

## Dependencies

- Vue.js 2.x
- Bootstrap 5 (CSS classes)
- Font Awesome 6 (icons)
- GameUtils (game calculations)
- DataUtils (data management)