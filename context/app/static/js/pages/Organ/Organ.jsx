import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { getSections } from 'js/shared-styles/sections/TableOfContents/utils';

import Azimuth from 'js/components/organ/Azimuth';
import Assays from 'js/components/organ/Assays';
import Description from 'js/components/organ/Description';
import OrganInfo from 'js/components/organ/OrganInfo';
import Samples from 'js/components/organ/Samples';

import { FlexRow, Content } from './style';

function Organ(props) {
  const { organ } = props;

  const shouldDisplaySection = {
    description: Boolean(organ?.description),
    organInfo: organ.has_iu_component,
    azimuth: Boolean(organ?.azimuth),
    search: organ.search.length > 0,
  };

  const sectionOrder = ['Description', 'Organ Info', 'Azimuth', 'Search'];
  const sections = new Map(getSections(sectionOrder));

  return (
    <FlexRow>
      <TableOfContents items={[...sections.values()]} />
      <Content>
        <SectionHeader variant="h1" component="h1">
          {organ.name}
        </SectionHeader>
        {shouldDisplaySection.description && (
          <Description uberonIri={organ.uberon} uberonShort={organ.uberon_short}>
            {organ.description}
          </Description>
        )}
        {shouldDisplaySection.organInfo && <OrganInfo uberonIri={organ.uberon} />}
        {shouldDisplaySection.azimuth && <Azimuth config={organ.azimuth} />}
        {shouldDisplaySection.search && (
          <>
            <Assays searchTerms={organ.search} />
            <Samples searchTerms={organ.search} />
          </>
        )}
      </Content>
    </FlexRow>
  );
}

export default Organ;
