import { renderHook } from '@testing-library/react';
import Cookies from 'universal-cookie';

import useSetUrlBeforeLogin from './useSetUrlBeforeLogin';

const readCookie = () => new Cookies().get('urlBeforeLogin') as string | undefined;

describe('useSetUrlBeforeLogin', () => {
  it('saves the current URL on mount and on programmatic pushState/replaceState (e.g. nuqs)', () => {
    window.history.replaceState(null, '', '/search/datasets');
    renderHook(() => useSetUrlBeforeLogin());
    expect(readCookie()).toBe('/search/datasets');

    // nuqs updates query params via replaceState — no native event fires.
    window.history.replaceState(null, '', '/search/datasets?mode=say-see');
    expect(readCookie()).toBe('/search/datasets?mode=say-see');

    // filters push a new entry.
    window.history.pushState(null, '', '/search/datasets?mode=say-see&q=abc');
    expect(readCookie()).toBe('/search/datasets?mode=say-see&q=abc');
  });

  it('stops saving after unmount', () => {
    window.history.replaceState(null, '', '/before-unmount');
    const { unmount } = renderHook(() => useSetUrlBeforeLogin());
    unmount();
    window.history.replaceState(null, '', '/after-unmount');
    expect(readCookie()).toBe('/before-unmount');
  });
});
