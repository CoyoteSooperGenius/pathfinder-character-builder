// Jest setup file for unit tests

// In the browser GameUtils is a global loaded before data-utils.js; mirror that
// for modules (like DataUtils) that reference it as a bare identifier.
global.GameUtils = require('../../js/utilities/game-utils.js');

// jsdom provides a fully functional localStorage (getItem/setItem/removeItem/
// clear/key/length); a plain-object mock can't replace it because jsdom defines
// window.localStorage as a non-configurable accessor. Just reset it between tests.
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});
