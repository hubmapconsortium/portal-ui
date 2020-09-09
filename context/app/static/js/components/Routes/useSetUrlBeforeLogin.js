import { useEffect } from 'react';
import Cookies from 'universal-cookie';

function useSetUrlBeforeLogin(path) {
  useEffect(() => {
    const cookies = new Cookies();
    if (path !== '/login' && path !== '/logout') {
      cookies.set('urlBeforeLogin', path, { path: '/' });
    }
  }, [path]);
}

export default useSetUrlBeforeLogin;
