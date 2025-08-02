// Jest setup file for unit tests

// Mock global objects that our services might need
global.window = {};
global.localStorage = {
  store: {},
  getItem: jest.fn((key) => global.localStorage.store[key] || null),
  setItem: jest.fn((key, value) => {
    global.localStorage.store[key] = value;
  }),
  removeItem: jest.fn((key) => {
    delete global.localStorage.store[key];
  }),
  clear: jest.fn(() => {
    global.localStorage.store = {};
  })
};

// Reset localStorage before each test
beforeEach(() => {
  global.localStorage.store = {};
  jest.clearAllMocks();
});