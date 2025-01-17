import { DonorIcon } from 'js/shared-styles/icons';
import { buildTableData, sortEntities, TableEntity } from './utils';

/**
 * =============================================================================
 *                                buildTableData
 * =============================================================================
 */

test('should look up field descriptions', () => {
  expect(
    buildTableData(
      {
        assay_type: 'FAKE-seq',
      },
      {
        assay_type: 'The specific type of assay being executed.',
      },
    ),
  ).toEqual([
    {
      description: 'The specific type of assay being executed.',
      key: 'assay_type',
      value: 'FAKE-seq',
    },
  ]);
});

test('should remove nested objects, but concat nested lists', () => {
  expect(
    buildTableData(
      {
        object: { foo: 'bar' },
        list: ['foo', 'bar'],
      },
      {},
    ),
  ).toEqual([
    {
      description: undefined,
      key: 'list',
      value: 'foo, bar',
    },
  ]);
});

test('should remove keys that are not metadata', () => {
  expect(
    buildTableData(
      {
        contributors_path: '/local/path',
        antibodies_path: '/local/path',
        version: '42',
      },
      {},
    ),
  ).toEqual([]);
});

/**
 * =============================================================================
 *                                sortEntities
 * =============================================================================
 */

const baseEntity = {
  icon: DonorIcon,
  tableRows: [],
};

const current: TableEntity = {
  ...baseEntity,
  uuid: 'current',
  label: 'Current',
  entity_type: 'Dataset',
  hubmap_id: 'current',
};

const donor: TableEntity = {
  ...baseEntity,
  uuid: 'donor',
  label: 'Donor',
  entity_type: 'Donor',
  hubmap_id: 'donor',
};

const uniqueSample1: TableEntity = {
  ...baseEntity,
  uuid: 'sample1',
  label: 'Unique Category',
  entity_type: 'Sample',
  hubmap_id: 'sample1',
};

const duplicateSample2: TableEntity = {
  ...baseEntity,
  uuid: 'sample2',
  label: 'Duplicate Category (sample2)',
  entity_type: 'Sample',
  hubmap_id: 'sample2',
};

const duplicateSample3: TableEntity = {
  ...baseEntity,
  uuid: 'sample3',
  label: 'Duplicate Category (sample3)',
  entity_type: 'Sample',
  hubmap_id: 'sample3',
};

test('should sort by current -> donor -> samples without IDs in their label -> samples with IDs in their label', () => {
  expect(
    sortEntities({
      tableEntities: [duplicateSample2, duplicateSample3, donor, current, uniqueSample1],
      uuid: 'current',
    }),
  ).toEqual([current, donor, uniqueSample1, duplicateSample2, duplicateSample3]);
});

test('should sort by current -> samples without IDs in their label -> samples with IDs in their label when donor is absent', () => {
  expect(
    sortEntities({
      tableEntities: [duplicateSample2, current, uniqueSample1, duplicateSample3],
      uuid: 'current',
    }),
  ).toEqual([current, uniqueSample1, duplicateSample2, duplicateSample3]);
});

test('should sort by donor -> samples without IDs -> samples with IDs when current is absent', () => {
  expect(
    sortEntities({
      tableEntities: [duplicateSample3, duplicateSample2, donor, uniqueSample1],
      uuid: 'current',
    }),
  ).toEqual([donor, uniqueSample1, duplicateSample2, duplicateSample3]);
});

test('should return only the current entity if no other entities are present', () => {
  expect(
    sortEntities({
      tableEntities: [current],
      uuid: 'current',
    }),
  ).toEqual([current]);
});
