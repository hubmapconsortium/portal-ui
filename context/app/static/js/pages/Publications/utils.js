function buildAbbreviatedContributors(contributors) {
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

function buildSecondaryText(contributors, publication_venue) {
  return [buildAbbreviatedContributors(contributors), publication_venue].filter((str) => str.length).join(' | ');
}

function buildPublicationPanelProps(publicationHit) {
  const {
    _source: { uuid, title, contributors = [], publication_venue, publication_date },
  } = publicationHit;

  return {
    key: uuid,
    href: `/browse/publication/${uuid}`,
    title,
    secondaryText: buildSecondaryText(contributors, publication_venue),
    rightText: `Published: ${publication_date}`,
  };
}

function buildPublicationsSeparatedByStatus(publications) {
  return publications.reduce(
    (acc, publication) => {
      const {
        _source: { publication_status },
      } = publication;

      if (publication_status === undefined) {
        return acc;
      }

      const publicationProps = buildPublicationPanelProps(publication);

      if (publication_status) {
        acc.published.entities.push(publicationProps);
      } else {
        acc.preprint.entities.push(publicationProps);
      }

      return acc;
    },
    { published: { category: 'Peer Reviewed', entities: [] }, preprint: { category: 'Preprint', entities: [] } },
  );
}

export {
  buildAbbreviatedContributors,
  buildSecondaryText,
  buildPublicationPanelProps,
  buildPublicationsSeparatedByStatus,
};
