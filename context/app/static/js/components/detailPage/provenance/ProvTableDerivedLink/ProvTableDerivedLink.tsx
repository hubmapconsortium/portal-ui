import React from 'react';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { buildSearchLink } from 'js/components/search/store';
import { ESEntityType } from 'js/components/types';
import { LinkButton } from './style';

interface ProvTableDerivedLinkProps {
  uuid: string;
  type: ESEntityType;
}

function ProvTableDerivedLink({ uuid, type }: ProvTableDerivedLinkProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();

  if (type === 'Sample' || type === 'Dataset') {
    return (
      <LinkButton
        href={buildSearchLink({
          entity_type: type,
          filters: {
            ancestor_ids: {
              values: [uuid],
              type: 'TERM',
            },
          },
        })}
        onClick={() => trackEntityPageEvent({ action: `Provenance / Table / View Derived ${type}s`, label: uuid })}
      >
        View Derived {type}s
      </LinkButton>
    );
  }
  return null;
}

export default ProvTableDerivedLink;
