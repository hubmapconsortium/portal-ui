import {
  Donor,
  Sample,
  Dataset,
  ESEntityType,
  DatasetEntityType,
  DonorEntityType,
  SampleEntityType,
} from 'js/components/types';
import { get } from './nodash';

const donorMetadataPath = 'mapped_metadata';
const sampleOrDatasetMetadataPath = 'metadata';

type ESEntityTypesWithIcons = Extract<ESEntityType, 'Donor' | 'Sample' | 'Dataset'>;

const paths: Record<ESEntityTypesWithIcons, Partial<Record<ESEntityType, string>>> = {
  Donor: {
    Donor: donorMetadataPath,
  },
  Sample: {
    Donor: `donor.${donorMetadataPath}`,
    Sample: sampleOrDatasetMetadataPath,
  },
  Dataset: {
    Donor: `donor.${donorMetadataPath}`,
    Dataset: sampleOrDatasetMetadataPath,
  },
};

type OnlyEntityTypeRequired<E> = Partial<E> & { entity_type: string };

type MetadataTypes =
  | {
      currentEntityType: DonorEntityType;
      currentEntity: OnlyEntityTypeRequired<Donor>;
      targetEntityType: DonorEntityType;
    }
  | {
      currentEntityType: SampleEntityType;
      currentEntity: OnlyEntityTypeRequired<Sample>;
      targetEntityType: DonorEntityType | SampleEntityType;
    }
  | {
      currentEntityType: DatasetEntityType;
      currentEntity: OnlyEntityTypeRequired<Dataset>;
      targetEntityType: DonorEntityType | DatasetEntityType;
    };

function getMetadataPath({
  currentEntityType,
  targetEntityType,
}: Pick<MetadataTypes, 'currentEntityType' | 'targetEntityType'>) {
  return paths?.[currentEntityType]?.[targetEntityType];
}

type GetMetadataTypes = Pick<MetadataTypes, 'currentEntity' | 'targetEntityType'>;

function getMetadata({ targetEntityType, currentEntity }: GetMetadataTypes) {
  const path = getMetadataPath({ currentEntityType: currentEntity.entity_type, targetEntityType });

  if (!path) {
    return {};
  }

  // Add extra safety in case metadata is `null` or another non-object type.
  const metadata = get(currentEntity, path, {});
  if (typeof metadata === 'object' && metadata !== null) {
    return metadata as Record<string, string | object | unknown[]>;
  }
  return {};
}

function hasMetadata(args: GetMetadataTypes) {
  return Object.keys(getMetadata(args)).length > 0;
}

export { getMetadataPath, getMetadata, hasMetadata };
