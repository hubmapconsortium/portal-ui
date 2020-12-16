import { useEffect } from 'react';
import Cookies from 'universal-cookie';

function useSetUrlBeforeLogin(url) {
  useEffect(() => {
    const cookies = new Cookies();
    cookies.set('urlBeforeLogin', url, { path: '/', sameSite: 'lax' });
  }, [url]);
}

export default useSetUrlBeforeLogin;
