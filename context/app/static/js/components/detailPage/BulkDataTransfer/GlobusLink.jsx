import React from 'react';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { getAuthHeader } from 'js/helpers/functions';
import useAbortableEffect from 'js/hooks/useAbortableEffect';
import { useAppContext, useFlaskDataContext, useFilesContext } from 'js/components/Contexts';
import FilesConditionalLink from './FilesConditionalLink';
import { StyledExternalLinkIcon } from './style';

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
    <DetailSectionPaper>
      <FilesConditionalLink href={url} hasAgreedToDUA={hasAgreedToDUA} openDUA={() => openDUA(url)} variant="body2">
        {hubmap_id} Globus <StyledExternalLinkIcon />
      </FilesConditionalLink>
    </DetailSectionPaper>
  ) : null;
}

export default GlobusLink;
