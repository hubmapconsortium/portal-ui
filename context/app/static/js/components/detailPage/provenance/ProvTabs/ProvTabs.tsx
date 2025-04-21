import React from 'react';
import Paper from '@mui/material/Paper';
import { useFlaskDataContext } from 'js/components/Contexts';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tabs';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import ProvGraph from '../ProvGraph';
import ProvTable from '../ProvTable';
import { hasDataTypes } from './utils';
import { filterTabsToDisplay } from './filterTabsToDisplay';
import { ProvData } from '../types';
import ProvGraphErrorBoundary from '../ProvGraph/ProvGraphErrorBoundary';

const availableTabDetails = {
  table: { label: 'Table', 'data-testid': 'prov-table-tab' },
  graph: { label: 'Graph', 'data-testid': 'prov-graph-tab' },
};

interface ProvTabsProps {
  provData: ProvData;
}

function ProvTabs({ provData }: ProvTabsProps) {
  const {
    entity: { uuid, entity_type, data_types },
  } = useFlaskDataContext();

  const trackEntityPageEvent = useTrackEntityPageEvent();
  const [open, setOpen] = React.useState(0);

  const tabsToDisplay = {
    table:
      entity_type !== 'Publication' &&
      !hasDataTypes(data_types, [
        'sc_rna_seq_snare_lab',
        'sc_atac_seq_snare_lab',
        'TMT-LC-MS',
        'salmon_rnaseq_snareseq',
      ]),
    graph: provData && Object.keys(provData).length > 0,
  };

  const filteredTabs = filterTabsToDisplay({ availableTabDetails, tabsToDisplay });

  const handleChange = (event: unknown, newValue: number) => {
    trackEntityPageEvent({ action: `Provenance / ${filteredTabs[Object.keys(filteredTabs)[newValue]].label} Tab` });
    setOpen(newValue);
  };

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
            <ProvGraph provData={provData} entity_type={entity_type} uuid={uuid} />
          </ProvGraphErrorBoundary>
        </TabPanel>
      )}
    </Paper>
  );
}

// ProvTabs.propTypes = {};

export default ProvTabs;
