import React from 'react';

import FileBrowserDirectory from '../FileBrowserDirectory';
import FileBrowserFile from '../FileBrowserFile';
import { Column } from './style';

function FileBrowserNode(props) {
  const { fileSubTree, level } = props;
  return Object.entries(fileSubTree).map(([k, v]) => {
    if (k === 'files') {
      return (
        <Column key={`${k}-${level}`}>
          {v.map((file) => (
            <FileBrowserFile key={file.fullPath} fileObj={file} level={level} />
          ))}
        </Column>
      );
    }
    return (
      <FileBrowserDirectory key={`${k}-${level}`} dirName={k.slice(0, -1)} level={level}>
        <FileBrowserNode fileSubTree={v} level={level + 1} />
      </FileBrowserDirectory>
    );
  });
}

export default FileBrowserNode;
