# Testing Strategy for Pathfinder Character Builder

This project uses a **two-tier testing approach** to ensure code quality and catch regressions.

## 🧪 **Testing Tiers**

### 1. **Unit Tests (Jest)** - `npm run test:unit`
- **Purpose**: Test core service logic in isolation
- **Framework**: Jest with jsdom environment
- **Location**: `tests/unit/`
- **Coverage**: Calculation logic, validation rules, data integrity

### 2. **End-to-End Tests (Playwright)** - `npm run test:e2e` 
- **Purpose**: Test complete user workflows
- **Framework**: Playwright
- **Location**: `tests/e2e/`
- **Coverage**: Character creation flow, component integration, bug regression

## 🚀 **Running Tests**

```bash
# Run all tests (unit + e2e)
npm test

# Run unit tests only
npm run test:unit

# Run unit tests in watch mode
npm run test:unit:watch

# Run e2e tests only
npm run test:e2e

# Run e2e tests with UI
npm run test:e2e:ui

# Run e2e tests in headed mode
npm run test:e2e:headed
```

## 📊 **Current Test Coverage**

### ✅ **Unit Tests** (14/14 passing)
- **AbilityCalculator.getModifier()** - All Pathfinder ability score calculations
- **LanguageData** core functions - Automatic languages, bonus languages, validation
- **Data integrity** - Race data, language lists, validation logic
- **Edge cases** - Invalid inputs, unknown races, negative modifiers

### ✅ **E2E Tests** (1/3 passing, 2 nearly passing)
- **Character creation flow** - Complete Human Fighter creation
- **Step validation** - Prevents progression with incomplete data ✅
- **Bug regression tests** - Tests for specific bugs we've fixed
- **localStorage persistence** - Data survives page refreshes

## 🎯 **Test Focus Areas**

### **Services Tested**
1. **AbilityCalculator** - Pathfinder ability score math
2. **LanguageData** - Race language rules and validation
3. **CharacterDataService** - localStorage persistence (via E2E)

### **Bug Scenarios Covered**
1. **Race selection completion** - Language validation logic
2. **Traits display** - Data format conversion
3. **Point buy quick set** - Automatic point system adjustment
4. **Step progression** - Proper validation checks

### **User Workflows Tested**
1. **Complete character creation** - From ability scores to finished character
2. **Step validation** - Cannot proceed without completing requirements
3. **Race selection** - Human with ability increases and language choices
4. **Class selection** - Fighter with bonus feat selection

## 🛠 **Test Architecture**

### **Unit Test Structure**
```
tests/unit/
├── setup.js           # Jest configuration and mocks
├── services.test.js    # Core service functions
└── README.md          # This file
```

### **E2E Test Structure**
```
tests/e2e/
├── character-creation.spec.js    # Main user workflows
├── bug-regression.spec.js        # Specific bug scenarios
└── playwright.config.js          # Playwright configuration
```

## 📈 **Future Test Expansion**

### **Potential Additions**
- **Component unit tests** - Individual Vue component testing
- **Visual regression tests** - Screenshot comparison
- **Performance tests** - Large character sheet rendering
- **Accessibility tests** - Keyboard navigation, screen readers
- **Cross-browser tests** - Firefox, Safari compatibility

### **Service Test Expansion**
- **PrerequisiteChecker** - Full feat requirement validation
- **CharacterDataService** - Complete localStorage operations
- **AbilityCalculator** - Hit points, skill points, saves calculations

## 🔧 **Development Workflow**

1. **Red-Green-Refactor** - Write failing test, make it pass, refactor
2. **Test-driven bugs** - Write regression test before fixing bugs
3. **E2E for features** - Test user-facing functionality end-to-end
4. **Unit for logic** - Test calculations and business rules in isolation

## 🚨 **Known Issues**

1. **E2E timing** - Some tests need longer waits for Vue component loading
2. **Mock limitations** - Complex service interdependencies are challenging to unit test

## 💡 **Best Practices**

1. **Clear test names** - Describe exactly what is being tested
2. **Independent tests** - Each test should be able to run in isolation
3. **Real data** - Use actual Pathfinder rules and character builds
4. **Bug regression** - Always add a test when fixing a bug
5. **Fast feedback** - Unit tests run in seconds, E2E tests for confidence