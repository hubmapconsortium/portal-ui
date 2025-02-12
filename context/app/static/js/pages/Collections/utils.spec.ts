import { CollectionHit } from './types';
import { buildCollectionsPanelsProps } from './utils';

test('should return the props require for the panel list', () => {
  const collections: CollectionHit[] = [
    {
      _source: {
        uuid: 'abc123',
        title: 'Collection ABC',
        hubmap_id: 'HBM_ABC123',
        datasets: [
          { hubmap_id: 'a', uuid: 'a123' },
          { hubmap_id: 'b', uuid: 'b234' },
          { hubmap_id: 'c', uuid: 'c345' },
        ],
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
