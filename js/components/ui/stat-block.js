Vue.component('stat-block', {
  props: {
    // Type of stat block: 'abilities', 'combat', 'skills', 'saves', 'custom'
    type: {
      type: String,
      default: 'custom',
      validator: value => ['abilities', 'combat', 'skills', 'saves', 'custom'].includes(value)
    },
    // Display mode: 'standard', 'compact', 'detailed', 'inline', 'traditional'
    mode: {
      type: String,
      default: 'standard',
      validator: value => ['standard', 'compact', 'detailed', 'inline', 'traditional'].includes(value)
    },
    // Size variant: 'small', 'normal', 'large'
    size: {
      type: String,
      default: 'normal',
      validator: value => ['small', 'normal', 'large'].includes(value)
    },
    // Character data object
    characterData: {
      type: Object,
      default: () => ({})
    },
    // Override specific stats (for custom display)
    stats: {
      type: Object,
      default: () => ({})
    },
    // Whether to show modifiers
    showModifiers: {
      type: Boolean,
      default: true
    },
    // Whether to show labels
    showLabels: {
      type: Boolean,
      default: true
    },
    // Whether to show icons
    showIcons: {
      type: Boolean,
      default: false
    },
    // Custom title
    title: {
      type: String,
      default: ''
    },
    // Layout: 'grid', 'table', 'list', 'cards', 'inline'
    layout: {
      type: String,
      default: 'grid',
      validator: value => ['grid', 'table', 'list', 'cards', 'inline'].includes(value)
    },
    // Custom CSS classes
    customClasses: {
      type: String,
      default: ''
    },
    // Whether to use color coding
    useColors: {
      type: Boolean,
      default: true
    },
    // Columns for grid layout
    columns: {
      type: Number,
      default: null
    }
  },
  computed: {
    // Get ability scores with modifiers
    abilityStats() {
      const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
      const abilityScores = this.characterData.abilityScores || this.stats.abilities || {};
      
      return abilities.map(ability => {
        const score = abilityScores[ability] || 10;
        const modifier = AbilityCalculator.getModifier(score);
        
        return {
          key: ability,
          name: ability,
          fullName: this.getAbilityFullName(ability),
          value: score,
          modifier: modifier,
          formattedModifier: this.formatModifier(modifier),
          color: this.getAbilityColor(score),
          icon: this.getAbilityIcon(ability)
        };
      });
    },
    
    // Get combat stats
    combatStats() {
      const combat = this.characterData.combat || this.characterData.derivedStats || this.stats.combat || {};
      const abilityScores = this.characterData.abilityScores || {};
      
      return [
        {
          key: 'hitPoints',
          name: 'HP',
          fullName: 'Hit Points',
          value: combat.hitPoints || combat.hp || 0,
          icon: 'fas fa-heart',
          color: 'text-danger'
        },
        {
          key: 'armorClass',
          name: 'AC',
          fullName: 'Armor Class',
          value: combat.armorClass || combat.ac || 10,
          icon: 'fas fa-shield-alt',
          color: 'text-primary'
        },
        {
          key: 'initiative',
          name: 'Init',
          fullName: 'Initiative',
          value: combat.initiative !== undefined ? combat.initiative : AbilityCalculator.getModifier(abilityScores.DEX || 10),
          modifier: true,
          icon: 'fas fa-bolt',
          color: 'text-success'
        },
        {
          key: 'speed',
          name: 'Speed',
          fullName: 'Speed',
          value: combat.speed || 30,
          suffix: 'ft',
          icon: 'fas fa-running',
          color: 'text-info'
        },
        {
          key: 'bab',
          name: 'BAB',
          fullName: 'Base Attack Bonus',
          value: combat.bab || combat.baseAttackBonus || 0,
          modifier: true,
          icon: 'fas fa-sword',
          color: 'text-warning'
        }
      ];
    },
    
    // Get saving throws
    savingThrows() {
      const saves = this.characterData.saves || this.stats.saves || {};
      const abilityScores = this.characterData.abilityScores || {};
      
      return [
        {
          key: 'fortitude',
          name: 'Fort',
          fullName: 'Fortitude',
          value: saves.fortitude !== undefined ? saves.fortitude : AbilityCalculator.getModifier(abilityScores.CON || 10),
          modifier: true,
          icon: 'fas fa-fist-raised',
          color: 'text-success'
        },
        {
          key: 'reflex',
          name: 'Ref',
          fullName: 'Reflex',
          value: saves.reflex !== undefined ? saves.reflex : AbilityCalculator.getModifier(abilityScores.DEX || 10),
          modifier: true,
          icon: 'fas fa-wind',
          color: 'text-info'
        },
        {
          key: 'will',
          name: 'Will',
          fullName: 'Will',
          value: saves.will !== undefined ? saves.will : AbilityCalculator.getModifier(abilityScores.WIS || 10),
          modifier: true,
          icon: 'fas fa-brain',
          color: 'text-primary'
        }
      ];
    },
    
    // Get current stats based on type
    currentStats() {
      switch (this.type) {
        case 'abilities':
          return this.abilityStats;
        case 'combat':
          return this.combatStats;
        case 'saves':
          return this.savingThrows;
        case 'skills':
          return this.skillStats;
        default:
          return this.customStats;
      }
    },
    
    // Get skill stats (placeholder for future implementation)
    skillStats() {
      const skills = this.characterData.skills || this.stats.skills || [];
      return skills.map(skill => ({
        key: skill.name,
        name: skill.name,
        value: skill.ranks || 0,
        modifier: skill.total || skill.ranks || 0,
        icon: 'fas fa-tools'
      }));
    },
    
    // Convert custom stats to standard format
    customStats() {
      if (!this.stats || typeof this.stats !== 'object') return [];
      
      return Object.entries(this.stats).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return {
            key,
            name: value.name || key,
            fullName: value.fullName || value.name || key,
            value: value.value !== undefined ? value.value : value,
            modifier: value.modifier,
            icon: value.icon,
            color: value.color,
            suffix: value.suffix
          };
        } else {
          return {
            key,
            name: key,
            value: value
          };
        }
      });
    },
    
    // Get component CSS classes
    componentClasses() {
      const classes = ['stat-block'];
      
      if (this.type !== 'custom') {
        classes.push(`stat-block-${this.type}`);
      }
      
      if (this.mode !== 'standard') {
        classes.push(`stat-block-${this.mode}`);
      }
      
      if (this.size !== 'normal') {
        classes.push(`stat-block-${this.size}`);
      }
      
      if (this.layout !== 'grid') {
        classes.push(`stat-block-${this.layout}`);
      }
      
      if (this.customClasses) {
        classes.push(this.customClasses);
      }
      
      return classes.join(' ');
    },
    
    // Get grid column classes
    gridColumnClass() {
      if (this.columns) {
        return `col-${Math.floor(12 / this.columns)}`;
      }
      
      const statCount = this.currentStats.length;
      if (statCount <= 2) return 'col-6';
      if (statCount <= 3) return 'col-4';
      if (statCount <= 4) return 'col-6 col-md-3';
      if (statCount <= 6) return 'col-6 col-md-4 col-lg-2';
      return 'col-6 col-md-4 col-lg-3';
    }
  },
  methods: {
    // Format modifier with + or -
    formatModifier(modifier) {
      if (modifier === undefined || modifier === null) return '';
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    },
    
    // Get ability full name
    getAbilityFullName(ability) {
      const names = {
        STR: 'Strength',
        DEX: 'Dexterity',
        CON: 'Constitution',
        INT: 'Intelligence',
        WIS: 'Wisdom',
        CHA: 'Charisma'
      };
      return names[ability] || ability;
    },
    
    // Get ability color based on score
    getAbilityColor(score) {
      if (!this.useColors) return '';
      if (score >= 16) return 'text-success';
      if (score >= 14) return 'text-info';
      if (score >= 12) return 'text-primary';
      if (score >= 10) return '';
      if (score >= 8) return 'text-warning';
      return 'text-danger';
    },
    
    // Get ability icon
    getAbilityIcon(ability) {
      const icons = {
        STR: 'fas fa-fist-raised',
        DEX: 'fas fa-feather',
        CON: 'fas fa-heart',
        INT: 'fas fa-brain',
        WIS: 'fas fa-eye',
        CHA: 'fas fa-star'
      };
      return icons[ability] || 'fas fa-chart-bar';
    },
    
    // Format stat value for display
    formatStatValue(stat) {
      let value = stat.value;
      
      if (stat.modifier === true && typeof stat.value === 'number') {
        value = this.formatModifier(stat.value);
      }
      
      if (stat.suffix) {
        value += stat.suffix;
      }
      
      return value;
    },
    
    // Get stat display name
    getStatDisplayName(stat) {
      if (this.mode === 'compact' || this.mode === 'inline') {
        return stat.name;
      }
      return this.showLabels ? (stat.fullName || stat.name) : stat.name;
    }
  },
  template: `
    <div :class="componentClasses">
      <!-- Title -->
      <div v-if="title" class="stat-block-title mb-2">
        <h6 class="fw-bold mb-0">{{ title }}</h6>
      </div>
      
      <!-- Grid Layout -->
      <div v-if="layout === 'grid'" class="row g-2">
        <div v-for="stat in currentStats" :key="stat.key" :class="gridColumnClass">
          <div class="stat-item text-center border rounded p-2">
            <div v-if="showIcons && stat.icon" class="stat-icon mb-1">
              <i :class="stat.icon + ' ' + (stat.color || '')"></i>
            </div>
            <div class="stat-name fw-bold" :class="stat.color || ''">
              {{ getStatDisplayName(stat) }}
            </div>
            <div class="stat-value" 
                 :class="[
                   size === 'large' ? 'display-6' : size === 'small' ? 'fs-6' : 'fs-4',
                   'fw-bold',
                   useColors ? (stat.color || '') : ''
                 ]">
              {{ formatStatValue(stat) }}
            </div>
            <div v-if="showModifiers && stat.modifier !== undefined && typeof stat.modifier === 'number'" 
                 class="stat-modifier small text-muted">
              {{ formatModifier(stat.modifier) }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Table Layout -->
      <table v-else-if="layout === 'table'" class="table table-sm mb-0">
        <thead v-if="showLabels">
          <tr>
            <th v-if="showIcons"></th>
            <th>Stat</th>
            <th class="text-center">Value</th>
            <th v-if="showModifiers" class="text-center">Modifier</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stat in currentStats" :key="stat.key">
            <td v-if="showIcons" class="text-center">
              <i v-if="stat.icon" :class="stat.icon + ' ' + (stat.color || '')"></i>
            </td>
            <td class="fw-semibold">{{ getStatDisplayName(stat) }}</td>
            <td class="text-center fw-bold" :class="useColors ? (stat.color || '') : ''">
              {{ formatStatValue(stat) }}
            </td>
            <td v-if="showModifiers" class="text-center">
              <span v-if="stat.modifier !== undefined && typeof stat.modifier === 'number'" class="badge bg-secondary">
                {{ formatModifier(stat.modifier) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- List Layout -->
      <ul v-else-if="layout === 'list'" class="list-unstyled mb-0">
        <li v-for="stat in currentStats" :key="stat.key" class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center">
            <i v-if="showIcons && stat.icon" :class="stat.icon + ' me-2 ' + (stat.color || '')"></i>
            <span class="fw-semibold">{{ getStatDisplayName(stat) }}:</span>
          </div>
          <div class="d-flex align-items-center">
            <span class="fw-bold me-2" :class="useColors ? (stat.color || '') : ''">
              {{ formatStatValue(stat) }}
            </span>
            <span v-if="showModifiers && stat.modifier !== undefined && typeof stat.modifier === 'number'" 
                  class="badge bg-secondary">
              {{ formatModifier(stat.modifier) }}
            </span>
          </div>
        </li>
      </ul>
      
      <!-- Cards Layout -->
      <div v-else-if="layout === 'cards'" class="d-flex flex-wrap gap-2">
        <div v-for="stat in currentStats" :key="stat.key" class="stat-card card text-center" :class="size === 'small' ? 'p-2' : 'p-3'">
          <div v-if="showIcons && stat.icon" class="stat-icon mb-2">
            <i :class="stat.icon + ' fs-4 ' + (stat.color || '')"></i>
          </div>
          <div class="stat-name fw-bold small text-muted">
            {{ getStatDisplayName(stat) }}
          </div>
          <div class="stat-value fw-bold" 
               :class="[
                 size === 'large' ? 'fs-2' : size === 'small' ? 'fs-5' : 'fs-3',
                 useColors ? (stat.color || '') : ''
               ]">
            {{ formatStatValue(stat) }}
          </div>
          <div v-if="showModifiers && stat.modifier !== undefined && typeof stat.modifier === 'number'" 
               class="stat-modifier small text-muted">
            {{ formatModifier(stat.modifier) }}
          </div>
        </div>
      </div>
      
      <!-- Inline Layout -->
      <div v-else-if="layout === 'inline'" class="d-flex flex-wrap gap-3">
        <span v-for="stat in currentStats" :key="stat.key" class="stat-inline">
          <i v-if="showIcons && stat.icon" :class="stat.icon + ' me-1 ' + (stat.color || '')"></i>
          <span class="fw-semibold">{{ getStatDisplayName(stat) }}</span>
          <span class="fw-bold ms-1" :class="useColors ? (stat.color || '') : ''">
            {{ formatStatValue(stat) }}
          </span>
          <span v-if="showModifiers && stat.modifier !== undefined && typeof stat.modifier === 'number'" 
                class="badge bg-secondary ms-1">
            {{ formatModifier(stat.modifier) }}
          </span>
        </span>
      </div>
      
      <!-- Traditional RPG Stat Block -->
      <div v-else-if="mode === 'traditional' && type === 'abilities'" class="traditional-stat-block">
        <div class="ability-line">
          <span v-for="(stat, index) in currentStats" :key="stat.key">
            <strong>{{ stat.name }}</strong> {{ stat.value }} ({{ stat.formattedModifier }})
            <span v-if="index < currentStats.length - 1">, </span>
          </span>
        </div>
      </div>
    </div>
  `,
  style: `
    <style scoped>
    .stat-block {
      /* Base styling */
    }
    
    .stat-block-small {
      font-size: 0.875rem;
    }
    
    .stat-block-large {
      font-size: 1.1rem;
    }
    
    .stat-item {
      transition: all 0.2s ease;
    }
    
    .stat-item:hover {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      transform: translateY(-1px);
    }
    
    .stat-card {
      min-width: 80px;
      border: 1px solid var(--bs-border-color);
    }
    
    .stat-inline {
      white-space: nowrap;
    }
    
    .traditional-stat-block .ability-line {
      font-family: serif;
      line-height: 1.4;
    }
    
    .stat-block-compact .stat-item {
      padding: 0.5rem;
    }
    
    .stat-block-detailed .stat-item {
      padding: 1rem;
    }
    
    .stat-icon {
      opacity: 0.8;
    }
    
    @media (max-width: 768px) {
      .stat-card {
        min-width: 60px;
      }
      
      .stat-inline {
        font-size: 0.875rem;
      }
    }
    </style>
  `
});