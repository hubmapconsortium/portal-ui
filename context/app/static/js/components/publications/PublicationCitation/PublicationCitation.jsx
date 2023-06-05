import React from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

function buildNLMCitation({ contributors, title, publication_date, publication_venue }) {
  if (contributors.length === 0) {
    return '';
  }
  const firstAuthorName = contributors[0].name;
  const author = contributors.length > 1 ? `${firstAuthorName}, et al` : firstAuthorName;

  const year = publication_date.slice(0, 4);
  return `${author}. ${title} [Internet]. ${publication_venue}; ${year}.`;
}

function PublicationCitation({ contributors = [], title, publication_date, publication_venue, doiURL }) {
  const citation = buildNLMCitation({ contributors, title, publication_date, publication_venue });

  return (
    <LabelledSectionText
      label="Citation"
      iconTooltipText="Citation is provided in NLM format."
      bottomSpacing={1}
      data-testid="publication-citation"
    >
      {citation} DOI: <OutboundIconLink href={doiURL}>{doiURL}</OutboundIconLink>
    </LabelledSectionText>
  );
}

export default PublicationCitation;
