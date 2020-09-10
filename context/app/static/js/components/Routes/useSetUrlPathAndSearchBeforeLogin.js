import { useEffect } from 'react';
import Cookies from 'universal-cookie';

function useSetPathAndSearchBeforeLogin(path) {
  useEffect(() => {
    const cookies = new Cookies();
    if (path !== '/login' && path !== '/logout') {
      cookies.set('urlPathAndSearchBeforeLogin', path, { path: '/' });
    }
  }, [path]);
}

export default useSetPathAndSearchBeforeLogin;
