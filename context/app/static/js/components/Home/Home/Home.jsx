import React from 'react';
import Container from '@material-ui/core/Container';
import DataSummary from '../DataSummary';
import Title from '../Title';
import About from '../About';
import Workflow from '../Workflow';
import DataUseGuidelines from '../DataUseGuidelines';
import Associations from '../Associations';
import TwitterTimeline from '../TwitterTimeline';
import { Flex } from './style';

function Home() {
  return (
    <Flex>
      <Container maxWidth="lg">
        <DataSummary summaryData={{ datasetCount: 242, sampleCount: 129, donorCount: 27, centerCount: 8 }} />
        <Title />
      </Container>
      <About />
      <Container maxWidth="lg">
        <Workflow />
        <DataUseGuidelines />
        <TwitterTimeline />
      </Container>
      <Associations />
    </Flex>
  );
}

export default Home;
