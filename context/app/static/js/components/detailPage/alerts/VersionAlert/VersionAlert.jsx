import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import { Alert } from 'js/shared-styles/alerts';

function VersionAlert({ uuid }) {
  return (
    <Alert severity="warning" $marginBottom="16">
      <span>
        {/* <span> to override "display: flex" which splits this on to multiple lines. */}
        You are viewing an older version of this page. Navigate to the{' '}
        <LightBlueLink href={`/browse/latest/dataset/${uuid}`}>latest version</LightBlueLink>.
      </span>
    </Alert>
  );
}

export default VersionAlert;
