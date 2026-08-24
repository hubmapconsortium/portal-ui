import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import { useInitialHashContext } from 'js/hooks/useInitialHash';
import { InternalLink } from 'js/shared-styles/Links';
import { sharedConfNeedsCredentials } from 'js/components/detailPage/visualization/vitessceTokens';
import { DetailPageAlert } from 'js/components/detailPage/style';

/**
 * Prompts a logged-out visitor to log in when the URL carries a shared visualization config for
 * data they can't read.
 *
 * This deliberately lives in the page's alert band rather than inside the visualization itself. The
 * case it exists for is a shared link to a non-published *descendant* of a published primary
 * dataset: the primary's page is public, so the visitor lands on it, but the descendant's section
 * never renders for them — Elasticsearch returns no hit for a dataset they lack access to. An alert
 * inside the visualization would have nothing to render into.
 *
 * The check reads the URL alone, so it works whether or not the target section exists.
 */
function SharedVisualizationAlert() {
  const { groupsToken } = useAppContext();
  const initialHash = useInitialHashContext();

  if (groupsToken || !sharedConfNeedsCredentials(initialHash ?? '')) {
    return null;
  }

  return (
    <DetailPageAlert severity="info">
      This shared visualization includes data that is not publicly available. Please{' '}
      <InternalLink href="/login">log in</InternalLink> with an account that has access to view it.
    </DetailPageAlert>
  );
}

export default SharedVisualizationAlert;
