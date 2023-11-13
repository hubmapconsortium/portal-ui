import React from 'react';
import { DetailPageSection } from 'js/components/detailPage/style';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';

import EntityTable from 'js/shared-styles/tables/EntitiesTable/EntityTable';
import { cellTypes } from '../constants';
import { useGeneDetails } from '../hooks';

export default function CellTypes() {
  const { data, isLoading } = useGeneDetails();
  return (
    <DetailPageSection id={cellTypes.id}>
      <SectionHeader iconTooltipText={cellTypes.tooltip}>{cellTypes.title}</SectionHeader>
    </DetailPageSection>
  );
}
