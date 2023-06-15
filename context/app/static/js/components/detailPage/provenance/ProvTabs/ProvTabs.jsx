import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

import { Tabs, Tab, TabPanel } from 'js/shared-styles/tabs';
import ProvGraph from '../ProvGraph';
import ProvTable from '../ProvTable';
import ProvAnalysisDetails from '../ProvAnalysisDetails';
import { hasDataTypes } from './utils';

function ProvTabs({ uuid, assayMetadata, provData }) {
  const { metadata, entity_type, ancestors, data_types } = assayMetadata;

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

ProvTabs.propTypes = {
  uuid: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assayMetadata: PropTypes.object.isRequired,
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ProvTabs;
