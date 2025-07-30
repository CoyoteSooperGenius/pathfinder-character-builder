Vue.component('step-class', {
  template: `
    <div>
      <h3>Class Selection</h3>
      <p>Step 3: Choose your character's class.</p>
      
      <!-- Class Selection Section -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Available Classes</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div 
              v-for="classOption in coreClasses" 
              :key="classOption.name"
              class="col-md-6 col-lg-4 mb-3"
            >
              <div 
                class="card h-100 class-option"
                :class="{ 'border-primary bg-light': selectedClass === classOption.name }"
                @click="selectClass(classOption.name)"
                style="cursor: pointer;"
              >
                <div class="card-body">
                  <h6 class="card-title">{{ classOption.name }}</h6>
                  <p class="card-text small">{{ classOption.description }}</p>
                  <div class="small text-muted">
                    <strong>Hit Die:</strong> d{{ classOption.hitDie }}<br>
                    <strong>Skill Points:</strong> {{ classOption.skillPoints }}<br>
                    <strong>BAB:</strong> {{ classOption.baseAttackBonus }}<br>
                    <strong>Saves:</strong> Fort {{ classOption.saves.fortitude }}, Ref {{ classOption.saves.reflex }}, Will {{ classOption.saves.will }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Class Details -->
      <div v-if="selectedClass" class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">{{ selectedClass }} Details</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h6>Class Features</h6>
              <ul class="list-unstyled">
                <li v-for="feature in getSelectedClassData().classFeatures" :key="feature">
                  <i class="fas fa-check text-success me-2"></i>{{ feature }}
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <h6>Proficiencies</h6>
              <div class="mb-2">
                <strong>Weapons:</strong> {{ getSelectedClassData().weaponProficiencies }}
              </div>
              <div class="mb-2">
                <strong>Armor:</strong> {{ getSelectedClassData().armorProficiencies }}
              </div>
              <div class="mb-2">
                <strong>Class Skills:</strong> {{ getSelectedClassData().classSkills.join(', ') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 1st Level Options Placeholder -->
      <div v-if="selectedClass" class="card">
        <div class="card-header">
          <h5 class="mb-0">1st Level Options</h5>
        </div>
        <div class="card-body">
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Coming Soon:</strong> 1st level class-specific options such as spell selection, 
            domains, schools, bloodlines, and other class features will be implemented here.
          </div>
          
          <!-- Placeholder sections for different class types -->
          <div v-if="isSpellcaster()" class="mb-3">
            <h6>Spell Selection</h6>
            <p class="text-muted">Choose your starting spells and cantrips.</p>
          </div>
          
          <div v-if="hasSpecialization()" class="mb-3">
            <h6>Specialization</h6>
            <p class="text-muted">{{ getSpecializationText() }}</p>
          </div>
          
          <div class="mb-3">
            <h6>Starting Equipment</h6>
            <p class="text-muted">Your class grants specific starting equipment and gold.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      selectedClass: null,
      coreClasses: [
        {
          name: 'Barbarian',
          description: 'A fierce warrior who can enter a battle rage.',
          hitDie: 12,
          skillPoints: 4,
          baseAttackBonus: 'High',
          saves: { fortitude: 'High', reflex: 'Low', will: 'Low' },
          classFeatures: ['Rage', 'Fast Movement'],
          weaponProficiencies: 'Simple and martial weapons',
          armorProficiencies: 'Light and medium armor, shields',
          classSkills: ['Acrobatics', 'Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Knowledge (nature)', 'Perception', 'Ride', 'Survival', 'Swim']
        },
        {
          name: 'Bard',
          description: 'A master of song, speech, and the magic they contain.',
          hitDie: 8,
          skillPoints: 6,
          baseAttackBonus: 'Medium',
          saves: { fortitude: 'Low', reflex: 'High', will: 'High' },
          classFeatures: ['Bardic Knowledge', 'Bardic Performance', 'Cantrips', 'Spells', 'Countersong', 'Distraction', 'Fascinate', 'Inspire Courage +1'],
          weaponProficiencies: 'Simple weapons, longsword, rapier, sap, short sword, shortbow, whip',
          armorProficiencies: 'Light armor, shields',
          classSkills: ['Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge (all)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Spellcraft', 'Stealth', 'Use Magic Device']
        },
        {
          name: 'Cleric',
          description: 'A devout follower of a deity who wields divine magic.',
          hitDie: 8,
          skillPoints: 2,
          baseAttackBonus: 'Medium',
          saves: { fortitude: 'High', reflex: 'Low', will: 'High' },
          classFeatures: ['Aura', 'Channel Energy 1d6', 'Domains', 'Orisons', 'Spells'],
          weaponProficiencies: 'Simple weapons, Deity\'s favored weapon',
          armorProficiencies: 'Light and medium armor, shields',
          classSkills: ['Appraise', 'Craft', 'Diplomacy', 'Heal', 'Knowledge (arcana)', 'Knowledge (history)', 'Knowledge (nobility)', 'Knowledge (planes)', 'Knowledge (religion)', 'Linguistics', 'Profession', 'Sense Motive', 'Spellcraft']
        },
        {
          name: 'Druid',
          description: 'A servant of nature who commands elemental forces and animal companions.',
          hitDie: 8,
          skillPoints: 4,
          baseAttackBonus: 'Medium',
          saves: { fortitude: 'High', reflex: 'Low', will: 'High' },
          classFeatures: ['Nature Bond', 'Nature Sense', 'Orisons', 'Spells', 'Wild Empathy'],
          weaponProficiencies: 'Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears',
          armorProficiencies: 'Light and medium non-metal armor, non-metal shields',
          classSkills: ['Climb', 'Craft', 'Fly', 'Handle Animal', 'Heal', 'Knowledge (geography)', 'Knowledge (nature)', 'Perception', 'Profession', 'Ride', 'Spellcraft', 'Survival', 'Swim']
        },
        {
          name: 'Fighter',
          description: 'A master of martial combat skilled with a variety of weapons and armor.',
          hitDie: 10,
          skillPoints: 2,
          baseAttackBonus: 'High',
          saves: { fortitude: 'High', reflex: 'Low', will: 'Low' },
          classFeatures: ['Bonus Feat'],
          weaponProficiencies: 'Simple and martial weapons',
          armorProficiencies: 'All armor and shields',
          classSkills: ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (engineering)', 'Profession', 'Ride', 'Survival', 'Swim']
        },
        {
          name: 'Monk',
          description: 'A master of martial arts, harnessing inner power.',
          hitDie: 8,
          skillPoints: 4,
          baseAttackBonus: 'Medium',
          saves: { fortitude: 'High', reflex: 'High', will: 'High' },
          classFeatures: ['Bonus Feat','AC Bonus', 'Flurry of Blows', 'Stunning Fist', 'Unarmed Strike', 'Unarmed Damage'],
          weaponProficiencies: 'Club, crossbow (light or heavy), dagger, handaxe, javelin, kama, nunchaku, quarterstaff, sai, shortspear, short sword, shuriken, siangham, sling',
          armorProficiencies: 'None',
          classSkills: ['Acrobatics', 'Climb', 'Craft', 'Escape Artist', 'Intimidate', 'Knowledge (history)', 'Knowledge (religion)', 'Perception', 'Perform', 'Profession', 'Ride', 'Sense Motive', 'Stealth', 'Swim']
        },
        {
          name: 'Paladin',
          description: 'A holy champion who smites evil with divine power.',
          hitDie: 10,
          skillPoints: 2,
          baseAttackBonus: 'High',
          saves: { fortitude: 'High', reflex: 'Low', will: 'High' },
          classFeatures: ['Aura of Good', 'Detect Evil', 'Smite Evil'],
          weaponProficiencies: 'Simple and martial weapons',
          armorProficiencies: 'All armor and shields',
          classSkills: ['Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Knowledge (nobility)', 'Knowledge (religion)', 'Profession', 'Ride', 'Sense Motive', 'Spellcraft']
        },
        {
          name: 'Ranger',
          description: 'A skilled hunter and tracker who dwells on the edges of civilization.',
          hitDie: 10,
          skillPoints: 6,
          baseAttackBonus: 'High',
          saves: { fortitude: 'High', reflex: 'High', will: 'Low' },
          classFeatures: ['1st Favored Enemy', 'Track', 'Wild Empathy'],
          weaponProficiencies: 'Simple and martial weapons',
          armorProficiencies: 'Light and medium armor, shields',
          classSkills: ['Climb', 'Craft', 'Handle Animal', 'Heal', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (geography)', 'Knowledge (nature)', 'Perception', 'Profession', 'Ride', 'Spellcraft', 'Stealth', 'Survival', 'Swim']
        },
        {
          name: 'Rogue',
          description: 'A scoundrel who uses stealth and trickery to overcome obstacles.',
          hitDie: 8,
          skillPoints: 8,
          baseAttackBonus: 'Medium',
          saves: { fortitude: 'Low', reflex: 'High', will: 'Low' },
          classFeatures: ['Sneak Attack 1d6', 'Trapfinding'],
          weaponProficiencies: 'Simple weapons, hand crossbow, rapier, sap, shortbow, short sword',
          armorProficiencies: 'Light armor',
          classSkills: ['Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (local)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Stealth', 'Swim', 'Use Magic Device']
        },
        {
          name: 'Sorcerer',
          description: 'A spellcaster who draws on inherent magic from a draconic or other exotic bloodline.',
          hitDie: 6,
          skillPoints: 2,
          baseAttackBonus: 'Low',
          saves: { fortitude: 'Low', reflex: 'Low', will: 'High' },
          classFeatures: ['Bloodline', 'Cantrips', 'Eschew Materials', 'Spells'],
          weaponProficiencies: 'Simple weapons',
          armorProficiencies: 'None',
          classSkills: ['Appraise', 'Bluff', 'Craft', 'Fly', 'Intimidate', 'Knowledge (arcana)', 'Profession', 'Spellcraft', 'Use Magic Device']
        },
        {
          name: 'Wizard',
          description: 'A potent spellcaster schooled in the arcane arts.',
          hitDie: 6,
          skillPoints: 2,
          baseAttackBonus: 'Low',
          saves: { fortitude: 'Low', reflex: 'Low', will: 'High' },
          classFeatures: ['Arcane Bond', 'Arcane School', 'Cantrips', 'Scribe Scroll', 'Spells'],
          weaponProficiencies: 'Club, dagger, heavy crossbow, light crossbow, quarterstaff',
          armorProficiencies: 'None',
          classSkills: ['Appraise', 'Craft', 'Fly', 'Knowledge (all)', 'Linguistics', 'Profession', 'Spellcraft']
        }
      ]
    };
  },
  methods: {
    selectClass(className) {
      this.selectedClass = className;
      this.$emit('step-complete', true);
    },
    getSelectedClassData() {
      return this.coreClasses.find(c => c.name === this.selectedClass) || {};
    },
    isSpellcaster() {
      const spellcasters = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Wizard'];
      return spellcasters.includes(this.selectedClass);
    },
    hasSpecialization() {
      const specializationClasses = ['Cleric', 'Druid', 'Ranger', 'Sorcerer', 'Wizard'];
      return specializationClasses.includes(this.selectedClass);
    },
    getSpecializationText() {
      const texts = {
        'Cleric': 'Choose two domains that reflect your deity\'s portfolio.',
        'Druid': 'Choose either an animal companion or a domain.',
        'Ranger': 'Choose a favored enemy and combat style.',
        'Sorcerer': 'Choose a bloodline that determines your magical heritage.',
        'Wizard': 'Choose an arcane school to specialize in.'
      };
      return texts[this.selectedClass] || '';
    },
    getClassData() {
      if (!this.selectedClass) return null;
      
      return {
        selectedClass: this.selectedClass,
        classData: this.getSelectedClassData()
      };
    }
  },
  mounted() {
    // Check if we already have a saved class
    const savedBasicInfo = localStorage.getItem('currentBasicInfo');
    if (savedBasicInfo) {
      try {
        const basicInfo = JSON.parse(savedBasicInfo);
        if (basicInfo.class) {
          this.selectedClass = basicInfo.class;
          this.$emit('step-complete', true);
        }
      } catch (e) {
        console.warn('Error loading saved class data:', e);
      }
    }
    
    // Initially disable next button
    this.$emit('step-complete', false);
  }
});