# Pathfinder Character Builder - Program Reference Document

## Project Overview

The Pathfinder Character Builder is a front-end web application for creating 1st level characters using Pathfinder 1st Edition Core Rulebook rules. Built with Vue.js 2, it provides a guided step-by-step interface with real-time character sheet updates and browser-based data persistence.

### Design Philosophy
- **Simplicity First**: One tool that does character creation well
- **No Build Process**: Direct deployment to any web server
- **Front-End Only**: No backend APIs or databases required
- **Core Rules Focus**: Pathfinder 1E Core Rulebook only
- **Level 1 Characters**: Starting characters with future leveling planned

## Technical Architecture

### Technology Stack
- **Framework**: Vue.js v2.7.16 (single file, no CLI)
- **Styling**: Bootstrap 5 with Sandstone theme
- **Icons**: Font Awesome 6
- **Storage**: Browser localStorage
- **Communication**: Vue props and events (no Vuex)

### Browser Compatibility
- **Primary**: Chrome (development browser)
- **Supported**: Modern Firefox, Edge
- **Not Targeted**: Safari, niche browsers

### Development Environment
- **Server**: Node.js http-server module
- **Deployment**: Copy files directly to web server
- **Testing**: Manual (automated testing planned)

## Application Architecture

### Component Hierarchy
```
Vue Root App
├── MainPage (landing)
├── CharacterSheet (live updates)
└── Stepper (main wizard)
    ├── StepAbilityScores
    │   ├── PointBuyMethod
    │   ├── StandardArrayMethod
    │   └── RollDiceMethod
    ├── StepRace
    │   ├── AvailableRacesCard
    │   ├── AbilityAdjustmentsCard
    │   ├── FavoredClassCard
    │   ├── LanguagesCard
    │   └── RacialTraitsCard
    ├── StepClass (in progress)
    ├── StepSkills (placeholder)
    ├── StepFeats (placeholder)
    ├── StepEquipment (placeholder)
    └── StepDetails (placeholder)
```

### Data Flow Pattern
1. **Props Down**: Parent components pass data to children via props
2. **Events Up**: Child components emit events to notify parents of changes
3. **localStorage Sync**: Character data automatically persisted on changes
4. **Reactive Updates**: Character sheet updates in real-time

## File Structure

```
/
├── index.html                          # Application entry point
├── css/
│   └── sandstone.css                   # Bootstrap theme
└── js/
    ├── vue.js                          # Vue.js v2.7.16
    ├── components/
    │   ├── main-page.js                # Landing page
    │   ├── character-sheet/
    │   │   └── character-sheet.js      # Live character display
    │   └── stepper/
    │       ├── stepper.js              # Main wizard controller
    │       ├── step-ability-scores.js  # Step 1: Ability generation
    │       ├── step-race.js            # Step 2: Race selection
    │       ├── step-class.js           # Step 3: Class selection (WIP)
    │       ├── step-skills.js          # Step 4: Skill allocation
    │       ├── step-feats.js           # Step 5: Feat selection
    │       ├── step-equipment.js       # Step 6: Equipment purchase
    │       ├── step-details.js         # Step 7: Final details
    │       ├── ability-scores/         # Ability score methods
    │       │   ├── point-buy-method.js
    │       │   ├── standard-array-method.js
    │       │   └── roll-dice-method.js
    │       └── race/                   # Race selection components
    │           ├── available-races-card.js
    │           ├── ability-adjustments-card.js
    │           ├── favored-class-card.js
    │           ├── languages-card.js
    │           └── racial-traits-card.js
```

## Data Management

### Character Data Structure
Character data is stored as separate objects in localStorage, with each major section having its own key:

```javascript
// currentAbilityScores
{
  "method": "point-buy",
  "totalPoints": 20,
  "scores": {
    "STR": 13,
    "DEX": 13,
    "CON": 15,
    "INT": 14,
    "WIS": 13,
    "CHA": 13
  }
}

// currentBasicInfo
{
  "race": "Half-Elf",
  "favoredClasses": ["Fighter", "Rogue"]
}

// currentDetails
{
  "languages": ["Common", "Elven", "Dwarven", "Auran"]
}

// currentTraits
{
  "racialTraits": [
    {
      "Label": "+2 to One Ability Score",
      "Description": "Half-elf characters get a +2 bonus to one ability score of their choice at creation to represent their varied nature."
    },
    {
      "Label": "Low-Light Vision", 
      "Description": "Half-elves can see twice as far as humans in conditions of dim light."
    }
    // ... additional traits
  ]
}
```

### Game Rules Data
Game rules are embedded as JavaScript objects within components:

- **Races**: Defined in step-race.js with complete Core Rulebook data
- **Classes**: Defined in step-class.js with all 11 core classes
- **Abilities**: Calculated dynamically based on race/class selections
- **Modifiers**: Computed properties handle ability score modifiers

### localStorage Keys
- `currentAbilityScores`: Ability generation method and final scores
- `currentBasicInfo`: Race selection and favored classes  
- `currentDetails`: Languages and other character details
- `currentTraits`: Racial traits with labels and descriptions

When saving characters, keys will follow pattern: `<uniquekey>BasicInfo`, `<uniquekey>AbilityScores`, etc.

## Component Communication Patterns

### Parent to Child (Props)
```javascript
// Parent passes data down
<child-component :character-data="character" :step-config="config" />

// Child receives via props
props: ['characterData', 'stepConfig']
```

### Child to Parent (Events)
```javascript
// Child emits changes
this.$emit('ability-scores-changed', newScores);
this.$emit('race-selected', raceData);

// Parent listens and updates
<child-component @ability-scores-changed="updateAbilityScores" />
```

### Data Persistence
```javascript
// Each section saves separately to localStorage
saveAbilityScores() {
  const abilityScores = this.$refs.currentStepComponent.getAbilityScores();
  localStorage.setItem('currentAbilityScores', JSON.stringify(abilityScores));
},

saveBasicInfo(raceData) {
  const basicInfo = {
    race: raceData.selectedRace,
    favoredClasses: raceData.selectedFavoredClasses
  };
  localStorage.setItem('currentBasicInfo', JSON.stringify(basicInfo));
},

saveLanguages(languages) {
  const details = { languages: languages };
  localStorage.setItem('currentDetails', JSON.stringify(details));
}
```

## Implementation Status

### Completed Features
- ✅ **Step 1**: Ability Score Generation (Point Buy, Standard Array, Dice Rolling)
- ✅ **Step 2**: Race Selection (All Core Rulebook races with traits)
- 🔄 **Step 3**: Class Selection (Basic selection done, 1st level choices pending)
- ⏳ **Steps 4-7**: Placeholders ready for implementation

### Step 3 Remaining Work
- Fighter bonus feat selection
- Sorcerer/Wizard 1st level spell selection
- Cleric domain selection
- Druid nature bond choice
- Ranger favored enemy selection
- Other class-specific 1st level choices

### Planned Features
- Character leveling system
- localStorage reset functionality
- Export/import character data
- Print-friendly character sheets

## Development Guidelines

### Component Creation Pattern
1. Create new .js file in appropriate directory
2. Follow Vue component structure:
   ```javascript
   const ComponentName = {
     template: `...`,
     props: [...],
     data() { return {...}; },
     computed: {...},
     methods: {...},
     watch: {...}
   };
   ```
3. Register component in parent or globally
4. Add to file structure documentation

### Data Binding Conventions
- Use `v-model` for form inputs
- Use computed properties for derived values
- Emit events for state changes that affect other components
- Keep component data minimal and focused

### localStorage Best Practices
- Always JSON.stringify() when storing objects
- Always JSON.parse() when retrieving (with error handling)
- Use consistent key naming: `pathfinder-{purpose}`
- Consider data migration strategies for future versions

### Code Organization
- Keep game rules data close to components that use them
- Use computed properties for ability score modifiers and derived stats
- Separate presentation logic from game rule calculations
- Comment complex game rule implementations

## Game Rules Implementation

### Ability Scores
- **Range**: 3-18 for generated scores, no upper limit after racial adjustments
- **Modifiers**: (score - 10) / 2, rounded down
- **Methods**: Point Buy (15, 20, 25, 30 points), Standard Array [15,14,13,12,10,8], 4d6 drop lowest

### Races (Core Rulebook)
All 7 core races implemented with:
- Ability score adjustments
- Racial traits and special abilities
- Automatic and bonus languages
- Favored class options
- Size and speed values

### Classes (Core Rulebook)
All 11 core classes with:
- Hit dice, skill points, BAB progression
- Saving throw progressions (Good/Poor)
- Class features by level
- Weapon and armor proficiencies
- Class skill lists
- Spellcasting progression (where applicable)

### Calculations
- **Hit Points**: Class hit die + Con modifier (minimum 1)
- **Armor Class**: 10 + Dex modifier + armor + shield + other
- **Attack Bonus**: BAB + Str/Dex modifier + other
- **Saving Throws**: Base save + ability modifier + other
- **Skill Points**: (Class base + Int modifier) × 1 at 1st level

## Testing Strategy

### Manual Testing Checklist
- [ ] All ability score generation methods work correctly
- [ ] Racial ability adjustments apply properly
- [ ] Class selection updates character sheet
- [ ] localStorage persists data across browser sessions
- [ ] Character sheet calculations are accurate
- [ ] Component events trigger proper updates

### Future Automated Testing
- Unit tests for game rule calculations
- Integration tests for component communication
- End-to-end tests for complete character creation flow

## Deployment

### Requirements
- Static web server capable of serving HTML, CSS, and JavaScript
- No server-side processing required
- No database or API endpoints needed

### Deployment Process
1. Copy all files to web server document root
2. Ensure file permissions allow web server access
3. No build process or compilation required
4. Application ready for immediate use

### Browser Requirements
- JavaScript enabled
- localStorage support
- ES6 support (modern browsers)
- CSS Grid and Flexbox support

## Known Limitations

### Current Constraints
- No spell management during play
- No character advancement beyond 1st level (yet)
- No custom races or classes
- No third-party or optional rules
- Limited to Core Rulebook content

### Technical Limitations
- localStorage size limits (generally not an issue for character data)
- No offline functionality
- No multi-user or sharing capabilities
- No data validation beyond basic form validation

## Future Roadmap

### Short Term
1. Complete Step 3 class-specific 1st level choices
2. Implement localStorage reset functionality
3. Add Step 4: Skill allocation
4. Add Step 5: Feat selection

### Medium Term
1. Complete Steps 6-7: Equipment and final details
2. Character leveling system
3. Export/import functionality
4. Print-friendly character sheets

### Long Term
1. Additional Pathfinder sourcebooks
2. Character management tools
3. Spell tracking and management
4. Advanced character options

## Troubleshooting

### Common Issues
- **Character data lost**: Check browser localStorage settings
- **Components not updating**: Verify event emission and prop binding
- **Calculation errors**: Check ability score modifier computations
- **Loading issues**: Ensure all component files are properly included

### Debug Tools
- Browser localStorage inspector
- Vue.js browser extension
- Console logging for component events
- Character data inspection in localStorage

---

*This document serves as the primary technical reference for the Pathfinder Character Builder project. Keep it updated as the application evolves.*