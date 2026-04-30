import { useMemo } from 'react';
import type { DownloadAction, DownloadActionContext } from 'udi-yac';

import { useAppContext } from 'js/components/Contexts';
import { trackEvent } from 'js/helpers/trackers';
import { createDownloadUrl } from 'js/helpers/functions';
import { checkAndDownloadFile } from 'js/helpers/download';

import useOpenInWorkspacesTrigger from './openInWorkspacesStore';

const ENTITY_LABELS = {
  donors: 'Donor',
  samples: 'Sample',
  datasets: 'Dataset',
} as const;

type EntitySource = keyof typeof ENTITY_LABELS;

function getRowsForSource(ctx: DownloadActionContext, source: EntitySource): Record<string, unknown>[] {
  return ctx.rowsBySource.find((r) => r.source === source)?.rows ?? [];
}

function extractHubmapIds(rows: Record<string, unknown>[]): string[] {
  return rows.map((r) => r.hubmap_id).filter((v): v is string => typeof v === 'string' && v.length > 0);
}

function downloadHubmapIds(ids: string[], entityLabel: string) {
  const isDatasetManifest = entityLabel === 'Dataset';
  const content = isDatasetManifest ? `${ids.join(' /\n')} /` : ids.join('\n');
  const url = createDownloadUrl(content, 'text/plain');
  const fileName = isDatasetManifest ? 'manifest.txt' : `hubmap-${entityLabel.toLowerCase()}-ids.txt`;
  void checkAndDownloadFile({ url, fileName });
}

export default function useSaySeeDownloadActions(): readonly DownloadAction[] {
  const { isWorkspacesUser } = useAppContext();
  const trigger = useOpenInWorkspacesTrigger((s) => s.trigger);

  return useMemo(() => {
    const idActions: DownloadAction[] = (Object.keys(ENTITY_LABELS) as EntitySource[]).map((source) => {
      const label = ENTITY_LABELS[source];
      return {
        label: `Download ${label} HuBMAP IDs`,
        onClick: (ctx) => {
          const rows = getRowsForSource(ctx, source);
          const ids = extractHubmapIds(rows);
          if (ids.length === 0) return;
          downloadHubmapIds(ids, label);
          trackEvent({
            category: 'Say & See',
            action: `Download ${label} HuBMAP IDs`,
            value: ids.length,
          });
        },
        disabled: (ctx) => extractHubmapIds(getRowsForSource(ctx, source)).length === 0,
      };
    });

    if (!isWorkspacesUser) return idActions;

    const workspacesAction: DownloadAction = {
      label: 'Open Selected Datasets in Workspaces',
      onClick: (ctx) => {
        const ids = extractHubmapIds(getRowsForSource(ctx, 'datasets'));
        if (ids.length === 0) return;
        trigger(ids);
        trackEvent({
          category: 'Say & See',
          action: 'Open Datasets in Workspaces',
          value: ids.length,
        });
      },
      disabled: (ctx) => extractHubmapIds(getRowsForSource(ctx, 'datasets')).length === 0,
    };

    return [...idActions, workspacesAction];
  }, [isWorkspacesUser, trigger]);
}
