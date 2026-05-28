import { CollectionHit } from './types';

function buildCollectionsPanelsProps(collections: CollectionHit[]) {
  return collections.map(({ _source: { uuid, title, hubmap_id, datasets } }) => ({
    panelKey: uuid,
    href: `/browse/collection/${uuid}`,
    title,
    secondaryText: hubmap_id,
    rightText: `${datasets.length} Datasets`,
  }));
}

export { buildCollectionsPanelsProps };
