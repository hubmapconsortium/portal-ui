import React from 'react';
import PropTypes from 'prop-types';

import { CwlIcon, FlexLightBlueLink, PrimaryTextDivider, StyledListItem } from './style';

function ProvAnalysisDetailsLink(props) {
  const { data } = props;

  const trimmedOrigin = data.origin.replace(/\.git$/, '');
  const githubUrl =
    'name' in data ? `${trimmedOrigin}/blob/${data.hash}/${data.name}` : `${trimmedOrigin}/tree/${data.hash}`;
  const cwlUrl = `https://view.commonwl.org/workflows/${githubUrl.replace(/^http(s?):\/\//i, '')}`;
  return (
    <StyledListItem>
      <FlexLightBlueLink href={githubUrl} target="_blank" rel="noopener noreferrer">
        {githubUrl} <CwlIcon />
      </FlexLightBlueLink>
      {'name' in data && (
        <>
          <PrimaryTextDivider orientation="vertical" />
          <FlexLightBlueLink href={cwlUrl} target="_blank" rel="noopener noreferrer">
            Open in CWL Viewer
            <CwlIcon />
          </FlexLightBlueLink>
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
