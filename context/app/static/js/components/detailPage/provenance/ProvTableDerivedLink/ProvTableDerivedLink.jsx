import React from 'react';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { LinkButton } from './style';

function ProvTableDerivedLink({ uuid, type }) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  return (
    <LinkButton
      href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${type}`}
      onClick={() => trackEntityPageEvent({ action: 'Provenance / Table / View Derived' })}
    >
      View Derived {type}s
    </LinkButton>
  );
}

export default ProvTableDerivedLink;
