/**
 * Character Progress Service
 * 
 * Centralized service for tracking character creation step completion status
 * and managing progression logic throughout the character creation process.
 */
const CharacterProgressService = {
  
  /**
   * Check which steps have been completed based on character data
   */
  getCompletedSteps(characterData = null) {
    // If no data provided, load from localStorage
    if (!characterData) {
      characterData = CharacterDisplayService.processAllCharacterData();
    }
    
    const completed = [];
    
    // Check ability scores (Step 0)
    if (Object.values(characterData.abilityScores).some(score => score !== 10)) {
      completed.push(0);
    }
    
    // Check race selection (Step 1)
    if (characterData.basicInfo.race) {
      completed.push(1);
    }
    
    // Check class selection (Step 2)
    if (characterData.basicInfo.class) {
      completed.push(2);
    }
    
    // Check skills allocation (Step 3)
    if (characterData.skills && characterData.skills.length > 0) {
      completed.push(3);
    }
    
    // Check feats selection (Step 4)
    if (characterData.feats && characterData.feats.length > 0) {
      completed.push(4);
    }
    
    // Check equipment selection (Step 5) - placeholder
    // if (characterData.equipment && characterData.equipment.length > 0) {
    //   completed.push(5);
    // }
    
    // Check final details (Step 6) - placeholder
    // if (characterData.basicInfo.name && characterData.basicInfo.alignment) {
    //   completed.push(6);
    // }
    
    return completed;
  },
  
  /**
   * Check if a specific step is completed
   */
  isStepCompleted(stepNumber, characterData = null) {
    const completedSteps = this.getCompletedSteps(characterData);
    return completedSteps.includes(stepNumber);
  },
  
  /**
   * Check if a specific step is currently active
   */
  isStepActive(stepNumber, currentStep) {
    return currentStep === stepNumber;
  },
  
  /**
   * Get completion status for a display section
   */
  getSectionCompletionStatus(section, completedSteps = null) {
    if (!completedSteps) {
      completedSteps = this.getCompletedSteps();
    }
    
    switch (section) {
      case 'abilities':
        return completedSteps.includes(0) ? 'complete' : 'incomplete';
      case 'background':
        return completedSteps.includes(1) ? 'complete' : 'incomplete';
      case 'combat':
        return completedSteps.includes(2) ? 'complete' : 'incomplete';
      case 'features':
        return (completedSteps.includes(3) || completedSteps.includes(4)) ? 'complete' : 'incomplete';
      default:
        return 'incomplete';
    }
  },
  
  /**
   * Get the appropriate active tab based on current step
   */
  getActiveTab(currentStep, completedSteps = null) {
    // Auto-select relevant tab based on current step
    if (currentStep === 0) {
      return 'abilities';
    } else if (currentStep === 1) {
      return 'background';
    } else if (currentStep === 2) {
      return 'combat';
    } else if (currentStep >= 3) {
      return 'features';
    }
    
    // If ability scores are set and we're past step 0, show abilities by default for compatibility
    if (!completedSteps) {
      completedSteps = this.getCompletedSteps();
    }
    
    if (currentStep > 0 && completedSteps.includes(0)) {
      return 'abilities';
    }
    
    return 'abilities'; // Default fallback
  },
  
  /**
   * Get progress summary for display
   */
  getProgressSummary(currentStep = 0, characterData = null) {
    const completedSteps = this.getCompletedSteps(characterData);
    const currentStepInfo = CharacterDisplayService.getCurrentStepInfo(currentStep);
    const stepInfo = CharacterDisplayService.getStepInfo();
    
    return {
      currentStep: currentStep,
      currentStepInfo: currentStepInfo,
      completedSteps: completedSteps,
      totalSteps: Object.keys(stepInfo).length,
      completionPercentage: Math.round((completedSteps.length / Object.keys(stepInfo).length) * 100),
      relevantSections: CharacterDisplayService.getRelevantSections(currentStep, completedSteps)
    };
  },
  
  /**
   * Check if character creation is complete
   */
  isCharacterCreationComplete(characterData = null) {
    const completedSteps = this.getCompletedSteps(characterData);
    
    // For now, consider character complete if first 3 core steps are done
    const requiredSteps = [0, 1, 2]; // Abilities, Race, Class
    return requiredSteps.every(step => completedSteps.includes(step));
  },
  
  /**
   * Get next recommended step
   */
  getNextStep(currentStep = 0, characterData = null) {
    const completedSteps = this.getCompletedSteps(characterData);
    const stepInfo = CharacterDisplayService.getStepInfo();
    const totalSteps = Object.keys(stepInfo).length;
    
    // Find the first incomplete step
    for (let i = 0; i < totalSteps; i++) {
      if (!completedSteps.includes(i)) {
        return i;
      }
    }
    
    // If all steps are complete, stay on current step
    return Math.min(currentStep, totalSteps - 1);
  },
  
  /**
   * Check if user can proceed to next step
   */
  canProceedToStep(targetStep, characterData = null) {
    const completedSteps = this.getCompletedSteps(characterData);
    
    // Can always go to step 0 (abilities)
    if (targetStep <= 0) return true;
    
    // For other steps, must complete previous step
    return completedSteps.includes(targetStep - 1);
  },
  
  /**
   * Get validation errors for current character state
   */
  getValidationErrors(characterData = null) {
    if (!characterData) {
      characterData = CharacterDisplayService.processAllCharacterData();
    }
    
    const errors = [];
    
    // Validate ability scores
    const hasValidAbilities = Object.values(characterData.abilityScores)
      .some(score => score !== 10);
    if (!hasValidAbilities) {
      errors.push('Ability scores must be set');
    }
    
    // Validate race selection
    if (!characterData.basicInfo.race) {
      errors.push('Race must be selected');
    }
    
    // Validate class selection
    if (!characterData.basicInfo.class) {
      errors.push('Class must be selected');
    }
    
    // Additional class-specific validations could go here
    
    return errors;
  },
  
  /**
   * Get warnings for current character state
   */
  getValidationWarnings(characterData = null) {
    if (!characterData) {
      characterData = CharacterDisplayService.processAllCharacterData();
    }
    
    const warnings = [];
    
    // Warn about low ability scores
    Object.entries(characterData.abilityScores).forEach(([ability, score]) => {
      if (score < 8) {
        warnings.push(`${ability} is very low (${score})`);
      }
    });
    
    // Warn about missing human bonus feat
    if (characterData.basicInfo.race === 'Human' && !characterData.basicInfo.humanBonusFeat) {
      warnings.push('Human bonus feat not selected');
    }
    
    // Warn about missing fighter bonus feat
    if (characterData.basicInfo.class === 'Fighter' && !characterData.basicInfo.bonusFeat) {
      warnings.push('Fighter bonus feat not selected');
    }
    
    return warnings;
  }
};