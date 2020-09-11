/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import { FlexPaper } from './style';
import SectionHeader from '../SectionHeader';
import SectionItem from '../SectionItem';
import SectionContainer from '../SectionContainer';

function MetadataItem(props) {
  const { label, children, ml, flexBasis } = props;
  return (
    <SectionItem label={label} ml={ml} flexBasis={flexBasis}>
      {children || `${label} not defined`}
    </SectionItem>
  );
}

function SampleTissue(props) {
  const { mapped_organ, mapped_specimen_type } = props;
  return (
    <SectionContainer id="tissue">
      <SectionHeader>Tissue</SectionHeader>
      <FlexPaper>
        <MetadataItem label="Organ Type" flexBasis="25%">
          {mapped_organ}
        </MetadataItem>
        <MetadataItem label="Specimen Type" ml={1} flexBasis="25%">
          {mapped_specimen_type}
        </MetadataItem>
        <MetadataItem label="Tissue Location" ml={1}>
          <>
            The spatial coordinates of this sample have been registered and it can be found in the{' '}
            <LightBlueLink href="/ccf-eui" target="_blank" rel="noopener noreferrer">
              Common Coordinate Framework Exploration User Interface
            </LightBlueLink>
            .
          </>
        </MetadataItem>
      </FlexPaper>
    </SectionContainer>
  );
}

SampleTissue.propTypes = {
  mapped_organ: PropTypes.string.isRequired,
  mapped_specimen_type: PropTypes.string.isRequired,
};

export default SampleTissue;
