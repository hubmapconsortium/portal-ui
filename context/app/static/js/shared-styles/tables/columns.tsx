import React, { useMemo } from 'react';
import { format } from 'date-fns/format';

import { EntityDocument, DatasetDocument, SampleDocument, DonorDocument } from 'js/typings/search';
import { InternalLink } from 'js/shared-styles/Links';
import { getDonorAgeString, getDemographicRangeString } from 'js/helpers/functions';
import { trackEvent } from 'js/helpers/trackers';
import { EventInfo } from 'js/components/types';
import Typography from '@mui/material/Typography';
import { useOptionalGeneContext } from 'js/components/cells/SCFindResults/CurrentGeneContext';
import { SecondaryBackgroundTooltip } from '../tooltips';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useDatasetAccess } from 'js/hooks/useDatasetPermissions';
import { useEventCallback } from '@mui/material/utils';

export interface CellContentProps<SearchDoc> {
  hit: SearchDoc;
}

type DatasetAccessWarningProps = Pick<EntityDocument, 'uuid' | 'mapped_status' | 'mapped_data_access_level'>;
const DatasetAccessWarning = ({ uuid, mapped_status, mapped_data_access_level }: DatasetAccessWarningProps) => {
  const { accessAllowed, isLoading } = useDatasetAccess(uuid);

  if (accessAllowed || isLoading) {
    return null;
  }
  return (
    <SecondaryBackgroundTooltip title="This is a protected dataset that cannot be accessed with your current permissions.">
      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
        {mapped_status} ({mapped_data_access_level})
      </Typography>
    </SecondaryBackgroundTooltip>
  );
};

function HubmapIDCell({
  hit: { uuid, hubmap_id, mapped_status, mapped_data_access_level, entity_type },
  trackingInfo,
  openLinksInNewTab,
}: CellContentProps<EntityDocument> & { trackingInfo: EventInfo; openLinksInNewTab?: boolean }) {
  const isDataset = entity_type === 'Dataset';
  const markerGene = useOptionalGeneContext();

  const flaskData = useFlaskDataContext();

  const isCurrentEntity = flaskData?.entity?.uuid === uuid;

  const href = useMemo(() => {
    const url = new URL(`/browse/${entity_type.toLowerCase()}/${uuid}`, window.location.origin);
    if (markerGene) {
      url.searchParams.set('marker', markerGene);
    }
    return url.toString();
  }, [uuid, markerGene, entity_type]);

  const handleLinkClick = useEventCallback(() => {
    if (trackingInfo) {
      trackEvent({
        ...trackingInfo,
        action: trackingInfo.action
          ? `${trackingInfo.action} / Select ${trackingInfo.action}`
          : 'Navigate to Dataset from Table',
        label: `${trackingInfo?.label} ${hubmap_id}`,
      });
    }
  });

  return (
    <>
      {isCurrentEntity ? (
        <>
          <div>{hubmap_id}</div>
          <Typography variant="caption" color="grey.500">
            (Current {entity_type})
          </Typography>
        </>
      ) : (
        <InternalLink
          target={openLinksInNewTab ? '_blank' : '_self'}
          href={href}
          onClick={handleLinkClick}
          variant="body2"
        >
          {hubmap_id}
        </InternalLink>
      )}

      {isDataset && (
        <DatasetAccessWarning
          uuid={uuid}
          mapped_data_access_level={mapped_data_access_level}
          mapped_status={mapped_status}
        />
      )}
    </>
  );
}

export const hubmapID = {
  id: 'hubmap_id',
  label: 'HuBMAP ID',
  sort: 'hubmap_id.keyword',
  cellContent: HubmapIDCell,
  width: 180,
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
  width: 150,
};

function CreatedTimestampCell({ hit: { created_timestamp } }: CellContentProps<EntityDocument>) {
  return format(created_timestamp, 'yyyy-MM-dd');
}

export const createdTimestamp = {
  id: 'created_timestamp',
  label: 'Creation Date',
  cellContent: CreatedTimestampCell,
  width: 150,
  sort: 'created_timestamp',
};

function AssayTypesCell({ hit: { mapped_data_types } }: CellContentProps<DatasetDocument>) {
  return mapped_data_types?.join(', ') ?? '';
}

export const assayTypes = {
  id: 'mapped_data_types',
  label: 'Data Type',
  sort: 'mapped_data_types.keyword',
  cellContent: AssayTypesCell,
  width: 270,
  filterable: true,
};

function StatusCell({ hit: { mapped_status, mapped_data_access_level } }: CellContentProps<DatasetDocument>) {
  return `${mapped_status} (${mapped_data_access_level})`;
}

export const status = {
  id: 'mapped_status',
  label: 'Status',
  sort: 'mapped_status.keyword',
  cellContent: StatusCell,
  filterable: true,
};

function OrganCell({
  hit: { origin_samples_unique_mapped_organs },
}: CellContentProps<DatasetDocument | SampleDocument>) {
  return origin_samples_unique_mapped_organs?.join(', ') ?? '';
}

export const organCol = {
  id: 'origin_samples.mapped_organ',
  label: 'Organ',
  sort: 'origin_samples.mapped_organ.keyword',
  cellContent: OrganCell,
  width: 180,
  filterable: true,
};

// Donor-entity cell components read the single donor's own mapped_metadata.
// Parent (Dataset/Sample) cell components read donor_demographics, aggregated across all donors.

function DonorAge({ hit }: CellContentProps<DonorDocument>) {
  return hit?.mapped_metadata && getDonorAgeString(hit?.mapped_metadata);
}

function ParentDonorAge({ hit: { donor_demographics } }: CellContentProps<SampleDocument | DatasetDocument>) {
  return getDemographicRangeString(donor_demographics?.age, donor_demographics?.age_unit);
}

export const parentDonorAge = {
  id: 'donor_demographics.age_value',
  label: 'Donor Age',
  sort: 'donor_demographics.age_value',
  cellContent: ParentDonorAge,
  width: 150,
  filterable: true,
};

export const donorAge = {
  ...parentDonorAge,
  id: 'mapped_metadata.age_value',
  cellContent: DonorAge,
  sort: 'mapped_metadata.age_value',
};

function DonorBMI({ hit }: CellContentProps<DonorDocument>) {
  return hit?.mapped_metadata?.body_mass_index_value;
}

export const donorBMI = {
  id: 'mapped_metadata.body_mass_index_value',
  label: 'Donor BMI',
  sort: 'mapped_metadata.body_mass_index_value',
  cellContent: DonorBMI,
  width: 150,
  filterable: true,
};

function DonorSex({ hit }: CellContentProps<DonorDocument>) {
  return hit?.mapped_metadata?.sex;
}

function ParentDonorSex({ hit: { donor_demographics } }: CellContentProps<SampleDocument | DatasetDocument>) {
  return (donor_demographics?.sex ?? []).join(', ');
}

export const parentDonorSex = {
  id: 'donor_demographics.sex',
  label: 'Donor Sex',
  sort: 'donor_demographics.sex.keyword',
  cellContent: ParentDonorSex,
  width: 150,
  filterable: true,
};

export const donorSex = {
  ...parentDonorSex,
  id: 'mapped_metadata.sex',
  cellContent: DonorSex,
  sort: 'mapped_metadata.sex.keyword',
};

function DonorRace({ hit }: CellContentProps<DonorDocument>) {
  return hit?.mapped_metadata?.race;
}

function ParentDonorRace({ hit: { donor_demographics } }: CellContentProps<SampleDocument | DatasetDocument>) {
  return (donor_demographics?.race ?? []).join(', ');
}

export const parentDonorRace = {
  id: 'donor_demographics.race',
  label: 'Donor Race',
  sort: 'donor_demographics.race.keyword',
  cellContent: ParentDonorRace,
  width: 150,
  filterable: true,
};

export const donorRace = {
  ...parentDonorRace,
  id: 'mapped_metadata.race',
  cellContent: DonorRace,
  sort: 'mapped_metadata.race.keyword',
};

export const datasetDescendants = {
  id: 'descendant_counts.entity_type.Dataset',
  label: 'Derived Dataset Count',
  cellContent: ({ hit: { descendant_counts } }: CellContentProps<EntityDocument>) =>
    descendant_counts?.entity_type?.Dataset ?? 0,
  width: 150,
};

export const anatomy = {
  id: 'anatomy_2',
  label: 'Anatomy',
  sort: 'anatomy_2.keyword',
  cellContent: ({ hit: { anatomy_2, anatomy_1 } }: CellContentProps<SampleDocument>) =>
    (Array.isArray(anatomy_2) ? anatomy_2.join(', ') : anatomy_2) ||
    (Array.isArray(anatomy_1) ? anatomy_1.join(', ') : anatomy_1) ||
    '—',
  width: 150,
};

export const datasetDescription = {
  id: 'description',
  label: 'Description',
  cellContent: ({ hit: { description } }: CellContentProps<DatasetDocument>) => description,
  width: 600,
};
