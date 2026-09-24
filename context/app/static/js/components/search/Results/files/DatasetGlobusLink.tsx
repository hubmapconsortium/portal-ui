import React, { useCallback } from 'react';
import Typography from '@mui/material/Typography';

import { useFetchProtectedFile } from 'js/components/detailPage/BulkDataTransfer/hooks';
import FilesConditionalLink from 'js/components/detailPage/BulkDataTransfer/FilesConditionalLink';
import { useFilesSearchDUA } from './FilesSearchDUA';

/**
 * Globus transfer link for one dataset's directory.
 *
 * The detail page's `GlobusLink` can't be reused (it depends on the entity page's DUA context and
 * event tracking); the hook that resolves the Globus URL from entity-api is shared.
 *
 * A 403 is an expected answer, not an error: it means this user has no access to the dataset's
 * protected files, so no link is offered.
 */
function DatasetGlobusLink({
  datasetUuid,
  datasetHubmapId,
  dataAccessLevel = 'public',
}: {
  datasetUuid: string;
  datasetHubmapId: string;
  dataAccessLevel?: string;
}) {
  const { status, responseUrl, isLoading } = useFetchProtectedFile(datasetUuid);
  const { hasAgreed, requestFile } = useFilesSearchDUA();

  const openDUA = useCallback(() => {
    if (responseUrl) requestFile(responseUrl, dataAccessLevel);
  }, [responseUrl, requestFile, dataAccessLevel]);

  if (isLoading) {
    return (
      <Typography variant="body2" color="secondary">
        Checking Globus access…
      </Typography>
    );
  }

  if (status === 403 || !responseUrl) {
    return (
      <Typography variant="body2" color="secondary">
        No Globus access to this dataset.
      </Typography>
    );
  }

  return (
    <FilesConditionalLink
      href={responseUrl}
      hasAgreedToDUA={hasAgreed(dataAccessLevel)}
      openDUA={openDUA}
      variant="body2"
      hasIcon
      fileName={`Open ${datasetHubmapId} in Globus`}
      onClick={() => {}}
    />
  );
}

export default DatasetGlobusLink;
