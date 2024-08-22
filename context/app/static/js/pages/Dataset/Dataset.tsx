import React, { useEffect } from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { ButtonProps } from '@mui/material/Button';

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
import useEntityStore, { EntityStore } from 'js/stores/useEntityStore';
import CollectionsSection from 'js/components/detailPage/CollectionsSection';
import SupportAlert from 'js/components/detailPage/SupportAlert';
import { DetailPageAlert } from 'js/components/detailPage/style';
import BulkDataTransfer from 'js/components/detailPage/BulkDataTransfer';

import WorkspacesIcon from 'assets/svg/workspaces.svg';
import { DetailContextProvider } from 'js/components/detailPage/DetailContext';
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
import { Dataset, Entity, isDataset, isSupport, Sample, Support } from 'js/components/types';
import useDatasetLabel from './hooks';

function NotebookButton({ disabled, ...props }: { disabled: boolean } & ButtonProps) {
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

interface SummaryDataChildrenProps {
  mapped_data_types: string[];
  mapped_organ: string;
  doi_url?: string;
  registered_doi?: string;
  hubmap_id: string;
  uuid: string;
  mapped_data_access_level: string;
}

function SummaryDataChildren({
  mapped_data_types,
  mapped_organ,
  doi_url,
  registered_doi,
  hubmap_id,
  uuid,
  mapped_data_access_level,
}: SummaryDataChildrenProps) {
  const { isWorkspacesUser } = useAppContext();
  const { setDialogIsOpen, removeDatasets, ...rest } = useCreateWorkspaceForm({
    defaultName: hubmap_id,
    initialSelectedDatasets: [uuid],
  });
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const dataTypes = mapped_data_types.join(', ');
  return (
    <>
      <SummaryItem>
        <InternalLink
          variant="h6"
          href="https://docs.hubmapconsortium.org/assays"
          underline="none"
          onClick={() => trackEntityPageEvent({ action: 'Assay Documentation Navigation', label: dataTypes })}
        >
          {dataTypes}
        </InternalLink>
      </SummaryItem>
      <SummaryItem showDivider={Boolean(doi_url)}>
        <InternalLink variant="h6" href={`/organ/${mapped_organ}`} underline="none">
          {mapped_organ}
        </InternalLink>
      </SummaryItem>
      {doi_url && (
        <OutboundIconLink href={doi_url} variant="h6">
          doi:{registered_doi}
        </OutboundIconLink>
      )}
      {isWorkspacesUser && (
        <>
          <NotebookButton onClick={() => setDialogIsOpen(true)} disabled={mapped_data_access_level === 'Protected'} />
          <NewWorkspaceDialog {...rest} />
        </>
      )}
    </>
  );
}

const entityStoreSelector = (state: EntityStore) => state.setAssayMetadata;

function OldVersionAlert({ uuid, isLatest }: { uuid: string; isLatest: boolean }) {
  if (isLatest) {
    return null;
  }
  return (
    <DetailPageAlert severity="warning">
      <span>
        {/* <span> to override "display: flex" which splits this on to multiple lines. */}
        You are viewing an older version of this page. Navigate to the{' '}
        <InternalLink href={`/browse/latest/dataset/${uuid}`}>latest version</InternalLink>.
      </span>
    </DetailPageAlert>
  );
}

function ExternalDatasetAlert({ isExternal }: { isExternal: boolean }) {
  if (!isExternal) {
    return null;
  }

  return (
    <DetailPageAlert severity="info">
      You are viewing an external dataset that was not generated by the HuBMAP Consortium.
    </DetailPageAlert>
  );
}

interface EntityDetailProps<T extends Entity> {
  assayMetadata: T;
  vitData: object | object[];
  hasNotebook?: boolean;
  visLiftedUUID: string;
}

function makeMetadataSectionProps(metadata: Record<string, string>, assay_modality: 'single' | 'multiple') {
  return assay_modality === 'multiple' ? { assay_modality } : { metadata, assay_modality };
}

function SupportDetail({ assayMetadata }: EntityDetailProps<Support>) {
  const {
    metadata,
    files,
    donor,
    source_samples,
    uuid,
    mapped_data_types,
    origin_samples,
    hubmap_id,
    entity_type,
    published_timestamp,
    status,
    mapped_data_access_level,
    mapped_external_group_name,
    contributors,
    contacts,
    is_component,
    assay_modality,
  } = assayMetadata;

  const isLatest = !('next_revision_uuid' in assayMetadata);

  const combinedMetadata = combineMetadata(
    donor,
    origin_samples[0],
    source_samples as Sample[],
    metadata as Record<string, unknown>,
  );

  const shouldDisplaySection: Record<string, boolean> = {
    provenance: false,
    metadata: Boolean(Object.keys(combinedMetadata).length) || assay_modality === 'multiple',
    files: Boolean(files?.length),
    bulkDataTransfer: true,
    contributors: Boolean(contributors && (contributors as unknown[]).length),
  };

  const sectionOrder = getSectionOrder(
    ['summary', 'metadata', 'files', 'bulk-data-transfer', 'contributors', 'attribution'],
    shouldDisplaySection,
  );

  const setAssayMetadata = useEntityStore(entityStoreSelector);

  useEffect(() => {
    setAssayMetadata({
      hubmap_id,
      entity_type,
      mapped_data_types,
    });
  }, [entity_type, hubmap_id, mapped_data_types, setAssayMetadata]);

  const datasetLabel = useDatasetLabel();

  return (
    <DetailContextProvider hubmap_id={hubmap_id} uuid={uuid} mapped_data_access_level={mapped_data_access_level}>
      <OldVersionAlert uuid={uuid} isLatest={isLatest} />
      <ExternalDatasetAlert isExternal={Boolean(mapped_external_group_name)} />
      <SupportAlert uuid={uuid} isSupport={entity_type === 'Support'} />
      {Boolean(is_component) && <ComponentAlert />}
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          entityTypeDisplay={datasetLabel}
          published_timestamp={published_timestamp}
          status={status}
          mapped_data_access_level={mapped_data_access_level}
          bottomFold={
            <>
              <MultiAssayRelationship assay_modality={assay_modality} />
              <DataProducts files={files} />
            </>
          }
        >
          <SummaryDataChildren
            mapped_organ={origin_samples[0].mapped_organ}
            mapped_data_types={mapped_data_types}
            uuid={uuid}
            hubmap_id={hubmap_id}
            mapped_data_access_level={mapped_data_access_level}
          />
        </Summary>
        {shouldDisplaySection.metadata && (
          <MetadataSection {...makeMetadataSectionProps(combinedMetadata, assay_modality)} />
        )}
        {shouldDisplaySection.files && <Files files={files} />}
        {shouldDisplaySection.bulkDataTransfer && <BulkDataTransfer />}
        {shouldDisplaySection.contributors && (
          <ContributorsTable contributors={contributors} contacts={contacts} title="Contributors" showIconPanel />
        )}

        <Attribution />
      </DetailLayout>
    </DetailContextProvider>
  );
}

function DatasetDetail({ assayMetadata, vitData, hasNotebook }: EntityDetailProps<Dataset>) {
  const {
    protocol_url,
    metadata,
    files,
    donor,
    source_samples,
    uuid,
    mapped_data_types,
    origin_samples,
    hubmap_id,
    entity_type,
    published_timestamp,
    status,
    sub_status,
    mapped_data_access_level,
    mapped_external_group_name,
    registered_doi,
    doi_url,
    contributors,
    contacts,
    is_component,
    assay_modality,
  } = assayMetadata;

  const isLatest = !('next_revision_uuid' in assayMetadata);

  const origin_sample = origin_samples[0];
  const { mapped_organ } = origin_sample;

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const combinedMetadata = combineMetadata(
    donor,
    origin_sample,
    source_samples as Sample[],
    metadata as Record<string, unknown>,
  );

  const collectionsData = useDatasetsCollections([uuid]);

  const shouldDisplaySection: Record<string, boolean> = {
    provenance: true,
    visualization: Boolean(vitData),
    protocols: Boolean(protocol_url),
    metadata: Boolean(Object.keys(combinedMetadata).length) || assay_modality === 'multiple',
    files: Boolean(files?.length),
    bulkDataTransfer: true,
    collections: Boolean(collectionsData.length),
    contributors: Boolean(contributors && (contributors as unknown[]).length),
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

  const setAssayMetadata = useEntityStore(entityStoreSelector);

  useEffect(() => {
    setAssayMetadata({ hubmap_id, entity_type, mapped_data_types, mapped_organ });
  }, [entity_type, hubmap_id, mapped_data_types, mapped_organ, setAssayMetadata]);

  const datasetLabel = useDatasetLabel();

  const metadataSectionProps =
    assay_modality === 'multiple' ? { assay_modality } : { metadata: combinedMetadata, assay_modality };

  return (
    <DetailContextProvider hubmap_id={hubmap_id} uuid={uuid} mapped_data_access_level={mapped_data_access_level}>
      <OldVersionAlert uuid={uuid} isLatest={isLatest} />
      <ExternalDatasetAlert isExternal={Boolean(mapped_external_group_name)} />
      {Boolean(is_component) && <ComponentAlert />}
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          entityTypeDisplay={datasetLabel}
          published_timestamp={published_timestamp}
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
            mapped_data_types={mapped_data_types}
            mapped_organ={mapped_organ}
            registered_doi={registered_doi}
            doi_url={doi_url}
            uuid={uuid}
            hubmap_id={hubmap_id}
            mapped_data_access_level={mapped_data_access_level}
          />
        </Summary>
        {shouldDisplaySection.visualization && (
          <VisualizationWrapper
            vitData={vitData}
            uuid={uuid}
            hubmap_id={hubmap_id}
            mapped_data_access_level={mapped_data_access_level}
            hasNotebook={hasNotebook}
          />
        )}
        {shouldDisplaySection.provenance && <ProvSection />}
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadata && <MetadataSection {...metadataSectionProps} />}
        {shouldDisplaySection.files && <Files files={files} />}
        {shouldDisplaySection.bulkDataTransfer && <BulkDataTransfer />}
        {shouldDisplaySection.collections && <CollectionsSection collectionsData={collectionsData} />}
        {shouldDisplaySection.contributors && (
          <ContributorsTable contributors={contributors} contacts={contacts} title="Contributors" showIconPanel />
        )}
        <Attribution />
      </DetailLayout>
    </DetailContextProvider>
  );
}

// Shared logic for the Dataset and Support cases
function DetailPageWrapper({ assayMetadata, ...props }: EntityDetailProps<Entity>) {
  const { entity_type, hubmap_id } = assayMetadata;
  useTrackID({ entity_type, hubmap_id });

  if (isDataset(assayMetadata)) {
    return <DatasetDetail assayMetadata={assayMetadata} {...props} />;
  }
  if (isSupport(assayMetadata)) {
    return <SupportDetail assayMetadata={assayMetadata} {...props} />;
  }
  console.error('Unsupported entity type');
  return null;
}

export default DetailPageWrapper;
