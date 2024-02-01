import React from 'react';
import Paper from '@mui/material/Paper';

import { useFlaskDataContext } from 'js/components/Contexts';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import BulkDataTransferPanel from './BulkDataTransferPanel';
import Link from './Link';
import NoAccess from './NoAccess';
import { usePanelSet } from './usePanelSet';

function BulkDataTransferPanels() {
  const {
    entity: { dbgap_study_url, dbgap_sra_experiment_url },
  } = useFlaskDataContext();

  const panelsToUse = usePanelSet();

  // Assign dynamic URL's to each type of link
  const linkTitleUrlMap = {
    dbGaP: dbgap_study_url,
    'SRA Experiment': dbgap_sra_experiment_url,
  };

  if (panelsToUse.error) {
    return <NoAccess {...panelsToUse.error} />;
  }

  const trackEntityPageEvent = useTrackEntityPageEvent;

  return (
    <>
      {panelsToUse.panels.length > 0 &&
        panelsToUse.panels.map((panel) => <BulkDataTransferPanel {...panel} key={panel.title} />)}
      {panelsToUse.links.length > 0 && (
        <Paper>
          {panelsToUse.links.map((link) =>
            React.isValidElement(link) ? (
              link
            ) : (
              <Link
                {...link}
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
