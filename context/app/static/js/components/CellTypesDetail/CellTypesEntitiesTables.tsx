import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import React from 'react';
import Description from 'js/shared-styles/sections/Description';
import { DetailPageSection } from '../detailPage/style';

export default function CellTypesEntitiesTables() {
  return (
    <DetailPageSection id="organs">
      <SectionHeader>Organs</SectionHeader>
      <Description>
        This is the list of organs and its associated data that is dependent on the data available within HuBMAP. To
        filter the list of data in the table below by organ, select organ(s) from the list below. Multiple organs can be
        selected.
      </Description>
    </DetailPageSection>
  );
}
