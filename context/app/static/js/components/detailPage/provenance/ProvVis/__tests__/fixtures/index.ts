/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-export */

import realProv from './real-prov.json';
import realCwl from './real-cwl.json';
import complexProv from './complex-prov.json';
import complexCwl from './complex-cwl.json';
import simpleProv from './simple-prov.json';
import simpleCwl from './simple-cwl.json';

import cwlProv from './primary.cwlprov.json';
import { ProvData } from '../../../types';

// This file just builds test fixtures: it has no tests of its own.
test.skip('skip', () => {
  /* purposely left empty */
});

const PROV_NS = 'prov:';

export const simple = {
  getNameForActivity: (id: string) => id.split('#').pop() || id,
  getNameForEntity: (id: string) => id.split('#').pop() || id,
  prov: simpleProv as unknown as ProvData,
  cwl: simpleCwl,
};

export const complex = {
  getNameForActivity: (id: string) => id.split('/').pop() || id,
  getNameForEntity: (id: string) => id.split('/').pop() || id,
  prov: complexProv as unknown as ProvData,
  cwl: complexCwl,
};

export const real = {
  getNameForActivity: (id: string, prov?: ProvData) => {
    if (!prov) return id;
    const activity = prov.activity[id];
    return `${activity[`${PROV_NS}type`]} - ${activity[`${PROV_NS}label`]}`;
  },
  getNameForEntity: (id: string, prov?: ProvData) => {
    if (!prov) return id;
    const entity = prov.entity[id];
    // NOTE: The initial entity node was not included in the sample data;
    // Fallback to ID, if needed. https://github.com/hubmapconsortium/prov-vis/issues/15
    return entity ? `${entity[`${PROV_NS}type`]} - ${entity[`${PROV_NS}label`]}` : id;
  },
  prov: realProv as unknown as ProvData,
  cwl: realCwl,
};

export const cwl = {
  prov: cwlProv as unknown as ProvData,
};

// The React demo references the default export.
export default cwl;
