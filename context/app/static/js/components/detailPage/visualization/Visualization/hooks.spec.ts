import { renderHook, act } from 'test-utils/functions';

import { useVitessceConfig } from './hooks';

function mockWindowLocation(hash: string, search = '') {
  // @ts-expect-error - Intentionally replacing location for test mock
  delete window.location;
  // @ts-expect-error - Partial Location mock for testing hash/search behavior
  window.location = { hash, search };
}

describe('useVitessceConfig', () => {
  test('without vitessce fragment returns vitData defaults', () => {
    mockWindowLocation('#mock_url_to_be_ignored');
    const vitData = [{ name: 'conf1' }, { name: 'conf2' }];
    const { result } = renderHook(() => useVitessceConfig({ vitData }));

    expect(result.current.vitessceSelection).toEqual(0);
    expect((result.current.vitessceConfig as { name: string }[])[0].name).toEqual('conf1');
    expect((result.current.vitessceConfig as { attr: string }[])[0].attr).toEqual(undefined);
    // localVitessceState should be set to the first config (default)
    expect(result.current.localVitessceState).toEqual({ name: 'conf1' });
    act(() => {
      result.current.setVitessceSelection(1);
    });
    expect(result.current.vitessceSelection).toEqual(1);
  });

  test('with vitessce fragment initializes config from hash', () => {
    mockWindowLocation('#vitessce_conf_=mock_is_called');
    const vitData = [{ name: 'conf1' }, { name: 'conf2' }];
    const { result } = renderHook(() => useVitessceConfig({ vitData }));

    // Config should be initialized (non-null) and selection set
    expect(result.current.vitessceSelection).toEqual(0);
    expect(result.current.vitessceConfig).not.toBeNull();
    expect(result.current.localVitessceState).not.toBeNull();
    act(() => {
      result.current.setVitessceSelection(1);
    });
    expect(result.current.vitessceSelection).toEqual(1);
  });

  test('non-target visualization uses defaults when ?viz= targets a different dataset', () => {
    mockWindowLocation('#vitessce_conf_=mock_is_called', '?viz=other-dataset');
    const vitData = [{ name: 'conf1' }, { name: 'conf2' }];
    const { result } = renderHook(() => useVitessceConfig({ vitData, hubmapId: 'HBM123.ABCD.456' }));

    // Should use defaults since ?viz= doesn't match this instance's hubmapId
    expect(result.current.vitessceSelection).toEqual(0);
    expect(result.current.localVitessceState).toEqual({ name: 'conf1' });
  });

  test('target visualization applies URL config when ?viz= matches hubmapId', () => {
    mockWindowLocation('#vitessce_conf_=mock_is_called', '?viz=hbm123.abcd.456');
    const vitData = [{ name: 'conf1' }, { name: 'conf2' }];
    const { result } = renderHook(() => useVitessceConfig({ vitData, hubmapId: 'HBM123.ABCD.456' }));

    // Should attempt to apply URL config since ?viz= matches this instance's lowercased hubmapId
    expect(result.current.vitessceSelection).toEqual(0);
    expect(result.current.vitessceConfig).not.toBeNull();
    expect(result.current.localVitessceState).not.toBeNull();
  });

  test('legacy URL without ?viz= applies config to all instances (backward compat)', () => {
    mockWindowLocation('#vitessce_conf_=mock_is_called');
    const vitData = [{ name: 'conf1' }, { name: 'conf2' }];
    const { result } = renderHook(() => useVitessceConfig({ vitData, hubmapId: 'HBM123.ABCD.456' }));

    // Without ?viz=, all instances should attempt to decode — backward compatible behavior
    expect(result.current.vitessceConfig).not.toBeNull();
    expect(result.current.localVitessceState).not.toBeNull();
  });

  test('single dataset config sets localVitessceState', () => {
    mockWindowLocation('#some-anchor');
    const vitData = { name: 'single-conf', datasets: [] };
    const { result } = renderHook(() => useVitessceConfig({ vitData }));

    expect(result.current.isMultiDataset).toBe(false);
    expect(result.current.localVitessceState).toEqual({ name: 'single-conf', datasets: [] });
    expect(result.current.currentConfig).toEqual({ name: 'single-conf', datasets: [] });
  });

  test('returns debounced setter for vitessce state', () => {
    mockWindowLocation('');
    const vitData = { name: 'conf1' };
    const { result } = renderHook(() => useVitessceConfig({ vitData }));

    expect(typeof result.current.setLocalVitessceStateDebounced).toBe('function');
  });
});
