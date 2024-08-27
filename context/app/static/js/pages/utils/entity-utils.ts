import { Donor, Sample } from 'js/components/types';

function addPrefix(prefix: string, object: object) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [prefix + key, value]));
}

function prefixDonorMetadata(donor: Donor | null | undefined) {
  const donorMetadata = donor?.mapped_metadata ?? {};
  return addPrefix('donor.', donorMetadata);
}

function prefixSampleMetadata(source_samples: Sample[] | null | undefined) {
  const sampleMetadatas = (source_samples ?? []).filter((sample) => sample?.metadata).map((sample) => sample.metadata);
  return sampleMetadatas.map((sampleMetadata) => addPrefix('sample.', sampleMetadata));
}

function combineMetadata(
  donor: Donor,
  source_samples: Sample[] = [],
  metadata: Record<string, unknown> | null | undefined = {},
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const combinedMetadata: Record<string, string> = {
    ...(metadata?.metadata ?? {}),
    ...prefixDonorMetadata(donor),
  };
  prefixSampleMetadata(source_samples).forEach((sampleMetadata) => {
    Object.assign(combinedMetadata, sampleMetadata);
  });

  return combinedMetadata;
}
export { combineMetadata };
