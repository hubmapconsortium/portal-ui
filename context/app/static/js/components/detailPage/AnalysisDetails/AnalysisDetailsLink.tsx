import React from 'react';

import { CwlIcon, FlexOutboundLink, PrimaryTextDivider, StyledListItem } from './style';

interface CWLPipelineLink {
  hash: string;
  name: string;
  origin: string;
}

interface IngestPipelineLink {
  hash: string;
  origin: string;
}

interface ProvAnalysisDetailsLinkProps {
  data: CWLPipelineLink | IngestPipelineLink;
}

function ProvAnalysisDetailsLink({ data }: ProvAnalysisDetailsLinkProps) {
  const trimmedOrigin = data.origin.replace(/\.git$/, '');
  const githubUrl =
    'name' in data ? `${trimmedOrigin}/blob/${data.hash}/${data.name}` : `${trimmedOrigin}/tree/${data.hash}`;
  const cwlUrl = `https://view.commonwl.org/workflows/${githubUrl.replace(/^http(s?):\/\//i, '')}`;
  return (
    <StyledListItem>
      <FlexOutboundLink href={githubUrl} variant="body1">
        {githubUrl} <CwlIcon />
      </FlexOutboundLink>
      {'name' in data && (
        <>
          <PrimaryTextDivider orientation="vertical" />
          <FlexOutboundLink href={cwlUrl} variant="body1">
            Open in CWL Viewer
            <CwlIcon />
          </FlexOutboundLink>
        </>
      )}
    </StyledListItem>
  );
}

export default ProvAnalysisDetailsLink;
