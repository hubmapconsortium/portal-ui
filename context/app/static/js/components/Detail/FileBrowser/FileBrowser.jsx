import React, { useState, useEffect } from 'react';

import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ScrollPaper } from './style';
import FileBrowserDUA from '../FileBrowserDUA';

function FileBrowser(props) {
  const { files } = props;
  const [fileTree, setFileTree] = useState({});
  const [hasAgreedToDUA, agreeToDUA] = useState(false);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  useEffect(() => {
    const treePath = relativeFilePathsToTree(files);
    setFileTree(treePath);
  }, [files]);

  function handleDUAAgree() {
    agreeToDUA(true);
    setDialogOpen(false);
  }

  function handleDUAClose() {
    agreeToDUA(false);
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
