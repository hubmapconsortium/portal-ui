import React, { PropsWithChildren } from 'react';
import { useFlaskDataContext } from 'js/components/Contexts';
import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SummaryBody from 'js/components/detailPage/summary/SummaryBody';

interface SummaryProps extends PropsWithChildren {
  published_timestamp?: number;
  status: string;
  mapped_data_access_level: string;
  entityTypeDisplay?: string;
  contributors?: { last_name: string; first_name: string }[];
  citationTitle?: string;
  doi_url?: string;
  doi?: string;
  collectionName?: string;
  mapped_external_group_name?: string;
  bottomFold?: React.ReactNode;
}

function Summary({
  published_timestamp,
  status,
  children,
  mapped_data_access_level,
  entityTypeDisplay,
  contributors,
  citationTitle,
  doi_url,
  doi,
  collectionName,
  mapped_external_group_name,
  bottomFold,
}: SummaryProps) {
  const {
    entity: { uuid, hubmap_id, entity_type, created_timestamp, last_modified_timestamp, description },
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
      <SummaryBody
        description={description}
        contributors={contributors}
        citationTitle={citationTitle}
        last_modified_timestamp={last_modified_timestamp}
        created_timestamp={created_timestamp}
        published_timestamp={published_timestamp}
        doi_url={doi_url}
        doi={doi}
        collectionName={collectionName}
      />
      {bottomFold}
    </DetailPageSection>
  );
}

export default Summary;
