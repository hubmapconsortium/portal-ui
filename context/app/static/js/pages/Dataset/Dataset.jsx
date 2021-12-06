import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';
import Files from 'js/components/detailPage/files/Files';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import Protocol from 'js/components/detailPage/Protocol';
import MetadataTable from 'js/components/detailPage/MetadataTable';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import useSendUUIDEvent from 'js/components/detailPage/useSendUUIDEvent';
import useEntityStore from 'js/stores/useEntityStore';
import CollectionsSection from 'js/components/detailPage/CollectionsSection';
import SupportAlert from 'js/components/detailPage/SupportAlert';
import { DetailPageAlert } from 'js/shared-styles/alerts';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';

// TODO use this context for components other than FileBrowser
import DetailContext from 'js/components/detailPage/context';
import { getSectionOrder } from 'js/components/detailPage/utils';
import { combineMetadata, getCollectionsWhichContainDataset } from 'js/pages/utils/entity-utils';

function SummaryDataChildren(props) {
  const { mapped_data_types, origin_sample } = props;
  return (
    <Typography variant="h6">
      <LightBlueLink href="/docs/assays">{mapped_data_types}</LightBlueLink>
      {' | '}
      <LightBlueLink href="/organ">{origin_sample.mapped_organ}</LightBlueLink>
    </Typography>
  );
}

const entityStoreSelector = (state) => state.setAssayMetadata;

function DatasetDetail(props) {
  const { assayMetadata, vitData, hasNotebook, visLiftedUUID } = props;
  const {
    protocol_url,
    metadata,
    files,
    donor,
    source_sample,
    uuid,
    data_types,
    mapped_data_types,
    origin_sample,
    origin_sample: { mapped_organ },
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    hubmap_id,
    entity_type,
    created_timestamp,
    last_modified_timestamp,
    description,
    status,
    mapped_data_access_level,
  } = assayMetadata;
  const isLatest = !('next_revision_uuid' in assayMetadata);

  const combinedMetadata = combineMetadata(donor, origin_sample, source_sample, metadata);

  const { searchHits: allCollections } = useSearchHits(getAllCollectionsQuery);
  const collectionsData = getCollectionsWhichContainDataset(uuid, allCollections);

  const shouldDisplaySection = {
    provenance: entity_type !== 'Support',
    visualization: Boolean(vitData),
    protocols: Boolean(protocol_url),
    metadata: Boolean(Object.keys(combinedMetadata).length),
    files: true,
    collections: Boolean(collectionsData.length),
  };

  const sectionOrder = getSectionOrder(
    ['summary', 'visualization', 'provenance', 'protocols', 'metadata', 'files', 'collections', 'attribution'],
    shouldDisplaySection,
  );

  useSendUUIDEvent(entity_type, uuid);

  const setAssayMetadata = useEntityStore(entityStoreSelector);
  useEffect(() => {
    setAssayMetadata({ hubmap_id, entity_type, mapped_data_types, mapped_organ });
  }, [setAssayMetadata, hubmap_id, entity_type, mapped_data_types, mapped_organ]);

  // TODO: When all environments are clean, data_types array fallbacks shouldn't be needed.
  return (
    <DetailContext.Provider value={{ hubmap_id, uuid, mapped_data_access_level }}>
      {!isLatest && (
        <DetailPageAlert severity="warning" $marginBottom="16">
          <span>
            {/* <span> to override "display: flex" which splits this on to multiple lines. */}
            You are viewing an older version of this page. Navigate to the{' '}
            <LightBlueLink href={`/browse/latest/dataset/${uuid}`}>latest version</LightBlueLink>.
          </span>
        </DetailPageAlert>
      )}
      {entity_type === 'Support' && <SupportAlert uuid={uuid} />}
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          hubmap_id={hubmap_id}
          created_timestamp={created_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
          status={status}
          mapped_data_access_level={mapped_data_access_level}
          group_name={group_name}
        >
          <SummaryDataChildren
            data_types={data_types || []}
            mapped_data_types={mapped_data_types || []}
            origin_sample={origin_sample}
          />
        </Summary>
        {shouldDisplaySection.visualization && (
          <VisualizationWrapper vitData={vitData} uuid={uuid} hasNotebook={hasNotebook} />
        )}
        {shouldDisplaySection.provenance && <ProvSection uuid={uuid} assayMetadata={assayMetadata} />}
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadata && <MetadataTable metadata={combinedMetadata} hubmap_id={hubmap_id} />}
        <Files files={files} uuid={uuid} hubmap_id={hubmap_id} visLiftedUUID={visLiftedUUID} />
        {shouldDisplaySection.collections && <CollectionsSection collectionsData={collectionsData} />}
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default DatasetDetail;
