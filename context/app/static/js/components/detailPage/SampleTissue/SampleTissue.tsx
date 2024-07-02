import React from 'react';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { InternalLink } from 'js/shared-styles/Links';
import { useFlaskDataContext } from 'js/components/Contexts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { isSample } from 'js/components/types';
import { FlexPaper } from './style';
import SectionItem from '../SectionItem';

function SampleTissue() {
  const { entity } = useFlaskDataContext();

  if (!isSample(entity)) return null;

  const { uuid, sample_category, origin_samples, rui_location } = entity;

  const origin_sample = origin_samples[0];
  const { mapped_organ } = origin_sample;
  const hasRUI = Boolean(rui_location);

  return (
    <DetailPageSection id="tissue">
      <SectionHeader>Tissue</SectionHeader>
      <FlexPaper>
        <SectionItem label="Organ Type" flexBasis="25%">
          <InternalLink variant="h6" href={`/organ/${mapped_organ}`} underline="none">
            {mapped_organ || 'Organ Type not defined'}
          </InternalLink>
        </SectionItem>
        <SectionItem label="Sample Category" ml flexBasis="25%">
          {sample_category || 'Sample Category not defined'}
        </SectionItem>
        {hasRUI && (
          <SectionItem label="Tissue Location" ml>
            <>
              The{' '}
              <InternalLink href={`/browse/sample/${uuid}.rui.json`} target="_blank" rel="noopener noreferrer">
                spatial coordinates of this sample
              </InternalLink>{' '}
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
