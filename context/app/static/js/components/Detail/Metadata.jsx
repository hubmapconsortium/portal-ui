/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SectionHeader from './SectionHeader';
import SectionItem from './SectionItem';
import SectionContainer from './SectionContainer';

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;

const FlexPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;

function getDonorMetadataValue(metadata, key) {
  return metadata && Object.prototype.hasOwnProperty.call(metadata, key)
    ? `${metadata[key].value} ${metadata[key].units}` : '';
}

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
  const { metadata } = props;

  const ageValue = getDonorMetadataValue(metadata, 'Current chronological age');
  const bmiValue = getDonorMetadataValue(metadata, 'Body mass index');

  return (
    <>
      <MetadataItem label="Gender Finding" value={metadata['Gender finding']} />
      <MetadataItem
        label="Current Chronological Age"
        ml={1}
        value={ageValue}
      />
      <MetadataItem
        label="Body Mass Index"
        ml={1}
        value={bmiValue}
      />
      <MetadataItem label="Racial Group" ml={1} value={metadata['Racial group']} />
    </>
  );
}

// TODO: Update tissue location with real data once it's in a consumable structure
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

function Metadata(props) {
  const { entityType } = props;
  return (
    <SectionContainer id="metadata">
      <SectionHeader variant="h3" component="h2">Metadata</SectionHeader>
      <FlexPaper>
        {entityType === 'Donor' ? <DonorItems {...props} /> : <SampleItems {...props} />}
      </FlexPaper>
    </SectionContainer>
  );
}

export default Metadata;
