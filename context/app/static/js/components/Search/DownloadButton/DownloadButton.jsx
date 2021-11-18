import React from 'react';
// import ReactGA from 'react-ga';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useSearchViewStore from 'js/stores/useSearchViewStore';
import { createDownloadUrl } from 'js/helpers/functions';
import { StyledButton } from './style';

/*
function sendTsvEvent(event) {
  ReactGA.pageview(event.currentTarget.href);
}
*/

function DownloadButton(props) {
  const { type } = props;
  const lcPluralType = `${type.toLowerCase()}s`;
  const allResultsUUIDs = useSearchViewStore((state) => state.allResultsUUIDs);

  // eslint-disable-next-line consistent-return
  async function fetchAndDownloadTSV() {
    const response = await fetch(`/metadata/v0/${lcPluralType}.tsv`, {
      method: 'POST',
      body: JSON.stringify({ uuids: allResultsUUIDs }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      console.error('Search API failed', response);
      return {};
    }
    const results = await response.blob();

    const downloadUrl = createDownloadUrl(results, 'text/tab-separated-values');
    // need to create link to set file name
    const tempLink = document.createElement('a');
    tempLink.href = downloadUrl;
    tempLink.download = `${lcPluralType}.tsv`;
    tempLink.click();
  }

  return (
    <SecondaryBackgroundTooltip title="Download a TSV of the table metadata. This will not take into account any filtering done on the search page.">
      <StyledButton onClick={fetchAndDownloadTSV} variant="outlined" color="primary">
        Download Metadata
      </StyledButton>
    </SecondaryBackgroundTooltip>
  );
}

export default DownloadButton;
