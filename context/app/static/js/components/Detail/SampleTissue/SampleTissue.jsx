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

function SampleTissue(props) {
  const { mapped_organ, mapped_specimen_type, tissueLocation } = props;
  return (
    <SectionContainer id="tissue">
      <SectionHeader>Tissue</SectionHeader>
      <FlexPaper>
        <MetadataItem label="Organ Type" value={mapped_organ} />
        <MetadataItem label="Specimen Type" ml={1} value={mapped_specimen_type} />
        <MetadataItem label="Tissue Location" ml={1} value={tissueLocation} />
      </FlexPaper>
    </SectionContainer>
  );
}

SampleTissue.propTypes = {
  mapped_organ: PropTypes.string.isRequired,
  mapped_specimen_type: PropTypes.string.isRequired,
  tissueLocation: PropTypes.string,
};

SampleTissue.defaultProps = {
  tissueLocation: '',
};

export default SampleTissue;
