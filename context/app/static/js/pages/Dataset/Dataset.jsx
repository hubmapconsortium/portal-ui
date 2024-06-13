import React, { useEffect, useMemo } from 'react';
import SvgIcon from '@mui/material/SvgIcon';

import { useAppContext } from 'js/components/Contexts';
import { InternalLink } from 'js/shared-styles/Links';
import Files from 'js/components/detailPage/files/Files';
import DataProducts from 'js/components/detailPage/files/DataProducts';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import Protocol from 'js/components/detailPage/Protocol';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import useEntityStore from 'js/stores/useEntityStore';
import CollectionsSection from 'js/components/detailPage/CollectionsSection';
import SupportAlert from 'js/components/detailPage/SupportAlert';
import { DetailPageAlert } from 'js/components/detailPage/style';
import BulkDataTransfer from 'js/components/detailPage/BulkDataTransfer';

import WorkspacesIcon from 'assets/svg/workspaces.svg';
// TODO use this context for components other than FileBrowser
import { DetailContext } from 'js/components/detailPage/DetailContext';
import { getSectionOrder, getCombinedDatasetStatus } from 'js/components/detailPage/utils';

import { combineMetadata } from 'js/pages/utils/entity-utils';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { useDatasetsCollections } from 'js/hooks/useDatasetsCollections';
import useTrackID from 'js/hooks/useTrackID';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import ComponentAlert from 'js/components/detailPage/multi-assay/ComponentAlert';
import MultiAssayRelationship from 'js/components/detailPage/multi-assay/MultiAssayRelationship';
import MetadataSection from 'js/components/detailPage/MetadataSection';
import useDatasetLabel from './getDatasetLabel';

function NotebookButton({ disabled, ...props }) {
  return (
    <TooltipIconButton
      color="primary"
      disabled={disabled}
      {...props}
      tooltip={disabled ? 'Protected datasets are not available in Workspaces.' : 'Launch a new workspace.'}
    >
      <SvgIcon component={WorkspacesIcon} />
    </TooltipIconButton>
  );
}

function SummaryDataChildren({
  mapped_data_types,
  origin_sample,
  doi_url,
  registered_doi,
  hubmap_id,
  uuid,
  mapped_data_access_level,
}) {
  const { isWorkspacesUser } = useAppContext();
  const { setDialogIsOpen, ...rest } = useCreateWorkspaceForm({ defaultName: hubmap_id });
  const trackEntityPageEvent = useTrackEntityPageEvent();
  return (
    <>
      <SummaryItem>
        <InternalLink
          variant="h6"
          href="https://software.docs.hubmapconsortium.org/assays"
          underline="none"
          onClick={() => trackEntityPageEvent({ action: 'Assay Documentation Navigation', label: mapped_data_types })}
        >
          {mapped_data_types}
        </InternalLink>
      </SummaryItem>
      <SummaryItem showDivider={Boolean(doi_url)}>
        <InternalLink variant="h6" href={`/organ/${origin_sample.mapped_organ}`} underline="none">
          {origin_sample.mapped_organ}
        </InternalLink>
      </SummaryItem>
      {doi_url && (
        <OutboundIconLink isOutbound href={doi_url} variant="h6" iconFontSize="1.1rem">
          doi:{registered_doi}
        </OutboundIconLink>
      )}
      {isWorkspacesUser && (
        <>
          <NotebookButton onClick={() => setDialogIsOpen(true)} disabled={mapped_data_access_level === 'Protected'} />
          <NewWorkspaceDialog datasetUUIDs={new Set([uuid])} {...rest} />
        </>
      )}
    </>
  );
}

const entityStoreSelector = (state) => state.setAssayMetadata;

function DatasetDetail({ assayMetadata, vitData, hasNotebook, visLiftedUUID }) {
  const {
    protocol_url,
    metadata,
    files,
    donor,
    source_samples,
    uuid,
    data_types,
    mapped_data_types,
    origin_samples,
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    hubmap_id,
    entity_type,
    created_timestamp,
    last_modified_timestamp,
    published_timestamp,
    description,
    status,
    sub_status,
    mapped_data_access_level,
    mapped_external_group_name,
    registered_doi,
    doi_url,
    contributors,
    is_component,
    assay_modality,
  } = assayMetadata;
  const isLatest = !('next_revision_uuid' in assayMetadata);

  // TODO: Update design to reflect samples and datasets which have multiple origin samples with different organs.
  const origin_sample = origin_samples[0];
  const { mapped_organ } = origin_sample;

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const combinedMetadata = combineMetadata(donor, origin_sample, source_samples, metadata);

  const collectionsData = useDatasetsCollections([uuid]);

  const shouldDisplaySection = {
    provenance: entity_type !== 'Support',
    visualization: Boolean(vitData),
    protocols: Boolean(protocol_url),
    metadata: Boolean(Object.keys(combinedMetadata).length) || assay_modality === 'multiple',
    files: Boolean(files?.length),
    bulkDataTransfer: true,
    collections: Boolean(collectionsData.length),
    contributors: contributors && Boolean(contributors.length),
  };

  const sectionOrder = getSectionOrder(
    [
      'summary',
      'visualization',
      'provenance',
      'protocols',
      'metadata',
      'files',
      'bulk-data-transfer',
      'collections',
      'contributors',
      'attribution',
    ],
    shouldDisplaySection,
  );

  useTrackID({ entity_type, hubmap_id });

  const setAssayMetadata = useEntityStore(entityStoreSelector);

  useEffect(() => {
    setAssayMetadata({ hubmap_id, entity_type, mapped_data_types, mapped_organ });
  }, [entity_type, hubmap_id, mapped_data_types, mapped_organ, setAssayMetadata]);

  const detailContextValue = useMemo(
    () => ({ hubmap_id, uuid, mapped_data_access_level }),
    [hubmap_id, mapped_data_access_level, uuid],
  );

  const datasetLabel = useDatasetLabel();
  // TODO: When all environments are clean, data_types array fallbacks shouldn't be needed.
  return (
    <DetailContext.Provider value={detailContextValue}>
      {!isLatest && (
        <DetailPageAlert severity="warning" $marginBottom="16">
          <span>
            {/* <span> to override "display: flex" which splits this on to multiple lines. */}
            You are viewing an older version of this page. Navigate to the{' '}
            <InternalLink href={`/browse/latest/dataset/${uuid}`}>latest version</InternalLink>.
          </span>
        </DetailPageAlert>
      )}
      {mapped_external_group_name && (
        <DetailPageAlert severity="info" $marginBottom="16">
          You are viewing an external dataset that was not generated by the HuBMAP Consortium.
        </DetailPageAlert>
      )}
      {entity_type === 'Support' && <SupportAlert uuid={uuid} />}
      {is_component && <ComponentAlert />}
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          title={hubmap_id}
          uuid={uuid}
          entity_type={entity_type}
          entityTypeDisplay={datasetLabel}
          created_timestamp={created_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          published_timestamp={published_timestamp}
          description={description}
          status={combinedStatus}
          mapped_data_access_level={mapped_data_access_level}
          mapped_external_group_name={mapped_external_group_name}
          bottomFold={
            <>
              <MultiAssayRelationship assay_modality={assay_modality} />
              <DataProducts files={files} />
            </>
          }
        >
          <SummaryDataChildren
            data_types={data_types || []}
            mapped_data_types={mapped_data_types || []}
            origin_sample={origin_sample}
            registered_doi={registered_doi}
            doi_url={doi_url}
            uuid={uuid}
            hubmap_id={hubmap_id}
            mapped_data_access_level={mapped_data_access_level}
          />
        </Summary>
        {shouldDisplaySection.visualization && (
          <VisualizationWrapper vitData={vitData} uuid={uuid} hasNotebook={hasNotebook} />
        )}
        {shouldDisplaySection.provenance && <ProvSection uuid={uuid} assayMetadata={assayMetadata} />}
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadata && (
          <MetadataSection metadata={combinedMetadata} assay_modality={assay_modality} />
        )}
        {shouldDisplaySection.files && (
          <Files files={files} uuid={uuid} hubmap_id={hubmap_id} visLiftedUUID={visLiftedUUID} />
        )}
        {shouldDisplaySection.bulkDataTransfer && <BulkDataTransfer visLiftedUUID={visLiftedUUID} />}
        {shouldDisplaySection.collections && <CollectionsSection collectionsData={collectionsData} />}
        {shouldDisplaySection.contributors && <ContributorsTable contributors={contributors} title="Contributors" />}

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
