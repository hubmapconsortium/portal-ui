import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@material-ui/core';
import { readCookie } from '../../../helpers/functions';
import { StyledButton } from './style';

function GlobusLink(props) {
  const { uuid, entityEndpoint, fileBrowserDisplayed } = props;
  const [globusUrlText, setGlobusUrlText] = React.useState({ url: null, text: 'Please wait...' });
  React.useEffect(() => {
    async function getAndSetGlobusUrlText() {
      const response = await fetch(`${entityEndpoint}/entities/dataset/globus-url/${uuid}`, {
        headers: {
          Authorization: `Bearer ${readCookie('nexus_token')}`,
        },
      });
      if (!response.ok) {
        console.error('Entities API failed', response);
        setGlobusUrlText({ url: null, text: `Globus File Browser: ${response.status}: ${response.statusText}` });
        return;
      }
      const responseGlobusUrl = await response.text();
      setGlobusUrlText({ url: responseGlobusUrl, text: 'Download from Globus' });
    }
    getAndSetGlobusUrlText();
  }, [entityEndpoint, uuid]);

  const { url, text } = globusUrlText;
  return url ? (
    <StyledButton $fileBrowserDisplayed={fileBrowserDisplayed}>
      <Link href={url}>{text}</Link>
    </StyledButton>
  ) : (
    text
  );
}

GlobusLink.propTypes = {
  entityEndpoint: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default GlobusLink;
