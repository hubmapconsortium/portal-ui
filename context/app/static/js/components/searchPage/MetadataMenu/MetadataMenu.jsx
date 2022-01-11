import React from 'react';
import ReactGA from 'react-ga';

import { format } from 'date-fns';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';

import { InfoIcon } from 'js/shared-styles/icons';
import useSearchViewStore from 'js/stores/useSearchViewStore';
import { createDownloadUrl } from 'js/helpers/functions';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledButton } from './style';

function MetadataMenu({ type, analyticsCategory }) {
  const lcPluralType = `${type.toLowerCase()}s`;
  const allResultsUUIDs = useSearchViewStore((state) => state.allResultsUUIDs);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
      console.error('Metadata TSV Failed', response);
      return;
    }
    const results = await response.blob();

    const downloadUrl = createDownloadUrl(results, 'text/tab-separated-values');
    // need to create link to set file name
    const tempLink = document.createElement('a');
    tempLink.href = downloadUrl;
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    tempLink.download = `hubmap-${lcPluralType}-metadata-${timestamp}.tsv`;
    tempLink.click();

    ReactGA.event({
      category: analyticsCategory,
      action: `Download Metadata`,
      label: type,
    });
    setAnchorEl(null);
  }

  return (
    <>
      <StyledButton onClick={handleClick} variant="outlined" color="primary" id="metadata-button">
        Metadata
      </StyledButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem>
          <Link href={`/lineup/${lcPluralType}`}>Visualize</Link>
          <SecondaryBackgroundTooltip title="Visualize all available metadata in Lineup." placement="bottom-start">
            <InfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </MenuItem>
        <MenuItem onClick={fetchAndDownloadTSV}>
          Download
          <SecondaryBackgroundTooltip title="Download a TSV of the table metadata." placement="bottom-start">
            <InfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </MenuItem>
      </Menu>
    </>
  );
}

export default MetadataMenu;
