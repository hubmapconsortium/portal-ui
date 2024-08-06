import React, { PropsWithChildren } from 'react';
import { useFlaskDataContext } from 'js/components/Contexts';
import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SummaryBody from 'js/components/detailPage/summary/SummaryBody';

interface SummaryProps extends PropsWithChildren {
  status: string;
  mapped_data_access_level: string;
  entityTypeDisplay?: string;
  mapped_external_group_name?: string;
  bottomFold?: React.ReactNode;
}

function Summary({
  status,
  mapped_data_access_level,
  mapped_external_group_name,
  entityTypeDisplay,
  children,
  bottomFold,
}: SummaryProps) {
  const {
    entity: { uuid, hubmap_id, entity_type },
  } = useFlaskDataContext();

  return (
    <DetailPageSection id="summary">
      <SummaryData
        title={hubmap_id}
        entityTypeDisplay={entityTypeDisplay}
        entity_type={entity_type}
        uuid={uuid}
        status={status ?? 'Missing status'}
        mapped_data_access_level={mapped_data_access_level ?? 'Missing access level'}
        mapped_external_group_name={mapped_external_group_name}
      >
        {children}
      </SummaryData>
      <SummaryBody />
      {bottomFold}
    </DetailPageSection>
  );
}

export default Summary;
