import React from 'react';
import useSWR from 'swr';

import MarkdownRenderer from 'js/components/Markdown/MarkdownRenderer';
import MaintenanceFallbackMessage from './MaintenanceFallbackMessage';

function useMaintenanceMessage() {
  const swr = useSWR<string, unknown, string>(`${CDN_URL}/maintenance-message.md`, (url) =>
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'binary/octet-stream',
      },
    }).then((res) => res.text()),
  );
  return swr;
}

export default function MaintenanceErrorDisplay() {
  const { data, error, isLoading } = useMaintenanceMessage();
  console.log(data);

  if (isLoading || error) {
    return <MaintenanceFallbackMessage />;
  }
  return <MarkdownRenderer>{data}</MarkdownRenderer>;
}
