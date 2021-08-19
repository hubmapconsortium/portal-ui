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
  const { uuid, hubmap_id } = props;
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
          if (response.status === 403) {
            // eslint-disable-next-line no-console
            console.info('No error: 403 is an expected API response');
          } else {
            console.error('Entities API failed', response);
          }
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
        <GlobusLinkMessage statusCode={statusCode} url={url} hubmap_id={hubmap_id} />
      </DetailSectionPaper>
    </MarginTopDiv>
  );
}

GlobusLink.propTypes = {
  uuid: PropTypes.string.isRequired,
  hubmap_id: PropTypes.string.isRequired,
};

export default GlobusLink;
