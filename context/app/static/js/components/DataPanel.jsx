import React from 'react';
import styled from 'styled-components';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PanelTitle from './PanelTitle';

const FlexContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export default function DataPanel(props) {
  const { propertyName, isRootChild, children } = props;
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="Details Panel"
        id="details-header"
      >
        <PanelTitle propertyName={propertyName} isRootChild={isRootChild} isDataPanelTitle />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <FlexContainer>
          {children}
        </FlexContainer>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
