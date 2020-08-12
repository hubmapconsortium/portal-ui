import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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

FileBrowser.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.exact({
      rel_path: PropTypes.string,
      edam_term: PropTypes.string,
      description: PropTypes.string,
      size: PropTypes.number,
      type: PropTypes.string,
    }),
  ).isRequired,
};
export default FileBrowser;
