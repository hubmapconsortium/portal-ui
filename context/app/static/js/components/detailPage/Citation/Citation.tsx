import React from 'react';
import Typography from '@mui/material/Typography';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import IconLink from 'js/shared-styles/Links/iconLinks/IconLink';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

interface Contributor {
  last_name: string;
  first_name: string;
}

function buildNLMCitation(contributors: Contributor[], citationTitle: string, created_timestamp: number) {
  const joinedContributors = contributors
    .map(({ last_name, first_name }) => `${last_name} ${first_name[0]}`)
    .join(', ');
  const year = new Date(created_timestamp).getFullYear();
  return `${joinedContributors}. ${citationTitle} [Internet]. HuBMAP Consortium; ${year}.`;
}

interface CitationProps {
  contributors: Contributor[];
  citationTitle: string;
  created_timestamp: number;
  doi_url: string;
  doi: string;
  className?: string;
  internalDoi?: boolean;
}

function ExternalDoiLink({ doi_url }: { doi_url: string }) {
  return <OutboundIconLink href={doi_url}>{doi_url}</OutboundIconLink>;
}

function InternalDoiLink({ doi_url }: { doi_url: string }) {
  const copy = useHandleCopyClick();
  return (
    <SecondaryBackgroundTooltip title="This DOI link leads to the page you are currently viewing. Click to copy.">
      <IconLink
        href={doi_url}
        onClick={(e) => {
          e.preventDefault();
          copy(doi_url);
        }}
        icon={<ContentCopyIcon />}
      >
        {doi_url}
      </IconLink>
    </SecondaryBackgroundTooltip>
  );
}

function Citation({
  contributors,
  citationTitle,
  created_timestamp,
  doi_url,
  doi,
  className,
  internalDoi,
}: CitationProps) {
  const citation = buildNLMCitation(contributors, citationTitle, created_timestamp);

  const DOI = internalDoi ? InternalDoiLink : ExternalDoiLink;
  return (
    <LabelledSectionText
      label="Citation"
      iconTooltipText="Citation is provided in NLM format. If DataCite page is available, click button to view alternate ways to cite."
      className={className}
      bottomSpacing={1}
      childContainerComponent="div"
    >
      <Typography variant="body1">
        {citation} Available from: <DOI doi_url={doi_url} />
      </Typography>
      <OutboundIconLink href={`https://commons.datacite.org/doi.org/${doi}`}>View DataCite Page</OutboundIconLink>
    </LabelledSectionText>
  );
}

export default Citation;
export { buildNLMCitation };
