import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useFlaskDataContext } from 'js/components/Contexts';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tabs';
import ProvGraph from '../ProvGraph';
import ProvTable from '../ProvTable';
import ProvAnalysisDetails from '../ProvAnalysisDetails';
import { hasDataTypes } from './utils';

function ProvTabs({ provData }) {
  const {
    entity: { uuid, metadata, entity_type, ancestors, data_types },
  } = useFlaskDataContext();

  const [open, setOpen] = React.useState(0);
  const handleChange = (event, newValue) => {
    setOpen(newValue);
  };

  const shouldDisplayTable =
    entity_type !== 'Publication' &&
    !hasDataTypes(data_types, ['sc_rna_seq_snare_lab', 'sc_atac_seq_snare_lab', 'TMT-LC-MS', 'salmon_rnaseq_snareseq']);

  const shouldDisplayDag =
    ['Dataset', 'Support'].includes(entity_type) && metadata && 'dag_provenance_list' in metadata;

  const graphIndex = shouldDisplayTable ? 1 : 0;
  const dagIndex = graphIndex + 1;

  return (
    <Paper>
      <Tabs value={open} onChange={handleChange} aria-label="Provenance Tabs">
        {shouldDisplayTable && <Tab label="Table" index={0} data-testid="prov-table-tab" />}
        <Tab label="Graph" index={graphIndex} data-testid="prov-graph-tab" />
        {shouldDisplayDag && <Tab label="Analysis Details" index={dagIndex} data-testid="prov-dag-tab" />}
      </Tabs>
      {shouldDisplayTable && (
        <TabPanel value={open} index={0} pad={1}>
          <ProvTable uuid={uuid} ancestors={ancestors} />
        </TabPanel>
      )}
      <TabPanel value={open} index={graphIndex}>
        <ProvGraph provData={provData} entity_type={entity_type} uuid={uuid} />
      </TabPanel>
      {shouldDisplayDag && (
        <TabPanel value={open} index={dagIndex} pad={1}>
          <ProvAnalysisDetails dagListData={metadata.dag_provenance_list} dagData={metadata.dag_provenance} />
        </TabPanel>
      )}
    </Paper>
  );
}

// ProvTabs.propTypes = {};

export default ProvTabs;
