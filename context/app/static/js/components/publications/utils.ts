import {
  Contributor,
  ContributorAPIResponse,
  normalizeContributor,
} from 'js/components/detailPage/ContributorsTable/utils';
import { trackEvent } from 'js/helpers/trackers';

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

function buildSecondaryText(publication_venue: string, contributors?: Contributor[], publication_date = '') {
  if (!contributors?.length) {
    return '';
  }

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
  const onClick = () => {
    trackEvent({
      category: 'Homepage',
      action: 'Recent Publications',
      label: title,
    });
  };

  return {
    key: uuid,
    href: `/browse/publication/${uuid}`,
    onClick,
    title,
    secondaryText: buildSecondaryText(
      publication_venue,
      contributors.map(normalizeContributor),
      noRightText ? dateText : undefined,
    ),
    rightText: noRightText ? undefined : dateText,
  };
}

export { buildPublicationPanelProps, buildAbbreviatedContributors, buildSecondaryText };
