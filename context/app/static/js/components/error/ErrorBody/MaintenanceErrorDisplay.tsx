import React from 'react';
import useSWR from 'swr';

import MarkdownRenderer from 'js/components/Markdown/MarkdownRenderer';
import MaintenanceFallbackMessage, { MaintenanceFallbackLoader } from './MaintenanceFallbackMessage';

function useMaintenanceMessage() {
  const swr = useSWR<string, unknown, string>(
    `${CDN_URL}/maintenance-message.md`,
    async (url) => {
      const request = await fetch(url);
      const markdownText = await request.text();
      return markdownText;
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );
  return swr;
}

export default function MaintenanceErrorDisplay() {
  const { data, error, isLoading } = useMaintenanceMessage();

  if (error) {
    return <MaintenanceFallbackMessage />;
  }

  if (isLoading || !data) {
    return <MaintenanceFallbackLoader />;
  }

  return <MarkdownRenderer>{data}</MarkdownRenderer>;
}
