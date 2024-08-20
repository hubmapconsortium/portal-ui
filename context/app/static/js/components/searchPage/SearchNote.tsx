import React from 'react';
import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';
import useEntityData from 'js/hooks/useEntityData';
import Skeleton from '@mui/material/Skeleton';

interface SearchNoteProps {
  params: URLSearchParams;
}

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

function CellTypeMessage({ arg: cellType, label }: MessageProps) {
  return (
    <>
      {label} {cellType}
    </>
  );
}

const paramNotes = [
  { urlSearchParam: 'ancestor_ids[0]', label: 'Derived from', Component: EntityMessage },
  { urlSearchParam: 'descendant_ids[0]', label: 'Ancestor of', Component: EntityMessage },
  { urlSearchParam: 'cell_type', label: 'Datasets containing', Component: CellTypeMessage },
];

function SearchNote({ params }: SearchNoteProps) {
  const notesToDisplay = paramNotes.filter(({ urlSearchParam }) => params.has(urlSearchParam));
  if (notesToDisplay.length === 0) {
    return null;
  }
  return (
    <Typography component="h2">
      {notesToDisplay.map(({ urlSearchParam, label, Component }) => (
        <Component key={urlSearchParam} arg={params.get(urlSearchParam) ?? ''} label={label} />
      ))}
    </Typography>
  );
}

export default SearchNote;
