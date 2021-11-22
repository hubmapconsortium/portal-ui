import React from 'react';
import PropTypes from 'prop-types';

import { CwlIcon, FlexOutboundLink, PrimaryTextDivider, StyledListItem } from './style';

function ProvAnalysisDetailsLink(props) {
  const { data } = props;

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

ProvAnalysisDetailsLink.propTypes = {
  data: PropTypes.shape({
    hash: PropTypes.string,
    name: PropTypes.string,
    origin: PropTypes.string,
  }).isRequired,
};

export default ProvAnalysisDetailsLink;
