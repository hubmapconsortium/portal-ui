import React from 'react';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import { StyledButton } from './style';

function DownloadButton(props) {
  const { type } = props;
  const lcPluralType = `${type.toLowerCase()}s`;
  return (
    <SecondaryBackgroundTooltip title="Download a TSV of the table metadata. This will not take into account any filtering done on the search page.">
      <StyledButton href={`/api/v0/${lcPluralType}.tsv`} target="_blank" component="a">
        Download Metadata
      </StyledButton>
    </SecondaryBackgroundTooltip>
  );
}

export default DownloadButton;
