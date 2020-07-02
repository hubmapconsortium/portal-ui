import React from 'react';

import FileBrowserDirectory from '../FileBrowserDirectory';
import FileBrowserFile from '../FileBrowserFile';
import { Column } from './style';

function FileBrowserNode(props) {
  const { fileSubTree, level } = props;
  return Object.entries(fileSubTree).map(([k, v]) => {
    if (k === 'files') {
      return (
        <Column>
          {v.map((file) => (
            <FileBrowserFile fileObj={file} level={level} />
          ))}
        </Column>
      );
    }
    return (
      <div>
        <FileBrowserDirectory dirName={k.slice(0, -1)} level={level}>
          <FileBrowserNode fileSubTree={v} level={level + 1} />
        </FileBrowserDirectory>
      </div>
    );
  });
}

export default FileBrowserNode;
