import React from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import { getCombinedDatasetStatus } from 'js/components/detailPage/utils';

import Summary from 'js/components/detailPage/summary/Summary';
import { useFlaskDataContext } from 'js/components/Contexts';
import { isPublication } from 'js/components/types';

function PublicationSummary() {
  const { entity } = useFlaskDataContext();

  if (!isPublication(entity)) {
    return null;
  }

  const {
    hubmap_id,
    title,
    publication_doi,
    publication_status: isPublished,
    status,
    sub_status,
    mapped_data_access_level,
    mapped_external_group_name,
  } = entity;

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });
  const hasDOI = Boolean(publication_doi);
  const doiURL = `https://doi.org/${publication_doi}`;

  return (
    <Summary
      title={title}
      entityTypeDisplay={isPublished ? 'Publication' : 'Preprint'}
      status={combinedStatus}
      mapped_data_access_level={mapped_data_access_level}
      mapped_external_group_name={mapped_external_group_name}
    >
      <SummaryItem showDivider={hasDOI}>{hubmap_id}</SummaryItem>
      {hasDOI && (
        <SummaryItem showDivider={false}>
          <OutboundIconLink href={doiURL}>{doiURL}</OutboundIconLink>
        </SummaryItem>
      )}
    </Summary>
  );
}

export default PublicationSummary;
