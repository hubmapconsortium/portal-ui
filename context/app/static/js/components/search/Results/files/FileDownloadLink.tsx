import React, { useCallback } from 'react';

import { useAppContext } from 'js/components/Contexts';
import { getTokenParam } from 'js/helpers/functions';
import { formatFileLink } from 'js/components/detailPage/files/DataProducts/hooks';
import FilesConditionalLink from 'js/components/detailPage/BulkDataTransfer/FilesConditionalLink';
import { useFilesSearchDUA } from './FilesSearchDUA';

/**
 * Links a file to its download on the assets service, behind the Data Use Agreement.
 *
 * `useFileLink` can't be reused: it takes the dataset uuid from the Flask entity context, which
 * only exists on a dataset detail page. The URL builder itself is shared.
 */
function FileDownloadLink({
  datasetUuid,
  relPath,
  dataAccessLevel = 'public',
  label,
}: {
  datasetUuid: string;
  relPath: string;
  dataAccessLevel?: string;
  label?: string;
}) {
  const { assetsEndpoint, groupsToken } = useAppContext();
  const { hasAgreed, requestFile } = useFilesSearchDUA();

  const href = formatFileLink(assetsEndpoint, datasetUuid, relPath, getTokenParam(groupsToken));

  const openDUA = useCallback(() => {
    requestFile(href, dataAccessLevel);
  }, [requestFile, href, dataAccessLevel]);

  return (
    <FilesConditionalLink
      href={href}
      hasAgreedToDUA={hasAgreed(dataAccessLevel)}
      openDUA={openDUA}
      variant="body2"
      download
      fileName={label ?? relPath}
      onClick={() => {}}
    />
  );
}

export default FileDownloadLink;
