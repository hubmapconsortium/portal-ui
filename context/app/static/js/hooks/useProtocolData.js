import React from 'react';

function useProtocolData(doiSuffix, lastVersion = 1) {
  const [protocol, setProtocol] = React.useState({});
  React.useEffect(() => {
    async function getAndSetProtocol() {
      const response = await fetch(`https://www.protocols.io/api/v3/protocols/${doi}?last_version=${lastVersion}`);
      if (!response.ok) {
        console.error('Protocol API failed', response);
        return;
      }
      const data = await response.json();
      setProtocol(data);
    }
    getAndSetProtocol();
  }, [doi, lastVersion]);

  return protocol;
}

export default useProtocolData;
