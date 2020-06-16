import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DataSummary from '../DataSummary';
import About from '../About';
import Workflow from '../Workflow';
import DataUseGuidelines from '../DataUseGuidelines';
import Associations from '../Associations';
import TwitterTimeline from '../TwitterTimeline';
import BarChart from '../BarChart';
import { OuterGrid, UpperInnerGrid, LowerInnerGrid } from './style';

function Home() {
  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <OuterGrid>
      <UpperInnerGrid maxWidth="lg">
        <DataSummary summaryData={{ datasetCount: 0, sampleCount: 0, donorCount: 0, centerCount: 0 }} />
        {isLargerThanMd && <BarChart />}
      </UpperInnerGrid>
      <About />
      <LowerInnerGrid maxWidth="lg">
        <Workflow />
        <DataUseGuidelines />
        <TwitterTimeline />
      </LowerInnerGrid>
      <Associations />
    </OuterGrid>
  );
}

export default Home;
