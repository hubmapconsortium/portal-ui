import { useEffect } from 'react';
import Cookies from 'universal-cookie';

function useSetUrlBeforeLogin() {
  useEffect(() => {
    const cookies = new Cookies();
    const saveUrl = () => {
      const url = window.location.pathname + window.location.search + window.location.hash;
      cookies.set('urlBeforeLogin', url, { path: '/', sameSite: 'lax' });
    };
    saveUrl();

    // Programmatic URL changes (the search store's history lib, nuqs query params like ?mode=)
    // go through history.pushState/replaceState, which fire no native event. Patch them to emit one.
    const emit = () => window.dispatchEvent(new Event('urlchange'));
    const pushState = window.history.pushState.bind(window.history);
    const replaceState = window.history.replaceState.bind(window.history);
    window.history.pushState = (...args: Parameters<History['pushState']>) => {
      pushState(...args);
      emit();
    };
    window.history.replaceState = (...args: Parameters<History['replaceState']>) => {
      replaceState(...args);
      emit();
    };

    window.addEventListener('urlchange', saveUrl);
    window.addEventListener('popstate', saveUrl);
    window.addEventListener('hashchange', saveUrl);
    return () => {
      window.history.pushState = pushState;
      window.history.replaceState = replaceState;
      window.removeEventListener('urlchange', saveUrl);
      window.removeEventListener('popstate', saveUrl);
      window.removeEventListener('hashchange', saveUrl);
    };
  }, []);
}

export default useSetUrlBeforeLogin;
