import { createGeneDetailDataKey } from './useGeneDetailData';
import { createCellTypeDetailDataKey } from './useCellTypeDetailData';
import { createCellTypesLandingDataKey } from './useCellTypesLandingData';

describe('per-page aggregate SWR keys', () => {
  it('gene detail key targets the Flask BFF route', () => {
    expect(createGeneDetailDataKey('VIM')).toBe('/scfind/gene-detail/VIM.json');
  });

  it('gene detail key URL-encodes the symbol', () => {
    expect(createGeneDetailDataKey('HLA-A')).toBe('/scfind/gene-detail/HLA-A.json');
  });

  it('cell type detail key URL-encodes the CLID colon', () => {
    expect(createCellTypeDetailDataKey('CL:0000236')).toBe('/scfind/cell-type-detail/CL%3A0000236.json');
  });

  it('cell types landing key is a static route', () => {
    expect(createCellTypesLandingDataKey()).toBe('/scfind/cell-types-landing.json');
  });
});
