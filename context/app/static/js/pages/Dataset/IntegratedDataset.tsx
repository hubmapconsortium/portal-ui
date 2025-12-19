import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

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
import DatasetRelationships from 'js/components/detailPage/DatasetRelationships';
import { SelectedVersionStoreProvider } from 'js/components/detailPage/VersionSelect/SelectedVersionStore';
import { useDatasetRelationships } from 'js/components/detailPage/DatasetRelationships/hooks';
import { useDatasetsCollections } from 'js/hooks/useDatasetsCollections';
import { useEntitiesData } from 'js/hooks/useEntityData';
import { hasMetadata } from 'js/helpers/metadata';
import MultiAssayRelationship from 'js/components/detailPage/multi-assay/MultiAssayRelationship';
import PublicationsSection from 'js/components/detailPage/PublicationsSection';
import { useDatasetsPublications } from 'js/hooks/useDatasetsPublications';
import { useProcessedDatasets, useRedirectAlert, useVitessceConf } from './hooks';
import { EntityDetailProps } from './Dataset';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import SummaryDataChildren from './DatasetPageSummaryChildren';
import IntegratedDatasets from 'js/components/detailPage/IntegratedDatasets/IntegratedDatasets';
import { combinePeopleLists } from 'js/pages/Dataset/utils';
import { Entity } from 'js/components/types';

function IntegratedDatasetPage({ assayMetadata }: EntityDetailProps<Dataset>) {
  const {
    protocol_url,
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
  } = assayMetadata;

  const [entities, loadingEntities] = useEntitiesData<Dataset | Donor | Sample>([uuid, ...ancestor_ids]);

  const entitiesWithMetadata = entities.filter((e) =>
    hasMetadata({ targetEntityType: e.entity_type, currentEntity: e }),
  );

  const contributors = combinePeopleLists(entities.map((entity: Entity) => entity?.contributors ?? []));
  const contacts = combinePeopleLists(entities.map((entity: Entity) => entity?.contacts ?? []));

  useRedirectAlert();

  // TODO: Origin sample needs to be fetched from the parent dataset for SnareSeq2 integrated datasets
  const origin_sample = origin_samples[0];
  const { mapped_organ } = origin_sample;

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const { searchHits: processedDatasets } = useProcessedDatasets();

  // Top level request for collections data to determine if there are any collections for any of the datasets
  const collectionsData = useDatasetsCollections([uuid, ...processedDatasets.map((ds) => ds._id)]);
  const publicationsData = useDatasetsPublications([uuid, ...processedDatasets.map((ds) => ds._id)]);
  const vitessceConfig = useVitessceConf(uuid);

  const shouldDisplaySection = {
    summary: true,
    metadata: true,
    visualization: Boolean(vitessceConfig.data || vitessceConfig.isLoading),
    'bulk-data-transfer': true,
    provenance: true,
    protocols: Boolean(protocol_url),
    collections: Boolean(collectionsData.length),
    publications: Boolean(publicationsData.length),
    attribution: true,
  };

  // TODO: The dataset relationships functionality needs to use the ancestor datasets for SnareSeq2 integrated datasets
  // For now, we just use the first immediate ancestor ID, but this should be updated to show relationships all ancestors of the integrated dataset
  const { shouldDisplay: shouldDisplayRelationships } = useDatasetRelationships(immediate_ancestor_ids[0], 'raw');

  if (loadingEntities) {
    return null;
  }

  const datasetRelationshipsContainerHeight = 500;

  return (
    <DetailContextProvider hubmap_id={hubmap_id} uuid={uuid} mapped_data_access_level={mapped_data_access_level}>
      <SelectedVersionStoreProvider initialVersionUUIDs={processedDatasets?.map((ds) => ds._id) ?? []}>
        <DetailLayout sections={shouldDisplaySection} isLoading={false}>
          <Summary
            entityTypeDisplay="Integrated Dataset"
            status={combinedStatus}
            mapped_data_access_level={mapped_data_access_level}
            mapped_external_group_name={mapped_external_group_name}
            bottomFold={
              shouldDisplayRelationships && (
                <>
                  <MultiAssayRelationship />
                  <Box height={datasetRelationshipsContainerHeight} width="100%" component={Paper} p={2}>
                    <DatasetRelationships uuid={immediate_ancestor_ids[0]} processing={'raw'} />
                  </Box>
                </>
              )
            }
          >
            <SummaryDataChildren mapped_data_types={mapped_data_types} mapped_organ={mapped_organ} />
          </Summary>
          {/* TODO: This should be wrapped in a detail page section */}
          <VisualizationWrapper
            uuid={uuid}
            vitData={vitessceConfig.data}
            trackingInfo={{
              category: 'Integrated Dataset',
            }}
          />
          <IntegratedDatasets datasets={immediate_ancestor_ids} />
          <MetadataSection entities={entitiesWithMetadata} shouldDisplay={shouldDisplaySection.metadata} />
          {/* TODO: Should display the parent datasets as well */}
          <BulkDataTransfer shouldDisplay={Boolean(shouldDisplaySection['bulk-data-transfer'])} />
          <ProvSection shouldDisplay={shouldDisplaySection.provenance} />
          <CollectionsSection shouldDisplay={shouldDisplaySection.collections} />
          <PublicationsSection shouldDisplay={shouldDisplaySection.publications} />
          <Attribution>
            <ContributorsTable contributors={contributors} contacts={contacts} />
          </Attribution>
        </DetailLayout>
      </SelectedVersionStoreProvider>
    </DetailContextProvider>
  );
}

export default IntegratedDatasetPage;
