import React from 'react';

import { getCombinedDatasetStatus, getSectionOrder } from 'js/components/detailPage/utils';
import ContributorsTable from 'js/components/detailPage/ContributorsTable/ContributorsTable';
import PublicationsDataSection from 'js/components/publications/PublicationsDataSection';
import PublicationsVisualizationSection from 'js/components/publications/PublicationVisualizationsSection/';
import PublicationSummary from 'js/components/publications/PublicationSummary';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import useEntityStore from 'js/stores/useEntityStore';

const entityStoreSelector = (state) => state.setAssayMetadata;

function Publication({ publication, vignette_data }) {
  const {
    title,
    uuid,
    entity_type,
    hubmap_id,
    status,
    sub_status,
    doi_url,
    contributors,
    ancestor_ids,
    publication_venue,
  } = publication;

  const setAssayMetadata = useEntityStore(entityStoreSelector);
  setAssayMetadata({ hubmap_id, entity_type, title, publication_venue });

  const sectionOrder = getSectionOrder(['summary', 'data', 'visualizations', 'authors', 'provenance'], {});

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const hasDOI = doi_url !== undefined;

  return (
    <DetailLayout sectionOrder={sectionOrder}>
      <PublicationSummary {...publication} status={combinedStatus} hasDOI={hasDOI} />
      <PublicationsDataSection uuid={uuid} datasetUUIDs={ancestor_ids} />
      <PublicationsVisualizationSection vignette_data={vignette_data} uuid={uuid} />
      <ContributorsTable contributors={contributors} title="Authors" />
      <ProvSection uuid={uuid} assayMetadata={publication} />
    </DetailLayout>
  );
}

export default Publication;
