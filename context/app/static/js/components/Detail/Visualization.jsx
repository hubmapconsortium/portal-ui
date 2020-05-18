import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Vitessce } from 'vitessce';
import SectionHeader from './SectionHeader';
import SectionContainer from './SectionContainer';


function Visualization(props) {
  const { vitData } = props;

  return (
    <SectionContainer>
      <SectionHeader variant="h3" component="h2">Visualization</SectionHeader>
      <Paper>
        <Vitessce rowHeight={100} config={vitData} theme="light" />
      </Paper>
    </SectionContainer>
  );
}

export default Visualization;
