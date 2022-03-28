import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import { DetailPageAlert } from '../style';

function VersionAlert({ uuid }) {
  return (
    <DetailPageAlert severity="warning">
      <span>
        {/* <span> to override "display: flex" which splits this on to multiple lines. */}
        You are viewing an older version of this page. Navigate to the{' '}
        <LightBlueLink href={`/browse/latest/dataset/${uuid}`}>latest version</LightBlueLink>.
      </span>
    </DetailPageAlert>
  );
}

export default VersionAlert;
