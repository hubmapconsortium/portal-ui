import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import DetailContext from 'js/components/Detail/context';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import GlobusLink from '../GlobusLink';
import FileBrowser from '../FileBrowser';
import FileBrowserDUA from '../FileBrowserDUA';
import FilesContext from './context';

function Files(props) {
  const { files, uuid, display_doi } = props;

  const { mapped_data_access_level } = useContext(DetailContext);

  const localStorageKey = `has_agreed_to_${mapped_data_access_level}_DUA`;
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
        <GlobusLink uuid={uuid} display_doi={display_doi} />
        <FileBrowserDUA
          isOpen={isDialogOpen}
          handleAgree={handleDUAAgree}
          handleClose={handleDUAClose}
          mapped_data_access_level={mapped_data_access_level}
        />
      </SectionContainer>
    </FilesContext.Provider>
  );
}

Files.propTypes = {
  uuid: PropTypes.string.isRequired,
  display_doi: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(
    PropTypes.exact({
      rel_path: PropTypes.string,
      edam_term: PropTypes.string,
      description: PropTypes.string,
      size: PropTypes.number,
      type: PropTypes.string,
    }),
  ),
};

Files.defaultProps = {
  files: undefined,
};

export default Files;
