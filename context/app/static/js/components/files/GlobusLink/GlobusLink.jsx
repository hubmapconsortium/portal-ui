import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AppContext } from 'js/components/Providers';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { getAuthHeader } from 'js/helpers/functions';
import useAbortableEffect from 'js/hooks/useAbortableEffect';
import { StyledTypography, CenteredDiv, MarginTopDiv, Flex, StyledErrorIcon, StyledSuccessIcon } from './style';
import GlobusLinkMessage from '../GlobusLinkMessage';

function GlobusLink(props) {
  const { uuid, display_doi } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [globusUrlStatus, setGlobusUrlStatus] = React.useState({ url: '', statusCode: null });

  const { entityEndpoint, nexusToken } = useContext(AppContext);

  const requestHeaders = getAuthHeader(nexusToken);
  useAbortableEffect(
    (status) => {
      async function getAndSetGlobusUrlStatus() {
        const response = await fetch(`${entityEndpoint}/entities/dataset/globus-url/${uuid}`, {
          headers: requestHeaders,
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
          {statusCode === 200 ? (
            <StyledSuccessIcon data-testid="success-icon" />
          ) : (
            <StyledErrorIcon data-testid="error-icon" />
          )}
          <StyledTypography variant="h6">Bulk Data Transfer</StyledTypography>
        </Flex>
        <GlobusLinkMessage statusCode={statusCode} url={url} display_doi={display_doi} />
      </DetailSectionPaper>
    </MarginTopDiv>
  );
}

GlobusLink.propTypes = {
  uuid: PropTypes.string.isRequired,
  display_doi: PropTypes.string.isRequired,
};

export default GlobusLink;
