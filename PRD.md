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

### Data Flow Pattern
1. **Props Down**: Parent components pass data to children via props
2. **Events Up**: Child components emit events to notify parents of changes
3. **localStorage Sync**: Character data automatically persisted on changes
4. **Reactive Updates**: Character sheet updates in real-time

## Data Management

### Character Data Structure
Character data is stored in localStorage. Each character should be save eventually with the key being its name like: firstname-lastname. If there is already a character with that names saved then append a number to the localStorage key.

The Character currently being built will be called current-character in localStorage.

### Game Data
Game Data are embedded as JavaScript objects within components. The data files are in the /data folder.

There are currently 5 data files in the folder: classes, feats, races, spells, and favored-enemies. More will have to be created to complete the character creation process.

The /data/pf1e-foundry-data folder has the complete Pathfinder 1e data files for the Foundry VTT. To build our data files we will use these files as the source of truth and build our own data files from them as we need the data.

## Application Functionality

### The Landing Page
The initial page of the application should be simple and give the title of the application and the option to Load an Existing Character or Create a New Character.

### Creating a New Character
The Create a New Character option should take the user through a stepper/wizard process that follows the 9 steps to creating a character in the Pathfinder 1e Core Rule Book. As each step in the process is completed the character data is save to the current-character in the localStorage.  After the last step when the character finally has a name, the character data is saved to firstname-lastname in the localStorage and the current-character is deleted. Then the complete character sheet for the character should be displayed with an option to go back to the Main Page.

The initial application is only concerned with creating 1st level Core Rule Book character. Progressing or leveling up characters will be another phase of development.

### Load Existing Character
The Load Character option should present the user with a list of characters in the localStorage. Clicking on a character should display the character sheet for that character.