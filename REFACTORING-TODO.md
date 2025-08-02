# Pathfinder Character Builder - Refactoring TODO

This document tracks the progress of the component refactoring project.

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

## 🔄 Phase 3: Create Reusable UI Components (IN PROGRESS)

### 3.1 Generic Form Components
- [x] Create `collapsible-card.js` - Reusable expand/collapse card
- [x] Create `selection-grid.js` - Generic grid for selecting options
- [ ] Create `checkbox-group.js` - Multiple selection component
- [ ] Create `progress-indicator.js` - Completion status display

### 3.2 Specialized Selection Components  
- [ ] Create `feat-selector.js` - Generalized feat selection
- [ ] Create `ability-score-adjuster.js` - Point-buy and racial adjustments
- [ ] Create `prerequisite-display.js` - Requirements with pass/fail indicators

### 3.3 Data Display Components
- [ ] Create `info-panel.js` - Standardized information display
- [ ] Create `stat-block.js` - Character stats display
- [ ] Create `tag-list.js` - Lists of tags/badges

### 3.4 Refactor Existing Components to Use New UI Components
- [ ] Update race components to use `collapsible-card.js`
- [ ] Update class selection to use `selection-grid.js`
- [ ] Update fighter bonus feats to use generic `feat-selector.js`
- [ ] Update language components to use `checkbox-group.js`

### 3.5 Infrastructure Updates
- [ ] Update `index.html` to include new UI component files
- [ ] Test all components work correctly with new UI components
- [ ] Remove duplicate UI code from existing components

## 🚀 Future Phases (Planned)

### Phase 4: Implement Remaining Character Creation Steps
- [ ] Complete Step 4: Skills allocation
- [ ] Complete Step 5: Feat selection  
- [ ] Complete Step 6: Equipment purchase
- [ ] Complete Step 7: Final character details

### Phase 5: Advanced Features
- [ ] Character export/import functionality
- [ ] Print-friendly character sheets
- [ ] Character leveling system
- [ ] Additional Pathfinder content (beyond Core Rulebook)

---

## Notes
- Each phase builds on the previous ones
- Phase 1 provides the foundation services
- Phase 2 breaks down monolithic components  
- Phase 3 creates reusable building blocks
- Future phases add new functionality

## Current Status
- **Phase 1**: ✅ Complete
- **Phase 2**: ✅ Complete  
- **Phase 3**: 🔄 Ready to start
- **Phase 4**: ⏳ Waiting
- **Phase 5**: ⏳ Waiting