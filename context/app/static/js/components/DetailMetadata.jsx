import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SectionHeader from './SectionHeader';
import SectionItem from './SectionItem';

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;


const FlexPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;

function DonorItems() {
  return (
    <>
      <SectionItem label="Gender Finding"><StyledTypography variant="body1">Gender Finding not defined</StyledTypography></SectionItem>
      <SectionItem label="Current Chronological Age" ml={1}><StyledTypography variant="body1">Age not defined</StyledTypography></SectionItem>
      <SectionItem label="Body Mass Index" ml={1}><StyledTypography variant="body1">BMI not defined</StyledTypography></SectionItem>
    </>
  );
}

function DetailMetadata() {
  return (
    <div>
      <SectionHeader variant="h3" component="h2">Metadata</SectionHeader>
      <FlexPaper>
        <DonorItems />
      </FlexPaper>
    </div>
  );
}

export default DetailMetadata;
