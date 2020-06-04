/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ProvGraph from './ProvGraph';
import ProvTable from './ProvTable';
import DagProv from './DagProv';
import { useStyles } from '../../styles';
import SectionHeader from './SectionHeader';
import SectionContainer from './SectionContainer';
import { readCookie } from '../../helpers/functions';

const StyledTab = styled(Tab)`
  min-height: 72px;
`;

const StyledTabs = styled(Tabs)`
  box-shadow: '0px 1px 10px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14)';
  background-color: ${(props) => props.theme.palette.primary.main};
  color: #ffffff;
`;

const PaddedBox = styled(Box)`
  padding: ${(props) => (props.$pad ? '30px 40px' : '0px')};
`;

function TabPanel(props) {
  const { children, value, index, className, boxClasses, pad } = props;
  return (
    <Typography
      className={className}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <PaddedBox $pad={pad} className={boxClasses}>
          {children}
        </PaddedBox>
      )}
    </Typography>
  );
}

const StyledTabPanel = styled(TabPanel)`
  width: 100%;
`;

function ProvTabs(props) {
  const { uuid, assayMetadata, entityEndpoint } = props;
  const { metadata, entity_type } = assayMetadata;
  const classes = useStyles();

  const [open, setOpen] = React.useState(0);
  const handleChange = (event, newValue) => {
    setOpen(newValue);
  };

  // eslint-disable-next-line no-prototype-builtins
  const shouldDisplayDag = entity_type === 'Dataset' && metadata && metadata.hasOwnProperty('dag_provenance_list');

  const [provData, setProvData] = React.useState(null);
  React.useEffect(() => {
    async function getAndSetProvData() {
      const response = await fetch(`${entityEndpoint}/entities/${uuid}/provenance`, {
        headers: {
          Authorization: `Bearer ${readCookie('nexus_token')}`,
        },
      });
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
      <SectionHeader variant="h3" component="h2">
        Provenance
      </SectionHeader>
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
            <StyledTabPanel value={open} boxClasses={classes.tabPanelBoxes} index={0} pad={1}>
              <ProvTable
                provData={provData}
                uuid={uuid}
                entity_type={entity_type}
                typesToSplit={['Donor', 'Sample', 'Dataset']}
              />
            </StyledTabPanel>
            <StyledTabPanel value={open} index={1}>
              <span id="prov-vis-react">
                <ProvGraph provData={provData} />
              </span>
            </StyledTabPanel>
            <StyledTabPanel value={open} index={2} pad={1}>
              {shouldDisplayDag && (
                <DagProv dagListData={metadata.dag_provenance_list} dagData={metadata.dag_provenance} />
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
};

export default ProvTabs;
