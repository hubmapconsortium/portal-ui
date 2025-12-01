import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { useEventCallback } from '@mui/material/utils';

import { useFlaskDataContext } from 'js/components/Contexts';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tabs';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useProvenanceStore } from '../ProvContext';
import useProvData from '../hooks';
import ProvGraph from '../ProvGraph';
import ProvTable from '../ProvTable';
import LargeGraphWarning from '../LargeGraphWarning';
import { hasDataTypes } from './utils';
import { filterTabsToDisplay } from './filterTabsToDisplay';
import ProvGraphErrorBoundary from '../ProvGraph/ProvGraphErrorBoundary';

const availableTabDetails = {
  table: { label: 'Table', 'data-testid': 'prov-table-tab' },
  graph: { label: 'Graph', 'data-testid': 'prov-graph-tab' },
};

const LARGE_GRAPH_THRESHOLD = 400;

function ProvTabs() {
  const {
    entity: { uuid, entity_type, data_types },
  } = useFlaskDataContext();

  const uuids = useProvenanceStore((state) => state.uuids);
  const { provData } = useProvData(uuids);

  const trackEntityPageEvent = useTrackEntityPageEvent();
  const [open, setOpen] = useState(0);
  const [hasConfirmedLargeGraph, setHasConfirmedLargeGraph] = useState(false);

  const entityCount = provData?.entity ? Object.keys(provData.entity).length : 0;
  const isLargeGraph = entityCount > LARGE_GRAPH_THRESHOLD;

  const shouldShowWarning = isLargeGraph && !hasConfirmedLargeGraph && uuids.length === 1;

  const tabsToDisplay = {
    table:
      entity_type !== 'Publication' &&
      !hasDataTypes(data_types as string[], [
        'sc_rna_seq_snare_lab',
        'sc_atac_seq_snare_lab',
        'TMT-LC-MS',
        'salmon_rnaseq_snareseq',
      ]),
    graph: Boolean(provData && Object.keys(provData).length > 0),
  };

  const filteredTabs = filterTabsToDisplay({ availableTabDetails, tabsToDisplay });

  const handleChange = useEventCallback((event: unknown, newValue: number) => {
    trackEntityPageEvent({ action: `Provenance / ${filteredTabs[Object.keys(filteredTabs)[newValue]].label} Tab` });
    setOpen(newValue);
  });

  const handleConfirm = useEventCallback(() => {
    setHasConfirmedLargeGraph(true);
    trackEntityPageEvent({ action: 'Provenance / Graph / Large Graph Confirmed' });
  });

  return (
    <Paper>
      <Tabs value={open} onChange={handleChange} aria-label="Provenance Tabs">
        {Object.values(filteredTabs).map(({ label, index, 'data-testid': dataTestID }) => (
          <Tab label={label} index={index} data-testid={dataTestID} key={label} />
        ))}
      </Tabs>
      {filteredTabs?.table && (
        <TabPanel value={open} index={filteredTabs.table.index} pad>
          <ProvTable />
        </TabPanel>
      )}
      {filteredTabs?.graph && (
        <TabPanel value={open} index={filteredTabs.graph.index}>
          <ProvGraphErrorBoundary>
            {shouldShowWarning ? (
              <LargeGraphWarning entityCount={entityCount} onConfirm={handleConfirm} />
            ) : (
              <ProvGraph provData={provData} entity_type={entity_type} uuid={uuid} />
            )}
          </ProvGraphErrorBoundary>
        </TabPanel>
      )}
    </Paper>
  );
}

export default ProvTabs;
