import React, { useState, useContext } from 'react';

import DetailContext from '../context';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';
import GlobusLink from '../GlobusLink';
import FileBrowser from '../FileBrowser';
import FileBrowserDUA from '../FileBrowserDUA';
import FilesContext from './context';

function Files(props) {
  const { files, entityEndpoint, uuid, display_doi } = props;

  const { data_access_level } = useContext(DetailContext);

  const localStorageKey = `has_agreed_to_${data_access_level}_DUA`;
  const [hasAgreedToDUA, agreeToDUA] = useState(localStorage.getItem(localStorageKey));
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [urlClickedBeforeDUA, setUrlClickedBeforeDUA] = useState('');

  function handleDUAAgree() {
    agreeToDUA(true);
    localStorage.setItem(localStorageKey, true);
    setDialogOpen(false);
    window.open(urlClickedBeforeDUA, '_blank');
  }

  function handleDUAClose() {
    setDialogOpen(false);
  }

  function openDUA(linkUrl) {
    setDialogOpen(true);
    setUrlClickedBeforeDUA(linkUrl);
  }

  return (
    <FilesContext.Provider value={{ openDUA, hasAgreedToDUA }}>
      <SectionContainer id="files">
        <SectionHeader>Files</SectionHeader>
        {files && <FileBrowser files={files} />}
        <GlobusLink entityEndpoint={entityEndpoint} uuid={uuid} display_doi={display_doi} />
        <FileBrowserDUA
          isOpen={isDialogOpen}
          handleAgree={handleDUAAgree}
          handleClose={handleDUAClose}
          data_access_level={data_access_level}
        />
      </SectionContainer>
    </FilesContext.Provider>
  );
}

export default Files;
