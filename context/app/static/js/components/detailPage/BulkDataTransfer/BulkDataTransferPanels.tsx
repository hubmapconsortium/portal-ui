import React from 'react';
import Paper from '@mui/material/Paper';

import { useFlaskDataContext } from 'js/components/Contexts';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import BulkDataTransferPanel from './BulkDataTransferPanel';
import Link from './Link';
import NoAccess from './NoAccess';
import { usePanelSet } from './usePanelSet';

function isReactNode(value: unknown): value is React.ReactNode {
  return typeof value === 'object' && value !== null && React.isValidElement(value);
}

function BulkDataTransferPanels() {
  const {
    entity: { dbgap_study_url, dbgap_sra_experiment_url },
  } = useFlaskDataContext();

  const trackEntityPageEvent = useTrackEntityPageEvent();

  const panelsToUse = usePanelSet();

  // Assign dynamic URL's to each type of link
  const linkTitleUrlMap = {
    dbGaP: dbgap_study_url as string,
    'SRA Experiment': dbgap_sra_experiment_url as string,
  } as const;

  if ('error' in panelsToUse) {
    return <NoAccess {...panelsToUse.error} />;
  }

  return (
    <>
      {panelsToUse.panels.length > 0 &&
        panelsToUse.panels.map((panel) => <BulkDataTransferPanel {...panel} key={panel.title} />)}
      {panelsToUse.links.length > 0 && (
        <Paper>
          {panelsToUse.links.map((link) =>
            isReactNode(link) ? (
              link
            ) : (
              <Link
                {...(link as { key: string; title: string })}
                key={link.key}
                url={linkTitleUrlMap[link.key]}
                onClick={() => trackEntityPageEvent({ action: 'Bulk Data Transfer / Panel Link', label: link.key })}
              />
            ),
          )}
        </Paper>
      )}
    </>
  );
}

export default BulkDataTransferPanels;
