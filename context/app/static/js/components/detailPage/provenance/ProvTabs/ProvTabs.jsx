import React, { useContext } from 'react';

import Paper from '@material-ui/core/Paper';

import { FlaskDataContext } from 'js/components/App';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tabs';
import ProvGraph from '../ProvGraph';
import ProvTable from '../ProvTable';
import ProvAnalysisDetails from '../ProvAnalysisDetails';
import { hasDataTypes } from './utils';

function ProvTabs({ provData }) {
  const { entity } = useContext(FlaskDataContext);
  const assayMetadata = entity;

  const { uuid, metadata, entity_type, ancestors, data_types } = assayMetadata;

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
        {shouldDisplayTable && <Tab label="Table" index={0} />}
        <Tab label="Graph" index={graphIndex} />
        {shouldDisplayDag && <Tab label="Analysis Details" index={dagIndex} />}
      </Tabs>
      {shouldDisplayTable && (
        <TabPanel value={open} index={0} pad={1}>
          <ProvTable uuid={uuid} ancestors={ancestors} assayMetadata={assayMetadata} />
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

export default ProvTabs;
