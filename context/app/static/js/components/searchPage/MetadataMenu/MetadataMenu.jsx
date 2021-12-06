import React from 'react';
import ReactGA from 'react-ga';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import { createDownloadUrl } from 'js/helpers/functions';
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
    tempLink.download = `${lcPluralType}.tsv`;
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
        id="metadata-menu"
        MenuListProps={{
          'aria-labelledby': 'metadata-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <Link href={`/lineup/${lcPluralType}`}>Visualize</Link>
        </MenuItem>
        <MenuItem onClick={fetchAndDownloadTSV}>Download</MenuItem>
      </Menu>
    </>
  );
}

export default MetadataMenu;
