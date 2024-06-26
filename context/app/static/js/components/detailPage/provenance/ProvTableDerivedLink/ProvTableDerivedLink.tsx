import React from 'react';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { LinkButton } from './style';

interface ProvTableDerivedLinkProps {
  uuid: string;
  type: string;
}

function ProvTableDerivedLink({ uuid, type }: ProvTableDerivedLinkProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  return (
    <LinkButton
      href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${type}`}
      onClick={() => trackEntityPageEvent({ action: `Provenance / Table / View Derived ${type}s`, label: uuid })}
    >
      View Derived {type}s
    </LinkButton>
  );
}

export default ProvTableDerivedLink;
