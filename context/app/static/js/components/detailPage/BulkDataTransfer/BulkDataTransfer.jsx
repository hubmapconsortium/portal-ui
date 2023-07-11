import React, { useState, useMemo, useCallback } from 'react';
import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { FilesContext, useDetailContext, useFlaskDataContext } from 'js/components/Contexts';
import { DetailPageSection } from 'js/components/detailPage/style';
import FileBrowserDUA from './FileBrowserDUA';
import BulkDataTransferPanel from './BulkDataTransferPanel';
import Link from './Link';
import NoAccess from './NoAccess';
import { StyledContainer } from './style';
import { useBulkDataTransferPanels } from './useBulkDataPanels';

function BulkDataTransfer() {
  const { mapped_data_access_level } = useDetailContext();
  const localStorageKey = `has_agreed_to_${mapped_data_access_level}_DUA`;
  const [hasAgreedToDUA, agreeToDUA] = useState(localStorage.getItem(localStorageKey));
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [urlClickedBeforeDUA, setUrlClickedBeforeDUA] = useState('');

  const {
    entity: { dbgap_study_url, dbgap_sra_experiment_url },
  } = useFlaskDataContext();

  // Assign dynamic URL's to each type of link
  const linkTitleUrlMap = {
    dbGaP: dbgap_study_url,
    'SRA Experiment': dbgap_sra_experiment_url,
  };

  const handleDUAAgree = useCallback(() => {
    agreeToDUA(true);
    localStorage.setItem(localStorageKey, true);
    setDialogOpen(false);
    window.open(urlClickedBeforeDUA, '_blank');
  }, [agreeToDUA, localStorageKey, setDialogOpen, urlClickedBeforeDUA]);

  const handleDUAClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const openDUA = useCallback((linkUrl) => {
    setDialogOpen(true);
    setUrlClickedBeforeDUA(linkUrl);
  }, []);

  const filesContext = useMemo(() => ({ openDUA, hasAgreedToDUA }), [openDUA, hasAgreedToDUA]);

  const panelsToUse = useBulkDataTransferPanels();

  return (
    <FilesContext.Provider value={filesContext}>
      <DetailPageSection id="bulk-data-transfer" data-testid="bulk-data-transfer">
        <SectionHeader>Bulk Data Transfer</SectionHeader>
        <StyledContainer>
          {panelsToUse.error ? (
            <NoAccess>{panelsToUse.error}</NoAccess>
          ) : (
            <>
              {panelsToUse.panels.length > 0 &&
                panelsToUse.panels.map((props) => <BulkDataTransferPanel {...props} key={props.title} />)}
              {panelsToUse.links.length > 0 && (
                <Paper>
                  {panelsToUse.links.map((link) =>
                    React.isValidElement(link) ? (
                      link
                    ) : (
                      <Link {...link} key={link.key} url={linkTitleUrlMap[link.title]} />
                    ),
                  )}
                </Paper>
              )}
            </>
          )}
        </StyledContainer>
      </DetailPageSection>
      <FileBrowserDUA
        isOpen={isDialogOpen}
        handleAgree={handleDUAAgree}
        handleClose={handleDUAClose}
        mapped_data_access_level={mapped_data_access_level}
      />
    </FilesContext.Provider>
  );
}

export default BulkDataTransfer;
