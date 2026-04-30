import { renderHook, act } from '@testing-library/react';
import useOpenInWorkspacesTrigger from './openInWorkspacesStore';

describe('useOpenInWorkspacesTrigger', () => {
  beforeEach(() => {
    useOpenInWorkspacesTrigger.setState({ pending: null });
  });

  it('starts with no pending request', () => {
    const { result } = renderHook(() => useOpenInWorkspacesTrigger());
    expect(result.current.pending).toBeNull();
  });

  it('trigger() populates pending with the supplied ids and a numeric nonce', () => {
    const { result } = renderHook(() => useOpenInWorkspacesTrigger());

    act(() => {
      result.current.trigger(['HBM1', 'HBM2']);
    });

    expect(result.current.pending?.ids).toEqual(['HBM1', 'HBM2']);
    expect(typeof result.current.pending?.nonce).toBe('number');
  });

  it('two consecutive triggers with the same ids produce different nonces', () => {
    const { result } = renderHook(() => useOpenInWorkspacesTrigger());

    act(() => {
      result.current.trigger(['HBM1']);
    });
    const firstNonce = result.current.pending?.nonce;

    // Date.now() can return identical values on adjacent calls in fast tests; spy to guarantee a step.
    const dateSpy = jest.spyOn(Date, 'now').mockReturnValueOnce((firstNonce ?? 0) + 1);
    act(() => {
      result.current.trigger(['HBM1']);
    });

    expect(result.current.pending?.nonce).not.toBe(firstNonce);
    dateSpy.mockRestore();
  });

  it('reset() clears the pending request', () => {
    const { result } = renderHook(() => useOpenInWorkspacesTrigger());

    act(() => {
      result.current.trigger(['HBM1']);
    });
    expect(result.current.pending).not.toBeNull();

    act(() => {
      result.current.reset();
    });
    expect(result.current.pending).toBeNull();
  });
});
