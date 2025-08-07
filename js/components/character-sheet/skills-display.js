Vue.component('skills-display', {
  props: {
    skills: {
      type: Array,
      default: () => []
    },
    basicInfo: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    hasSkills() {
      return this.skills && this.skills.length > 0;
    },
    
    skillsByType() {
      // When skills are implemented, we can group by class skills vs cross-class
      // For now, just return all skills in one group
      if (!this.hasSkills) return {};
      
      return {
        'All Skills': this.skills
      };
    },
    
    totalSkillRanks() {
      if (!this.hasSkills) return 0;
      return this.skills.reduce((total, skill) => total + (skill.ranks || 0), 0);
    },
    
    availableSkillPoints() {
      // Placeholder calculation - will be enhanced when skills are implemented
      // Base calculation: Class skill points + Int modifier per level
      const baseSkillPoints = this.getClassSkillPoints();
      const intModifier = 0; // TODO: Get from ability scores when available
      return baseSkillPoints + intModifier;
    }
  },
  methods: {
    getClassSkillPoints() {
      // Skill points per level by class
      const classSkillPoints = {
        'Barbarian': 4,
        'Bard': 6,
        'Cleric': 2,
        'Druid': 4,
        'Fighter': 2,
        'Monk': 4,
        'Paladin': 2,
        'Ranger': 6,
        'Rogue': 8,
        'Sorcerer': 2,
        'Wizard': 2
      };
      
      return classSkillPoints[this.basicInfo.class] || 2;
    },
    
    getSkillModifier(skill) {
      // Placeholder for future implementation
      // Will calculate: Ranks + Ability Modifier + Class Skill Bonus + Misc
      return skill.ranks || 0;
    }
  },
  template: `
    <div class="card h-100">
      <div class="card-header">
        <h6 class="mb-0">
          <i class="fas fa-tools me-2"></i>Skills
          <span v-if="hasSkills" class="badge bg-secondary ms-2">{{ totalSkillRanks }}</span>
        </h6>
      </div>
      <div class="card-body">
        <div v-if="hasSkills">
          <!-- Skill Point Summary -->
          <div class="skill-summary mb-3 p-2 bg-light rounded">
            <div class="small text-muted">
              <div class="d-flex justify-content-between">
                <span>Skill Points Used:</span>
                <span class="fw-semibold">{{ totalSkillRanks }} / {{ availableSkillPoints }}</span>
              </div>
            </div>
          </div>
          
          <!-- Skills by type -->
          <div v-for="(typeSkills, skillType) in skillsByType" :key="skillType" class="skill-type-group mb-3">
            <div v-if="Object.keys(skillsByType).length > 1" class="skill-type-header mb-2">
              <small class="text-muted fw-semibold">{{ skillType }}</small>
            </div>
            
            <div v-for="skill in typeSkills" :key="skill.label" class="skill-item mb-2">
              <div class="d-flex justify-content-between align-items-center">
                <div class="skill-info">
                  <span class="fw-semibold">{{ skill.label }}</span>
                  <small v-if="skill.ability" class="text-muted ms-1">({{ skill.ability }})</small>
                </div>
                <div class="skill-ranks">
                  <span class="badge bg-primary">{{ skill.ranks || 0 }}</span>
                  <small v-if="getSkillModifier(skill) !== (skill.ranks || 0)" class="text-muted ms-1">
                    ({{ getSkillModifier(skill) >= 0 ? '+' : '' }}{{ getSkillModifier(skill) }} total)
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-else class="empty-state text-center py-3">
          <i class="fas fa-tools text-muted mb-2 empty-icon"></i>
          <div class="text-muted">
            <div class="fw-semibold">No skills allocated yet</div>
            <div class="small">Skills will be allocated in the Skills step</div>
            <div v-if="basicInfo.class" class="small mt-1">
              <strong>{{ basicInfo.class }}</strong> gets {{ getClassSkillPoints() }} skill points per level
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  style: `
    <style scoped>
    .skill-item {
      padding: 0.5rem 0.75rem;
      background: var(--bs-light);
      border-radius: 0.375rem;
      border: 1px solid var(--bs-border-color);
      transition: all 0.2s ease;
    }
    
    .skill-item:hover {
      background: var(--bs-secondary-bg-subtle);
      border-color: var(--bs-secondary-border-subtle);
    }
    
    .skill-type-group:last-child {
      margin-bottom: 0 !important;
    }
    
    .skill-type-header {
      border-bottom: 1px solid var(--bs-border-color);
      padding-bottom: 0.25rem;
    }
    
    .skill-summary {
      border: 1px solid var(--bs-border-color);
    }
    
    .skill-info {
      flex-grow: 1;
      min-width: 0;
    }
    
    .skill-ranks {
      flex-shrink: 0;
      text-align: right;
    }
    
    .empty-state {
      padding: 2rem 1rem;
    }
    </style>
  `
});