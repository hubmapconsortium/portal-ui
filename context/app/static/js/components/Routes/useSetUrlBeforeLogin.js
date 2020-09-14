import { useEffect } from 'react';
import Cookies from 'universal-cookie';

function useSetUrlBeforeLogin(url) {
  useEffect(() => {
    const cookies = new Cookies();
    cookies.set('urlBeforeLogin', url, { path: '/' });
  }, [url]);
}

export default useSetUrlBeforeLogin;
