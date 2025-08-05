# Pathfinder Character Builder - TODO

This document tracks the progress of the Pathfinder Character Builder development.

## ✅ Phase 1: Extract Data and Services (COMPLETED)

### Services Created
- [x] `character-data-service.js` - Centralized localStorage management
- [x] `ability-calculator.js` - Shared ability score calculations  
- [x] `prerequisite-checker.js` - Reusable prerequisite validation
- [x] `language-data.js` - Centralized language data and validation

### Components Updated
- [x] Updated `fighter-bonus-feat.js` to use PrerequisiteChecker
- [x] Updated `stepper.js` to use CharacterDataService
- [x] Updated `languages-card.js` to use AbilityCalculator
- [x] Updated `step-race.js` to use AbilityCalculator
- [x] Updated `character-sheet.js` to use AbilityCalculator
- [x] Updated `index.html` to include new service files

## ✅ Phase 2: Break Down Large Components (COMPLETED)

### 2.1 Languages Card Breakdown (293 lines → 4 components + 1 service)
- [x] Create `language-data.js` service
- [x] Create `automatic-languages.js` component
- [x] Create `bonus-languages.js` component  
- [x] Create `language-summary.js` component
- [x] Create `language-selector.js` coordinator
- [x] Update `step-race.js` to use new language components
- [x] Remove old `languages-card.js`

### 2.2 Character Sheet Breakdown (216 lines → 5 components)
- [x] Create `character-basics.js` - Name, race, class, level display
- [x] Create `ability-scores-display.js` - Ability scores with modifiers
- [x] Create `character-list-display.js` - Generic list component
- [x] Create `character-details.js` - Background, languages, notes
- [x] Create `character-sheet-coordinator.js` - Main orchestrator
- [x] Update main Vue app to use new character sheet
- [x] Remove old `character-sheet.js`

### 2.3 Class Step Breakdown (212 lines → 4 components)
- [x] Create `class-selector.js` - Grid of available classes
- [x] Create `class-details-display.js` - Selected class info
- [x] Create `first-level-options.js` - Class-specific 1st level choices
- [x] Create `class-step-coordinator.js` - Main orchestrator
- [x] Update `stepper.js` to use new class components
- [x] Remove old `step-class.js`

### 2.4 Infrastructure Updates
- [x] Update `index.html` to include all new component files
- [x] Update parent components to use new child components
- [x] Fix traits display issue in character sheet

## ✅ Phase 3: Create Reusable UI Components (COMPLETED)

### 3.1 Generic Form Components
- [x] Create `collapsible-card.js` - Reusable expand/collapse card
- [x] Create `selection-grid.js` - Generic grid for selecting options
- [x] Create `checkbox-group.js` - Multiple selection component
- [x] Create `progress-indicator.js` - Completion status display

### 3.2 Specialized Selection Components  
- [x] Create `feat-selector.js` - Generalized feat selection
- [x] Create `ability-score-adjuster.js` - Point-buy and racial adjustments
- [x] Create `prerequisite-display.js` - Requirements with pass/fail indicators

### 3.3 Data Display Components
- [x] Create `info-panel.js` - Standardized information display
- [x] Create `stat-block.js` - Character stats display
- [x] Create `tag-list.js` - Lists of tags/badges

### 3.4 Refactor Existing Components to Use New UI Components
- [x] Update race components to use `collapsible-card.js`
- [x] Update class selection to use `selection-grid.js`
- [x] Update fighter bonus feats to use generic `feat-selector.js`
- [x] Update language components to use `checkbox-group.js`

## 🔄 Phase 4: Implement Remaining Character Creation Steps (IN PROGRESS)

### Step 1: Determine Ability Scores ✅ COMPLETED
- [x] Point Buy method
- [x] Standard Array method
- [x] Roll Dice method

### Step 2: Pick Your Race ✅ COMPLETED
- [x] All Core Rulebook races implemented
- [x] Racial traits and adjustments
- [x] Language selection
- [x] Human bonus feat selection

### Step 3: Pick Your Class ⏳ IN PROGRESS
#### Core Classes Implementation Status:
- [x] **Barbarian** - Automatic features (Rage, Fast Movement)
- [ ] **Bard** - Spellcasting, Bardic Performance
- [ ] **Cleric** - Domain selection, Channel Energy
- [ ] **Druid** - Animal Companion or Domain, Wild Empathy
- [x] **Fighter** - Bonus feat selection
- [ ] **Monk** - Bonus feat, Flurry of Blows, Stunning Fist
- [x] **Paladin** - Automatic features (Aura of Good, Detect Evil, Smite Evil)
- [ ] **Ranger** - Favored Enemy, Track, Combat Style
- [ ] **Rogue** - Sneak Attack, Trapfinding
- [ ] **Sorcerer** - Bloodline selection, Spells known
- [x] **Wizard** - Arcane Bond, Arcane School, Starting spellbook

### Step 4: Skills Allocation
- [ ] Implement skill point allocation based on class and Intelligence
- [ ] Validate skill selections and prerequisites

### Step 5: Feat Selection  
- [ ] General feat selection for all characters
- [ ] Class-specific bonus feats
- [ ] Prerequisite validation

### Step 6: Equipment Purchase
- [ ] Starting equipment based on class
- [ ] Gold and equipment purchasing system
- [ ] Armor Class and encumbrance calculations

### Step 7: Final Character Details
- [ ] Character name and background
- [ ] Alignment selection
- [ ] Final character summary and validation

## 🚀 Phase 5: Advanced Features (PLANNED)
- [ ] Character export/import functionality
- [ ] Print-friendly character sheets
- [ ] Character leveling system
- [ ] Additional Pathfinder content (beyond Core Rulebook)
- [ ] Multi-class support
- [ ] Spell preparation and casting interface
- [ ] Combat encounter calculator

---

## Notes
- Each phase builds on the previous ones
- Phase 1 provides the foundation services
- Phase 2 breaks down monolithic components  
- Phase 3 creates reusable building blocks
- Phase 4 completes core character creation
- Phase 5 adds advanced features

## Current Status
- **Phase 1**: ✅ Complete - Services and data management
- **Phase 2**: ✅ Complete - Component architecture
- **Phase 3**: ✅ Complete - Reusable UI components
- **Phase 4**: 🔄 In Progress - Character creation steps (4/11 classes done)
- **Phase 5**: ⏳ Waiting - Advanced features

## Recent Progress
- ✅ Implemented Human racial bonus feat selection
- ✅ Created dedicated Spellbook section for character sheet
- ✅ Implemented Barbarian class (automatic features)
- ✅ Implemented Paladin class (automatic features)
- ✅ Fixed wizard selection persistence and display issues
- ✅ Established data-driven architecture for all class features