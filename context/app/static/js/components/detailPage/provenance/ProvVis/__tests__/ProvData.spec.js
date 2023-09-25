import ProvData, { makeCwlInput, makeCwlOutput } from '../ProvData';

import * as fixtures from './fixtures';

console.warn = (...args) => {
  if (args[0] !== 'HORZ') {
    // TODO: Remove when upstream PR is merged: https://github.com/4dn-dcic/react-workflow-viz/pull/7
    console.warn(...args);
  }
};

// TODO: Hitting validation errors.
// describe('Prov fixtures', () => {
//   Object.entries(fixtures).forEach(([k, v]) => {
//     it(`converts ${k} W3C JSON to 4DN CWL`, () => {
//       const cwl = new ProvData(v.prov, v.getNameForActivity, v.getNameForEntity).toCwl();
//       expect(cwl).toEqual(v.cwl, `Mismatch (full after diff):\n${JSON.stringify(cwl, null, 2)}`);
//     });
//   });
// });

const expectedErrorMessage = `
Received invalid provenance data. The following categories of errors were found:
Invalid input: 'prefix'
Required: 'entity', 'activity', 'wasGeneratedBy', 'used'`.trim();

describe('ProvData errors', () => {
  it('has expected error message', () => {
    let message;
    let prov;
    try {
      prov = new ProvData({ prov: {} });
    } catch (e) {
      message = e.message;
    }
    expect(message).toStrictEqual(expectedErrorMessage);
    expect(prov).toBeUndefined();
  });
});

describe('ProvData methods', () => {
  const prov = new ProvData({ prov: fixtures.complex.prov });

  it('getParentEntityNames', () => {
    expect(prov.getParentEntityNames('hubmap:act-4')).toEqual(['hubmap:ent-1', 'hubmap:ent-3', 'hubmap:ent-4']);
  });

  it('getChildEntityNames', () => {
    expect(prov.getChildEntityNames('hubmap:act-2')).toEqual(['hubmap:ent-4', 'hubmap:ent-7']);
  });

  it('getParentActivityNames', () => {
    expect(prov.getParentActivityNames('hubmap:ent-6')).toEqual(['hubmap:act-4']);
  });

  it('getChildActivityNames', () => {
    expect(prov.getChildActivityNames('hubmap:ent-1')).toEqual(['hubmap:act-1', 'hubmap:act-2', 'hubmap:act-4']);
  });
});

// No such function: Maybe version mismatch?
//
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

  it('makeCwlOutput', () => {
    expect(makeCwlOutput('name1', ['step1'], { extras: 'go here!' })).toEqual({
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
