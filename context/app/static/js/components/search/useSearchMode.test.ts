import { renderHook, act } from '@testing-library/react';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import { useSearchMode } from './useSearchMode';

describe('useSearchMode', () => {
  it('defaults to "filter" when no mode param is in the URL', () => {
    const { result } = renderHook(() => useSearchMode(), {
      wrapper: withNuqsTestingAdapter({ searchParams: '' }),
    });
    expect(result.current[0]).toBe('filter');
  });

  it('reads the value from the URL when ?mode=say-see is set', () => {
    const { result } = renderHook(() => useSearchMode(), {
      wrapper: withNuqsTestingAdapter({ searchParams: '?mode=say-see' }),
    });
    expect(result.current[0]).toBe('say-see');
  });

  it('clamps unknown mode values back to the default', () => {
    const { result } = renderHook(() => useSearchMode(), {
      wrapper: withNuqsTestingAdapter({ searchParams: '?mode=bogus' }),
    });
    expect(result.current[0]).toBe('filter');
  });

  it('round-trips a setMode call through the URL', async () => {
    const onUrlUpdate: jest.MockedFunction<OnUrlUpdateFunction> = jest.fn();
    const { result } = renderHook(() => useSearchMode(), {
      wrapper: withNuqsTestingAdapter({ searchParams: '', onUrlUpdate, hasMemory: true }),
    });

    await act(async () => {
      await result.current[1]('say-see');
    });

    expect(onUrlUpdate).toHaveBeenCalled();
    const lastCall = onUrlUpdate.mock.calls.at(-1)![0];
    expect(lastCall.searchParams.get('mode')).toBe('say-see');
  });
});
