import { findBestType, findBestDescription, mapXSDTypetoHMFIELD, MetadataField, buildFieldsMap } from './useUBKG';

describe('mapXSDTypeToHMFIELD', () => {
  it.each([
    ['string', 'string'],
    ['float', 'number'],
    ['anyURI', 'string'],
    ['int', 'integer'],
    ['integer', 'integer'],
    ['decimal', 'number'],
    ['boolean', 'boolean'],
    ['dateTime', 'datetime'],
    ['date', 'date'],
    ['long', 'number'],
    ['fire', 'fire'],
  ])('Maps %s to %s', (inputXSD: string, expectedHMFIELD: string) => {
    expect(mapXSDTypetoHMFIELD(inputXSD)).toBe(expectedHMFIELD);
  });
});

describe('findBestType', () => {
  it('should return HMFIELD type if present', () => {
    expect(
      findBestType([
        {
          mapping_source: 'CEDAR',
          type: 'anyURI',
          type_source: 'XSD',
        },
        {
          mapping_source: 'HMFIELD',
          type: 'string',
          type_source: 'HMFIELD',
        },
      ]),
    ).toEqual('string');
  });

  it('should return mapped XSD type if no HMFIELD type is present', () => {
    expect(
      findBestType([
        {
          mapping_source: 'CEDAR',
          type: 'anyURI',
          type_source: 'XSD',
        },
        {
          mapping_source: 'CEDAR',
          type: 'string',
          type_source: 'XSD',
        },
      ]),
    ).toEqual('string');
  });
});

describe('findBestDescription', () => {
  it('should return CEDAR description if present', () => {
    expect(
      findBestDescription([
        {
          source: 'HMFIELD',
          description: 'An interesting field.',
        },
        {
          source: 'CEDAR',
          description: 'An updated interesting field.',
        },
      ]),
    ).toEqual('An updated interesting field.');
  });

  it('should return HMFIELD description if no CEDAR description is present', () => {
    expect(
      findBestDescription([
        {
          source: 'HMFIELD',
          description: 'An interesting field.',
        },
      ]),
    ).toEqual('An interesting field.');
  });
});

interface TestField extends MetadataField {
  other: string;
}

describe('buildFieldsMap', () => {
  it('should return an object with name keys and specified values', () => {
    expect(
      buildFieldsMap<TestField>({
        fields: [
          {
            code_ids: ['a', 'b', 'c'],
            name: 'height',
            other: 'x',
          },
        ],
        getValue: (field: TestField) => field.other,
      }),
    ).toEqual({
      height: 'x',
    });
  });
});
