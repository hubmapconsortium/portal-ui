import { validateSavedEntitiesList, type SavedEntitiesList } from 'js/components/savedLists/types';

describe('validateSavedEntitiesList', () => {
  const validList: SavedEntitiesList = {
    title: 'My Test List',
    description: 'Test description',
    dateSaved: 1234567890,
    dateLastModified: 1234567890,
    savedEntities: {
      'entity-1': { dateSaved: 1234567890 },
      'entity-2': { dateAddedToList: 1234567890 },
    },
  };

  describe('valid inputs', () => {
    it('should return true for a valid SavedEntitiesList', () => {
      expect(validateSavedEntitiesList(validList)).toBe(true);
    });

    it('should return true for a valid list with empty savedEntities', () => {
      const listWithEmptyEntities = {
        ...validList,
        savedEntities: {},
      };
      expect(validateSavedEntitiesList(listWithEmptyEntities)).toBe(true);
    });

    it('should return true for a valid list with empty title and description', () => {
      const listWithEmptyStrings = {
        ...validList,
        title: '',
        description: '',
      };
      expect(validateSavedEntitiesList(listWithEmptyStrings)).toBe(true);
    });

    it('should return true for a valid list with savedEntities having optional fields', () => {
      const listWithOptionalFields = {
        ...validList,
        savedEntities: {
          'entity-1': {},
          'entity-2': { dateSaved: 1234567890, dateAddedToList: 1234567890 },
        },
      };
      expect(validateSavedEntitiesList(listWithOptionalFields)).toBe(true);
    });
  });

  describe('invalid inputs - wrong types', () => {
    it('should return false for null', () => {
      expect(validateSavedEntitiesList(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(validateSavedEntitiesList(undefined)).toBe(false);
    });

    it('should return false for a string', () => {
      expect(validateSavedEntitiesList('not an object')).toBe(false);
    });

    it('should return false for a number', () => {
      expect(validateSavedEntitiesList(123)).toBe(false);
    });

    it('should return false for an array', () => {
      expect(validateSavedEntitiesList([])).toBe(false);
    });

    it('should return false for a boolean', () => {
      expect(validateSavedEntitiesList(true)).toBe(false);
    });
  });

  describe('invalid inputs - missing required fields', () => {
    it('should return false when title is missing', () => {
      const { title, ...withoutTitle } = validList;
      expect(validateSavedEntitiesList(withoutTitle)).toBe(false);
    });

    it('should return false when description is missing', () => {
      const { description, ...withoutDescription } = validList;
      expect(validateSavedEntitiesList(withoutDescription)).toBe(false);
    });

    it('should return false when dateSaved is missing', () => {
      const { dateSaved, ...withoutDateSaved } = validList;
      expect(validateSavedEntitiesList(withoutDateSaved)).toBe(false);
    });

    it('should return false when dateLastModified is missing', () => {
      const { dateLastModified, ...withoutDateLastModified } = validList;
      expect(validateSavedEntitiesList(withoutDateLastModified)).toBe(false);
    });

    it('should return false when savedEntities is missing', () => {
      const { savedEntities, ...withoutSavedEntities } = validList;
      expect(validateSavedEntitiesList(withoutSavedEntities)).toBe(false);
    });

    it('should return false when multiple fields are missing', () => {
      expect(validateSavedEntitiesList({ title: 'Test' })).toBe(false);
    });
  });

  describe('invalid inputs - wrong field types', () => {
    it('should return false when title is not a string', () => {
      const invalidList = { ...validList, title: 123 };
      expect(validateSavedEntitiesList(invalidList)).toBe(false);
    });

    it('should return false when title is null', () => {
      const invalidList = { ...validList, title: null };
      expect(validateSavedEntitiesList(invalidList)).toBe(false);
    });

    it('should return false when description is not a string', () => {
      const invalidList = { ...validList, description: ['not', 'a', 'string'] };
      expect(validateSavedEntitiesList(invalidList)).toBe(false);
    });

    it('should return false when description is null', () => {
      const invalidList = { ...validList, description: null };
      expect(validateSavedEntitiesList(invalidList)).toBe(false);
    });

    it('should return false when dateSaved is not a number', () => {
      const invalidList = { ...validList, dateSaved: '1234567890' };
      expect(validateSavedEntitiesList(invalidList)).toBe(false);
    });

    it('should return false when dateSaved is null', () => {
      const invalidList = { ...validList, dateSaved: null };
      expect(validateSavedEntitiesList(invalidList)).toBe(false);
    });

    it('should return false when dateLastModified is not a number', () => {
      const invalidList = { ...validList, dateLastModified: new Date() };
      expect(validateSavedEntitiesList(invalidList)).toBe(false);
    });

    it('should return false when dateLastModified is null', () => {
      const invalidList = { ...validList, dateLastModified: null };
      expect(validateSavedEntitiesList(invalidList)).toBe(false);
    });

    it('should return false when savedEntities is not an object', () => {
      const invalidList = { ...validList, savedEntities: 'not an object' };
      expect(validateSavedEntitiesList(invalidList)).toBe(false);
    });

    it('should return false when savedEntities is null', () => {
      const invalidList = { ...validList, savedEntities: null };
      expect(validateSavedEntitiesList(invalidList)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should return true when object has extra fields', () => {
      const listWithExtraFields = {
        ...validList,
        extraField: 'extra',
        anotherField: 123,
      };
      expect(validateSavedEntitiesList(listWithExtraFields)).toBe(true);
    });

    it('should return false for an empty object', () => {
      expect(validateSavedEntitiesList({})).toBe(false);
    });

    it('should return true for dateSaved = 0', () => {
      const listWithZeroDate = { ...validList, dateSaved: 0 };
      expect(validateSavedEntitiesList(listWithZeroDate)).toBe(true);
    });

    it('should return true for negative dateSaved', () => {
      const listWithNegativeDate = { ...validList, dateSaved: -1 };
      expect(validateSavedEntitiesList(listWithNegativeDate)).toBe(true);
    });

    it('should return true for NaN in dateSaved (limitation of typeof check)', () => {
      // Note: typeof NaN === 'number' in JavaScript
      const listWithNaN = { ...validList, dateSaved: NaN };
      expect(validateSavedEntitiesList(listWithNaN)).toBe(true);
    });

    it('should return true for Infinity in dateLastModified (limitation of typeof check)', () => {
      // Note: typeof Infinity === 'number' in JavaScript
      const listWithInfinity = { ...validList, dateLastModified: Infinity };
      expect(validateSavedEntitiesList(listWithInfinity)).toBe(true);
    });
  });

  describe('type guard behavior', () => {
    it('should work as a type guard that narrows unknown to SavedEntitiesList', () => {
      const unknownValue: unknown = validList;
      expect(validateSavedEntitiesList(unknownValue)).toBe(true);

      // After validation, TypeScript type guard should allow access to properties
      // This test verifies the runtime validation matches the type definition
      expect(validateSavedEntitiesList(validList)).toBe(true);
    });
  });
});
