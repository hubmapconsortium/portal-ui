import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ProvGraph from './ProvGraph';
import ProvTable from './ProvTable';
import { useStyles } from '../styles';
import SectionHeader from './SectionHeader';
import SectionContainer from './SectionContainer';

function TabPanel(props) {
  const {
    children, value, index, className, boxClasses,
  } = props;
  return (
    <Typography
      className={className}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && <Box className={boxClasses} p={3}>{children}</Box>}
    </Typography>
  );
}


function VisTabs(props) {
  const { provData, assayMetadata } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(0);

  const handleChange = (event, newValue) => {
    setOpen(newValue);
  };
  return (
    <SectionContainer>
      <SectionHeader variant="h3" component="h2">Provenance</SectionHeader>
      <Paper className={classes.tabsRoot}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={open}
          onChange={handleChange}
          aria-label="Detail View Tabs"
          className={classes.tabs}
          indicatorColor="secondary"
        >
          <Tab
            label="Table"
            id="vertical-tab-0"
            aria-controls="vertical-tabpanel-0"
          />
          <Tab
            label="Graph"
            id="vertical-tab-1"
            aria-controls="vertical-tabpanel-1"
          />
        </Tabs>
        <TabPanel
          value={open}
          className={classes.tabPanels}
          boxClasses={classes.tabPanelBoxes}
          index={0}
        >
          <ProvTable provData={provData} assayMetadata={assayMetadata} typesToSplit={['Donor', 'Sample', 'Dataset']} />
        </TabPanel>
        <TabPanel value={open} className={classes.tabPanels} index={1}>
          <span id="prov-vis-react">
            <ProvGraph provData={provData} />
          </span>
        </TabPanel>

      </Paper>
    </SectionContainer>
  );
}

VisTabs.propTypes = {
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default VisTabs;
