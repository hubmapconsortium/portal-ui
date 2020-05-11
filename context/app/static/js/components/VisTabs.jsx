import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { Vitessce } from 'vitessce';
import ProvGraph from './ProvGraph';
import ProvTable from './ProvTable';
import { useStyles } from '../styles';

function TabPanel(props) {
  const {
    children, value, index, className, boxClasses,
  } = props;
  return (
    value === index
      && (
        <Typography
          className={className}
          component="div"
          role="tabpanel"
          hidden={value !== index}
          id={`vertical-tabpanel-${index}`}
          aria-labelledby={`vertical-tab-${index}`}
        >
          <Box className={boxClasses} p={3}>{children}</Box>
        </Typography>
      )
  );
}


function VisTabs(props) {
  const { provData, vitData } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(0);

  const handleChange = (event, newValue) => {
    // eslint-disable-next-line
    console.log(event, newValue)
    setOpen(newValue);
  };
  return (
    <div className={classes.tabsRoot}>
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
          label="Visualizations"
          id="vertical-tab-0"
          aria-controls="vertical-tabpanel-0"
        />
        <Tab
          label="Provenance Chart"
          id="vertical-tab-1"
          aria-controls="vertical-tabpanel-1"
        />
        <Tab
          label="Provenance Table"
          id="vertical-tab-1"
          aria-controls="vertical-tabpanel-1"
        />
      </Tabs>
      <TabPanel
        value={open}
        index={0}
        className={classes.tabPanels}
        boxClasses={classes.tabPanelBoxes}
      >
        {'name' in vitData ? <Vitessce config={vitData} rowHeight={200} theme="light" /> : null}
      </TabPanel>
      <TabPanel value={open} index={1}>
        <span id="prov-vis-react">
          <ProvGraph provData={provData} />
        </span>
      </TabPanel>
      <TabPanel
        value={open}
        className={classes.tabPanels}
        boxClasses={classes.tabPanelBoxes}
        index={2}
      >
        <ProvTable
          provData={provData}
          typesToSplit={['Donor', 'Sample', 'Dataset']}
        />
      </TabPanel>
    </div>
  );
}

VisTabs.propTypes = {
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default VisTabs;
