import React, { useState, useCallback, useMemo } from 'react';

import { useDetailContext } from 'js/components/detailPage/DetailContext';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';

import FileBrowser from '../FileBrowser';
import FileBrowserDUA from '../../BulkDataTransfer/FileBrowserDUA';
import { FilesContext } from '../FilesContext';
import { MarginBottomDiv } from './style';
import { UnprocessedFile } from '../types';

type FilesProps = {
  files: UnprocessedFile[];
};

function Files({ files }: FilesProps) {
  const { mapped_data_access_level } = useDetailContext();

  if (!mapped_data_access_level) {
    throw new Error('Data access level information was not found.')
  }

  const localStorageKey = `has_agreed_to_${mapped_data_access_level}_DUA`;
  const [hasAgreedToDUA, agreeToDUA] = useState<boolean>(Boolean(localStorage.getItem(localStorageKey)));
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [urlClickedBeforeDUA, setUrlClickedBeforeDUA] = useState('');

  const handleDUAAgree = useCallback(() => {
    agreeToDUA(true);
    localStorage.setItem(localStorageKey, 'true');
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

  return (
    <FilesContext.Provider value={filesContext}>
      <DetailPageSection id="files" data-testid="files">
        <SectionHeader>Files</SectionHeader>
        {files.length > 0 && (
          <MarginBottomDiv>
            <FileBrowser files={files} />
          </MarginBottomDiv>
        )}
        <FileBrowserDUA
          isOpen={isDialogOpen}
          handleAgree={handleDUAAgree}
          handleClose={handleDUAClose}
          mapped_data_access_level={mapped_data_access_level}
        />
      </DetailPageSection>
    </FilesContext.Provider>
  );
}

export default Files;
