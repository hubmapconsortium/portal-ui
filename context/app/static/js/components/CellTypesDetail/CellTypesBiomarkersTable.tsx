import React from 'react';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';
import { DetailPageSection } from '../detailPage/style';

export default function CellTypesBiomarkersTable() {
  return (
    <DetailPageSection>
      <SectionHeader>Biomarkers</SectionHeader>
      <Description>
        This is a list of identified biomarkers that are validated from the listed source. Explore other sources in
        dropdown menu below, if available.
      </Description>
    </DetailPageSection>
  );
}
