import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ScrollPaper } from './style';

function FileBrowser(props) {
  const { files } = props;
  const [fileTree, setFileTree] = useState({});
  const [qaFileTree, setQaFileTree] = useState({});
  const [displayOnlyQaFiles, setDisplayOnlyQaFiles] = useState(false);

  useEffect(() => {
    setFileTree(relativeFilePathsToTree(files));
    setQaFileTree(relativeFilePathsToTree(files.filter((file) => file?.is_qa_qc)));
  }, [files]);

  return (
    <>
      <Chip
        label="Show QA Files Only"
        clickable
        color="primary"
        onClick={() => setDisplayOnlyQaFiles((prevState) => !prevState)}
        icon={<DoneIcon />}
        component="button"
      />
      <ScrollPaper data-testid="file-browser">
        <FileBrowserNode fileSubTree={displayOnlyQaFiles ? qaFileTree : fileTree} depth={0} />
      </ScrollPaper>
    </>
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
