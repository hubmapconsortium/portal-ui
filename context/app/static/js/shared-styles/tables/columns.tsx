import React, { ComponentType, useMemo } from 'react';
import { format } from 'date-fns/format';

import { EntityDocument, DatasetDocument, SampleDocument, DonorDocument } from 'js/typings/search';
import { InternalLink } from 'js/shared-styles/Links';
import { getDonorAgeString } from 'js/helpers/functions';
import { trackEvent } from 'js/helpers/trackers';
import { EventInfo } from 'js/components/types';
import Typography from '@mui/material/Typography';
import { useOptionalGeneContext } from 'js/components/cells/SCFindResults/CurrentGeneContext';
import { useCheckDatasetAccess } from 'js/hooks/useRestrictedDatasets';
import { SecondaryBackgroundTooltip } from '../tooltips';

export interface CellContentProps<SearchDoc> {
  hit: SearchDoc;
}

function HubmapIDCell({
  hit: { uuid, hubmap_id, mapped_status, mapped_data_access_level },
  trackingInfo,
  openLinksInNewTab,
}: CellContentProps<EntityDocument> & { trackingInfo: EventInfo; openLinksInNewTab?: boolean }) {
  const checkDatasetAccess = useCheckDatasetAccess();
  const isRestricted = !checkDatasetAccess(uuid);

  const isNotPublic =
    mapped_status &&
    mapped_data_access_level &&
    (mapped_status !== 'Published' || mapped_data_access_level !== 'Public');

  const markerGene = useOptionalGeneContext();

  const href = useMemo(() => {
    const url = new URL(`/browse/dataset/${uuid}`, window.location.origin);
    if (markerGene) {
      url.searchParams.set('marker', markerGene);
    }
    return url.toString();
  }, [uuid, markerGene]);

  const accessTooltip = useMemo(
    () =>
      isRestricted
        ? 'This is a protected dataset that cannot be accessed with your current permissions.'
        : 'This is a protected dataset. Access to this dataset depends on your user permissions.',
    [isRestricted],
  );

  return (
    <>
      <InternalLink
        target={openLinksInNewTab ? '_blank' : '_self'}
        href={href}
        onClick={() =>
          trackingInfo &&
          trackEvent({
            ...trackingInfo,
            action: trackingInfo.action
              ? `${trackingInfo.action} / Select ${trackingInfo.action}`
              : 'Navigate to Dataset from Table',
            label: `${trackingInfo.label} ${hubmap_id}`,
          })
        }
        variant="body2"
      >
        {hubmap_id}
      </InternalLink>
      {(isNotPublic || isRestricted) && (
        <SecondaryBackgroundTooltip title={accessTooltip}>
          <Typography variant="caption" color={isRestricted ? 'error' : 'warning'} sx={{ display: 'block', mt: 1 }}>
            {mapped_status} ({mapped_data_access_level})
          </Typography>
        </SecondaryBackgroundTooltip>
      )}
    </>
  );
}

export const hubmapID = {
  id: 'hubmap_id',
  label: 'HuBMAP ID',
  sort: 'hubmap_id.keyword',
  cellContent: HubmapIDCell,
};

export const hubmapIDWithLinksInNewTab = {
  ...hubmapID,
  cellContent: (props: CellContentProps<EntityDocument> & { trackingInfo: EventInfo }) => (
    <HubmapIDCell {...props} openLinksInNewTab />
  ),
};

function LastModifiedTimestampCell({ hit: { last_modified_timestamp } }: CellContentProps<EntityDocument>) {
  return format(last_modified_timestamp, 'yyyy-MM-dd');
}

export const lastModifiedTimestamp = {
  id: 'last_modified_timestamp',
  label: 'Last Modified',
  cellContent: LastModifiedTimestampCell,
};

function CreatedTimestampCell({ hit: { created_timestamp } }: CellContentProps<EntityDocument>) {
  return format(created_timestamp, 'yyyy-MM-dd');
}

export const createdTimestamp = {
  id: 'created_timestamp',
  label: 'Creation Date',
  cellContent: CreatedTimestampCell,
};

function AssayTypesCell({ hit: { mapped_data_types } }: CellContentProps<DatasetDocument>) {
  return mapped_data_types.join(', ');
}

export const assayTypes = {
  id: 'mapped_data_types',
  label: 'Data Type',
  sort: 'mapped_data_types.keyword',
  cellContent: AssayTypesCell,
};

function StatusCell({ hit: { mapped_status, mapped_data_access_level } }: CellContentProps<DatasetDocument>) {
  return `${mapped_status} (${mapped_data_access_level})`;
}

export const status = {
  id: 'mapped_status',
  label: 'Status',
  sort: 'mapped_status.keyword',
  cellContent: StatusCell,
};

function OrganCell({
  hit: { origin_samples_unique_mapped_organs },
}: CellContentProps<DatasetDocument | SampleDocument>) {
  return origin_samples_unique_mapped_organs.join(', ');
}

export const organ = {
  id: 'origin_samples.mapped_organ',
  label: 'Organ',
  sort: 'origin_samples.mapped_organ.keyword',
  cellContent: OrganCell,
};

function withParentDonor(Component: ComponentType<{ hit: DonorDocument }>) {
  return function D({ hit: { donor } }: CellContentProps<SampleDocument | DatasetDocument>) {
    return <Component hit={donor} />;
  };
}

function DonorAge({ hit }: CellContentProps<DonorDocument>) {
  return hit?.mapped_metadata && getDonorAgeString(hit?.mapped_metadata);
}

export const parentDonorAge = {
  id: 'donor.mapped_metadata.age_value',
  label: 'Donor Age',
  sort: 'donor.mapped_metadata.age_value',
  cellContent: withParentDonor(DonorAge),
};

function DonorSex({ hit }: CellContentProps<DonorDocument>) {
  return hit?.mapped_metadata?.sex;
}

export const parentDonorSex = {
  id: 'donor.mapped_metadata.sex',
  label: 'Donor Sex',
  sort: 'donor.mapped_metadata.sex.keyword',
  cellContent: withParentDonor(DonorSex),
};

function DonorRace({ hit }: CellContentProps<DonorDocument>) {
  return hit?.mapped_metadata?.race;
}

export const parentDonorRace = {
  id: 'donor.mapped_metadata.race',
  label: 'Donor Race',
  sort: 'donor.mapped_metadata.race.keyword',
  cellContent: withParentDonor(DonorRace),
};

export const datasetDescendants = {
  id: 'descendant_counts.entity_type.Dataset',
  label: 'Derived Dataset Count',
  cellContent: ({ hit: { descendant_counts } }: CellContentProps<EntityDocument>) =>
    descendant_counts?.entity_type?.Dataset ?? 0,
};
