import React, { useState, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import DetailContext from 'js/components/detailPage/context';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import GlobusSection from '../GlobusSection';
import FileBrowser from '../FileBrowser';
import FileBrowserDUA from '../FileBrowserDUA';
import FilesContext from './context';
import { MarginBottomDiv } from './style';

function Files({ files, uuid, hubmap_id, visLiftedUUID }) {
  const { mapped_data_access_level } = useContext(DetailContext);

  const localStorageKey = `has_agreed_to_${mapped_data_access_level}_DUA`;
  const [hasAgreedToDUA, agreeToDUA] = useState(localStorage.getItem(localStorageKey));
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [urlClickedBeforeDUA, setUrlClickedBeforeDUA] = useState('');

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

  return (
    <FilesContext.Provider value={filesContext}>
      <DetailPageSection id="files" data-testid="files">
        <SectionHeader>Files</SectionHeader>
        {files.length > 0 && (
          <MarginBottomDiv>
            <FileBrowser files={files} />
          </MarginBottomDiv>
        )}
        <GlobusSection uuid={uuid} hubmap_id={hubmap_id} visLiftedUUID={visLiftedUUID} />
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

Files.propTypes = {
  uuid: PropTypes.string.isRequired,
  hubmap_id: PropTypes.string.isRequired,
  visLiftedUUID: PropTypes.string,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      rel_path: PropTypes.string.isRequired,
      edam_term: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      is_qa_qc: PropTypes.bool,
    }),
  ),
};

Files.defaultProps = {
  files: undefined,
  visLiftedUUID: undefined,
};

export default Files;
