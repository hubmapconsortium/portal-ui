import React from 'react';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import withShouldDisplay from 'js/helpers/withShouldDisplay';

interface DataProductsProps {
  id: string;
}

function DataProducts({ id }: DataProductsProps) {
  return (
    <CollapsibleDetailPageSection id={id} title="Data Products">
      hahaha
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(DataProducts);
