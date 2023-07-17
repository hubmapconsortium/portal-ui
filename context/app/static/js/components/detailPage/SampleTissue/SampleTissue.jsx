import React from 'react';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { LightBlueLink } from 'js/shared-styles/Links';
import { useFlaskDataContext } from 'js/components/Contexts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { FlexPaper } from './style';
import SectionItem from '../SectionItem';

function SampleTissue() {
  const {
    entity: { uuid, sample_category, origin_samples, rui_location },
  } = useFlaskDataContext();

  const origin_sample = origin_samples[0];
  const { mapped_organ } = origin_sample;
  const hasRUI = Boolean(rui_location);

  return (
    <DetailPageSection id="tissue">
      <SectionHeader>Tissue</SectionHeader>
      <FlexPaper>
        <SectionItem label="Organ Type" flexBasis="25%">
          <LightBlueLink variant="h6" href="/organ" underline="none">
            {mapped_organ || 'Organ Type not defined'}
          </LightBlueLink>
        </SectionItem>
        <SectionItem label="Sample Category" ml={1} flexBasis="25%">
          {sample_category || 'Sample Category not defined'}
        </SectionItem>
        {hasRUI && (
          <SectionItem label="Tissue Location" ml={1}>
            <>
              The{' '}
              <LightBlueLink href={`/browse/sample/${uuid}.rui.json`} target="_blank" rel="noopener noreferrer">
                spatial coordinates of this sample
              </LightBlueLink>{' '}
              have been registered and it can be found in the{' '}
              <OutboundLink href="/ccf-eui">Common Coordinate Framework Exploration User Interface</OutboundLink>.
            </>
          </SectionItem>
        )}
      </FlexPaper>
    </DetailPageSection>
  );
}

export default SampleTissue;
