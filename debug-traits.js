// Debug script for traits issue
// Run this in the browser console to check localStorage and clear data

console.log('=== DEBUGGING TRAITS ISSUE ===');

// Check what's currently in localStorage
console.log('Current localStorage contents:');
console.log('currentAbilityScores:', localStorage.getItem('currentAbilityScores'));
console.log('currentBasicInfo:', localStorage.getItem('currentBasicInfo'));
console.log('currentDetails:', localStorage.getItem('currentDetails'));
console.log('currentTraits:', localStorage.getItem('currentTraits'));

// Function to clear all character data
function clearCharacterData() {
  console.log('Clearing all character data...');
  localStorage.removeItem('currentAbilityScores');
  localStorage.removeItem('currentBasicInfo');
  localStorage.removeItem('currentDetails');
  localStorage.removeItem('currentTraits');
  console.log('Character data cleared!');
  console.log('Please refresh the page and create a new character.');
}

// Function to test trait data structure
function testTraitsData() {
  const traitsData = CharacterDataService.getTraits();
  console.log('Traits data from service:', traitsData);
  
  if (traitsData && traitsData.racialTraits) {
    console.log('Number of traits:', traitsData.racialTraits.length);
    traitsData.racialTraits.forEach((trait, index) => {
      console.log(`Trait ${index}:`, trait);
      console.log(`  Label: "${trait.Label}"`);
      console.log(`  Description: "${trait.Description}"`);
    });
  } else {
    console.log('No traits found or wrong data structure');
  }
}

// Function to manually save sample elf traits (for testing)
function saveSampleElfTraits() {
  const sampleTraits = [
    "+2 Dexterity, +2 Intelligence, –2 Constitution: Elves are nimble, both in body and mind, but their form is frail.",
    "Medium: Elves are Medium creatures and have no bonuses or penalties due to their size.",
    "Normal Speed: Elves have a base speed of 30 feet.",
    "Low-Light Vision: Elves can see twice as far as humans in conditions of dim light.",
    "Elven Immunities: Elves are immune to magic sleep effects and get a +2 racial saving throw bonus against enchantment spells and effects."
  ];
  
  const formattedTraits = sampleTraits.map(trait => {
    const colonIndex = trait.indexOf(':');
    if (colonIndex > -1) {
      return {
        Label: trait.substring(0, colonIndex).trim(),
        Description: trait.substring(colonIndex + 1).trim()
      };
    } else {
      return {
        Label: trait.trim(),
        Description: ''
      };
    }
  });
  
  const traitsData = {
    racialTraits: formattedTraits
  };
  
  localStorage.setItem('currentTraits', JSON.stringify(traitsData));
  console.log('Sample elf traits saved!');
  console.log('Formatted traits:', formattedTraits);
}

// Make functions available globally
window.clearCharacterData = clearCharacterData;
window.testTraitsData = testTraitsData;
window.saveSampleElfTraits = saveSampleElfTraits;

console.log('Available functions:');
console.log('- clearCharacterData() - Clear all localStorage data');
console.log('- testTraitsData() - Check current traits data structure');
console.log('- saveSampleElfTraits() - Manually save sample elf traits');