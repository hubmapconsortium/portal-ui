import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { StyledTab, StyledTabs, StyledTabPanel } from './style';
import ProvGraph from '../ProvGraph';
import ProvTable from '../ProvTable';
import ProvAnalysisDetails from '../ProvAnalysisDetails';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';
import { readCookie } from '../../../helpers/functions';

function ProvTabs(props) {
  const { uuid, assayMetadata, entityEndpoint } = props;
  const { metadata, entity_type, ancestors } = assayMetadata;

  const [open, setOpen] = React.useState(0);
  const handleChange = (event, newValue) => {
    setOpen(newValue);
  };

  const shouldDisplayDag = entity_type === 'Dataset' && metadata && 'dag_provenance_list' in metadata;

  const [provData, setProvData] = React.useState(null);
  React.useEffect(() => {
    async function getAndSetProvData() {
      const nexus_token = readCookie('nexus_token');
      const requestInit = nexus_token
        ? {
            headers: {
              Authorization: `Bearer ${nexus_token}`,
            },
          }
        : {};
      const response = await fetch(`${entityEndpoint}/entities/${uuid}/provenance`, requestInit);
      if (!response.ok) {
        console.error('Prov API failed', response);
        return;
      }
      const responseProvData = await response.json();
      setProvData(responseProvData);
    }
    getAndSetProvData();
  }, [entityEndpoint, uuid]);

  return (
    <SectionContainer id="provenance">
      <SectionHeader>Provenance</SectionHeader>
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
        {provData && (
          <>
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
          </>
        )}
      </Paper>
    </SectionContainer>
  );
}

ProvTabs.propTypes = {
  uuid: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assayMetadata: PropTypes.object.isRequired,
  entityEndpoint: PropTypes.string.isRequired,
};

export default ProvTabs;
