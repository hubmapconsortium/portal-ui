function addPrefix(prefix, object) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [prefix + key, value]));
}

function prefixDonorMetadata(donor) {
  const donorMetadata = donor?.mapped_metadata || {};
  return addPrefix('donor.', donorMetadata);
}

function prefixSampleMetadata(source_sample) {
  const sampleMetadatas = (source_sample || []).filter((sample) => sample?.metadata).map((sample) => sample.metadata);
  return sampleMetadatas.map((sampleMetadata) => addPrefix('sample.', sampleMetadata));
}

function combineMetadata(donor, origin_sample, source_sample, metadata) {
  const combinedMetadata = {
    ...(metadata?.metadata || {}),
    ...prefixDonorMetadata(donor),
  };
  prefixSampleMetadata(source_sample).forEach((sampleMetadata) => {
    Object.assign(combinedMetadata, sampleMetadata);
  });

  return combinedMetadata;
}
export { combineMetadata };
