import React from 'react';
import Skeleton from '@mui/material/Skeleton';

import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import CollectionsSection from 'js/components/detailPage/CollectionsSection';
import BulkDataTransfer from 'js/components/detailPage/BulkDataTransfer';
import { DetailContextProvider } from 'js/components/detailPage/DetailContext';
import { getCombinedDatasetStatus } from 'js/components/detailPage/utils';
import MetadataSection from 'js/components/detailPage/MetadataSection';
import { Dataset, Donor, Sample } from 'js/components/types';
import { SelectedVersionStoreProvider } from 'js/components/detailPage/VersionSelect/SelectedVersionStore';
import { useDatasetsCollections } from 'js/hooks/useDatasetsCollections';
import { useEntitiesData } from 'js/hooks/useEntityData';
import PublicationsSection from 'js/components/detailPage/PublicationsSection';
import { useDatasetsPublications } from 'js/hooks/useDatasetsPublications';
import { useProcessedDatasets, useRedirectAlert, useVitessceConf } from './hooks';
import { EntityDetailProps } from './Dataset';
import SummaryDataChildren from './DatasetPageSummaryChildren';
import IntegratedDataSection from 'js/components/detailPage/IntegratedData/IntegratedData';
import { combinePeopleLists } from 'js/pages/Dataset/utils';
import { Entity } from 'js/components/types';
import AnalysisDetailsSection from 'js/components/detailPage/AnalysisDetails/AnalysisDetailsSection';
import IntegratedDatasetVisualizationSection from 'js/components/detailPage/visualization/IntegratedDatasetVisualizationSection';
import IntegratedDatasetFiles from 'js/components/detailPage/files/IntegratedDatasetFiles';
import { useEventCallback } from '@mui/material/utils';
import { trackEvent } from 'js/helpers/trackers';

function IntegratedDatasetPage({ assayMetadata }: EntityDetailProps<Dataset>) {
  const {
    protocol_url: currentProtocolUrl,
    uuid,
    mapped_data_types,
    origin_samples,
    hubmap_id,
    status,
    sub_status,
    mapped_data_access_level,
    mapped_external_group_name,
    ancestor_ids,
    // Parent dataset IDs for SnareSeq2 datasets are the components
    immediate_ancestor_ids,
    creation_action,
    files,
    metadata,
    ingest_metadata: { dag_provenance_list },
  } = assayMetadata;

  const isExternal = creation_action === 'External Process';

  const protocolUrl = isExternal
    ? // External datasets have their protocol URL in the metadata
      ((metadata?.derived_dataset_protocol_doi as string) ?? currentProtocolUrl)
    : currentProtocolUrl;

  const [entities, loadingEntities] = useEntitiesData<Dataset | Donor | Sample>([uuid, ...ancestor_ids]);

  // Is this filtering necessary? I'm not sure if there will ever be datasets that are not immediate ancestors.
  const entitiesForImmediateAncestors = entities.filter(
    (entity) => entity.entity_type !== 'Dataset' || immediate_ancestor_ids.includes(entity.uuid),
  );

  const contributors = combinePeopleLists(entities.map((entity: Entity) => entity?.contributors ?? []));
  const contacts = combinePeopleLists(entities.map((entity: Entity) => entity?.contacts ?? []));

  useRedirectAlert();

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const { searchHits: processedDatasets } = useProcessedDatasets();

  // Top level request for collections data to determine if there are any collections for any of the datasets
  const collectionsData = useDatasetsCollections([uuid, ...processedDatasets.map((ds) => ds._id)]);
  const publicationsData = useDatasetsPublications([uuid, ...processedDatasets.map((ds) => ds._id)]);
  const vitessceConfig = useVitessceConf(uuid);

  const shouldDisplaySection = {
    summary: true,
    metadata: isExternal,
    visualization: Boolean(vitessceConfig.data || vitessceConfig.isLoading),
    files: Boolean(files),
    'bulk-data-transfer': true,
    'integrated-data': Boolean(entitiesForImmediateAncestors.length),
    provenance: true,
    // External datasets have protocol URLs, internal datasets should have workflow details
    'protocols-and-workflow-details': Boolean(protocolUrl || (!isExternal && dag_provenance_list)),
    collections: Boolean(collectionsData.length),
    publications: Boolean(publicationsData.length),
    attribution: true,
  };

  const uuidsForBulkDataTransfer = new Set<string>([
    ...entitiesForImmediateAncestors.filter((e) => e.entity_type === 'Dataset').map((ds) => ds.uuid),
    uuid,
  ]);

  const trackFilesSectionEvents = useEventCallback((info: { action: string; label: string }) => {
    trackEvent({
      category: 'Integrated Dataset Detail Page',
      action: `Files / ${info.action}`,
      label: info.label,
    });
  });

  return (
    <DetailContextProvider
      hubmap_id={hubmap_id}
      uuid={uuid}
      entityType="Integrated Dataset"
      mapped_data_access_level={mapped_data_access_level}
    >
      <SelectedVersionStoreProvider initialVersionUUIDs={processedDatasets?.map((ds) => ds._id) ?? []}>
        <DetailLayout sections={shouldDisplaySection} isLoading={false}>
          <Summary
            entityTypeDisplay="Integrated Dataset"
            status={combinedStatus}
            mapped_data_access_level={mapped_data_access_level}
            mapped_external_group_name={mapped_external_group_name}
          >
            <SummaryDataChildren mapped_data_types={mapped_data_types} origin_samples={origin_samples} />
          </Summary>
          <IntegratedDatasetVisualizationSection uuid={uuid} vitessceConfig={vitessceConfig.data} />
          <MetadataSection entities={[assayMetadata]} shouldDisplay={shouldDisplaySection.metadata} />
          {shouldDisplaySection.files && <IntegratedDatasetFiles files={files} track={trackFilesSectionEvents} />}
          <BulkDataTransfer
            shouldDisplay={Boolean(shouldDisplaySection['bulk-data-transfer'])}
            integratedEntityUUID={uuid}
            customUUIDs={uuidsForBulkDataTransfer}
          />
          <IntegratedDataSection
            entities={entitiesForImmediateAncestors}
            shouldDisplay={shouldDisplaySection['integrated-data']}
            includeCurrentEntity
          />
          <ProvSection shouldDisplay={shouldDisplaySection.provenance} integratedDataset />
          <AnalysisDetailsSection
            isExternal={isExternal}
            protocolUrl={protocolUrl}
            dataset={assayMetadata}
            shouldDisplay={shouldDisplaySection['protocols-and-workflow-details']}
          />
          <CollectionsSection shouldDisplay={shouldDisplaySection.collections} />
          <PublicationsSection shouldDisplay={shouldDisplaySection.publications} />
          <Attribution>
            {loadingEntities ? <Skeleton /> : <ContributorsTable contributors={contributors} contacts={contacts} />}
          </Attribution>
        </DetailLayout>
      </SelectedVersionStoreProvider>
    </DetailContextProvider>
  );
}

export default IntegratedDatasetPage;
