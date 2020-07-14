/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { FlexPaper } from './style';
import SectionHeader from '../SectionHeader';
import SectionItem from '../SectionItem';
import SectionContainer from '../SectionContainer';

function MetadataItem(props) {
  const { label, value, ml } = props;
  return (
    <SectionItem label={label} ml={ml}>
      {value || `${label} not defined`}
    </SectionItem>
  );
}

function DonorMetadata(props) {
  const { metadata } = props;
  const { gender, age, bmi, race } = metadata;
  return (
    <SectionContainer id="metadata">
      <SectionHeader variant="h3" component="h2">
        Metadata
      </SectionHeader>
      <FlexPaper>
        <MetadataItem label="Gender Finding" value={gender} />
        <MetadataItem label="Current Chronological Age" ml={1} value={age} />
        <MetadataItem label="Body Mass Index" ml={1} value={bmi} />
        <MetadataItem label="Racial Group" ml={1} value={race} />
      </FlexPaper>
    </SectionContainer>
  );
}

DonorMetadata.propTypes = {
  metadata: PropTypes.string.isRequired,
};

export default DonorMetadata;
