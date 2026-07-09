const DataUtils = require('../../js/utilities/data-utils.js');

// KB-1 regression: the Load Character view reads storageKey, level, hitPoints,
// armorClass, concept, and lastModified off each saved-character wrapper —
// loadSavedCharacters must return all of them.

describe('DataUtils.loadSavedCharacters', () => {
  const savedCharacter = {
    name: { first: 'Conan', last: 'TheBarbarian' },
    race: { name: 'Human' },
    characterClass: { name: 'Barbarian' },
    level: 3,
    hitPoints: 31,
    armorClass: 15,
    concept: 'Wandering sellsword',
    lastModified: '2026-07-08T12:00:00.000Z'
  };

  it('returns display-ready wrappers with all fields the load view reads', () => {
    localStorage.setItem('conan-thebarbarian', JSON.stringify(savedCharacter));

    let result;
    DataUtils.loadSavedCharacters((chars) => { result = chars; }, null);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      storageKey: 'conan-thebarbarian',
      name: 'Conan TheBarbarian',
      race: 'Human',
      characterClass: 'Barbarian',
      level: 3,
      hitPoints: 31,
      armorClass: 15,
      concept: 'Wandering sellsword',
      lastModified: '2026-07-08T12:00:00.000Z'
    });
  });

  it('flattens string-valued race/class and defaults missing fields', () => {
    localStorage.setItem('red-sonja', JSON.stringify({
      name: { first: 'Red', last: 'Sonja' },
      race: 'Human',
      characterClass: 'Fighter'
    }));

    let result;
    DataUtils.loadSavedCharacters((chars) => { result = chars; }, null);

    expect(result[0].race).toBe('Human');
    expect(result[0].characterClass).toBe('Fighter');
    expect(result[0].level).toBe(1);
    expect(result[0].hitPoints).toBeNull();
    expect(result[0].armorClass).toBeNull();
    expect(result[0].concept).toBe('');
    expect(result[0].lastModified).toBeNull();
  });

  it('preserves a legitimate 0 hitPoints instead of treating it as missing', () => {
    localStorage.setItem('downed-hero', JSON.stringify({
      name: { first: 'Downed', last: 'Hero' },
      hitPoints: 0,
      armorClass: 10
    }));

    let result;
    DataUtils.loadSavedCharacters((chars) => { result = chars; }, null);

    expect(result[0].hitPoints).toBe(0);
    expect(result[0].armorClass).toBe(10);
  });

  it('falls back to Unknown for a race/class object without a name', () => {
    localStorage.setItem('malformed', JSON.stringify({
      name: { first: 'Mal', last: 'Formed' },
      race: {},
      characterClass: { name: '' }
    }));

    let result;
    DataUtils.loadSavedCharacters((chars) => { result = chars; }, null);

    expect(result[0].race).toBe('Unknown');
    expect(result[0].characterClass).toBe('Unknown');
  });

  it('skips current-character and non-character entries', () => {
    localStorage.setItem('current-character', JSON.stringify(savedCharacter));
    localStorage.setItem('pf-theme', '"dark"');
    localStorage.setItem('not-json', '{oops');

    let result;
    DataUtils.loadSavedCharacters((chars) => { result = chars; }, null);

    expect(result).toEqual([]);
  });
});

describe('DataUtils.saveCharacter', () => {
  it('stamps lastModified and clears current-character', () => {
    const character = { name: { first: 'Conan', last: 'TheBarbarian' } };
    localStorage.setItem('current-character', JSON.stringify(character));

    const ok = DataUtils.saveCharacter(character, () => 'conan-thebarbarian', null, null);

    expect(ok).toBe(true);
    const stored = JSON.parse(localStorage.getItem('conan-thebarbarian'));
    expect(new Date(stored.lastModified).toString()).not.toBe('Invalid Date');
    expect(localStorage.getItem('current-character')).toBeNull();
  });
});
