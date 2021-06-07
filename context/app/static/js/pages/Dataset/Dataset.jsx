import React, { useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'js/shared-styles/alerts';
import { LightBlueLink } from 'js/shared-styles/Links';
import Files from 'js/components/files/Files';
import ProvSection from 'js/components/Detail/provenance/ProvSection';
import Summary from 'js/components/Detail/Summary';
import Attribution from 'js/components/Detail/Attribution';
import Protocol from 'js/components/Detail/Protocol';
import MetadataTable from 'js/components/Detail/MetadataTable';
import VisualizationWrapper from 'js/components/Detail/visualization/VisualizationWrapper';
import DetailLayout from 'js/components/Detail/DetailLayout';
import SummaryItem from 'js/components/Detail/SummaryItem';
import useSendUUIDEvent from 'js/components/Detail/useSendUUIDEvent';
import useEntityStore from 'js/stores/useEntityStore';
import { AppContext } from 'js/components/Providers';
import useCollectionsData from 'js/hooks/useCollectionsData';
import CollectionsSection from 'js/components/Detail/CollectionsSection';
import SupportAlert from 'js/components/Detail/SupportAlert';

// TODO use this context for components other than FileBrowser
import DetailContext from 'js/components/Detail/context';
import { getSectionOrder } from 'js/components/Detail/utils';

function SummaryDataChildren(props) {
  const { mapped_data_types, origin_sample } = props;
  return (
    <>
      <SummaryItem>
        <LightBlueLink variant="h6" href="/docs/assays" underline="none">
          {mapped_data_types}
        </LightBlueLink>
      </SummaryItem>
      <Typography variant="h6" component="p">
        {origin_sample.mapped_organ}
      </Typography>
    </>
  );
}

function getCollectionsWhichContainDataset(uuid, collections) {
  return collections.filter((collection) => {
    // eslint-disable-next-line no-underscore-dangle
    return collection._source.datasets.some((dataset) => dataset.uuid === uuid);
  });
}

const entityStoreSelector = (state) => state.setAssayMetadata;

function DatasetDetail(props) {
  const { assayMetadata, vitData } = props;
  const {
    protocol_url,
    metadata,
    files,
    uuid,
    data_types,
    mapped_data_types,
    origin_sample,
    origin_sample: { mapped_organ },
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    display_doi,
    entity_type,
    create_timestamp,
    last_modified_timestamp,
    description,
    status,
    mapped_data_access_level,
  } = assayMetadata;
  const isLatest = !('next_revision_uuid' in assayMetadata);

  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const allCollections = useCollectionsData(elasticsearchEndpoint, nexusToken);
  const collectionsData = getCollectionsWhichContainDataset(uuid, allCollections);

  const shouldDisplaySection = {
    provenance: entity_type !== 'Support',
    visualization: Boolean(vitData),
    protocols: Boolean(protocol_url),
    metadata: metadata && 'metadata' in metadata,
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
    setAssayMetadata({ display_doi, entity_type, mapped_data_types, mapped_organ });
  }, [setAssayMetadata, display_doi, entity_type, mapped_data_types, mapped_organ]);

  // TODO: When all environments are clean, data_types array fallbacks shouldn't be needed.
  return (
    <DetailContext.Provider value={{ display_doi, uuid, mapped_data_access_level }}>
      {!isLatest && (
        <Alert severity="warning" $marginBottom="16">
          <span>
            {/* <span> to override "display: flex" which splits this on to multiple lines. */}
            You are viewing an older version of this page. Navigate to a{' '}
            <LightBlueLink href={`/browse/dataset/${assayMetadata.next_revision_uuid}`}>
              more recent version
            </LightBlueLink>
            .
          </span>
        </Alert>
      )}
      {entity_type === 'Support' && <SupportAlert uuid={uuid} />}
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          display_doi={display_doi}
          create_timestamp={create_timestamp}
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
        {shouldDisplaySection.visualization && <VisualizationWrapper vitData={vitData} />}
        {shouldDisplaySection.provenance && <ProvSection uuid={uuid} assayMetadata={assayMetadata} />}
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadata && <MetadataTable metadata={metadata.metadata} display_doi={display_doi} />}
        <Files files={files} uuid={uuid} display_doi={display_doi} />
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
