import React from 'react';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import { Vitessce } from 'vitessce';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';
import 'vitessce/dist/es/production/static/css/index.css';

const HEIGHT = 600;

const VitessceContainer = styled.div`
  height: ${HEIGHT}px;
`;
function Visualization(props) {
  const { vitData } = props;

  return (
    <SectionContainer id="visualization">
      <SectionHeader variant="h3" component="h2">
        Visualization
      </SectionHeader>
      <Paper>
        <VitessceContainer>
          <Vitessce height={HEIGHT} config={vitData} theme="light" />
        </VitessceContainer>
      </Paper>
    </SectionContainer>
  );
}

export default Visualization;
