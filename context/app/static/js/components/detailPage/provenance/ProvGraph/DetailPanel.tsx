import React from 'react';
import Stack from '@mui/material/Stack';

import SectionItem from 'js/components/detailPage/SectionItem';
import { InternalLink } from 'js/shared-styles/Links';
import ShowDerivedEntitiesButton from 'js/components/detailPage/provenance/ShowDerivedEntitiesButton';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { StyledPaper, StyledTypography } from './style';
import '@hms-dbmi-bgm/react-workflow-viz/dist/react-workflow-viz.min.css';
import { ProvData } from './types';

interface DetailPanelProps {
  prov: Record<string, string>;
  // eslint-disable-next-line react/no-unused-prop-types
  timeKey: string;
  // eslint-disable-next-line react/no-unused-prop-types
  uuid: string;
  typeKey: string;
  idKey: string;
  getNameForActivity: (id: string, prov: ProvData) => string;
  getNameForEntity: (id: string, prov: ProvData) => string;
}

const entityTypes = ['Donor', 'Sample', 'Dataset', 'Support'];

function Type({ prov, typeKey }: Pick<DetailPanelProps, 'prov' | 'typeKey'>) {
  return typeKey in prov ? (
    <SectionItem label="Type">{prov[typeKey]}</SectionItem>
  ) : (
    <SectionItem label="Type">{prov['prov:type']}</SectionItem>
  );
}

function ID({ prov, idKey, typeKey }: Pick<DetailPanelProps, 'prov' | 'idKey' | 'typeKey'>) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  if (typeKey in prov && entityTypes.includes(prov[typeKey])) {
    return (
      <SectionItem label="ID" ml>
        <InternalLink
          href={`/browse/${prov[typeKey].toLowerCase()}/${prov['hubmap:uuid']}`}
          onClick={() => trackEntityPageEvent({ action: 'Provenance / Graph / Link', label: prov[idKey] })}
        >
          {prov[idKey]}
        </InternalLink>
      </SectionItem>
    );
  }
  return null;
}

function Created({ prov, timeKey }: Pick<DetailPanelProps, 'prov' | 'timeKey'>) {
  if (timeKey in prov) {
    return (
      <SectionItem label="Created" ml>
        {prov[timeKey]}
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
  return (
    <StyledPaper>
      <Stack direction="row">
        <Type typeKey={typeKey} prov={prov} />
        <ID typeKey={typeKey} idKey={idKey} prov={prov} />
        <Created timeKey={timeKey} prov={prov} />
        <Actions uuid={uuid} prov={prov} typeKey={typeKey} idKey={idKey} timeKey={timeKey} {...actions} />
      </Stack>
      {uuid === prov['hubmap:uuid'] && <StyledTypography>* Indicates Current Entity Node</StyledTypography>}
    </StyledPaper>
  );
}
