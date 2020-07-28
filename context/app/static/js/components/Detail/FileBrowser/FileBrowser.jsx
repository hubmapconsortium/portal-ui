import React, { useState, useEffect } from 'react';

import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ScrollPaper } from './style';

function FileBrowser(props) {
  const { files } = props;
  const [fileTree, setFileTree] = useState({});

  useEffect(() => {
    const treePath = relativeFilePathsToTree(files);
    setFileTree(treePath);
  }, [files]);

  return (
    <ScrollPaper>
      <FileBrowserNode fileSubTree={fileTree} depth={0} />
    </ScrollPaper>
  );
}

export default FileBrowser;
