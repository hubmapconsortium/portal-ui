import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useAppContext, useFlaskDataContext, useFilesContext } from 'js/components/Contexts';

import { getAuthHeader } from 'js/helpers/functions';
import useAbortableEffect from 'js/hooks/useAbortableEffect';
import { StyledExternalLinkIcon } from './style';
import FilesConditionalLink from './FilesConditionalLink';

function GlobusLink() {
  const [globusUrlStatus, setGlobusUrlStatus] = React.useState({ url: '', statusCode: null });

  const {
    entity: { hubmap_id, uuid },
  } = useFlaskDataContext();

  const { hasAgreedToDUA, openDUA } = useFilesContext();
  const { entityEndpoint, groupsToken } = useAppContext();

  const requestHeaders = getAuthHeader(groupsToken);

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
          }
          return;
        }
        const responseGlobusUrl = await response.text();
        if (!status.aborted) {
          setGlobusUrlStatus({ url: responseGlobusUrl, statusCode: response.status });
        }
      }
      getAndSetGlobusUrlStatus();
    },
    [entityEndpoint, uuid],
  );

  const { statusCode, url } = globusUrlStatus;

  return statusCode ? (
    <Paper>
      {hubmap_id}
      <FilesConditionalLink href={url} hasAgreedToDUA={hasAgreedToDUA} openDUA={() => openDUA(url)} variant="body2">
        Globus <StyledExternalLinkIcon />
      </FilesConditionalLink>
    </Paper>
  ) : null;
}

export default GlobusLink;
