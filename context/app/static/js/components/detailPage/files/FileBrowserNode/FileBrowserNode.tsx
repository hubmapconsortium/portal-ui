import React from 'react';
import PropTypes from 'prop-types';

import FileBrowserDirectory from '../FileBrowserDirectory';
import FileBrowserFile from '../FileBrowserFile';

type FileBrowserNodeProps = {
  
}

function FileBrowserNode({ fileSubTree, depth }) {
  return Object.entries(fileSubTree).map(([k, v]) => {
    // if the object contains array of files, display all files
    if (k === 'files') {
      return v.map((file) => <FileBrowserFile key={file.rel_path} fileObj={file} depth={depth} />);
    }
    // if the object contains additional directories, display dir and continue down
    return (
      <FileBrowserDirectory key={`${k}-${depth}`} dirName={k.slice(0, -1)} depth={depth}>
        <FileBrowserNode fileSubTree={v} depth={depth + 1} />
      </FileBrowserDirectory>
    );
  });
}

FileBrowserNode.propTypes = {
  fileSubTree: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])).isRequired,
  depth: PropTypes.number.isRequired,
};

export default FileBrowserNode;
