import { Donor, Sample, Dataset } from 'js/components/Contexts';
import { get } from './nodash';

const donorMetadataPath = 'mapped_metadata';
const sampleMetdataPath = 'metadata';

type DonorEntityType = 'Donor';
type SampleEntityType = 'Sample';
type DatasetEntityType = 'Dataset';

type EntityType = DonorEntityType | SampleEntityType | DatasetEntityType;

const paths: Record<EntityType, Partial<Record<EntityType, string>>> = {
  Donor: {
    Donor: donorMetadataPath,
  },
  Sample: {
    Donor: `donor.${donorMetadataPath}`,
    Sample: sampleMetdataPath,
  },
  Dataset: {
    Donor: `donor.${donorMetadataPath}`,
    Dataset: 'metadata.metadata',
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

  return get(currentEntity, path, {});
}

function hasMetadata(args: GetMetadataTypes) {
  return Object.keys(getMetadata(args)).length > 0;
}

export { getMetadataPath, getMetadata, hasMetadata };
