import ProvData, { makeCwlInput, makeCwlOutput } from '../ProvData';

import * as fixtures from './fixtures';

console.warn = (...args) => {
  if (args[0] !== 'HORZ') {
    // TODO: Remove when upstream PR is merged: https://github.com/4dn-dcic/react-workflow-viz/pull/7
    console.warn(...args);
  }
};

describe('Prov fixtures', () => {
  Object.entries(fixtures).forEach(([k, v]) => {
    it(`converts ${k} W3C JSON to 4DN CWL`, () => {
      const cwl = new ProvData(v.prov, v.getNameForActivity, v.getNameForEntity).toCwl();
      expect(cwl).toEqual(v.cwl, `Mismatch (full after diff):\n${JSON.stringify(cwl, null, 2)}`);
    });
  });
});

describe('ProvData errors', () => {
  it('has expected error message', () => {
    let message;
    try {
      new ProvData({}); // eslint-disable-line no-new
    } catch (e) {
      message = e.message;
    }
    expect(message).toContain("should have required property 'prefix'");
  });
});

describe('ProvData methods', () => {
  const prov = new ProvData(fixtures.complex.prov);

  it('getParentEntityNames', () => {
    expect(prov.getParentEntityNames('https://hubmapconsortium.org/act-4')).toEqual([
      'https://hubmapconsortium.org/ent-1',
      'https://hubmapconsortium.org/ent-3',
      'https://hubmapconsortium.org/ent-4',
    ]);
  });

  it('getChildEntityNames', () => {
    expect(prov.getChildEntityNames('https://hubmapconsortium.org/act-2')).toEqual([
      'https://hubmapconsortium.org/ent-4',
      'https://hubmapconsortium.org/ent-7',
    ]);
  });

  it('getParentActivityNames', () => {
    expect(prov.getParentActivityNames('https://hubmapconsortium.org/ent-6')).toEqual([
      'https://hubmapconsortium.org/act-4',
    ]);
  });

  it('getChildActivityNames', () => {
    expect(prov.getChildActivityNames('https://hubmapconsortium.org/ent-1')).toEqual([
      'https://hubmapconsortium.org/act-1',
      'https://hubmapconsortium.org/act-2',
      'https://hubmapconsortium.org/act-4',
    ]);
  });
});

// describe('PROV expansion', () => {
//   it('should expand prefixes', () => {
//     expect(
//       expand(
//         {
//           'do:C': { 're:D': 'mi:E' },
//           're:D': { 're:D': 'not-expanded' },
//         },
//         {
//           do: 'deer#',
//           re: 'drop-of-golden-sun#',
//           mi: 'name-i-call-myself#',
//         },
//       ),
//     ).toEqual({
//       'deer#C': { 'drop-of-golden-sun#D': 'name-i-call-myself#E' },
//       'drop-of-golden-sun#D': { 'drop-of-golden-sun#D': 'not-expanded' },
//     });
//   });
// });

describe('CWL utils', () => {
  it('makeCwlInput reference', () => {
    expect(makeCwlInput('name1', [], { extras: 'go here!' }, true)).toEqual({
      meta: {
        global: true,
        in_path: true,
        type: 'reference file',
      },
      name: 'name1',
      run_data: {
        file: [
          {
            '@id': 'name1',
          },
        ],
      },
      source: [
        {
          for_file: 'name1',
          name: 'name1',
        },
      ],
      prov: {
        extras: 'go here!',
      },
    });
  });

  it('makeCwlInput with step', () => {
    expect(makeCwlInput('name1', ['step1'], { extras: 'go here!' })).toEqual({
      meta: {
        global: true,
        in_path: true,
        type: 'data file',
      },
      name: 'name1',
      run_data: {
        file: [
          {
            '@id': 'name1',
          },
        ],
      },
      source: [
        {
          for_file: 'name1',
          name: 'name1',
          step: 'step1',
        },
      ],
      prov: {
        extras: 'go here!',
      },
    });
  });

  it('_makeCwlOutput', () => {
    expect(makeCwlOutput('name1', ['step1'], { extras: 'go here!' })).toEqual({
      meta: {
        global: true,
        in_path: true,
      },
      name: 'name1',
      run_data: {
        file: [
          {
            '@id': 'name1',
          },
        ],
      },
      target: [
        {
          name: 'name1',
          step: 'step1',
        },
      ],
      prov: {
        extras: 'go here!',
      },
    });
  });
});
