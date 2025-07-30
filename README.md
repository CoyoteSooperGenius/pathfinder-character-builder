# Pathfinder Character Builder

A web-based character creation tool for the Pathfinder RPG Core Rulebook. This application provides a step-by-step guided interface for creating Pathfinder characters, with real-time character sheet updates and data persistence.

## Features

### Current Implementation
- **Step-by-Step Character Creation**: Guided wizard interface with progress tracking
- **Ability Score Generation**: Multiple methods including Point Buy, Standard Array, and Dice Rolling
- **Race Selection**: Complete Core Rulebook races with racial traits and adjustments
- **Class Selection**: All 11 Core Rulebook classes with detailed information
- **Real-time Character Sheet**: Live updates as you make selections
- **Data Persistence**: Automatically saves progress in browser localStorage

### Character Creation Steps
1. **Determine Ability Scores** - Choose from three different generation methods
2. **Pick Your Race** - Select from Core Rulebook races with automatic ability adjustments
3. **Pick Your Class** - Choose from 11 core classes with detailed stats and features
4. **Pick Skills** *(Coming Soon)*
5. **Pick Feats** *(Coming Soon)*
6. **Buy Equipment** *(Coming Soon)*
7. **Finishing Details** *(Coming Soon)*

## Technology Stack

- **Frontend Framework**: Vue.js 2
- **CSS Framework**: Bootstrap 5 (Sandstone theme)
- **Icons**: Font Awesome 6
- **Data Storage**: Browser localStorage for session persistence

## Project Structure

```
/
├── index.html                          # Main application entry point
├── css/
│   └── sandstone.css                   # Bootstrap Sandstone theme
└── js/
    ├── vue.js                          # Vue.js framework
    ├── components/
    │   ├── main-page.js                # Landing page component
    │   ├── character-sheet/
    │   │   └── character-sheet.js      # Live character sheet display
    │   └── stepper/
    │       ├── stepper.js              # Main stepper component
    │       ├── step-ability-scores.js  # Ability score generation
    │       ├── step-race.js            # Race selection
    │       ├── step-class.js           # Class selection
    │       ├── step-skills.js          # Skill allocation (placeholder)
    │       ├── step-feats.js           # Feat selection (placeholder)
    │       ├── step-equipment.js       # Equipment purchase (placeholder)
    │       ├── step-details.js         # Final character details (placeholder)
    │       ├── ability-scores/         # Ability score generation methods
    │       │   ├── point-buy-method.js
    │       │   ├── standard-array-method.js
    │       │   └── roll-dice-method.js
    │       └── race/                   # Race selection sub-components
    │           ├── available-races-card.js
    │           ├── ability-adjustments-card.js
    │           ├── favored-class-card.js
    │           ├── languages-card.js
    │           └── racial-traits-card.js
```

## Getting Started

### Prerequisites
- A modern web browser with JavaScript enabled
- A local web server (recommended for development)

### Installation
1. Clone or download the project files
2. Open `index.html` in a web browser, or
3. Serve the files through a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server package)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

### Usage
1. Open the application in your web browser
2. Click "Create New Character" to begin the character creation process
3. Follow the step-by-step wizard:
   - Generate ability scores using your preferred method
   - Select a race and configure racial options
   - Choose a class from the available options
   - *(Additional steps coming soon)*
4. View your character's progress in the live character sheet panel

## Classes Available

The application includes all 11 core Pathfinder classes:

- **Barbarian** - Fierce warrior with battle rage
- **Bard** - Master of magic through music and performance
- **Cleric** - Divine spellcaster devoted to a deity
- **Druid** - Nature-focused spellcaster with animal companions
- **Fighter** - Master of weapons and armor
- **Monk** - Martial artist with mystical abilities
- **Paladin** - Holy warrior championing good
- **Ranger** - Skilled tracker and hunter
- **Rogue** - Stealthy specialist in skills and sneak attacks
- **Sorcerer** - Innate arcane spellcaster with bloodline powers
- **Wizard** - Scholarly arcane spellcaster with spell schools

Each class includes:
- Hit die, skill points, and base attack bonus progression
- Saving throw progressions (Fortitude, Reflex, Will)
- Class features and abilities
- Weapon and armor proficiencies
- Complete class skill lists

## Data Persistence

Character data is automatically saved to browser localStorage as you progress through the creation steps. This includes:
- Generated ability scores
- Selected race and racial options
- Chosen class
- Applied racial ability adjustments
- Selected languages and traits

## Contributing

This is an educational project demonstrating Vue.js component architecture and Pathfinder RPG rules implementation. Feel free to fork and expand upon it!

### Future Enhancements
- Complete implementation of remaining character creation steps
- Spell selection for spellcasting classes
- Equipment and gear management
- Character export/import functionality
- Advanced class options and archetypes
- Multi-level character progression

## License

This project is for educational and personal use. Pathfinder is a trademark of Paizo Inc., and this tool is not affiliated with or endorsed by Paizo Inc.

## Acknowledgments

- Paizo Inc. for the Pathfinder RPG system
- Bootstrap team for the UI framework
- Vue.js team for the reactive framework
- Font Awesome for the