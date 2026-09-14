import React, { useMemo } from 'react';

import { useAppContext } from 'js/components/Contexts';
import { useInitialHashContext } from 'js/hooks/useInitialHash';
import { useDatasetsAccess } from 'js/hooks/useDatasetPermissions';
import { InternalLink } from 'js/shared-styles/Links';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import {
  sharedConfDatasetUuids,
  sharedConfNeedsCredentials,
} from 'js/components/detailPage/visualization/vitessceTokens';
import { DetailPageAlert } from 'js/components/detailPage/style';

const NO_UUIDS: string[] = [];

/**
 * Explains why a shared visualization will not load, when the reason is that the viewer can't read
 * the data it references.
 *
 * This deliberately lives in the page's alert band rather than inside the visualization itself. The
 * case it exists for is a shared link to a non-published *descendant* of a published primary
 * dataset: the primary's page is public, so the visitor lands on it, but the descendant's section
 * never renders for anyone without access — Elasticsearch returns no hit for it. An alert inside the
 * visualization would have nothing to render into. Even where the section does render, the failure
 * is otherwise silent, because `handleWarning` in Visualization.tsx suppresses the resulting 401s.
 */
function SharedVisualizationAlert() {
  const { groupsToken } = useAppContext();
  const initialHash = useInitialHashContext() ?? '';

  const needsCredentials = useMemo(() => sharedConfNeedsCredentials(initialHash), [initialHash]);

  // Only look up permissions when the answer could change what we render: the link references
  // non-public data, and the viewer has a token that might grant access. An empty list makes
  // `useDatasetsAccess` skip the request entirely.
  const uuids = useMemo(
    () => (needsCredentials && groupsToken ? sharedConfDatasetUuids(initialHash) : NO_UUIDS),
    [needsCredentials, groupsToken, initialHash],
  );
  const { accessibleDatasets, isLoading } = useDatasetsAccess(uuids);

  // Test explicitly against `false` rather than truthiness: ids the permissions API doesn't
  // recognize come back with no `access_allowed` at all, and a failed request leaves the map empty.
  // Neither should be reported to the viewer as a permissions problem.
  const isDenied = uuids.some((uuid) => accessibleDatasets[uuid]?.access_allowed === false);

  if (!needsCredentials) {
    return null;
  }

  // `DetailPageAlert` only sets a bottom margin, and the alerts above this one are all conditional —
  // so this is usually the first thing under the entity header and needs its own top margin.
  if (!groupsToken) {
    return (
      <DetailPageAlert severity="info" sx={{ mt: 2 }}>
        This shared visualization includes data that is not publicly available. Please{' '}
        <InternalLink href="/login">log in</InternalLink> with an account that has access to view it.
      </DetailPageAlert>
    );
  }

  if (isLoading || !isDenied) {
    return null;
  }

  return (
    <DetailPageAlert severity="warning" sx={{ mt: 2 }}>
      This shared visualization includes data that your account does not have access to, so it may not display
      completely. <ContactUsLink variant="body2" /> with the dataset ID if you believe you should have access.
    </DetailPageAlert>
  );
}

export default SharedVisualizationAlert;
