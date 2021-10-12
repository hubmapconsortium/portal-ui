function combineMetadata(donor, origin_sample, source_sample, metadata) {
  const donorMetadata = donor?.mapped_metadata || {};
  const combinedMetadata = {
    ...(metadata?.metadata || {}),
    ...Object.fromEntries(Object.entries(donorMetadata).map(([key, value]) => [`donor.${key}`, value])),
  };
  const sampleMetadatas = (source_sample || []).filter((sample) => sample?.metadata).map((sample) => sample.metadata);
  sampleMetadatas.forEach((sampleMetadata) => {
    Object.assign(
      combinedMetadata,
      Object.fromEntries(Object.entries(sampleMetadata).map(([key, value]) => [`sample.${key}`, value])),
    );
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
