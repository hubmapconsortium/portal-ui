function buildCollectionsPanelsProps(collections) {
  return collections.map(({ _source }) => ({
    key: _source.uuid,
    href: `/browse/collection/${_source.uuid}`,
    title: _source.title,
    secondaryText: _source.hubmap_id,
    rightText: `${_source.datasets.length} Datasets`,
  }));
}

export { buildCollectionsPanelsProps };
