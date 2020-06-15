import React from 'react';
import DataSummary from '../DataSummary';
import Title from '../Title';
import About from '../About';
import Workflow from '../Workflow';
import DataUseGuidelines from '../DataUseGuidelines';
import Associations from '../Associations';
import TwitterTimeline from '../TwitterTimeline';
import { OuterGrid, InnerGrid, SummaryContainer } from './style';

function Home() {
  return (
    <OuterGrid>
      <SummaryContainer maxWidth="lg">
        <DataSummary summaryData={{ datasetCount: 242, sampleCount: 129, donorCount: 27, centerCount: 8 }} />
        <Title />
      </SummaryContainer>
      <About />
      <InnerGrid maxWidth="lg">
        <Workflow />
        <DataUseGuidelines />
        <TwitterTimeline />
      </InnerGrid>
      <Associations />
    </OuterGrid>
  );
}

export default Home;
