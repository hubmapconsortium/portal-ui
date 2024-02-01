import React from 'react';

import { LinkButton } from './style';

function ProvTableDerivedLink({ uuid, type, trackEntityPageEvent }) {
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
