import { getSearchURL } from './utils';

test('should construct search url', () => {
  const searchURL = getSearchURL('Whatever', ['Elbow (Left)', 'Elbow (Right)']);
  const [path, query] = searchURL.split('?');
  expect(path).toEqual('/search');
  expect(decodeURI(query).split('&')).toEqual([
    'entity_type[0]=Whatever',
    'origin_sample.mapped_organ[0]=Elbow+(Left)',
    'origin_sample.mapped_organ[1]=Elbow+(Right)',
  ]);
});
