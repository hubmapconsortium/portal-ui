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
  const searchURL = getSearchURL({
    entityType: 'Whatever',
    organTerms: ['Nose'],
    assay: 'something FISH',
    assayTypeMap: { 'something FISH': ['abc', 'def', 'ghi'] },
  });
  const [path, query] = searchURL.split('?');
  expect(path).toEqual('/search');
  expect(decodeURI(query).split('&')).toEqual([
    'entity_type[0]=Whatever',
    'origin_samples.mapped_organ[0]=Nose',
    'raw_dataset_type_keyword-assay_display_name_keyword[something+FISH][0]=abc',
    'raw_dataset_type_keyword-assay_display_name_keyword[something+FISH][1]=def',
    'raw_dataset_type_keyword-assay_display_name_keyword[something+FISH][2]=ghi',
  ]);
});

test('construct search url w/ assay, organ, donor sex, donor race, and processing status', () => {
  const searchURL = getSearchURL({
    entityType: 'Whatever',
    organTerms: ['Nose'],
    assay: 'something FISH',
    assayTypeMap: { 'something FISH': ['abc', 'def', 'ghi'] },
    donorSex: 'Unknown',
    donorRace: 'Klingon',
    processingStatus: 'Processed',
  });
  const [path, query] = searchURL.split('?');
  expect(path).toEqual('/search');
  expect(decodeURI(query).split('&')).toEqual([
    'entity_type[0]=Whatever',
    'origin_samples.mapped_organ[0]=Nose',
    'donor.mapped_metadata.race[0]=Klingon',
    'donor.mapped_metadata.sex[0]=Unknown',
    'processing[0]=Processed',
    'raw_dataset_type_keyword-assay_display_name_keyword[something+FISH][0]=abc',
    'raw_dataset_type_keyword-assay_display_name_keyword[something+FISH][1]=def',
    'raw_dataset_type_keyword-assay_display_name_keyword[something+FISH][2]=ghi',
  ]);
});

test('construct search url w/ mapped assay and organ', () => {
  const searchURL = getSearchURL({
    entityType: 'Whatever',
    organTerms: ['Nose'],
    assayTypeMap: { 'something FISH': ['abc', 'def', 'ghi'] },
    mappedAssay: 'abc',
  });
  const [path, query] = searchURL.split('?');
  expect(path).toEqual('/search');
  expect(decodeURI(query).split('&')).toEqual([
    'entity_type[0]=Whatever',
    'origin_samples.mapped_organ[0]=Nose',
    'raw_dataset_type_keyword-assay_display_name_keyword[something+FISH][0]=abc',
  ]);
});
