import {
  buildSecondaryText,
  buildAbbreviatedContributors,
  buildPublicationPanelProps,
  buildPublicationsSeparatedByStatus,
} from './utils';

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

const publication_venue = 'Pallet Town Times';

const preprintPublicationHit = {
  _source: {
    uuid: 'abc123',
    title: 'Publication ABC',
    contributors: [ash],
    publication_status: false,
    publication_venue,
    publication_date: '2022-03-02',
  },
};

const publishedPublicationHit = {
  _source: {
    uuid: 'def456',
    title: 'Publication DEF',
    contributors: [professorOak],
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

    expect(buildSecondaryText(contributors, publication_venue)).toBe('Ash Ketchum | Pallet Town Times');
  });

  test('should just the publication venue if contributors list is empty', () => {
    const contributors = [];

    expect(buildSecondaryText(contributors, publication_venue)).toBe('Pallet Town Times');
  });
});

describe('buildPublicationsPanelProps', () => {
  test('should return the props require for the panel list', () => {
    expect(buildPublicationPanelProps(preprintPublicationHit)).toEqual({
      key: 'abc123',
      href: '/browse/publication/abc123',
      title: 'Publication ABC',
      secondaryText: 'Ash Ketchum | Pallet Town Times',
      rightText: 'Published: 2022-03-02',
    });
  });
});

describe('buildPublicationsSeparatedByStatus', () => {
  test('should return sorted publications', () => {
    expect(buildPublicationsSeparatedByStatus([preprintPublicationHit, publishedPublicationHit])).toEqual({
      preprint: {
        category: 'Preprint',
        entities: [
          {
            key: 'abc123',
            href: '/browse/publication/abc123',
            title: 'Publication ABC',
            secondaryText: 'Ash Ketchum | Pallet Town Times',
            rightText: 'Published: 2022-03-02',
          },
        ],
      },
      published: {
        category: 'Peer Reviewed',
        entities: [
          {
            key: 'def456',
            href: '/browse/publication/def456',
            title: 'Publication DEF',
            secondaryText: 'Professor Oak | Pallet Town Times',
            rightText: 'Published: 2022-03-02',
          },
        ],
      },
    });
  });
});
