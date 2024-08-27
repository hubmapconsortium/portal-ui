import { Donor, Sample } from 'js/components/types';
import { combineMetadata } from './entity-utils';

test('robust against undefined data', () => {
  const donor = undefined;
  const source_samples = undefined;
  const metadata = undefined;
  // @ts-expect-error - This is a test case for bad data.
  expect(combineMetadata(donor, source_samples, metadata)).toEqual({});
});

test('robust against empty objects', () => {
  const donor = {};
  const source_samples: Sample[] = [];
  const metadata = {};
  // @ts-expect-error - This is a test case for bad data.
  expect(combineMetadata(donor, source_samples, metadata)).toEqual({});
});

test('combines appropriately structured metadata', () => {
  // This information is also available in the "ancestors" list,
  // but metadata is structured differently between Samples and Donors,
  // so it wouldn't simplify things to use that.
  const donor = {
    created_by_user_displayname: 'John Doe',
    mapped_metadata: {
      age_unit: ['years'],
      age_value: [40],
    },
    metadata: {
      // This is the source of the mapped_metadata.
      living_donor_data: [],
    },
  } as unknown as Donor;
  const source_samples = [
    {
      // mapped_metadata seems to be empty.
      mapped_metadata: {},
      metadata: {
        cold_ischemia_time_unit: 'minutes',
        cold_ischemia_time_value: '100',
      },
    },
  ] as unknown as Sample[];
  const metadata = {
    dag_provenance_list: [],
    extra_metadata: {},
    metadata: {
      analyte_class: 'polysaccharides',
      assay_category: 'imaging',
      assay_type: 'PAS microscopy',
    },
  };
  expect(combineMetadata(donor, source_samples, metadata)).toEqual({
    analyte_class: 'polysaccharides',
    assay_category: 'imaging',
    assay_type: 'PAS microscopy',
    'donor.age_unit': ['years'],
    'donor.age_value': [40],
    'sample.cold_ischemia_time_unit': 'minutes',
    'sample.cold_ischemia_time_value': '100',
  });
});
