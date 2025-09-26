import React, { useMemo } from 'react';

import ContributorsTable from 'js/components/detailPage/ContributorsTable/ContributorsTable';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import PublicationSummary from 'js/components/publications/PublicationSummary';
import PublicationsVisualizationSection from 'js/components/publications/PublicationVisualizationsSection/';
import PublicationsDataSection from 'js/components/publications/PublicationsDataSection';
import Files from 'js/components/detailPage/files/Files';
import { DetailContext } from 'js/components/detailPage/DetailContext';
import useTrackID from 'js/hooks/useTrackID';
import PublicationBulkDataTransfer from 'js/components/detailPage/BulkDataTransfer/PublicationBulkDataTransfer';
import { Publication as PublicationType } from 'js/components/types';

interface PublicationProps {
  publication: PublicationType;
  vignette_json: {
    vignettes: { name: string; directory_name: string }[];
  };
}

function Publication({ publication, vignette_json }: PublicationProps) {
  const {
    uuid,
    entity_type,
    hubmap_id,
    contributors = [],
    contacts = [],
    ancestor_ids,
    files,
    associated_collection,
  } = publication;

  useTrackID({ entity_type, hubmap_id });

  const associatedCollectionUUID = associated_collection?.uuid;

  const shouldDisplayProvenance = !associatedCollectionUUID; // && ancestor_ids?.length < 400;

  const shouldDisplaySection = {
    summary: true,
    data: true,
    visualizations: vignette_json?.vignettes?.length > 0,
    files: Boolean(files?.length),
    'bulk-data-transfer': true,
    authors: true,
    provenance: shouldDisplayProvenance,
  };

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
        {/* TODO: Uncomment */}
        {/* <PublicationSummary />
        <PublicationsDataSection
          uuid={uuid}
          datasetUUIDs={ancestor_ids}
          associatedCollectionUUID={associatedCollectionUUID}
        />
        {shouldDisplaySection.visualizations && (
          <PublicationsVisualizationSection vignette_json={vignette_json} uuid={uuid} />
        )}
        {shouldDisplaySection.files && <Files files={files} includeAccordion />}
        {shouldDisplaySection['bulk-data-transfer'] && <PublicationBulkDataTransfer uuid={uuid} label={hubmap_id} />}
        <ContributorsTable contributors={contributors} contacts={contacts} title="Authors" /> */}
        {shouldDisplaySection.provenance && <ProvSection />}
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default Publication;
