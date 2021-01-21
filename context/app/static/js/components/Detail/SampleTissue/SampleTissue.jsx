import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { FlexPaper, Pre } from './style';
import SectionItem from '../SectionItem';

function MetadataItem(props) {
  const { label, children, ml, flexBasis } = props;
  return (
    <SectionItem label={label} ml={ml} flexBasis={flexBasis}>
      {children || `${label} not defined`}
    </SectionItem>
  );
}

function LocationDetails(props) {
  const { locationJson } = props;
  const prettyLocation = JSON.stringify(JSON.parse(locationJson), null, 2);
  return (
    <details>
      <summary>RUI JSON</summary>
      <Pre>{prettyLocation}</Pre>
    </details>
  );
}

function SampleTissue(props) {
  const { mapped_organ, mapped_specimen_type, rui_location } = props;
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
          <LocationDetails locationJson={rui_location} />
        </MetadataItem>
      </FlexPaper>
    </SectionContainer>
  );
}

SampleTissue.propTypes = {
  mapped_organ: PropTypes.string.isRequired,
  mapped_specimen_type: PropTypes.string.isRequired,
  rui_location: PropTypes.string.isRequired,
};

export default SampleTissue;
