import React from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { Contributor } from 'js/components/detailPage/ContributorsTable/utils';

interface PublicationCitationProps {
  contributors?: Contributor[];
  title: string;
  publication_date: string;
  publication_venue: string;
  doiURL: string;
}
type BuildNLMCitationProps = Omit<PublicationCitationProps, 'doiURL'>;

function buildNLMCitation({ contributors, title, publication_date, publication_venue }: BuildNLMCitationProps) {
  if (!contributors || contributors.length === 0) {
    return '';
  }
  const firstAuthorName = contributors?.[0].name;
  const author = contributors.length > 1 ? `${firstAuthorName}, et al` : firstAuthorName;

  const year = publication_date.slice(0, 4);
  return `${author}. ${title}. ${publication_venue}; ${year}.`;
}

function PublicationCitation({
  contributors = [],
  title,
  publication_date,
  publication_venue,
  doiURL,
}: PublicationCitationProps) {
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
