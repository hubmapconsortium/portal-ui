import React from 'react';
import { renderHook, AllTheProviders } from 'test-utils/functions';

import SearchConfigProvider from 'js/components/entity-search/SearchWrapper';
import { useGroupedFacets } from './hooks';

const searchDataFixture = {
  'donor.mapped_metadata.age_value': {
    avg: 44.1220653843975,
    count: 4251,
    max: 78,
    min: 1,
    sum: 187562.8999490738,
  },
  'donor.mapped_metadata.body_mass_index_value': {
    avg: 28.45118761917169,
    count: 3906,
    max: 64.0999984741211,
    min: 15.869999885559082,
    sum: 111130.33884048462,
  },
  'donor.mapped_metadata.height_value': {
    avg: 167.3203374860197,
    count: 3084,
    max: 193,
    min: 63,
    sum: 516015.92080688477,
  },
  'donor.mapped_metadata.kidney_donor_profile_index_value': {
    avg: 60.33448573898012,
    count: 1157,
    max: 100,
    min: 4,
    sum: 69807,
  },
  'donor.mapped_metadata.weight_value': {
    avg: 86.70690611580775,
    count: 3084,
    max: 250,
    min: 10.100000381469727,
    sum: 267404.0984611511,
  },
  'metadata.metadata.ablation_distance_between_shots_x_value': {
    avg: 1,
    count: 16,
    max: 1,
    min: 1,
    sum: 16,
  },
  'metadata.metadata.ablation_distance_between_shots_y_value': {
    avg: 1,
    count: 16,
    max: 1,
    min: 1,
    sum: 16,
  },
  'metadata.metadata.ablation_frequency_value': {
    avg: 237.5,
    count: 16,
    max: 400,
    min: 200,
    sum: 3800,
  },
  'metadata.metadata.area_normalized_ion_dose_value': {
    avg: 7,
    count: 211,
    max: 7,
    min: 7,
    sum: 1477,
  },
  'metadata.metadata.bulk_rna_isolation_quality_metric_value': {
    avg: 9.100000023841858,
    count: 8,
    max: 9.600000381469727,
    min: 8.699999809265137,
    sum: 72.80000019073486,
  },
  'metadata.metadata.bulk_rna_yield_value': {
    avg: 104.47500133514404,
    count: 8,
    max: 248,
    min: 27.299999237060547,
    sum: 835.8000106811523,
  },
  'metadata.metadata.column_length_value': {
    avg: null,
    count: 0,
    max: null,
    min: null,
    sum: 0,
  },
  'metadata.metadata.column_temp_value': {
    avg: null,
    count: 0,
    max: null,
    min: null,
    sum: 0,
  },
  'metadata.metadata.data_precision_bytes': {
    avg: 2.1160714285714284,
    count: 224,
    max: 4,
    min: 2,
    sum: 474,
  },
  'metadata.metadata.desi_solvent_flow_rate': {
    avg: 1.2076922746805043,
    count: 13,
    max: 1.2999999523162842,
    min: 1,
    sum: 15.699999570846558,
  },
  'metadata.metadata.dna_assay_input_value': {
    avg: 1.2647058823529411,
    count: 17,
    max: 1.5,
    min: 1,
    sum: 21.5,
  },
  'metadata.metadata.dual_count_start': {
    avg: 0.05803571428571429,
    count: 224,
    max: 1,
    min: 0,
    sum: 13,
  },
  'metadata.metadata.expected_cell_count': {
    avg: 7156.626506024097,
    count: 83,
    max: 22000,
    min: 1000,
    sum: 594000,
  },
  'metadata.metadata.increment_z_value': {
    avg: 1.493333339691162,
    count: 3,
    max: 2.4800000190734863,
    min: 1,
    sum: 4.480000019073486,
  },
  'metadata.metadata.lc_flow_rate_value': {
    avg: 103.27619048527309,
    count: 210,
    max: 600,
    min: 0.5,
    sum: 21688.00000190735,
  },
  'metadata.metadata.lc_id_value': {
    avg: 24.21904754638672,
    count: 210,
    max: 100,
    min: 2.0999999046325684,
    sum: 5085.999984741211,
  },
  'metadata.metadata.lc_length_value': {
    avg: 63.357142857142854,
    count: 210,
    max: 100,
    min: 15,
    sum: 13305,
  },
  'metadata.metadata.lc_temp_value': {
    avg: 47.80952380952381,
    count: 210,
    max: 60,
    min: 21,
    sum: 10040,
  },
  'metadata.metadata.library_average_fragment_size': {
    avg: 576.4526166902405,
    count: 707,
    max: 2196,
    min: 150,
    sum: 407552,
  },
  'metadata.metadata.library_concentration_value': {
    avg: 8.899999856948853,
    count: 16,
    max: 11.699999809265137,
    min: 6.099999904632568,
    sum: 142.39999771118164,
  },
  'metadata.metadata.library_final_yield': {
    avg: 5256.807000013335,
    count: 280,
    max: 20480,
    min: 1.8700000047683716,
    sum: 1471905.9600037336,
  },
  'metadata.metadata.library_final_yield_value': {
    avg: 641.852482471868,
    count: 427,
    max: 3115,
    min: 8.640000343322754,
    sum: 274071.0100154877,
  },
  'metadata.metadata.library_pcr_cycles': {
    avg: 12.205278592375366,
    count: 682,
    max: 19,
    min: 6,
    sum: 8324,
  },
  'metadata.metadata.library_pcr_cycles_for_sample_index': {
    avg: 11.295252225519288,
    count: 674,
    max: 16,
    min: 0,
    sum: 7613,
  },
  'metadata.metadata.mass_resolving_power': {
    avg: 77583.08974358975,
    count: 234,
    max: 120000,
    min: 34443,
    sum: 18154443,
  },
  'metadata.metadata.max_x_width_value': {
    avg: 814.0969162995594,
    count: 227,
    max: 1000,
    min: 800,
    sum: 184800,
  },
  'metadata.metadata.max_y_height_value': {
    avg: 814.0969162995594,
    count: 227,
    max: 1000,
    min: 800,
    sum: 184800,
  },
  'metadata.metadata.mz_range_high_value': {
    avg: 1476.3083333333334,
    count: 360,
    max: 20000,
    min: 1000,
    sum: 531471,
  },
  'metadata.metadata.mz_range_low_value': {
    avg: 129.17777777777778,
    count: 360,
    max: 4500,
    min: 50,
    sum: 46504,
  },
  'metadata.metadata.mz_resolving_power': {
    avg: 3622.676837106036,
    count: 234,
    max: 60000,
    min: 200,
    sum: 847706.3798828125,
  },
  'metadata.metadata.number_of_antibodies': {
    avg: 36.889518413597735,
    count: 353,
    max: 57,
    min: 1,
    sum: 13022,
  },
  'metadata.metadata.number_of_barcode_probes': {
    avg: 34,
    count: 9,
    max: 45,
    min: 12,
    sum: 306,
  },
  'metadata.metadata.number_of_barcode_regions_per_barcode_probe': {
    avg: 5.666666666666667,
    count: 9,
    max: 6,
    min: 5,
    sum: 51,
  },
  'metadata.metadata.number_of_channels': {
    avg: 26.374695863746958,
    count: 411,
    max: 45,
    min: 1,
    sum: 10840,
  },
  'metadata.metadata.number_of_cycles': {
    avg: 16.864864864864863,
    count: 148,
    max: 26,
    min: 4,
    sum: 2496,
  },
  'metadata.metadata.number_of_imaging_rounds': {
    avg: 18,
    count: 12,
    max: 18,
    min: 18,
    sum: 216,
  },
  'metadata.metadata.number_of_pseudocolors_per_channel': {
    avg: 1,
    count: 9,
    max: 1,
    min: 1,
    sum: 9,
  },
  'metadata.metadata.number_of_readout_probes_per_channel': {
    avg: 1,
    count: 9,
    max: 1,
    min: 1,
    sum: 9,
  },
  'metadata.metadata.number_of_sections': {
    avg: 53.333333333333336,
    count: 3,
    max: 58,
    min: 50,
    sum: 160,
  },
  'metadata.metadata.pixel_dwell_time_value': {
    avg: 1,
    count: 211,
    max: 1,
    min: 1,
    sum: 211,
  },
  'metadata.metadata.pixel_size_x_value': {
    avg: 391,
    count: 211,
    max: 391,
    min: 391,
    sum: 82501,
  },
  'metadata.metadata.pixel_size_y_value': {
    avg: 391,
    count: 211,
    max: 391,
    min: 391,
    sum: 82501,
  },
  'metadata.metadata.primary_ion_current_value': {
    avg: 5000,
    count: 211,
    max: 5000,
    min: 5000,
    sum: 1055000,
  },
  'metadata.metadata.range_z_value': {
    avg: 1843.6666666666667,
    count: 3,
    max: 2567,
    min: 598,
    sum: 5531,
  },
  'metadata.metadata.resolution_x_value': {
    avg: 380.5041222802692,
    count: 544,
    max: 4679.72021484375,
    min: 0.1120000034570694,
    sum: 206994.24252046645,
  },
  'metadata.metadata.resolution_y_value': {
    avg: 380.4655840176103,
    count: 544,
    max: 4658.75,
    min: 0.11259999871253967,
    sum: 206973.27770558,
  },
  'metadata.metadata.resolution_z_value': {
    avg: 435.82674418604654,
    count: 215,
    max: 1500,
    min: 0,
    sum: 93702.75,
  },
  'metadata.metadata.rnaseq_assay_input': {
    avg: 22326.41899441341,
    count: 358,
    max: 270000,
    min: 356,
    sum: 7992858,
  },
  'metadata.metadata.rnaseq_assay_input_value': {
    avg: 1,
    count: 8,
    max: 1,
    min: 1,
    sum: 8,
  },
  'metadata.metadata.roi_id': {
    avg: 1.1145374449339207,
    count: 227,
    max: 6,
    min: 1,
    sum: 253,
  },
  'metadata.metadata.sc_isolation_cell_number': {
    avg: 2812039.9507154212,
    count: 629,
    max: 33500000,
    min: 1488,
    sum: 1768773129,
  },
  'metadata.metadata.sequencing_phix_percent': {
    avg: 10.932475247516532,
    count: 707,
    max: 20,
    min: 0,
    sum: 7729.259999994189,
  },
  'metadata.metadata.sequencing_read_percent_q30': {
    avg: 85.19276505818293,
    count: 707,
    max: 97.0999984741211,
    min: 0,
    sum: 60231.28489613533,
  },
  'metadata.metadata.step_z_value': {
    avg: 1333,
    count: 3,
    max: 2366,
    min: 598,
    sum: 3999,
  },
  'metadata.metadata.transposition_input': {
    avg: 148964.68045112782,
    count: 266,
    max: 4000000,
    min: 356,
    sum: 39624605,
  },
  'metadata.metadata.umi_offset': {
    avg: 17,
    count: 6,
    max: 17,
    min: 17,
    sum: 102,
  },
  'metadata.metadata.umi_size': {
    avg: 12,
    count: 6,
    max: 12,
    min: 12,
    sum: 72,
  },
};

jest.mock('js/hooks/useSearchData', () =>
  jest.fn(() => ({ searchData: { aggregations: searchDataFixture }, isLoading: false })),
);

jest.mock(
  'js/components/entity-search/Search',
  () =>
    function SearchMock() {
      return <div />;
    },
);

test('should group facets', () => {
  const facets = {
    mapped_data_types: { facetGroup: 'Dataset Metadata' },
    mapped_status: { facetGroup: 'Dataset Metadata' },
    group_name: { facetGroup: 'Affiliation' },
  };
  const resultsFacets = [
    { identifier: 'mapped_data_types' },
    { identifier: 'group_name' },
    { identifier: 'mapped_status' },
  ];

  const entityType = 'dataset';
  const wrapper = ({ children }) => (
    <AllTheProviders>
      <SearchConfigProvider uniqueFacets={facets} uniqueFields={{}} entityType={entityType}>
        {children}
      </SearchConfigProvider>
    </AllTheProviders>
  );

  const { result } = renderHook(() => useGroupedFacets(resultsFacets), {
    wrapper,
  });

  expect(result.current).toStrictEqual({
    'Dataset Metadata': [{ identifier: 'mapped_data_types' }, { identifier: 'mapped_status' }],
    Affiliation: [{ identifier: 'group_name' }],
  });
});
