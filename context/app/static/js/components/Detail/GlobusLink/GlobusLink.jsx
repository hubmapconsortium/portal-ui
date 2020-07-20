import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { DetailSectionPaper } from 'shared-styles/surfaces';
import { readCookie } from 'helpers/functions';
import { StyledTypography, CenteredDiv, MarginTopDiv, Flex, StyledInfoIcon, StyledSuccessIcon } from './style';
import GlobusLinkMessage from '../GlobusLinkMessage';

function GlobusLink(props) {
  const { uuid, entityEndpoint, display_doi } = props;
  const [isLoading, setLoading] = React.useState(true);
  const [globusUrlText, setGlobusUrlText] = React.useState({ url: null, statusCode: null });

  React.useEffect(() => {
    async function getAndSetGlobusUrlText() {
      const response = await fetch(`${entityEndpoint}/entities/dataset/globus-url/${uuid}`, {
        headers: {
          Authorization: `Bearer ${readCookie('nexus_token')}`,
        },
      });
      if (!response.ok) {
        console.error('Entities API failed', response);
        setGlobusUrlText({ url: null, statusCode: response.status });
        return;
      }
      const responseGlobusUrl = await response.text();
      setGlobusUrlText({ url: responseGlobusUrl, statusCode: response.status });
    }
    getAndSetGlobusUrlText();
    setLoading(false);
  }, [entityEndpoint, uuid]);

  const { statusCode, url } = globusUrlText;

  return isLoading ? (
    <CenteredDiv>
      <CircularProgress />
    </CenteredDiv>
  ) : (
    <MarginTopDiv>
      <DetailSectionPaper>
        <Flex>
          <StyledTypography variant="h6">Bulk Data Transfer</StyledTypography>
          {statusCode === 200 ? <StyledSuccessIcon /> : <StyledInfoIcon />}
        </Flex>
        <Typography variant="body2">
          <GlobusLinkMessage statusCode={statusCode} url={url} display_doi={display_doi} />
        </Typography>
      </DetailSectionPaper>
    </MarginTopDiv>
  );
}

GlobusLink.propTypes = {
  entityEndpoint: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  display_doi: PropTypes.string.isRequired,
};

export default GlobusLink;
