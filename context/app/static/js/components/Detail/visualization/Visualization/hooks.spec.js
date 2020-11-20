// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook, act } from '@testing-library/react-hooks';
import { encodeConfInUrl } from 'vitessce';

import { useVitessceConfig } from './hooks';

test('Vitessce Config Hook Test', () => {
  const urlConf = { name: 'conf1' };
  const urlParams = encodeConfInUrl({ conf: urlConf });
  delete window.location;
  window.location = {
    hash: `#${urlParams}`,
  };
  const vitData = [{ name: 'conf1' }, { name: 'conf2' }];
  const props = { vitData, setVitessceState: () => {} };
  const { result } = renderHook(() => useVitessceConfig(props));

  expect(result.current.vitessceSelection).toEqual(0);
  expect(result.current.vitessceConfig[0].name).toEqual('conf1');
  act(() => {
    result.current.setVitessceSelection(1);
  });

  expect(result.current.vitessceSelection).toEqual(1);
});
