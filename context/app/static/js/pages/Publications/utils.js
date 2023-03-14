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

export { buildAbbreviatedContributors, buildSecondaryText, buildPublicationPanelProps };
