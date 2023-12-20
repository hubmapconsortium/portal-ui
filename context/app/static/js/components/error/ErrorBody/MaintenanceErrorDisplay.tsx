import React from 'react';

import MarkdownRenderer from 'js/components/Markdown/MarkdownRenderer';
import MaintenanceFallbackMessage, { MaintenanceFallbackLoader } from './MaintenanceFallbackMessage';
import useMaintenanceMessage from './hooks';

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
