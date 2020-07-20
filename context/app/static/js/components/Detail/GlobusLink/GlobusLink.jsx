import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

import { DetailSectionPaper } from 'shared-styles/surfaces';
import { readCookie } from 'helpers/functions';
import { StyledTypography, CenteredDiv, MarginTopDiv, Flex, StyledInfoIcon, StyledSuccessIcon } from './style';
import GlobusLinkMessage from '../GlobusLinkMessage';

function GlobusLink(props) {
  const { uuid, entityEndpoint, display_doi } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [globusUrlStatus, setGlobusUrlStatus] = React.useState({ url: null, statusCode: null });

  React.useEffect(() => {
    async function getAndSetGlobusUrlStatus() {
      const response = await fetch(`${entityEndpoint}/entities/dataset/globus-url/${uuid}`, {
        headers: {
          Authorization: `Bearer ${readCookie('nexus_token')}`,
        },
      });
      if (!response.ok) {
        console.error('Entities API failed', response);
        setGlobusUrlStatus({ url: null, statusCode: response.status });
        setIsLoading(false);
        return;
      }
      const responseGlobusUrl = await response.text();
      setGlobusUrlStatus({ url: responseGlobusUrl, statusCode: response.status });
      setIsLoading(false);
    }
    getAndSetGlobusUrlStatus();
  }, [entityEndpoint, uuid]);

  const { statusCode, url } = globusUrlStatus;

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
        <GlobusLinkMessage statusCode={statusCode} url={url} display_doi={display_doi} />
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
