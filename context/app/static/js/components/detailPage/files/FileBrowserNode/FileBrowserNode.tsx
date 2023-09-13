import React from 'react';

import FileBrowserDirectory from '../FileBrowserDirectory';
import FileBrowserFile from '../FileBrowserFile';
import { FileTree } from '../types';

interface FileBrowserNodeProps {
  fileSubTree: FileTree;
  depth: number;
}

function FileBrowserNode({ fileSubTree, depth }: FileBrowserNodeProps) {
  return (
    <>
      {Object.entries(fileSubTree).map(([k, v]) => {
        if (Array.isArray(v)) {
          // if the object contains array of files, display all files
          if (k === 'files') {
            return v.map((file) => <FileBrowserFile key={file.rel_path} fileObj={file} depth={depth} />);
          }
          // If non-"files" key contains an array, throw an error
          throw new Error('FileBrowserNode: fileSubTree should not contain arrays in non-"files" keys.');
        }
        // if the object contains additional directories, display dir and continue down
        return (
          <FileBrowserDirectory key={`${k}-${depth}`} dirName={k.slice(0, -1)} depth={depth}>
            <FileBrowserNode fileSubTree={v} depth={depth + 1} />
          </FileBrowserDirectory>
        );
      })}
    </>
  );
}

export default FileBrowserNode;
