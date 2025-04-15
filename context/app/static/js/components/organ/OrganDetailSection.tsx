import React from 'react';
import {
  CollapsibleDetailPageSection,
  CollapsibleDetailPageSectionProps,
} from 'js/components/detailPage/DetailPageSection';
import { useOrganContext } from 'js/components/organ/contexts';
import { OrganEventCategories } from 'js/components/organ/types';

function OrganDetailSection({ title, ...rest }: CollapsibleDetailPageSectionProps) {
  const {
    organ: { name },
  } = useOrganContext();

  return (
    <CollapsibleDetailPageSection
      trackingInfo={{ category: OrganEventCategories.OrganPage, label: `${name} ${title}` }}
      title={title}
      {...rest}
    />
  );
}

export default OrganDetailSection;
