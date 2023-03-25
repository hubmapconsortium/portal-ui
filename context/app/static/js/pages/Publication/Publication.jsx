import React from 'react';

import Summary from 'js/components/detailPage/summary/Summary';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { getCombinedDatasetStatus } from 'js/components/detailPage/utils';
import PublicationRelatedEntities from 'js/components/publications/PublicationRelatedEntities';
import ContributorsTable from 'js/components/detailPage/ContributorsTable/ContributorsTable';
import PublicationsDataSection from 'js/components/publications/PublicationsDataSection';

function Publication({ publication }) {
  const {
    title,
    uuid,
    entity_type,
    hubmap_id,
    created_timestamp,
    last_modified_timestamp,
    published_timestamp,
    description,
    status,
    sub_status,
    mapped_data_access_level,
    mapped_external_group_name,
    doi_url,
    contributors,
    ancestor_ids,
  } = publication;

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const hasDOI = doi_url !== undefined;

  return (
    <>
      <Summary
        title={title}
        uuid={uuid}
        entity_type={entity_type}
        hubmap_id={hubmap_id}
        created_timestamp={created_timestamp}
        last_modified_timestamp={last_modified_timestamp}
        published_timestamp={published_timestamp}
        description={description}
        status={combinedStatus}
        mapped_data_access_level={mapped_data_access_level}
        mapped_external_group_name={mapped_external_group_name}
      >
        <SummaryItem showDivider={hasDOI}>{hubmap_id}</SummaryItem>
        {hasDOI && <OutboundIconLink href={doi_url}>{doi_url}</OutboundIconLink>}
      </Summary>
      <PublicationRelatedEntities uuid={uuid} />
      <PublicationsDataSection datasetUUIDs={ancestor_ids} />
      <ContributorsTable contributors={contributors} title="Authors" />
    </>
  );
}

export default Publication;
