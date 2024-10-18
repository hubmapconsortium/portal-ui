import {
  Contributor,
  ContributorAPIResponse,
  normalizeContributor,
} from 'js/components/detailPage/ContributorsTable/utils';

function buildAbbreviatedContributors(contributors: Contributor[]) {
  switch (contributors.length) {
    case 0:
      return '';
    case 1:
      return contributors[0].name;
    case 2:
      return contributors.map((contributor) => contributor.name).join(' and ');
    default:
      return `${contributors[0].name}, et al.`;
  }
}

function buildSecondaryText(contributors: Contributor[], publication_venue: string, publication_date = '') {
  return [buildAbbreviatedContributors(contributors), publication_venue, publication_date]
    .filter((str) => str.length)
    .join(' | ');
}

export interface PublicationHit {
  _source: {
    uuid: string;
    title: string;
    contributors: ContributorAPIResponse[];
    publication_venue: string;
    publication_date: string;
    publication_status: boolean;
  };
}

function buildPublicationPanelProps(
  {
    _source: { uuid, title, contributors = [], publication_venue, publication_date, publication_status },
  }: PublicationHit,
  noRightText?: boolean,
) {
  const dateText = `${publication_status ? 'Published' : 'Preprint Date'}: ${publication_date}`;
  return {
    key: uuid,
    href: `/browse/publication/${uuid}`,
    title,
    secondaryText: buildSecondaryText(
      contributors.map(normalizeContributor),
      publication_venue,
      noRightText ? dateText : undefined,
    ),
    rightText: noRightText ? undefined : dateText,
  };
}

export { buildAbbreviatedContributors, buildSecondaryText, buildPublicationPanelProps };
