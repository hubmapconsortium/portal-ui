import { renderHook, act } from 'test-utils/functions';

import { useVitessceConfig } from './hooks';

describe('Run Vitessce Hooks Test', () => {
  test('Vitessce Config Hook Test Without Vitessce Fragment Returns vitData', () => {
    // @ts-expect-error Spec setup
    delete window.location;

    // @ts-expect-error Spec setup
    window.location = {
      hash: `#mock_url_to_be_ignored`,
    };
    const vitData = [{ name: 'conf1' }, { name: 'conf2' }];
    const props = { vitData, setVitessceState: () => {} };
    const { result } = renderHook(() => useVitessceConfig(props));

    expect(result.current.vitessceSelection).toEqual(0);
    expect((result.current.vitessceConfig as { name: string }[])[0].name).toEqual('conf1');
    expect((result.current.vitessceConfig as { attr: string }[])[0].attr).toEqual(undefined);
    act(() => {
      result.current.setVitessceSelection(1);
    });

    expect(result.current.vitessceSelection).toEqual(1);
  });

  test('Vitessce Config Hook Test With Vitessce Fragment Return Decoded Mock', () => {
    // Mocked vitessce config returns ({ name: 'conf1', attr: 'bar' }) in __mocks__/vitessce
    // @ts-expect-error Spec setup
    delete window.location;
    // @ts-expect-error Spec setup
    window.location = {
      hash: `#vitessce_conf_=mock_is_called`,
    };
    const vitData = [{ name: 'conf1' }, { name: 'conf2' }];
    const props = { vitData, setVitessceState: () => {} };
    const { result } = renderHook(() => useVitessceConfig(props));

    expect(result.current.vitessceSelection).toEqual(0);
    expect((result.current.vitessceConfig as { name: string }[])[0].name).toEqual('conf1');
    expect((result.current.vitessceConfig as { attr: string }[])[0].attr).toEqual('bar');
    act(() => {
      result.current.setVitessceSelection(1);
    });

    expect(result.current.vitessceSelection).toEqual(1);
  });
});
