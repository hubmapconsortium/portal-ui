import { getSearchURL } from './utils';

test('construct search url w/o assay', () => {
  const searchURL = getSearchURL({ entityType: 'Whatever', organTerms: ['Elbow (Left)', 'Elbow (Right)'] });
  const [path, query] = searchURL.split('?');
  expect(path).toEqual('/search');
  expect(decodeURI(query).split('&')).toEqual([
    'entity_type[0]=Whatever',
    'origin_samples.mapped_organ[0]=Elbow+(Left)',
    'origin_samples.mapped_organ[1]=Elbow+(Right)',
  ]);
});

test('construct search url w/ assay', () => {
  const searchURL = getSearchURL({ entityType: 'Whatever', organTerms: ['Nose'], assay: ['something FISH'] });
  const [path, query] = searchURL.split('?');
  expect(path).toEqual('/search');
  expect(decodeURI(query).split('&')).toEqual([
    'entity_type[0]=Whatever',
    'origin_samples.mapped_organ[0]=Nose',
    'mapped_data_types[0]=something+FISH',
  ]);
});
