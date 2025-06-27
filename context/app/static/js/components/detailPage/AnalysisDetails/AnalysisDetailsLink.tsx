import React from 'react';

import { DagProvenanceType } from 'js/components/types';
import { CwlIcon, FlexOutboundLink, StyledListItem } from './style';

interface ProvAnalysisDetailsLinkProps {
  data: DagProvenanceType;
}

function buildGithubURL(data: DagProvenanceType) {
  const trimmedOrigin = data.origin.replace(/\.git$/, '');
  return 'name' in data ? `${trimmedOrigin}/blob/${data.hash}/${data.name}` : `${trimmedOrigin}/tree/${data.hash}`;
}

function ProvAnalysisDetailsLink({ data }: ProvAnalysisDetailsLinkProps) {
  const githubUrl = buildGithubURL(data);
  return (
    <StyledListItem>
      <FlexOutboundLink href={githubUrl}>
        {githubUrl} <CwlIcon />
      </FlexOutboundLink>
    </StyledListItem>
  );
}

export { buildGithubURL };
export default ProvAnalysisDetailsLink;
