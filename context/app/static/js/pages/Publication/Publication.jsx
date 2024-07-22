import React, { useEffect, useMemo } from 'react';

import ContributorsTable from 'js/components/detailPage/ContributorsTable/ContributorsTable';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import { getCombinedDatasetStatus } from 'js/components/detailPage/utils';
import PublicationSummary from 'js/components/publications/PublicationSummary';
import PublicationsVisualizationSection from 'js/components/publications/PublicationVisualizationsSection/';
import PublicationsDataSection from 'js/components/publications/PublicationsDataSection';
import Files from 'js/components/detailPage/files/Files';
import useEntityStore from 'js/stores/useEntityStore';
import BulkDataTransfer from 'js/components/detailPage/BulkDataTransfer';
import { DetailContext } from 'js/components/detailPage/DetailContext';
import useTrackID from 'js/hooks/useTrackID';

const entityStoreSelector = (state) => state.setAssayMetadata;

function Publication({ publication, vignette_json }) {
  const {
    title,
    uuid,
    entity_type,
    hubmap_id,
    status,
    sub_status,
    doi_url,
    contributors = [],
    ancestor_ids,
    publication_venue,
    files,
    associated_collection,
  } = publication;

  const setAssayMetadata = useEntityStore(entityStoreSelector);
  useEffect(() => {
    setAssayMetadata({ hubmap_id, entity_type, title, publication_venue });
  }, [hubmap_id, entity_type, title, publication_venue, setAssayMetadata]);

  useTrackID({ entity_type, hubmap_id });

  const associatedCollectionUUID = associated_collection?.uuid;

  const shouldDisplaySection = {
    summary: true,
    data: true,
    visualizations: Boolean(Object.keys(vignette_json).length),
    files: Boolean(files?.length),
    'bulk-data-transfer': true,
    authors: true,
    provenance: !associatedCollectionUUID,
  };

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const hasDOI = doi_url !== undefined;

  const detailContext = useMemo(
    () => ({
      uuid,
      hubmap_id,
      // Default to `Public` for publication page DUA
      mapped_data_access_level: 'Public',
    }),
    [uuid, hubmap_id],
  );

  return (
    <DetailContext.Provider value={detailContext}>
      <DetailLayout sections={shouldDisplaySection}>
        <PublicationSummary
          {...publication}
          status={combinedStatus}
          hasDOI={hasDOI}
          associatedCollectionUUID={associatedCollectionUUID}
        />
        <PublicationsDataSection
          uuid={uuid}
          datasetUUIDs={ancestor_ids}
          associatedCollectionUUID={associatedCollectionUUID}
        />
        {shouldDisplaySection.visualizations && (
          <PublicationsVisualizationSection vignette_json={vignette_json} uuid={uuid} />
        )}
        {shouldDisplaySection.files && <Files files={files} uuid={uuid} hubmap_id={hubmap_id} />}
        {shouldDisplaySection['bulk-data-transfer'] && (
          <BulkDataTransfer files={files} uuid={uuid} hubmap_id={hubmap_id} />
        )}
        <ContributorsTable contributors={contributors} title="Authors" />
        {shouldDisplaySection.provenance && (
          <ProvSection
            uuid={uuid}
            assayMetadata={publication}
            iconTooltipText="The provenance shows the sequence of events and actions that led to this page creation."
          />
        )}
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default Publication;
