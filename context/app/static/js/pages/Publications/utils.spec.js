import { buildSecondaryText, buildAbbreviatedContributors } from './utils';

const ash = {
  first_name: 'Ash',
  last_name: 'Ketchum',
  name: 'Ash Ketchum',
};

const professorOak = {
  first_name: 'Professor',
  last_name: 'Oak',
  name: 'Professor Oak',
};

const brock = {
  first_name: 'Brock',
  last_name: 'Harrison',
  name: 'Brock Harrison',
};

describe('buildAbbreviatedContributors', () => {
  test("should return the contributor's name if there is only a single contributor", () => {
    const contributors = [ash];
    expect(buildAbbreviatedContributors(contributors)).toBe('Ash Ketchum');
  });

  test("should return the both contributors' names separated by and if there are two contributors", () => {
    const contributors = [ash, professorOak];

    expect(buildAbbreviatedContributors(contributors)).toBe('Ash Ketchum and Professor Oak');
  });

  test("should return the first contributor's and et. al if there are more than two contributors", () => {
    const contributors = [ash, professorOak, brock];

    expect(buildAbbreviatedContributors(contributors)).toBe('Ash Ketchum, et al.');
  });
});

describe('buildSecondaryText', () => {
  test('should return the abbreviated contributors and publication venue separated by a pipe', () => {
    const contributors = [ash];
    const publication_venue = 'Pallet Town Times';

    expect(buildSecondaryText(contributors, publication_venue)).toBe('Ash Ketchum | Pallet Town Times');
  });

  test('should just the publication venue if contributors list is empty', () => {
    const contributors = [];
    const publication_venue = 'Pallet Town Times';

    expect(buildSecondaryText(contributors, publication_venue)).toBe('Pallet Town Times');
  });
});
