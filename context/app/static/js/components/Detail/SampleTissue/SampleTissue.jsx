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

function SampleTissue(props) {
  const { origin_sample, specimenType, tissueLocation } = props;
  return (
    <SectionContainer id="tissue">
      <SectionHeader variant="h3" component="h2">
        Tissue
      </SectionHeader>
      <FlexPaper>
        <MetadataItem label="Organ Type" value={origin_sample.mapped_organ} />
        <MetadataItem label="Specimen Type" ml={1} value={specimenType} />
        <MetadataItem label="Tissue Location" ml={1} value={tissueLocation} />
      </FlexPaper>
    </SectionContainer>
  );
}

SampleTissue.propTypes = {
  origin_sample: PropTypes.string.isRequired,
  specimenType: PropTypes.string.isRequired,
  tissueLocation: PropTypes.string,
};

SampleTissue.defaultProps = {
  tissueLocation: '',
};

export default SampleTissue;
