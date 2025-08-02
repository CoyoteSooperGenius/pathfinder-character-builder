# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
# Serve files locally using Python
python -m http.server 8000

# Serve files using Node.js http-server
npx http-server

# Serve files using PHP
php -S localhost:8000
```

### Opening the Application
- Navigate to `http://localhost:8000` after starting a local server
- Or open `index.html` directly in a web browser (limited functionality)

## Application Architecture

### Technology Stack
- **Vue.js 2.7.16** (single file, no CLI/build process)
- **Bootstrap 5** with Sandstone theme
- **Font Awesome 6** for icons
- **localStorage** for data persistence
- **No backend** - pure frontend application

### Component Structure
The application follows a hierarchical Vue component structure:

```
Vue Root App
├── MainPage (landing page)
├── CharacterSheet (live character display)
└── Stepper (main wizard controller)
    ├── StepAbilityScores (with 3 sub-methods)
    ├── StepRace (with 5 sub-cards)
    ├── StepClass (in progress - fighter bonus feat implemented)
    └── Step[Skills|Feats|Equipment|Details] (placeholders)
```

### Data Flow Pattern
- **Props Down**: Parent components pass data to children via props
- **Events Up**: Child components emit events (`@step-complete`, `@ability-scores-changed`, etc.)
- **localStorage Sync**: All character data persisted automatically in browser storage
- **Reactive Updates**: Character sheet updates in real-time via component references

### localStorage Structure
Character data is stored in separate keys:
- `currentAbilityScores`: Ability generation method and final scores
- `currentBasicInfo`: Race selection and favored classes
- `currentDetails`: Languages and other character details  
- `currentTraits`: Racial traits with labels and descriptions

## File Organization

### Component Files
All components are in `/js/components/` with this structure:
- `main-page.js` - Landing page component
- `character-sheet/character-sheet.js` - Live character display
- `stepper/stepper.js` - Main wizard controller with step navigation
- `stepper/step-*.js` - Individual step components
- `stepper/ability-scores/` - Three ability generation methods
- `stepper/race/` - Five race selection sub-components
- `stepper/class/` - Class-specific choice components

### Data Files
Game rules data is in `/data/`:
- `races.json` - All Core Rulebook races with traits and adjustments
- `classes.json` - All 11 core classes with features and progressions
- `feats.json` - Available feats for character creation

### Script Loading Order
Components must be loaded in dependency order in `index.html`. The stepper and its steps load first, followed by sub-components.

## Key Implementation Details

### Component Registration
Components use global Vue registration:
```javascript
Vue.component('component-name', { ... });
```

### Data Persistence
Each step component is responsible for saving its data to localStorage:
```javascript
localStorage.setItem('currentAbilityScores', JSON.stringify(data));
```

### Character Sheet Updates
The character sheet updates via method calls triggered by events from the stepper:
```javascript
this.$refs.characterSheet.updateAbilityScores();
this.$refs.characterSheet.updateFromLocalStorage();
```

### Game Rules Implementation
- Ability score modifiers: `(score - 10) / 2` rounded down
- Character data follows Pathfinder 1E Core Rulebook rules
- All calculations happen client-side with computed properties

## Current Implementation Status

### Completed Steps
1. **Ability Scores** - Point Buy, Standard Array, Dice Rolling methods
2. **Race Selection** - All Core Rulebook races with full trait implementation

### In Progress
3. **Class Selection** - Basic selection complete, 1st level choices partially implemented (Fighter bonus feat done)

### Planned Steps
4. **Skills** - Skill point allocation based on class and intelligence
5. **Feats** - Feat selection including racial and class bonus feats
6. **Equipment** - Starting equipment and gold purchases
7. **Details** - Final character details and summary

## Development Guidelines

### Adding New Components
1. Create component file in appropriate `/js/components/` subdirectory
2. Add script tag to `index.html` in correct dependency order
3. Follow existing Vue component pattern with template, props, data, computed, methods
4. Emit events for state changes that affect other components

### Working with Character Data
- Always use `JSON.stringify()` and `JSON.parse()` for localStorage
- Keep character data structure consistent across components
- Use computed properties for derived values like ability modifiers
- Emit events when data changes to trigger character sheet updates

### Game Rules
- Follow Pathfinder 1E Core Rulebook strictly
- Keep game data close to components that use it
- Use clear variable names that match game terminology
- Comment complex rule calculations for clarity