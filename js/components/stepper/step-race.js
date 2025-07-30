Vue.component('step-race', {
  data() {
    return {
      selectedRace: 'Human',
      selectedIncreases: [],
      selectedDecreases: [],
      selectedFavoredClasses: [],
      selectedLanguages: [],
      abilities: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      races: [
        {
          name: 'Human',
          abilityAdjustments: {
            increases: { count: 1, fixed: false },
            decreases: { count: 0, fixed: false }
          },
          traits: [
            '+2 to One Ability Score: Human characters get a +2 bonus to one ability score of their choice at creation to represent their varied nature.',
            'Medium: Humans are Medium creatures and have no bonuses or penalties due to their size.',
            'Normal Speed: Humans have a base speed of 30 feet.',
            'Bonus Feat: Humans select one extra feat at 1st level.',
            'Skilled: Humans gain an additional skill rank at first level and one additional rank whenever they gain a level.',
            'Languages: Humans begin play speaking Common. Humans with high Intelligence scores can choose any languages they want (except secret languages, such as Druidic).'
          ]
        },
        {
          name: 'Dwarf',
          abilityAdjustments: {
            increases: { count: 2, fixed: true, abilities: ['CON', 'WIS'] },
            decreases: { count: 1, fixed: true, abilities: ['CHA'] }
          },
          traits: [
            '+2 Constitution, +2 Wisdom, –2 Charisma: Dwarves are both tough and wise, but also a bit gruff.',
            'Medium: Dwarves are Medium creatures and have no bonuses or penalties due to their size.',
            'Slow and Steady: Dwarves have a base speed of 20 feet, but their speed is never modified by armor or encumbrance.',
            'Darkvision: Dwarves can see in the dark up to 60 feet.',
            'Defensive Training: Dwarves get a +4 dodge bonus to AC against monsters of the giant subtype.',
            'Greed: Dwarves receive a +2 racial bonus on Appraise skill checks made to determine the price of nonmagical goods that contain precious metals or gemstones.',
            'Hatred: Dwarves receive a +1 racial bonus on attack rolls against humanoid creatures of the orc and goblinoid subtypes due to special training against these hated foes.',
            'Hardy: Dwarves receive a +2 racial bonus on saving throws against poison, spells, and spell-like abilities.',
            'Stability: Dwarves receive a +4 racial bonus to their Combat Maneuver Defense when resisting a bull rush or trip attempt while standing on the ground.',
            'Stonecunning: Dwarves receive a +2 bonus on Perception checks to potentially notice unusual stonework.',
            'Weapon Familiarity: Dwarves are proficient with battleaxes, heavy picks, and warhammers, and treat any weapon with the word "dwarven" in its name as a martial weapon.',
            'Languages: Dwarves begin play speaking Common and Dwarven. Dwarves with high Intelligence scores can choose from the following: Giant, Gnome, Goblin, Orc, Terran, and Undercommon.'
          ]
        },
        {
          name: 'Elf',
          abilityAdjustments: {
            increases: { count: 2, fixed: true, abilities: ['DEX', 'INT'] },
            decreases: { count: 1, fixed: true, abilities: ['CON'] }
          },
          traits: [
            '+2 Dexterity, +2 Intelligence, –2 Constitution: Elves are nimble, both in body and mind, but their form is frail.',
            'Medium: Elves are Medium creatures and have no bonuses or penalties due to their size.',
            'Normal Speed: Elves have a base speed of 30 feet.',
            'Low-Light Vision: Elves can see twice as far as humans in conditions of dim light.',
            'Elven Immunities: Elves are immune to magic sleep effects and get a +2 racial saving throw bonus against enchantment spells and effects.',
            'Elven Magic: Elves receive a +2 racial bonus on caster level checks made to overcome spell resistance. In addition, elves receive a +2 racial bonus on Spellcraft skill checks made to identify the properties of magic items.',
            'Keen Senses: Elves receive a +2 racial bonus on Perception skill checks.',
            'Weapon Familiarity: Elves are proficient with longbows (including composite longbows), longswords, rapiers, and shortbows (including composite shortbows), and treat any weapon with the word "elven" in its name as a martial weapon.',
            'Languages: Elves begin play speaking Common and Elven. Elves with high Intelligence scores can choose from the following: Celestial, Draconic, Gnoll, Gnome, Goblin, Orc, and Sylvan.'
          ]
        },
        {
          name: 'Gnome',
          abilityAdjustments: {
            increases: { count: 2, fixed: true, abilities: ['CON', 'CHA'] },
            decreases: { count: 1, fixed: true, abilities: ['STR'] }
          },
          traits: [
            '+2 Constitution, +2 Charisma, –2 Strength: Gnomes are physically weak but surprisingly hardy and have strong personalities.',
            'Small: Gnomes are Small creatures and gain a +1 size bonus to their AC, a +1 size bonus on attack rolls, a –1 penalty to their Combat Maneuver Bonus and Combat Maneuver Defense, and a +4 size bonus on Stealth checks.',
            'Slow Speed: Gnomes have a base speed of 20 feet.',
            'Low-Light Vision: Gnomes can see twice as far as humans in conditions of dim light.',
            'Defensive Training: Gnomes get a +4 dodge bonus to AC against monsters of the giant subtype.',
            'Gnome Magic: Gnomes add +1 to the DC of any saving throws against illusion spells that they cast. Gnomes with a Charisma of 11 or higher also gain the following spell-like abilities: 1/day—dancing lights, ghost sound, prestidigitation, and speak with animals. The caster level for these effects is equal to the gnome\'s level. The DC for these spells is equal to 10 + the spell\'s level + the gnome\'s Charisma modifier.',
            'Hatred: Gnomes receive a +1 racial bonus on attack rolls against humanoid creatures of the reptilian and goblinoid subtypes due to special training against these hated foes.',
            'Illusion Resistance: Gnomes get a +2 racial saving throw bonus against illusion spells and effects.',
            'Keen Senses: Gnomes receive a +2 racial bonus on Perception skill checks.',
            'Obsessive: Gnomes receive a +2 racial bonus on a Craft or Profession skill of their choice.',
            'Weapon Familiarity: Gnomes treat any weapon with the word "gnome" in its name as a martial weapon.',
            'Languages: Gnomes begin play speaking Common, Gnome, and Sylvan. Gnomes with high Intelligence scores can choose from the following: Draconic, Dwarven, Elven, Giant, Goblin, and Orc.'
          ]
        },
        {
          name: 'Half-Elf',
          abilityAdjustments: {
            increases: { count: 1, fixed: false },
            decreases: { count: 0, fixed: false }
          },
          traits: [
            '+2 to One Ability Score: Half-elf characters get a +2 bonus to one ability score of their choice at creation to represent their varied nature.',
            'Medium: Half-elves are Medium creatures and have no bonuses or penalties due to their size.',
            'Normal Speed: Half-elves have a base speed of 30 feet.',
            'Low-Light Vision: Half-elves can see twice as far as humans in conditions of dim light.',
            'Adaptability: Half-elves receive Skill Focus as a bonus feat at 1st level.',
            'Elf Blood: Half-elves count as both elves and humans for any effect related to race.',
            'Elven Immunities: Half-elves are immune to magic sleep effects and get a +2 racial saving throw bonus against enchantment spells and effects.',
            'Keen Senses: Half-elves receive a +2 racial bonus on Perception skill checks.',
            'Multitalented: Half-elves choose two favored classes at first level and gain +1 hit point or +1 skill point whenever they take a level in either one of those classes.',
            'Languages: Half-elves begin play speaking Common and Elven. Half-elves with high Intelligence scores can choose any languages they want (except secret languages, such as Druidic).'
          ]
        },
        {
          name: 'Half-Orc',
          abilityAdjustments: {
            increases: { count: 1, fixed: false },
            decreases: { count: 0, fixed: false }
          },
          traits: [
            '+2 to One Ability Score: Half-orc characters get a +2 bonus to one ability score of their choice at creation to represent their varied nature.',
            'Medium: Half-orcs are Medium creatures and have no bonuses or penalties due to their size.',
            'Normal Speed: Half-orcs have a base speed of 30 feet.',
            'Darkvision: Half-orcs can see in the dark up to 60 feet.',
            'Intimidating: Half-orcs receive a +2 racial bonus on Intimidate skill checks due to their fearsome nature.',
            'Orc Blood: Half-orcs count as both humans and orcs for any effect related to race.',
            'Orc Ferocity: Once per day, when a half-orc is brought below 0 hit points but not killed, he can fight on for one more round as if disabled. At the end of his next turn, unless brought to above 0 hit points, he immediately falls unconscious and begins dying.',
            'Weapon Familiarity: Half-orcs are proficient with falchions and greataxes, and treat any weapon with the word "orc" in its name as a martial weapon.',
            'Languages: Half-orcs begin play speaking Common and Orc. Half-orcs with high Intelligence scores can choose from the following: Abyssal, Draconic, Giant, Gnoll, and Goblin.'
          ]
        },
        {
          name: 'Halfling',
          abilityAdjustments: {
            increases: { count: 2, fixed: true, abilities: ['DEX', 'CHA'] },
            decreases: { count: 1, fixed: true, abilities: ['STR'] }
          },
          traits: [
            '+2 Dexterity, +2 Charisma, –2 Strength: Halflings are nimble and strong-willed, but their small stature makes them weaker than other races.',
            'Small: Halflings are Small creatures and gain a +1 size bonus to their AC, a +1 size bonus on attack rolls, a –1 penalty to their Combat Maneuver Bonus and Combat Maneuver Defense, and a +4 size bonus on Stealth checks.',
            'Slow Speed: Halflings have a base speed of 20 feet.',
            'Fearless: Halflings receive a +2 racial bonus on saving throws against fear. This bonus stacks with the bonus granted by halfling luck.',
            'Halfling Luck: Halflings receive a +1 racial bonus on all saving throws.',
            'Keen Senses: Halflings receive a +2 racial bonus on Perception skill checks.',
            'Sure-Footed: Halflings receive a +2 racial bonus on Acrobatics and Climb skill checks.',
            'Weapon Familiarity: Halflings are proficient with slings and treat any weapon with the word "halfling" in its name as a martial weapon.',
            'Languages: Halflings begin play speaking Common and Halfling. Halflings with high Intelligence scores can choose from the following: Dwarven, Elven, Gnome, and Goblin.'
          ]
        }
      ]
    };
  },
  computed: {
    selectedRaceData() {
      return this.races.find(race => race.name === this.selectedRace);
    },
    intelligenceModifier() {
      // Calculate Intelligence modifier based on ability scores and racial adjustments
      let baseIntelligence = 10; // Default base score
      
      // Add racial adjustments
      if (this.selectedRaceData.abilityAdjustments.increases.fixed) {
        if (this.selectedRaceData.abilityAdjustments.increases.abilities.includes('INT')) {
          baseIntelligence += 2;
        }
      } else if (this.selectedIncreases.includes('INT')) {
        baseIntelligence += 2;
      }
      
      if (this.selectedRaceData.abilityAdjustments.decreases.fixed) {
        if (this.selectedRaceData.abilityAdjustments.decreases.abilities.includes('INT')) {
          baseIntelligence -= 2;
        }
      } else if (this.selectedDecreases.includes('INT')) {
        baseIntelligence -= 2;
      }
      
      return Math.floor((baseIntelligence - 10) / 2);
    },
    isStepComplete() {
      const raceData = this.selectedRaceData;
      if (!raceData) return false;
      
      const increasesComplete = raceData.abilityAdjustments.increases.fixed || 
        this.selectedIncreases.length === raceData.abilityAdjustments.increases.count;
      const decreasesComplete = raceData.abilityAdjustments.decreases.fixed || 
        this.selectedDecreases.length === raceData.abilityAdjustments.decreases.count;
      
      // Check favored class completion
      const expectedFavoredClasses = raceData.name === 'Half-Elf' ? 2 : 1;
      const favoredClassComplete = this.selectedFavoredClasses.length === expectedFavoredClasses;
      
      // Check languages completion (racial languages + bonus from INT)
      const expectedLanguageCount = this.getExpectedLanguageCount();
      const languagesComplete = this.selectedLanguages.length >= expectedLanguageCount;
      
      return increasesComplete && decreasesComplete && favoredClassComplete && languagesComplete;
    }
  },
  methods: {
    getRaceData() {
      // Return all the race-related data for saving
      return {
        selectedRace: this.selectedRace,
        selectedIncreases: this.selectedIncreases,
        selectedDecreases: this.selectedDecreases,
        selectedFavoredClasses: this.selectedFavoredClasses,
        languages: this.selectedLanguages,
        traits: this.selectedRaceData.traits
      };
    },
    onRaceChange(newRace) {
      this.selectedRace = newRace;
      this.resetAbilitySelections();
      this.resetFavoredClasses();
      this.resetLanguages();
      this.checkCompletion();
    },
    resetAbilitySelections() {
      const raceData = this.selectedRaceData;
      
      // Set fixed ability adjustments
      if (raceData.abilityAdjustments.increases.fixed) {
        this.selectedIncreases = [...raceData.abilityAdjustments.increases.abilities];
      } else {
        this.selectedIncreases = [];
      }
      
      if (raceData.abilityAdjustments.decreases.fixed) {
        this.selectedDecreases = [...raceData.abilityAdjustments.decreases.abilities];
      } else {
        this.selectedDecreases = [];
      }
    },
    resetFavoredClasses() {
      this.selectedFavoredClasses = [];
    },
    resetLanguages() {
      this.selectedLanguages = [];
    },
    getExpectedLanguageCount() {
      // Get racial languages count + bonus from Intelligence
      const racialCount = this.getRacialLanguagesCount();
      const bonusCount = Math.max(0, this.intelligenceModifier);
      return racialCount + bonusCount;
    },
    getRacialLanguagesCount() {
      // This is a simplified count - the actual component will handle the parsing
      return this.selectedRaceData.name === 'Human' ? 1 : 2; // Rough estimate
    },
    onIncreaseChange(ability) {
      const raceData = this.selectedRaceData;
      if (raceData.abilityAdjustments.increases.fixed) return;
      
      const index = this.selectedIncreases.indexOf(ability);
      if (index > -1) {
        this.selectedIncreases.splice(index, 1);
      } else if (this.selectedIncreases.length < raceData.abilityAdjustments.increases.count) {
        this.selectedIncreases.push(ability);
      }
      this.checkCompletion();
    },
    onDecreaseChange(ability) {
      const raceData = this.selectedRaceData;
      if (raceData.abilityAdjustments.decreases.fixed) return;
      
      const index = this.selectedDecreases.indexOf(ability);
      if (index > -1) {
        this.selectedDecreases.splice(index, 1);
      } else if (this.selectedDecreases.length < raceData.abilityAdjustments.decreases.count) {
        this.selectedDecreases.push(ability);
      }
      this.checkCompletion();
    },
    onFavoredClassChange(classes) {
      this.selectedFavoredClasses = classes;
      this.checkCompletion();
    },
    onLanguagesChange(languages) {
      this.selectedLanguages = languages;
      this.checkCompletion();
    },
    checkCompletion() {
      this.$emit('step-complete', this.isStepComplete);
    }
  },
  mounted() {
    this.resetAbilitySelections();
    this.resetFavoredClasses();
    this.resetLanguages();
    this.checkCompletion();
  },
  template: `
    <div>
      <h3 class="mb-4">Choose Your Race</h3>
      <div class="row">
        <div class="col-12 col-lg-6">
          <available-races-card
            :races="races"
            :selected-race="selectedRace"
            @race-changed="onRaceChange"
          ></available-races-card>
          
          <ability-adjustments-card
            :selected-race-data="selectedRaceData"
            :selected-increases="selectedIncreases"
            :selected-decreases="selectedDecreases"
            :abilities="abilities"
            @increase-changed="onIncreaseChange"
            @decrease-changed="onDecreaseChange"
          ></ability-adjustments-card>
          
          <favored-class-card
            :selected-race-data="selectedRaceData"
            :selected-favored-classes="selectedFavoredClasses"
            @favored-class-changed="onFavoredClassChange"
          ></favored-class-card>
          
          <languages-card
            :selected-race-data="selectedRaceData"
            :selected-languages="selectedLanguages"
            :selected-increases="selectedIncreases"
            :selected-decreases="selectedDecreases"
            @languages-changed="onLanguagesChange"
          ></languages-card>
        </div>
        
        <div class="col-12 col-lg-6">
          <racial-traits-card
            :selected-race-data="selectedRaceData"
          ></racial-traits-card>
        </div>
      </div>
    </div>
  `
});