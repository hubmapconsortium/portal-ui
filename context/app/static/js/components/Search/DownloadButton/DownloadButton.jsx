import React from 'react';
import ReactGA from 'react-ga';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import { StyledButton } from './style';

function sendTsvEvent(event) {
  ReactGA.pageview(event.currentTarget.href);
}

function DownloadButton(props) {
  const { type } = props;
  const lcPluralType = `${type.toLowerCase()}s`;
  return (
    <SecondaryBackgroundTooltip title="Download a TSV of the table metadata. This will not take into account any filtering done on the search page.">
      <StyledButton
        href={`/api/v0/${lcPluralType}.tsv`}
        target="_blank"
        component="a"
        onClick={sendTsvEvent}
        variant="outlined"
        color="primary"
      >
        Download Metadata
      </StyledButton>
    </SecondaryBackgroundTooltip>
  );
}

export default DownloadButton;
