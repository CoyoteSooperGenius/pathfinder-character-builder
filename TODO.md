# Pathfinder Character Generator - Development TODO

## Project Status
**Current State**: Clean slate - all previous implementation files have been removed. Only core project structure, data files, and configuration remain.

**Updated Character Creation Flow**: Steps have been reordered to follow proper Pathfinder 1e sequence starting with Ability Scores.

---

## Phase 1: Core Infrastructure & Foundation

### 1.1 Basic Application Structure
- [ ] **Create main Vue.js application structure in index.html**
  - Set up root Vue instance with proper data structure
  - Define main application state management
  - Implement character data localStorage integration

- [ ] **Create core component library**
  - [ ] Create shared utility components (buttons, cards, modals)
  - [ ] Create selection-grid component for choosing items
  - [ ] Create character-summary component for displaying current character state
  - [ ] Create stepper/wizard navigation component

- [ ] **Implement character data management**
  - [ ] Define complete character data schema
  - [ ] Create localStorage utilities for saving/loading characters
  - [ ] Implement `current-character` working storage
  - [ ] Implement named character storage with collision handling

### 1.2 Landing Page & Navigation
- [ ] **Create landing page**
  - [ ] Simple title and application description
  - [ ] "Create New Character" button
  - [ ] "Load Existing Character" button with character list

- [ ] **Character loading functionality**
  - [ ] List saved characters from localStorage
  - [ ] Character preview cards showing basic info
  - [ ] Load character into character sheet view

---

## Phase 2: Character Creation Wizard (Steps 1-9)

### 2.1 Step 1: Ability Scores
- [ ] **Create ability score generation methods**
  - [ ] Point buy system (25 point buy default)
  - [ ] Standard array method (15, 14, 13, 12, 10, 8)
  - [ ] Dice rolling method (4d6 drop lowest, 6 times)

- [ ] **Ability score assignment interface**
  - [ ] Display all six abilities (STR, DEX, CON, INT, WIS, CHA)
  - [ ] Interactive assignment based on chosen method
  - [ ] Real-time calculation of modifiers
  - [ ] Validation and constraints

### 2.2 Step 2: Character Concept
- [ ] **Create concept definition interface**
  - [ ] Free-form text field for character concept
  - [ ] Optional alignment selection guidance
  - [ ] Character background ideas/prompts
  - [ ] Save concept to character data

### 2.3 Step 3: Race Selection
- [ ] **Race selection interface**
  - [ ] Grid/list view of available core races from races.json
  - [ ] Race details display (traits, bonuses, descriptions)
  - [ ] Apply racial ability score modifiers
  - [ ] Handle special cases (human bonus feat, etc.)

- [ ] **Racial features implementation**
  - [ ] Automatic language grants
  - [ ] Bonus language selections where applicable
  - [ ] Racial traits application
  - [ ] Size and speed modifications
  - [ ] Special abilities and immunities

### 2.4 Step 4: Class Selection
- [ ] **Class selection interface**
  - [ ] Grid/list view of available core classes from classes.json
  - [ ] Class details display (features, BAB, saves, skills)
  - [ ] Class-specific options (wizard schools, ranger combat styles, etc.)

- [ ] **Class features implementation**
  - [ ] Hit points calculation (max at 1st level)
  - [ ] Base attack bonus application
  - [ ] Saving throw base values
  - [ ] Class skill list definition
  - [ ] 1st level class features

- [ ] **Class-specific sub-components**
  - [ ] Wizard arcane school selection
  - [ ] Ranger combat style and favored enemy
  - [ ] Bard performance types
  - [ ] Fighter bonus feat selection
  - [ ] Cleric domain selection (if implemented)

### 2.5 Step 5: Skills
- [ ] **Skill system implementation**
  - [ ] Calculate available skill points (class + INT modifier)
  - [ ] Display class skills vs cross-class skills
  - [ ] Skill point allocation interface
  - [ ] Real-time skill bonus calculation (ranks + ability + class + racial)
  - [ ] Validate maximum ranks per skill

### 2.6 Step 6: Feats
- [ ] **Feat selection system**
  - [ ] Display available feats from feats.json
  - [ ] Filter feats by prerequisites
  - [ ] Handle bonus feats (human, fighter, etc.)
  - [ ] Feat description and benefit display
  - [ ] Apply feat benefits to character

### 2.7 Step 7: Equipment
- [ ] **Starting equipment system**
  - [ ] Class-based starting equipment packages
  - [ ] Alternative: Starting gold and equipment purchase
  - [ ] Weapon and armor proficiency validation
  - [ ] Encumbrance calculations
  - [ ] Equipment bonus applications (AC, attack, damage)

- [ ] **Equipment data structure**
  - [ ] Create weapons.json with core weapons
  - [ ] Create armor.json with core armor/shields
  - [ ] Create equipment.json with general gear
  - [ ] Implement equipment weight and cost tracking

### 2.8 Step 8: Spells (If Applicable)
- [ ] **Spellcasting implementation**
  - [ ] Detect if character has spellcasting ability
  - [ ] Calculate spells per day
  - [ ] Known spells vs spells per day systems
  - [ ] Spell selection interface using spells.json
  - [ ] Spellbook management for wizards

### 2.9 Step 9: Character Details
- [ ] **Final character details**
  - [ ] Character name (first name + last name)
  - [ ] Age, height, weight, gender
  - [ ] Character appearance description
  - [ ] Character background/personality
  - [ ] Save final character to named localStorage key

---

## Phase 3: Character Sheet Display

### 3.1 Character Sheet Layout
- [ ] **Create comprehensive character sheet**
  - [ ] Character header (name, class, level, race)
  - [ ] Ability scores with modifiers
  - [ ] Combat statistics (AC, HP, BAB, CMB, CMD)
  - [ ] Saving throws
  - [ ] Skills list with totals
  - [ ] Feats and features list
  - [ ] Equipment and inventory
  - [ ] Spells (if applicable)

### 3.2 Calculated Values
- [ ] **Implement all derived statistics**
  - [ ] Armor Class (base + armor + shield + DEX + size + misc)
  - [ ] Hit Points (HD + CON modifier + favored class + misc)
  - [ ] Initiative (DEX modifier + misc)
  - [ ] Combat Maneuver Bonus/Defense
  - [ ] Skill totals (ranks + ability + class + racial + misc)
  - [ ] Saving throw totals (base + ability + misc)

### 3.3 Character Sheet Actions
- [ ] **Character sheet functionality**
  - [ ] Edit character (return to creation steps)
  - [ ] Print/export character sheet
  - [ ] Delete character option
  - [ ] Return to main menu

---

## Phase 4: Data Enhancement

### 4.1 Complete Core Data Files
- [ ] **Expand existing data files**
  - [ ] Complete all core races in races.json
  - [ ] Complete all core classes in classes.json
  - [ ] Expand feats.json with all core feats
  - [ ] Complete spells.json with core spells (0-1st level minimum)

- [ ] **Create new data files**
  - [ ] weapons.json - all core weapons
  - [ ] armor.json - all core armor and shields
  - [ ] equipment.json - adventuring gear, tools, etc.
  - [ ] skills.json - complete skill definitions
  - [ ] languages.json - available languages

### 4.2 Data Validation & Source References
- [ ] **Ensure data accuracy**
  - [ ] Cross-reference all data with Pathfinder 1e Core Rulebook
  - [ ] Add source references to all game elements
  - [ ] Validate mechanical accuracy of features and calculations
  - [ ] Test edge cases and special interactions

---

## Phase 5: Testing & Polish

### 5.1 Unit Testing
- [ ] **Write comprehensive unit tests**
  - [ ] Test character data management functions
  - [ ] Test calculation utilities (AC, HP, skills, etc.)
  - [ ] Test data validation functions
  - [ ] Test localStorage operations

### 5.2 End-to-End Testing
- [ ] **Create e2e test scenarios**
  - [ ] Complete character creation workflow
  - [ ] Character saving and loading
  - [ ] Each step of the creation wizard
  - [ ] Edge cases and error handling

### 5.3 User Experience Polish
- [ ] **UI/UX improvements**
  - [ ] Responsive design testing
  - [ ] Accessibility improvements
  - [ ] Loading states and progress indicators
  - [ ] Error messages and validation feedback
  - [ ] Help text and tooltips

### 5.4 Documentation
- [ ] **Project documentation**
  - [ ] Update README with usage instructions
  - [ ] Document component API and data structures
  - [ ] Create deployment guide
  - [ ] Document known limitations and future features

---

## Phase 6: Future Enhancements (Post-MVP)

### 6.1 Advanced Features
- [ ] Character leveling system
- [ ] Additional races and classes
- [ ] Prestige classes
- [ ] Magic item integration
- [ ] Advanced feat chains and prerequisites

### 6.2 Quality of Life
- [ ] Character comparison tools
- [ ] Build optimization suggestions
- [ ] Import/export functionality
- [ ] Character portraits and tokens
- [ ] Campaign/party management

---

## Development Notes

### Priority Order
1. **Phase 1** - Essential foundation
2. **Phase 2** - Core character creation (implement in step order)
3. **Phase 3** - Character sheet display
4. **Phase 4** - Data completion
5. **Phase 5** - Testing and polish

### Key Dependencies
- Vue.js 2 components must be created before implementing wizard steps
- Character data schema must be finalized before implementing storage
- Basic infrastructure must be complete before building specific steps

### Testing Strategy
- Unit test each component and utility function
- E2E test complete character creation workflows
- Manual testing for UI/UX validation
- Cross-browser testing (Chrome primary, Firefox/Edge support)

### Data Management Strategy
- Use Foundry VTT data in `/data/pf1e-foundry-data/` as reference
- Transform and simplify data for web application needs
- Maintain Core Rulebook focus for initial release
- Ensure data structure supports future expansions