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

function getCollectionsWhichContainDataset(uuid, collections) {
  return collections.filter((collection) => {
    // eslint-disable-next-line no-underscore-dangle
    return collection._source.datasets.some((dataset) => dataset.uuid === uuid);
  });
}

export { combineMetadata, getCollectionsWhichContainDataset };
