Vue.component('wizard-options', {
  template: `
    <div>
      <!-- Arcane Bond Selection -->
      <div class="card mb-3">
        <div class="card-header">
          <h6 class="mb-0">Arcane Bond</h6>
        </div>
        <div class="card-body">
          <p class="text-muted small mb-3">
            At 1st level, wizards form a powerful bond with an object or a creature. This bond can take one of two forms: a familiar or a bonded object.
          </p>
          
          <div class="row">
            <div class="col-md-6 mb-3">
              <div 
                class="card h-100 option-card cursor-pointer"
                :class="{ 'border-primary bg-light': selectedArcaneBond === 'familiar' }"
                @click="selectArcaneBond('familiar')"
              >
                <div class="card-body text-center">
                  <i class="fas fa-cat fa-2x mb-2 text-primary"></i>
                  <h6 class="card-title">Familiar</h6>
                  <p class="card-text small">
                    A magical animal companion that shares a special bond with you and aids in your magical studies.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="col-md-6 mb-3">
              <div 
                class="card h-100 option-card cursor-pointer"
                :class="{ 'border-primary bg-light': selectedArcaneBond === 'bonded_object' }"
                @click="selectArcaneBond('bonded_object')"
              >
                <div class="card-body text-center">
                  <i class="fas fa-magic fa-2x mb-2 text-primary"></i>
                  <h6 class="card-title">Bonded Object</h6>
                  <p class="card-text small">
                    A wand, amulet, ring, staff, weapon, or other item that becomes magically bonded to you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Familiar Selection (shown only when Familiar is selected) -->
      <div v-if="selectedArcaneBond === 'familiar'" class="card mb-3">
        <div class="card-header">
          <h6 class="mb-0">Choose Your Familiar</h6>
        </div>
        <div class="card-body">
          <p class="text-muted small mb-3">
            Select the type of familiar that will accompany you. Each familiar provides a different benefit to its master.
          </p>
          
          <div class="row">
            <div class="col-md-6 col-lg-4 mb-3" v-for="familiar in familiarOptions" :key="familiar.name">
              <div 
                class="card h-100 option-card cursor-pointer"
                :class="{ 'border-primary bg-light': selectedFamiliar === familiar.name }"
                @click="selectFamiliar(familiar.name)"
              >
                <div class="card-body">
                  <h6 class="card-title">
                    <i :class="familiar.icon" class="me-2 text-primary"></i>{{ familiar.name }}
                  </h6>
                  <p class="card-text small mb-2">{{ familiar.description }}</p>
                  <div class="small">
                    <strong class="text-success">Benefit:</strong> {{ familiar.benefit }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bonded Object Selection (shown only when Bonded Object is selected) -->
      <div v-if="selectedArcaneBond === 'bonded_object'" class="card mb-3">
        <div class="card-header">
          <h6 class="mb-0">Choose Your Bonded Object</h6>
        </div>
        <div class="card-body">
          <p class="text-muted small mb-3">
            Select the type of object that will become your bonded item. This item becomes a focus for your magical abilities.
          </p>
          
          <div class="row">
            <div class="col-md-6 col-lg-4 mb-3" v-for="object in bondedObjectOptions" :key="object.name">
              <div 
                class="card h-100 option-card cursor-pointer"
                :class="{ 'border-primary bg-light': selectedBondedObject === object.name }"
                @click="selectBondedObject(object.name)"
              >
                <div class="card-body">
                  <h6 class="card-title">
                    <i :class="object.icon" class="me-2 text-primary"></i>{{ object.name }}
                  </h6>
                  <p class="card-text small mb-2">{{ object.description }}</p>
                  <div class="small">
                    <strong class="text-success">Benefit:</strong> {{ object.benefit }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Weapon Input Field (shown only when Weapon is selected) -->
          <div v-if="selectedBondedObject === 'Weapon'" class="mt-3">
            <div class="card border-info">
              <div class="card-body">
                <h6 class="card-title">
                  <i class="fas fa-edit me-2 text-info"></i>Specify Your Weapon
                </h6>
                <p class="text-muted small mb-3">
                  Enter the specific weapon you want as your bonded object. This must be a weapon you are proficient with.
                </p>
                <div class="mb-3">
                  <label for="weapon-input" class="form-label">Weapon Name:</label>
                  <input 
                    type="text" 
                    id="weapon-input"
                    class="form-control" 
                    :value="selectedWeapon"
                    @input="updateWeapon($event.target.value)"
                    placeholder="e.g., Quarterstaff, Dagger, Light Crossbow"
                    maxlength="50"
                  >
                  <div class="form-text">
                    Wizards are proficient with: Club, Dagger, Heavy Crossbow, Light Crossbow, Quarterstaff
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Arcane School Selection -->
      <div class="card mb-3">
        <div class="card-header">
          <h6 class="mb-0">Arcane School</h6>
        </div>
        <div class="card-body">
          <p class="text-muted small mb-3">
            At 1st level, a wizard must choose to specialize in one school of magic or be a universalist wizard who doesn't specialize.
          </p>
          
          <div class="row">
            <div class="col-md-6 col-lg-4 mb-3" v-for="school in arcaneSchools" :key="school.name">
              <div 
                class="card h-100 option-card cursor-pointer"
                :class="{ 'border-primary bg-light': selectedArcaneSchool === school.name }"
                @click="selectArcaneSchool(school.name)"
              >
                <div class="card-body">
                  <h6 class="card-title">
                    <i :class="school.icon" class="me-2"></i>{{ school.name }}
                  </h6>
                  <p class="card-text small">{{ school.description }}</p>
                  
                  <!-- School Powers -->
                  <div v-if="school.schoolPowers && school.schoolPowers.length > 0" class="mt-2">
                    <div class="small">
                      <strong class="text-primary">School Powers:</strong>
                    </div>
                    <div v-for="power in school.schoolPowers" :key="power.name" class="small mt-1">
                      <strong>{{ power.name }}:</strong> {{ power.description }}
                    </div>
                  </div>
                  
                  <div v-if="school.name !== 'Universalist'" class="small text-muted mt-2">
                    <strong>Note:</strong> You will choose 2 opposition schools after selecting this specialization.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Opposition School Selection (shown only when specialized school is selected) -->
      <div v-if="needsOppositionSchools" class="card mb-3">
        <div class="card-header">
          <h6 class="mb-0">Choose Opposition Schools</h6>
        </div>
        <div class="card-body">
          <p class="text-muted small mb-3">
            As a specialist in {{ selectedArcaneSchool }}, you must choose exactly two schools of magic to be your opposition schools. 
            You cannot cast spells from these schools, and they take up two spell slots when prepared from scrolls or other sources.
          </p>
          
          <feat-selector
            :feats="availableOppositionSchools"
            :selected-feat="selectedOppositionSchools"
            title=""
            description="Select exactly 2 opposition schools:"
            display-mode="cards"
            :show-details="false"
            :allow-multiple="true"
            :max-selections="2"
            :min-selections="2"
            :loading="availableOppositionSchools.length === 0"
            empty-message="Loading schools..."
            :filter-by-prerequisites="false"
            @feat-selected="selectOppositionSchools"
          />
        </div>
      </div>

      <!-- Starting Spellbook -->
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0">Starting Spellbook</h6>
        </div>
        <div class="card-body">
          <p class="text-muted small mb-3">
            A wizard begins play with a spellbook containing all 0-level wizard spells plus three 1st-level wizard spells of your choice.
          </p>
          
          <!-- Cantrips (0-level) -->
          <div class="mb-4">
            <h6 class="mb-2">Cantrips (0-level) - All Included</h6>
            <div class="alert alert-info small">
              <i class="fas fa-info-circle me-2"></i>
              Your spellbook automatically contains all wizard cantrips: 
              Acid Splash, Arcane Mark, Bleed, Dancing Lights, Daze, Detect Magic, Detect Poison, Disrupt Undead, 
              Flare, Ghost Sound, Light, Mage Hand, Mending, Message, Open/Close, Prestidigitation, Ray of Frost, 
              Read Magic, Resistance, Touch of Fatigue.
            </div>
          </div>
          
          <!-- 1st Level Spells -->
          <div class="mb-3">
            <h6 class="mb-2">
              1st-Level Spells - Choose {{ availableStartingSpells.total }}
              <span v-if="availableStartingSpells.total === 0" class="text-danger">(None - Intelligence too low)</span>
            </h6>
            
            <!-- Intelligence Info -->
            <div class="alert alert-info small mb-3">
              <i class="fas fa-info-circle me-2"></i>
              <strong>Intelligence {{ availableStartingSpells.intelligence }}</strong> 
              ({{ availableStartingSpells.bonus >= 0 ? '+' : '' }}{{ availableStartingSpells.bonus }} bonus) = 
              {{ availableStartingSpells.total }} starting spells (3 base + Int bonus)
              <div v-if="availableStartingSpells.total === 0" class="text-danger mt-1">
                <i class="fas fa-exclamation-triangle me-1"></i>
                You need at least Intelligence 11 to cast 1st-level spells. With Intelligence {{ availableStartingSpells.intelligence }}, 
                you can only cast cantrips until you increase your Intelligence.
              </div>
            </div>
            
            <!-- Unified Spell Selection Interface -->
            <spell-selector
              v-if="availableStartingSpells.total > 0"
              :spell-selections="spellSelections"
              :selected-spells="selectedSpellsData"
              :loading="firstLevelSpells.length === 0"
              class-name="Wizard"
              @spells-changed="onWizardSpellsChanged"
            />
            
            <div v-else class="alert alert-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>No 1st-level spells available.</strong> Your Intelligence is too low to cast 1st-level spells. 
              You will only have cantrips in your starting spellbook.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    selectedArcaneBond: {
      type: String,
      default: null
    },
    selectedFamiliar: {
      type: String,
      default: null
    },
    selectedBondedObject: {
      type: String,
      default: null
    },
    selectedWeapon: {
      type: String,
      default: null
    },
    selectedArcaneSchool: {
      type: String,
      default: null
    },
    selectedSpells: {
      type: Array,
      default: () => []
    },
    selectedOppositionSchools: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIntelligence: 10, // Track Intelligence reactively
      arcaneSchools: [
        {
          name: 'Universalist',
          description: 'No specialization. Access to all schools but no special bonuses.',
          icon: 'fas fa-circle',
          schoolPowers: [
            {
              name: 'Hand of the Apprentice',
              description: 'You cause your melee weapon to fly from your grasp and strike a foe before instantly returning to you. As a standard action, you can make a single attack using a melee weapon at a range of 30 feet. This attack is treated as a ranged attack with a thrown weapon, except that you add your Intelligence modifier on the attack roll instead of your Dexterity modifier (damage still relies on Strength). This ability cannot be used to perform a combat maneuver. You can use this ability a number of times per day equal to 3 + your Intelligence modifier.'
            }
          ]
        },
        {
          name: 'Abjuration',
          description: 'Protective magic and spells that negate or counter other spells.',
          icon: 'fas fa-shield-alt',
          schoolPowers: [
            {
              name: 'Resistance',
              description: 'You gain resistance 5 to an energy type of your choice, chosen when you prepare spells. This resistance can be changed each day when you prepare spells.'
            },
            {
              name: 'Protective Ward',
              description: 'As a standard action, you can create a 10-foot-radius field of protective magic centered on you that lasts for a number of rounds equal to your Intelligence modifier. All allies in this area (including you) receive a +1 deflection bonus to AC. This bonus increases by +1 for every five wizard levels you possess. You can use this ability a number of times per day equal to 3 + your Intelligence modifier.'
            }
          ]
        },
        {
          name: 'Conjuration',
          description: 'Spells that bring creatures or materials to the caster.',
          icon: 'fas fa-plus-circle',
          schoolPowers: [
            {
              name: 'Summoner\'s Charm',
              description: 'Whenever you cast a conjuration (summoning) spell, increase the duration by a number of rounds equal to 1/2 your wizard level (minimum 1). This increase is not doubled by Extend Spell.'
            },
            {
              name: 'Acid Dart',
              description: 'As a standard action you can unleash an acid dart targeting any foe within 30 feet as a ranged touch attack. The acid dart deals 1d6 points of acid damage + 1 for every two wizard levels you possess. You can use this ability a number of times per day equal to 3 + your Intelligence modifier.'
            }
          ]
        },
        {
          name: 'Divination',
          description: 'Spells that reveal information, grant insight, or see the future.',
          icon: 'fas fa-eye',
          schoolPowers: [
            {
              name: 'Forewarned',
              description: 'You can always act in the surprise round even if you fail to make a Perception roll to notice a foe, but you are still considered flat-footed until you take an action. In addition, you receive a bonus on initiative checks equal to 1/2 your wizard level (minimum +1).'
            },
            {
              name: 'Diviner\'s Fortune',
              description: 'When you activate this school power, you can touch any creature as a standard action to give it an insight bonus on all of its attack rolls, skill checks, ability checks, and saving throws equal to 1/2 your wizard level (minimum +1) for 1 round. You can use this ability a number of times per day equal to 3 + your Intelligence modifier.'
            }
          ]
        },
        {
          name: 'Enchantment',
          description: 'Magic that affects the mind and influences behavior.',
          icon: 'fas fa-heart',
          schoolPowers: [
            {
              name: 'Enchanting Smile',
              description: 'You gain a +2 enhancement bonus on Bluff, Diplomacy, and Intimidate skill checks. This bonus increases by +1 for every five wizard levels you possess, up to a maximum of +6 at 20th level.'
            },
            {
              name: 'Dazing Touch',
              description: 'You can cause a living creature to become dazed for a number of rounds equal to 1/2 your wizard level (minimum 1) by making a successful melee touch attack. You can use this ability a number of times per day equal to 3 + your Intelligence modifier.'
            }
          ]
        },
        {
          name: 'Evocation',
          description: 'Magic that manipulates energy or taps an unseen source of power.',
          icon: 'fas fa-bolt',
          schoolPowers: [
            {
              name: 'Intense Spells',
              description: 'Whenever you cast an evocation spell that deals hit point damage, add 1/2 your wizard level to the damage (minimum +1). This bonus only applies once to a spell, not once per missile or ray, and cannot be split between multiple targets.'
            },
            {
              name: 'Force Missile',
              description: 'As a standard action you can unleash a force missile that automatically strikes a foe, as magic missile. The force missile deals 1d4 points of damage plus the damage from your intense spells evocation power. This is a force effect. You can use this ability a number of times per day equal to 3 + your Intelligence modifier.'
            }
          ]
        },
        {
          name: 'Illusion',
          description: 'Magic that deceives the senses or minds of others.',
          icon: 'fas fa-mask',
          schoolPowers: [
            {
              name: 'Extended Illusions',
              description: 'Any illusion spell you cast with a duration of "concentration" lasts a number of additional rounds equal to 1/2 your wizard level after you stop maintaining concentration (minimum +1 round).'
            },
            {
              name: 'Blinding Ray',
              description: 'As a standard action you can fire a shimmering ray at any foe within 30 feet as a ranged touch attack. The ray causes creatures to be blinded for 1 round. Creatures with more Hit Dice than your wizard level are dazzled for 1 round instead. You can use this ability a number of times per day equal to 3 + your Intelligence modifier.'
            }
          ]
        },
        {
          name: 'Necromancy',
          description: 'Magic that manipulates life force, death, and undeath.',
          icon: 'fas fa-skull',
          schoolPowers: [
            {
              name: 'Power over Undead',
              description: 'You receive Command Undead or Turn Undead as a bonus feat. You can channel energy a number of times per day equal to 3 + your Intelligence modifier, but only to use the selected feat. You can take other feats to add to this ability, such as Extra Channel and Improved Channel, but not feats that alter this ability, such as Elemental Channel and Alignment Channel.'
            },
            {
              name: 'Grave Touch',
              description: 'As a standard action, you can make a melee touch attack that causes a living creature to become shaken for a number of rounds equal to 1/2 your wizard level (minimum 1). If you touch a shaken creature with this ability, it becomes frightened for 1 round if it has fewer Hit Dice than your wizard level. You can use this ability a number of times per day equal to 3 + your Intelligence modifier.'
            }
          ]
        },
        {
          name: 'Transmutation',
          description: 'Magic that transforms creatures and objects.',
          icon: 'fas fa-exchange-alt',
          schoolPowers: [
            {
              name: 'Physical Enhancement',
              description: 'You gain a +1 enhancement bonus to one physical ability score (Strength, Dexterity, or Constitution). This bonus increases by +1 for every five wizard levels you possess to a maximum of +5 at 20th level. You can change this bonus to a new ability score when you prepare spells. At 20th level, this bonus applies to two physical ability scores of your choice.'
            },
            {
              name: 'Telekinetic Fist',
              description: 'As a standard action you can strike with a telekinetic fist, targeting any foe within 30 feet as a ranged touch attack. The telekinetic fist deals 1d4 points of bludgeoning damage + 1 for every two wizard levels you possess. You can use this ability a number of times per day equal to 3 + your Intelligence modifier.'
            }
          ]
        }
      ],
      firstLevelSpells: [],
      selectedSpellsData: {
        firstLevel: []
      },
      familiarOptions: [
        {
          name: 'Bat',
          description: 'A small flying mammal with echolocation abilities.',
          benefit: '+3 bonus on Fly checks',
          icon: 'fas fa-bat'
        },
        {
          name: 'Cat',
          description: 'A small, agile feline companion.',
          benefit: '+3 bonus on Stealth checks',
          icon: 'fas fa-cat'
        },
        {
          name: 'Hawk',
          description: 'A keen-eyed bird of prey.',
          benefit: '+3 bonus on Perception checks in bright light',
          icon: 'fas fa-feather-alt'
        },
        {
          name: 'Lizard',
          description: 'A small reptilian creature.',
          benefit: '+3 bonus on Climb checks',
          icon: 'fas fa-dragon'
        },
        {
          name: 'Monkey',
          description: 'A clever and nimble primate.',
          benefit: '+3 bonus on Acrobatics checks',
          icon: 'fas fa-paw'
        },
        {
          name: 'Owl',
          description: 'A wise nocturnal bird.',
          benefit: '+3 bonus on Perception checks in shadows or darkness',
          icon: 'fas fa-dove'
        },
        {
          name: 'Rat',
          description: 'A small, clever rodent.',
          benefit: '+2 bonus on Fortitude saves',
          icon: 'fas fa-mouse'
        },
        {
          name: 'Raven',
          description: 'An intelligent black bird.',
          benefit: '+3 bonus on Appraise checks',
          icon: 'fas fa-crow'
        },
        {
          name: 'Toad',
          description: 'A small amphibian creature.',
          benefit: '+3 hit points',
          icon: 'fas fa-frog'
        },
        {
          name: 'Viper',
          description: 'A small poisonous snake.',
          benefit: '+3 bonus on Bluff checks',
          icon: 'fas fa-snake'
        },
        {
          name: 'Weasel',
          description: 'A small, quick carnivorous mammal.',
          benefit: '+2 bonus on Reflex saves',
          icon: 'fas fa-otter'
        }
      ],
      bondedObjectOptions: [
        {
          name: 'Amulet',
          description: 'A protective charm worn around the neck.',
          icon: 'fas fa-yin-yang',
          benefit: 'Provides magical protection and can be used to cast one additional spell per day.'
        },
        {
          name: 'Ring',
          description: 'A magical ring worn on the finger.',
          icon: 'fas fa-ring',
          benefit: 'Enhances spellcasting abilities and can store magical energy.'
        },
        {
          name: 'Staff',
          description: 'A long wooden rod used to channel magical energy.',
          icon: 'fas fa-magic',
          benefit: 'Serves as a focus for spells and can enhance metamagic abilities.'
        },
        {
          name: 'Wand',
          description: 'A short rod used for precise magical manipulation.',
          icon: 'fas fa-wand-magic',
          benefit: 'Allows for precise spellcasting and can store spell energy.'
        },
        {
          name: 'Weapon',
          description: 'A weapon that the wizard is proficient with.',
          icon: 'fas fa-sword',
          benefit: 'Combines martial prowess with magical enhancement.',
          requiresInput: true
        }
      ]
    };
  },
  computed: {
    // Get available opposition schools (all schools except selected specialization and Universalist)
    availableOppositionSchools() {
      if (!this.selectedArcaneSchool || this.selectedArcaneSchool === 'Universalist') {
        return [];
      }
      return this.arcaneSchools.filter(school => 
        school.name !== this.selectedArcaneSchool && school.name !== 'Universalist'
      );
    },
    // Check if we need opposition school selection
    needsOppositionSchools() {
      return this.selectedArcaneSchool && this.selectedArcaneSchool !== 'Universalist';
    },
    // Calculate available starting spells based on Intelligence
    availableStartingSpells() {
      // Use reactive intelligence data
      const intelligence = this.currentIntelligence;
      
      // Calculate Intelligence bonus (score - 10) / 2, rounded down
      const intBonus = Math.floor((intelligence - 10) / 2);
      
      // Base 3 spells + Intelligence bonus, minimum 0
      const totalSpells = Math.max(0, 3 + intBonus);
      
      return {
        total: totalSpells,
        intelligence: intelligence,
        bonus: intBonus
      };
    },
    // Spell selections for unified spell-selector component
    spellSelections() {
      if (this.availableStartingSpells.total <= 0) {
        return [];
      }
      
      return [
        {
          type: 'firstLevel',
          label: '1st Level Spells',
          icon: 'fa-magic',
          count: this.availableStartingSpells.total,
          description: `Select ${this.availableStartingSpells.total} 1st-level wizard spells for your starting spellbook. These spells represent your initial magical knowledge and research.`,
          spells: this.firstLevelSpells
        }
      ];
    }
  },
  methods: {
    selectArcaneBond(bondType) {
      this.$emit('arcane-bond-selected', bondType);
    },
    selectFamiliar(familiarName) {
      this.$emit('familiar-selected', familiarName);
    },
    selectBondedObject(objectType) {
      this.$emit('bonded-object-selected', objectType);
    },
    updateWeapon(weaponName) {
      this.$emit('weapon-selected', weaponName);
    },
    selectArcaneSchool(school) {
      this.$emit('arcane-school-selected', school);
    },
    selectOppositionSchools(schools) {
      this.$emit('opposition-schools-selected', schools);
    },
    selectSpells(spells) {
      this.$emit('spells-selected', spells);
    },
    onWizardSpellsChanged(newSelections) {
      this.selectedSpellsData = newSelections;
      // Convert to array format for existing wizard code compatibility
      const spellsArray = newSelections.firstLevel || [];
      this.$emit('spells-selected', spellsArray);
    },
    updateIntelligence() {
      // Get current ability scores from localStorage
      const abilityScores = JSON.parse(localStorage.getItem('currentAbilityScores') || '{}');
      
      // Try both 'Intelligence' and 'INT' as the key
      let intelligence = 10;
      if (abilityScores && abilityScores.scores) {
        if (abilityScores.scores.Intelligence) {
          intelligence = abilityScores.scores.Intelligence;
        } else if (abilityScores.scores.INT) {
          intelligence = abilityScores.scores.INT;
        }
      }
      
      this.currentIntelligence = intelligence;
    },
    async loadSpells() {
      try {
        const response = await fetch('data/spells.json');
        const data = await response.json();
        
        this.firstLevelSpells = data.wizardSpells.firstLevel || [];
      } catch (error) {
        console.error('Error loading wizard spells:', error);
        // Fallback to empty array if loading fails
        this.firstLevelSpells = [];
      }
    }
  },
  async mounted() {
    await this.loadSpells();
    this.updateIntelligence();
    // Initialize selectedSpellsData from existing selectedSpells prop
    if (this.selectedSpells && this.selectedSpells.length > 0) {
      this.selectedSpellsData = {
        firstLevel: [...this.selectedSpells]
      };
    }
  }
});