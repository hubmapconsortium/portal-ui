import { invertKeyToArrayMap } from './utils';

test('should invert map', () => {
  const initialMap = {
    empty_value_ok: [],
    ablation_frequency_value: ['3D Imaging Mass Cytometry', 'Imaging Mass Cytometry'],
    acquisition_id: ['3D Imaging Mass Cytometry', 'Imaging Mass Cytometry', 'Multiplex Ion Beam Imaging'],
  };

  expect(invertKeyToArrayMap(initialMap)).toEqual({
    '3D Imaging Mass Cytometry': ['ablation_frequency_value', 'acquisition_id'],
    'Imaging Mass Cytometry': ['ablation_frequency_value', 'acquisition_id'],
    'Multiplex Ion Beam Imaging': ['acquisition_id'],
  });
});
