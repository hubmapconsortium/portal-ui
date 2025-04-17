import React from 'react';
import {
  CollapsibleDetailPageSection,
  CollapsibleDetailPageSectionProps,
} from 'js/components/detailPage/DetailPageSection';
import { useOrganContext } from 'js/components/organ/contexts';

function OrganDetailSection({ title, ...rest }: CollapsibleDetailPageSectionProps) {
  const {
    organ: { name },
  } = useOrganContext();

  return (
    <CollapsibleDetailPageSection
      trackingInfo={{ category: 'Organ Page', label: `${name} ${title}` }}
      title={title}
      {...rest}
    />
  );
}

export default OrganDetailSection;
