import { useEffect } from 'react';
import Cookies from 'universal-cookie';
import history from 'history/browser';

function useSetUrlBeforeLogin() {
  useEffect(() => {
    const cookies = new Cookies();
    const saveUrl = () => {
      const url = window.location.pathname + window.location.search + window.location.hash;
      cookies.set('urlBeforeLogin', url, { path: '/', sameSite: 'lax' });
    };
    saveUrl();
    // history.listen covers push/replace (query params) and popstate; hashchange covers direct hash updates.
    const unlisten = history.listen(saveUrl);
    window.addEventListener('hashchange', saveUrl);
    return () => {
      unlisten();
      window.removeEventListener('hashchange', saveUrl);
    };
  }, []);
}

export default useSetUrlBeforeLogin;
