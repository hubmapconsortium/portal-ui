import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { readCookie } from 'js/helpers/functions';
import useAbortableEffect from 'js/hooks/useAbortableEffect';
import { StyledTypography, CenteredDiv, MarginTopDiv, Flex, StyledInfoIcon, StyledSuccessIcon } from './style';
import GlobusLinkMessage from '../GlobusLinkMessage';

function GlobusLink(props) {
  const { uuid, entityEndpoint, display_doi } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [globusUrlStatus, setGlobusUrlStatus] = React.useState({ url: '', statusCode: null });

  useAbortableEffect(
    (status) => {
      async function getAndSetGlobusUrlStatus() {
        const response = await fetch(`${entityEndpoint}/entities/dataset/globus-url/${uuid}`, {
          headers: {
            Authorization: `Bearer ${readCookie('nexus_token')}`,
          },
        });
        if (!response.ok) {
          console.error('Entities API failed', response);
          if (!status.aborted) {
            setGlobusUrlStatus({ url: null, statusCode: response.status });
            setIsLoading(false);
          }
          return;
        }
        const responseGlobusUrl = await response.text();
        if (!status.aborted) {
          setGlobusUrlStatus({ url: responseGlobusUrl, statusCode: response.status });
          setIsLoading(false);
        }
      }
      getAndSetGlobusUrlStatus();
    },
    [entityEndpoint, uuid],
  );

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
          {statusCode === 200 ? (
            <StyledSuccessIcon data-testid="success-icon" />
          ) : (
            <StyledInfoIcon data-testid="info-icon" />
          )}
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
