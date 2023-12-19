import { useEffect } from 'react';

/**
 * Reusable hook to dynamically add a script tag to the dom
 * @param url - url of the script to add
 */
export default function useScript(url: string) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
}
