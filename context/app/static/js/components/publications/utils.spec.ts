import { Contributor, ContributorAPIResponse } from 'js/components/detailPage/ContributorsTable/utils';
import { buildSecondaryText, buildAbbreviatedContributors, buildPublicationPanelProps } from './utils';

const genericContributorDetails = {
  affiliation: '',
  middleNameOrInitial: '',
  email: '',
  isContact: false,
  isOperator: false,
  isPrincipalInvestigator: false,
  orcid: '',
};

const ash: Contributor = {
  firstName: 'Ash',
  lastName: 'Ketchum',
  name: 'Ash Ketchum',
  ...genericContributorDetails,
};

const professorOak: Contributor = {
  firstName: 'Professor',
  lastName: 'Oak',
  name: 'Professor Oak',
  ...genericContributorDetails,
};

const brock: Contributor = {
  firstName: 'Brock',
  lastName: 'Harrison',
  name: 'Brock Harrison',
  ...genericContributorDetails,
};

const jessie: ContributorAPIResponse = {
  first_name: 'Team',
  last_name: 'Rocket',
  name: 'Team Rocket',
  orcid_id: '',
  version: '0',
  affiliation: '',
  middle_name_or_initial: '',
};

const publication_venue = 'Pallet Town Times';

const preprintPublicationHit = {
  _source: {
    uuid: 'abc123',
    title: 'Publication ABC',
    onClick: () => {},
    contributors: [jessie],
    publication_status: false,
    publication_venue,
    publication_date: '2022-03-02',
  },
};

const peerReviewedPublicationHit = {
  _source: {
    uuid: 'def234',
    title: 'Publication DEF',
    onClick: () => {},
    contributors: [jessie],
    publication_status: true,
    publication_venue,
    publication_date: '2022-03-02',
  },
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

    expect(buildSecondaryText(publication_venue, contributors)).toBe('Ash Ketchum | Pallet Town Times');
  });

  test('should just the publication venue if contributors list is empty', () => {
    const contributors: Contributor[] = [];

    expect(buildSecondaryText(publication_venue, contributors)).toBe('Pallet Town Times');
  });
});

describe('buildPublicationsPanelProps', () => {
  test('should return the props require for the panel list for a preprint', () => {
    expect(buildPublicationPanelProps(preprintPublicationHit)).toEqual({
      key: 'abc123',
      href: '/browse/publication/abc123',

      onClick: expect.any(Function),
      title: 'Publication ABC',
      secondaryText: 'Team Rocket | Pallet Town Times',
      rightText: 'Preprint Date: 2022-03-02',
    });
  });
  test('should return the props required for the panel list of a peer reviewed paper', () => {
    expect(buildPublicationPanelProps(peerReviewedPublicationHit)).toEqual({
      key: 'def234',
      href: '/browse/publication/def234',

      onClick: expect.any(Function),
      title: 'Publication DEF',
      secondaryText: 'Team Rocket | Pallet Town Times',
      rightText: 'Published: 2022-03-02',
    });
  });
});
