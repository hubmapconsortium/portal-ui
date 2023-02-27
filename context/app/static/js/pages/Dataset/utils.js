function getCollectionsWhichContainDataset(uuid, collections) {
  return collections.filter((collection) => {
    // eslint-disable-next-line no-underscore-dangle
    return collection._source.datasets.some((dataset) => dataset.uuid === uuid);
  });
}

export { getCollectionsWhichContainDataset };
