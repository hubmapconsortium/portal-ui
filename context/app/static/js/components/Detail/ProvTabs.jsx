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

function TabPanel(props) {
  const { children, value, index, className, boxClasses } = props;
  return (
    <Typography
      className={className}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && (
        <Box className={boxClasses} p={3}>
          {children}
        </Box>
      )}
    </Typography>
  );
}

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
      <Paper className={classes.tabsRoot}>
        <Tabs
          variant="standard"
          value={open}
          onChange={handleChange}
          aria-label="Detail View Tabs"
          className={classes.tabs}
          tabColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: '#9CB965' } }}
        >
          <StyledTab label="Table" id="vertical-tab-0" aria-controls="vertical-tabpanel-0" />
          <StyledTab label="Graph" id="vertical-tab-1" aria-controls="vertical-tabpanel-1" />
          {shouldDisplayDag && <StyledTab label="Analysis" id="vertical-tab-1" aria-controls="vertical-tabpanel-1" />}
        </Tabs>
        {provData && (
          <>
            <TabPanel value={open} className={classes.tabPanels} boxClasses={classes.tabPanelBoxes} index={0}>
              <ProvTable
                provData={provData}
                assayMetadata={assayMetadata}
                typesToSplit={['Donor', 'Sample', 'Dataset']}
              />
            </TabPanel>
            <TabPanel value={open} className={classes.tabPanels} index={1}>
              <span id="prov-vis-react">
                <ProvGraph provData={provData} />
              </span>
            </TabPanel>
            <TabPanel value={open} className={classes.tabPanels} index={2}>
              {shouldDisplayDag && (
                <DagProv dagListData={metadata.dag_provenance_list} dagData={metadata.dag_provenance} />
              )}
            </TabPanel>
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
