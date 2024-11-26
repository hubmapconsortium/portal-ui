import React from 'react';
import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';
import useEntityData from 'js/hooks/useEntityData';
import Skeleton from '@mui/material/Skeleton';
import { Filter, filterHasValues, isTermFilter, useSearchStore } from './store';

interface MessageProps {
  label: string;
  arg: string;
}

function EntityMessage({ arg: uuid, label }: MessageProps) {
  const [entity, isLoading] = useEntityData(uuid, ['hubmap_id', 'entity_type', 'mapped_data_types']);
  if (!entity || isLoading) {
    return <Skeleton variant="text" />;
  }
  const { entity_type, hubmap_id } = entity;
  const lcType = entity_type.toLowerCase();
  const dataTypes = (entity?.mapped_data_types ?? []).join('/');
  return (
    <>
      {`${label} ${dataTypes} ${lcType} `}
      <InternalLink href={`/browse/${lcType}/${uuid}`}>{hubmap_id}</InternalLink>
    </>
  );
}

/*
function CellTypeMessage({ arg: cellType, label }: MessageProps) {
  return (
    <>
      {label} {cellType}
    </>
  );
}
*/

function getUUID(filter: Filter) {
  if (!isTermFilter(filter)) {
    return '';
  }

  const values = [...filter.values];

  return values.length > 0 ? values[0] : '';
}

const paramNotes = [
  { filter: 'ancestor_ids', label: 'Derived from', Component: EntityMessage },
  { filter: 'descendant_ids', label: 'Ancestor of', Component: EntityMessage },
];

function SearchNote() {
  const filters = useSearchStore((state) => state.filters);
  const notesToDisplay = paramNotes.filter(
    ({ filter }) => filters?.[filter] && filterHasValues({ filter: filters?.[filter] }),
  );

  if (notesToDisplay.length === 0) {
    return null;
  }

  return (
    <Typography component="h2">
      {notesToDisplay.map(({ filter, label, Component }) => (
        <Component key={filter} arg={getUUID(filters?.[filter])} label={label} />
      ))}
    </Typography>
  );
}

export default SearchNote;
