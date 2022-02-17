import React from 'react';
import PropTypes from 'prop-types';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { FlexPaper } from './style';
import SectionItem from '../SectionItem';

function MetadataItem(props) {
  const { label, children, ml, flexBasis } = props;
  return (
    <SectionItem label={label} ml={ml} flexBasis={flexBasis}>
      {children || `${label} not defined`}
    </SectionItem>
  );
}

function SampleTissue(props) {
  const { uuid, mapped_organ, mapped_specimen_type, hasRUI } = props;
  return (
    <DetailPageSection id="tissue">
      <SectionHeader>Tissue</SectionHeader>
      <FlexPaper>
        <MetadataItem label="Organ Type" flexBasis="25%">
          <LightBlueLink variant="h6" href="/organ" underline="none">
            {mapped_organ}
          </LightBlueLink>
        </MetadataItem>
        <MetadataItem label="Specimen Type" ml={1} flexBasis="25%">
          {mapped_specimen_type}
        </MetadataItem>
        {hasRUI && (
          <MetadataItem label="Tissue Location" ml={1}>
            <>
              The{' '}
              <LightBlueLink href={`/browse/sample/${uuid}.rui.json`} target="_blank" rel="noopener noreferrer">
                spatial coordinates of this sample
              </LightBlueLink>{' '}
              have been registered and it can be found in the{' '}
              <OutboundLink href="/ccf-eui">Common Coordinate Framework Exploration User Interface</OutboundLink>.
            </>
          </MetadataItem>
        )}
      </FlexPaper>
    </DetailPageSection>
  );
}

SampleTissue.propTypes = {
  uuid: PropTypes.string.isRequired,
  mapped_organ: PropTypes.string.isRequired,
  mapped_specimen_type: PropTypes.string.isRequired,
  hasRUI: PropTypes.bool.isRequired,
};

export default SampleTissue;
