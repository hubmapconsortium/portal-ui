import { makeDonorMetadataFilters } from './S';

describe('makeDonorMetadataFilters', () => {
  it('targets the single donor (top-level mapped_metadata) for Donor entities', () => {
    const fields = makeDonorMetadataFilters({ entity_type: 'Donor' }).map((f) => f.field);
    expect(fields).toEqual([
      'mapped_metadata.sex',
      'mapped_metadata.age_value',
      'mapped_metadata.race',
      'mapped_metadata.body_mass_index_value',
    ]);
  });

  it('targets aggregated donor_demographics for multi-donor Dataset/Sample entities', () => {
    (['Dataset', 'Sample'] as const).forEach((entity_type) => {
      const fields = makeDonorMetadataFilters({ entity_type }).map((f) => f.field);
      expect(fields).toEqual([
        'donor_demographics.sex',
        'donor_demographics.age_value',
        'donor_demographics.race',
        'donor_demographics.body_mass_index_value',
      ]);
    });
  });
});
