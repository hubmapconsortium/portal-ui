import React from 'react';
import Paper from '@mui/material/Paper';

import BulkDataTransferPanel from './BulkDataTransferPanel';
import Link from './Link';
import NoAccess from './NoAccess';
import { usePanelSet } from './usePanelSet';
import { useStudyURLsQuery } from './hooks';
import GlobusLink from './GlobusLink';

interface BulkDataTransferPanelProps {
  uuid: string;
  label: string;
}

function BulkDataTransferPanels({ uuid, label }: BulkDataTransferPanelProps) {
  const { dbgap_study_url, dbgap_sra_experiment_url, mapped_data_access_level, hubmap_id } =
    useStudyURLsQuery(uuid).searchHits[0]?._source || {};

  const panelsToUse = usePanelSet(uuid, dbgap_study_url, mapped_data_access_level);

  if ('error' in panelsToUse) {
    return <NoAccess {...panelsToUse.error} />;
  }

  const { showDbGaP, showGlobus, showSRA, panels } = panelsToUse;

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- this is a logical OR.
  const hasLinks = Boolean(showDbGaP || showGlobus || showSRA);

  return (
    <>
      {panels.map((panel) => (
        <BulkDataTransferPanel {...panel} key={panel.title} />
      ))}
      {hasLinks && (
        <Paper>
          {showGlobus && <GlobusLink uuid={uuid} hubmap_id={hubmap_id} label={label} />}
          {showDbGaP && <Link href={dbgap_study_url} title="dbGaP" />}
          {showSRA && <Link href={dbgap_sra_experiment_url} title="SRA Experiment" />}
        </Paper>
      )}
    </>
  );
}

export default BulkDataTransferPanels;
