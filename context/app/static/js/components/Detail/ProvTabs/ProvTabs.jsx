import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

import { StyledTab, StyledTabs, StyledTabPanel } from './style';
import ProvGraph from '../../ProvGraph';
import ProvTable from '../ProvTable';
import ProvAnalysisDetails from '../ProvAnalysisDetails';

function ProvTabs(props) {
  const { uuid, assayMetadata, provData } = props;
  const { metadata, entity_type, ancestors } = assayMetadata;

  const [open, setOpen] = React.useState(0);
  const handleChange = (event, newValue) => {
    setOpen(newValue);
  };

  const shouldDisplayDag = entity_type === 'Dataset' && metadata && 'dag_provenance_list' in metadata;

  return (
    <Paper>
      <StyledTabs
        variant="standard"
        value={open}
        onChange={handleChange}
        aria-label="Detail View Tabs"
        TabIndicatorProps={{ style: { backgroundColor: '#9CB965' } }}
      >
        <StyledTab label="Table" id="tab-0" aria-controls="tabpanel-0" />
        <StyledTab label="Graph" id="tab-1" aria-controls="tabpanel-1" />
        {shouldDisplayDag && <StyledTab label="Analysis Details" id="tab-2" aria-controls="tabpanel-2" />}
      </StyledTabs>
      <StyledTabPanel value={open} index={0} pad={1}>
        <ProvTable
          provData={provData}
          uuid={uuid}
          entity_type={entity_type}
          typesToSplit={['Donor', 'Sample', 'Dataset']}
          ancestors={ancestors}
          assayMetadata={assayMetadata}
        />
      </StyledTabPanel>
      <StyledTabPanel value={open} index={1}>
        <span id="prov-vis-react">
          <ProvGraph provData={provData} />
        </span>
      </StyledTabPanel>
      <StyledTabPanel value={open} index={2} pad={1}>
        {shouldDisplayDag && (
          <ProvAnalysisDetails dagListData={metadata.dag_provenance_list} dagData={metadata.dag_provenance} />
        )}
      </StyledTabPanel>
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
