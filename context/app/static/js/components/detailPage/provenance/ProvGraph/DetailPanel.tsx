import React from 'react';
import Stack from '@mui/material/Stack';

import SectionItem from 'js/components/detailPage/SectionItem';
import { InternalLink } from 'js/shared-styles/Links';
import ShowDerivedEntitiesButton from 'js/components/detailPage/provenance/ShowDerivedEntitiesButton';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { StyledPaper } from './style';
import { ProvData } from '../types';
import { format } from 'date-fns/format';
import Typography from '@mui/material/Typography';

interface DetailPanelProps {
  prov: Record<string, string>;
  timeKey: string;
  uuid: string;
  typeKey: string;
  idKey: string;
  getNameForActivity: (id: string, prov?: ProvData) => string;
  getNameForEntity: (id: string, prov?: ProvData) => string;
}

const entityTypes = ['Donor', 'Sample', 'Dataset', 'Support'];

function Type({ prov, typeKey }: Pick<DetailPanelProps, 'prov' | 'typeKey'>) {
  const content = typeKey in prov ? prov[typeKey] : prov['prov:type'];
  return <SectionItem label="Type">{content}</SectionItem>;
}

function ID({ prov, idKey, typeKey }: Pick<DetailPanelProps, 'prov' | 'idKey' | 'typeKey'>) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  if (!(typeKey in prov) || !entityTypes.includes(prov[typeKey])) {
    return null;
  }
  return (
    <SectionItem label="ID" ml>
      <InternalLink
        href={`/browse/${prov[typeKey].toLowerCase()}/${prov['hubmap:uuid']}`}
        onClick={() => {
          trackEntityPageEvent({ action: 'Provenance / Graph / Link', label: prov[idKey] });
        }}
      >
        {prov[idKey]}
      </InternalLink>
    </SectionItem>
  );
}

function Created({ prov, timeKey }: Pick<DetailPanelProps, 'prov' | 'timeKey'>) {
  if (timeKey in prov) {
    const date = new Date(prov[timeKey]);
    const formattedDate = format(date, 'Pp');
    return (
      <SectionItem label="Created" ml>
        {formattedDate}
      </SectionItem>
    );
  }
  return null;
}

function Actions({ idKey, typeKey, getNameForActivity, getNameForEntity, prov }: DetailPanelProps) {
  if (typeKey in prov && entityTypes.includes(prov[typeKey])) {
    return (
      <SectionItem ml>
        <ShowDerivedEntitiesButton
          id={prov[idKey]}
          getNameForActivity={getNameForActivity}
          getNameForEntity={getNameForEntity}
        />
      </SectionItem>
    );
  }
  return null;
}

export default function DetailPanel({ uuid, timeKey, idKey, prov, typeKey, ...actions }: DetailPanelProps) {
  const isCurrentEntity = uuid === prov['hubmap:uuid'];

  return (
    <StyledPaper>
      <Stack direction="row">
        <Type typeKey={typeKey} prov={prov} />
        <ID typeKey={typeKey} idKey={idKey} prov={prov} />
        <Created timeKey={timeKey} prov={prov} />
        <Actions uuid={uuid} prov={prov} typeKey={typeKey} idKey={idKey} timeKey={timeKey} {...actions} />
      </Stack>
      <Typography variant="caption" visibility={isCurrentEntity ? 'visible' : 'hidden'}>
        ✻ Indicates Current Entity Node
      </Typography>
    </StyledPaper>
  );
}
