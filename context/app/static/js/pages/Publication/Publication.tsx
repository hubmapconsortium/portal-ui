import React from 'react';

import ContributorsTable from 'js/components/detailPage/ContributorsTable/ContributorsTable';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import PublicationSummary from 'js/components/publications/PublicationSummary';
import PublicationsVisualizationSection from 'js/components/publications/PublicationVisualizationsSection/';
import PublicationsDataSection from 'js/components/publications/PublicationsDataSection';
import Files from 'js/components/detailPage/files/Files';
import { DetailContextProvider } from 'js/components/detailPage/DetailContext';
import useTrackID from 'js/hooks/useTrackID';
import { Publication as PublicationType } from 'js/components/types';
import BulkDataTransfer from 'js/components/detailPage/BulkDataTransfer';
import { PublicationVignette } from 'js/components/publications/types';

interface PublicationProps {
  publication: PublicationType;
  vignette_json: {
    vignettes: PublicationVignette[];
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

  const shouldDisplaySection = {
    summary: true,
    data: true,
    visualizations: vignette_json?.vignettes?.length > 0,
    files: Boolean(files?.length),
    'bulk-data-transfer': true,
    authors: true,
    provenance: true,
  };

  return (
    <DetailContextProvider uuid={uuid} hubmap_id={hubmap_id} mapped_data_access_level="Public" entityType="Publication">
      <DetailLayout sections={shouldDisplaySection}>
        <PublicationSummary />
        <PublicationsDataSection ancestorIds={ancestor_ids} associatedCollectionUUID={associated_collection?.uuid} />
        {shouldDisplaySection.visualizations && (
          <PublicationsVisualizationSection vignette_json={vignette_json} uuid={uuid} />
        )}
        {shouldDisplaySection.files && <Files files={files} includeAccordion />}
        {shouldDisplaySection['bulk-data-transfer'] && (
          <BulkDataTransfer customUUIDs={new Set(ancestor_ids)} integratedEntityUUID={uuid} />
        )}
        <ContributorsTable contributors={contributors} contacts={contacts} title="Authors" />
        <ProvSection />
      </DetailLayout>
    </DetailContextProvider>
  );
}

export default Publication;
