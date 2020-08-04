import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import { CwlIcon, FlexLightBlueLink, StyledSpan } from './style';

function ProvAnalysisDetailsLink(props) {
  const { data } = props;

  const trimmedOrigin = data.origin.split('.').slice(0, -1).join('.');
  const githubUrl =
    'name' in data ? `${trimmedOrigin}/blob/${data.hash}/${data.name}` : `${trimmedOrigin}/tree/${data.hash}`;
  const cwlUrl = `https://view.commonwl.org/workflows/${githubUrl.replace(/^http(s?):\/\//i, '')}`;
  return (
    <>
      <LightBlueLink href={githubUrl} target="_blank" rel="noopener noreferrer">
        {githubUrl}
      </LightBlueLink>
      {'name' in data && (
        <>
          <StyledSpan>: Open in</StyledSpan>
          <FlexLightBlueLink href={cwlUrl} target="_blank" rel="noopener noreferrer">
            CWL Viewer <CwlIcon />
          </FlexLightBlueLink>
        </>
      )}
    </>
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
