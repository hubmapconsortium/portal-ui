/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { StyledTypography, FlexPaper } from './style';
import SectionHeader from '../SectionHeader';
import SectionItem from '../SectionItem';
import SectionContainer from '../SectionContainer';

function MetadataItem(props) {
  const { label, value, ml } = props;
  return (
    <SectionItem label={label} ml={ml}>
      <StyledTypography variant="body1">{value || `${label} not defined`}</StyledTypography>
    </SectionItem>
  );
}

function DonorItems(props) {
  const { metadata } = props;

  return (
    <>
      <MetadataItem label="Gender Finding" value={metadata.gender} />
      <MetadataItem label="Current Chronological Age" ml={1} value={metadata.age} />
      <MetadataItem label="Body Mass Index" ml={1} value={metadata.bmi} />
      <MetadataItem label="Racial Group" ml={1} value={metadata.race} />
    </>
  );
}

// TODO: Update tissue location with real data once it's in a consumable structure
function SampleItems(props) {
  const { origin_sample, specimenType, tissueLocation } = props;
  return (
    <>
      <MetadataItem label="Organ Type" value={origin_sample.mapped_organ} />
      <MetadataItem label="Specimen Type" ml={1} value={specimenType} />
      <MetadataItem label="Tissue Location" ml={1} value={tissueLocation} />
    </>
  );
}

function Metadata(props) {
  const { entity_type } = props;
  return (
    <SectionContainer id="metadata">
      <SectionHeader variant="h3" component="h2">
        Metadata
      </SectionHeader>
      <FlexPaper>{entity_type === 'Donor' ? <DonorItems {...props} /> : <SampleItems {...props} />}</FlexPaper>
    </SectionContainer>
  );
}

Metadata.propTypes = {
  entity_type: PropTypes.string.isRequired,
};

export default Metadata;
