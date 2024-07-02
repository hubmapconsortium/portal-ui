import React from 'react';
import Paper from '@mui/material/Paper';
import { useFlaskDataContext } from 'js/components/Contexts';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tabs';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import MultiAssayProvenance from 'js/components/detailPage/multi-assay/MultiAssayProvenance';
import ProvGraph from '../ProvGraph';
import ProvTable from '../ProvTable';
import ProvAnalysisDetails from '../ProvAnalysisDetails';
import { hasDataTypes } from './utils';
import { filterTabsToDisplay } from './filterTabsToDisplay';
import { ProvData } from '../types';

const availableTabDetails = {
  multi: { label: 'Multi-Assay', 'data-testid': 'multi-prov-tab' },
  table: { label: 'Table', 'data-testid': 'prov-table-tab' },
  graph: { label: 'Graph', 'data-testid': 'prov-graph-tab' },
  dag: { label: 'Analysis Details', 'data-testid': 'prov-dag-tab' },
};

interface ProvTabsProps {
  provData: ProvData;
}

function ProvTabs({ provData }: ProvTabsProps) {
  const {
    entity: { uuid, metadata, entity_type, data_types, assay_modality },
  } = useFlaskDataContext();

  const trackEntityPageEvent = useTrackEntityPageEvent();
  const [open, setOpen] = React.useState(0);

  const tabsToDisplay = {
    multi: assay_modality === 'multiple',
    table:
      entity_type !== 'Publication' &&
      !hasDataTypes(data_types, [
        'sc_rna_seq_snare_lab',
        'sc_atac_seq_snare_lab',
        'TMT-LC-MS',
        'salmon_rnaseq_snareseq',
      ]),
    graph: true,
    dag: ['Dataset', 'Support'].includes(entity_type) && metadata && 'dag_provenance_list' in metadata,
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
      {filteredTabs?.multi && (
        <TabPanel value={open} index={filteredTabs.multi.index}>
          <MultiAssayProvenance />
        </TabPanel>
      )}
      {filteredTabs?.table && (
        <TabPanel value={open} index={filteredTabs.table.index} pad>
          <ProvTable />
        </TabPanel>
      )}
      <TabPanel value={open} index={filteredTabs.graph.index}>
        <ProvGraph provData={provData} entity_type={entity_type} uuid={uuid} />
      </TabPanel>
      {filteredTabs?.dag && (
        <TabPanel value={open} index={filteredTabs.dag.index} pad>
          <ProvAnalysisDetails dagListData={metadata.dag_provenance_list} />
        </TabPanel>
      )}
    </Paper>
  );
}

// ProvTabs.propTypes = {};

export default ProvTabs;
