import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

import Tabs from 'js/shared-styles/tabs/Tabs';
import TabPanel from 'js/shared-styles/tabs/TabPanel';
import { StyledTab } from './style';
import ProvGraph from '../ProvGraph';
import ProvTable from '../ProvTable';
import ProvAnalysisDetails from '../ProvAnalysisDetails';
import { hasDataTypes } from './utils';

function ProvTabs(props) {
  const { uuid, assayMetadata, provData } = props;
  const { metadata, entity_type, ancestors, data_types } = assayMetadata;

  const [open, setOpen] = React.useState(0);
  const handleChange = (event, newValue) => {
    setOpen(newValue);
  };

  const shouldDisplayTable = !hasDataTypes(data_types, [
    'sc_rna_seq_snare_lab',
    'sc_atac_seq_snare_lab',
    'TMT-LC-MS',
    'salmon_rnaseq_snareseq',
  ]);
  const shouldDisplayDag = entity_type === 'Dataset' && metadata && 'dag_provenance_list' in metadata;

  const graphIndex = shouldDisplayTable ? 1 : 0;
  const dagIndex = graphIndex + 1;

  return (
    <Paper>
      <Tabs value={open} onChange={handleChange} aria-label="Detail View Tabs">
        {shouldDisplayTable && <StyledTab label="Table" id="tab-table" aria-controls="tabpanel-table" />}
        <StyledTab label="Graph" id="tab-graph" aria-controls="tabpanel-graph" />
        {shouldDisplayDag && (
          <StyledTab label="Analysis Details" id="tab-analysis-details" aria-controls="tabpanel-analysis-details" />
        )}
      </Tabs>
      {shouldDisplayTable && (
        <TabPanel value={open} index={0} pad={1}>
          <ProvTable
            uuid={uuid}
            typesToSplit={['Donor', 'Sample', 'Dataset', 'Support']}
            ancestors={ancestors}
            assayMetadata={assayMetadata}
          />
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
