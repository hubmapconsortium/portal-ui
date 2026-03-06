interface DonorMappedMetadata {
  sex?: string;
  age_value?: number;
  age_unit?: string;
  height_value?: number;
  height_unit?: string;
  weight_value?: number;
  weight_unit?: string;
  race?: string;
  medicalHistory?: string[];
}

export interface DatasetForLD {
  mapped_data_types: string[];
  origin_samples_unique_mapped_organs: string[];
  donor?: { mapped_metadata: DonorMappedMetadata };
  created_by_user_displayname: string;
  group_name: string;
  description?: string;
}

function getDatasetLD(entity: DatasetForLD) {
  // Based on https://developers.google.com/search/docs/data-types/dataset#guidelines
  const assayOrganString = `${String(entity.mapped_data_types)} of ${entity.origin_samples_unique_mapped_organs.join(', ')}`;
  let name = `${assayOrganString} from unknown donor`;
  let fallbackDescription = name;

  const donor = entity.donor?.mapped_metadata;
  if (donor) {
    const shortDonorString = `${donor.sex || '(Unknown sex)'}, ${donor.age_value || '(Unknown age)'} ${
      donor.age_unit || '(Unknown age unit)'
    } old`;
    const heightString = `${donor.height_value || ''} ${donor.height_unit || ''}`;
    const weightString = `${donor.weight_value || ''} ${donor.weight_unit || ''}`;
    const longDonorString = `${heightString}, ${weightString}, ${donor.race || ''} ${shortDonorString}`;
    const medicalHistory = donor.medicalHistory ? `${donor.medicalHistory.join(', ')}` : 'no medical history';
    name = `${assayOrganString} from ${shortDonorString}`;
    fallbackDescription = `${assayOrganString} from ${longDonorString} with ${medicalHistory}`;
  }

  return {
    '@context': 'https://schema.org/' as const,
    '@type': 'Dataset' as const,
    name,
    description:
      entity.description && entity.description.length >= 50
        ? entity.description
        : `${fallbackDescription}. ${entity.description}`,
    creator: [
      {
        '@type': 'Person' as const,
        // sameAs: 'http://orcid.org/0000-0000-0000-0001',
        name: entity.created_by_user_displayname,
      },
      {
        '@type': 'Organization' as const,
        // TODO: sameAs: 'http://ror.org/xxxxxxxxx',
        name: entity.group_name,
      },
    ],
  };
}

function setJsonLD(entity: DatasetForLD) {
  const ld = getDatasetLD(entity);
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(ld, null, 2);
  document.head.appendChild(script);
}

export { getDatasetLD, setJsonLD };
