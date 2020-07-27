import React, { useState, useEffect, useContext } from 'react';

import DetailContext from '../context';
import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ScrollPaper } from './style';
import FileBrowserDUA from '../FileBrowserDUA';

function FileBrowser(props) {
  const { files } = props;

  const { data_access_level } = useContext(DetailContext);
  const localStorageKey = `has_agreed_to_${data_access_level}_DUA`;
  const [fileTree, setFileTree] = useState({});
  const [hasAgreedToDUA, agreeToDUA] = useState(localStorage.getItem(localStorageKey));
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const treePath = relativeFilePathsToTree(files);
    setFileTree(treePath);
  }, [files]);

  function handleDUAAgree() {
    agreeToDUA(true);
    localStorage.setItem(localStorageKey, true);
    setDialogOpen(false);
  }

  function handleDUAClose() {
    setDialogOpen(false);
  }

  function openDUA() {
    setDialogOpen(true);
  }

  return (
    <ScrollPaper>
      <FileBrowserNode fileSubTree={fileTree} hasAgreedToDUA={hasAgreedToDUA} openDUA={openDUA} depth={0} />
      <FileBrowserDUA
        isOpen={isDialogOpen}
        handleAgree={handleDUAAgree}
        handleClose={handleDUAClose}
        data_access_level={data_access_level}
      />
    </ScrollPaper>
  );
}

export default FileBrowser;
