import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;

const LightText = styled(StyledTypography)`
  color: rgba(0, 0, 0, 0.54);
`;

const FlexPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;

const StyledDiv = styled.div`
  margin-left: ${(props) => (props.ml ? '75px' : '0px')};
`;

function MetadataItem(props) {
  const { children, label, ml } = props;
  return (
    <StyledDiv ml={ml}>
      <LightText variant="body1">{label}</LightText>
      {children}
    </StyledDiv>
  );
}

function DonorItems() {
  return (
    <>
      <MetadataItem label="Gender Finding"><StyledTypography variant="body1">Gender Finding not defined</StyledTypography></MetadataItem>
      <MetadataItem label="Current Chronological Age" ml={1}><StyledTypography variant="body1">Age not defined</StyledTypography></MetadataItem>
      <MetadataItem label="Body Mass Index" ml={1}><StyledTypography variant="body1">BMI not defined</StyledTypography></MetadataItem>
    </>
  );
}

function DetailMetadata() {
  return (
    <div>
      <Typography variant="h3" component="h2">Metadata</Typography>
      <FlexPaper>
        <DonorItems />
      </FlexPaper>
    </div>
  );
}

export default DetailMetadata;
