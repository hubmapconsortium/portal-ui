/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
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

function MetadataItem(props) {
  const { label, value, ml } = props;
  return (
    <SectionItem label={label} ml={ml}>
      <StyledTypography variant="body1">
        {value || `${label} not defined`}
      </StyledTypography>
    </SectionItem>
  );
}

function DonorItems(props) {
  const { genderFinding, currentAge, bodyMassIndex } = props;
  return (
    <>
      <MetadataItem label="Gender Finding" value={genderFinding} />
      <MetadataItem label="Current Chronological Age" ml={1} value={currentAge} />
      <MetadataItem label="Body Mass Index" ml={1} value={bodyMassIndex} />
    </>
  );
}

function SampleItems(props) {
  const {
    organ, origin_sample: { organ: originOrgan }, specimenType, tissueLocation,
  } = props;
  return (
    <>
      <MetadataItem label="Organ Type" value={organ || originOrgan} />
      <MetadataItem label="Specimen Type" ml={1} value={specimenType} />
      <MetadataItem label="Tissue Location" ml={1} value={tissueLocation} />
    </>
  );
}

function DetailMetadata(props) {
  const { entityType } = props;
  return (
    <div>
      <SectionHeader variant="h3" component="h2">Metadata</SectionHeader>
      <FlexPaper>
        {entityType === 'donor' ? <DonorItems {...props} /> : <SampleItems {...props} />}
      </FlexPaper>
    </div>
  );
}

export default DetailMetadata;
