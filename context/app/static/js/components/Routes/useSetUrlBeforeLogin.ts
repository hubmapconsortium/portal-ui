import { useEffect } from 'react';
import Cookies from 'universal-cookie';

function useSetUrlBeforeLogin() {
  useEffect(() => {
    const cookies = new Cookies();
    const url = window.location.pathname + window.location.search + window.location.hash;
    cookies.set('urlBeforeLogin', url, { path: '/', sameSite: 'lax' });
  }, []);
}

export default useSetUrlBeforeLogin;
