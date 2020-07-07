import React, { useState, useEffect } from 'react';

import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ScrollPaper } from './style';
import FileBrowserDUA from '../FileBrowserDUA';

function FileBrowser(props) {
  const { files } = props;
  const localStorageKey = 'has_agreed_to_DUA';
  const [fileTree, setFileTree] = useState({});
  const [hasAgreedToDUA, agreeToDUA] = useState(localStorage.getItem(localStorageKey));
  const [isDialogOpen, setDialogOpen] = React.useState(false);

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
      <FileBrowserDUA isOpen={isDialogOpen} handleAgree={handleDUAAgree} handleClose={handleDUAClose} />
    </ScrollPaper>
  );
}

export default FileBrowser;
