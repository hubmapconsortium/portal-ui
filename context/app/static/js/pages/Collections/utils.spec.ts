import { CollectionHit } from './types';
import { buildCollectionsPanelsProps } from './utils';

test('should return the props require for the panel list', () => {
  const collections: CollectionHit[] = [
    {
      _source: {
        uuid: 'abc123',
        title: 'Collection ABC',
        hubmap_id: 'HBM_ABC123',
        datasets: [{ hubmap_id: 'a' }, { hubmap_id: 'b' }, { hubmap_id: 'c' }],
      },
    },
  ];

  expect(buildCollectionsPanelsProps(collections)).toEqual([
    {
      key: 'abc123',
      href: '/browse/collection/abc123',
      title: 'Collection ABC',
      secondaryText: 'HBM_ABC123',
      rightText: '3 Datasets',
    },
  ]);
});
