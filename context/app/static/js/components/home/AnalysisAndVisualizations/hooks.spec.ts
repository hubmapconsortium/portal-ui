import { renderHook, act } from 'test-utils/functions';
import { usePrefersReducedMotion } from './hooks';

describe('usePrefersReducedMotion', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test('returns false when user prefers motion', () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  test('returns true when user prefers reduced motion', () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  test('updates when preference changes', () => {
    let changeHandler: ((e: { matches: boolean }) => void) | null = null;

    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn((_event: string, handler: (e: { matches: boolean }) => void) => {
        changeHandler = handler;
      }),
      removeEventListener: jest.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      changeHandler?.({ matches: true });
    });

    expect(result.current).toBe(true);
  });
});
