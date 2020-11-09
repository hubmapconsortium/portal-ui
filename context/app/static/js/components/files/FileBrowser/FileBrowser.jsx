import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

import useFilesStore from 'js/stores/useFilesStore';
import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ScrollPaper } from './style';

const filesStoreSelector = (state) => ({
  displayOnlyQaQc: state.displayOnlyQaQc,
  toggleDisplayOnlyQaQc: state.toggleDisplayOnlyQaQc,
});

function FileBrowser(props) {
  const { files } = props;
  const [fileTree, setFileTree] = useState({});
  const [qaFileTree, setQaFileTree] = useState({});

  const { displayOnlyQaQc, toggleDisplayOnlyQaQc } = useFilesStore(filesStoreSelector);

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
        onClick={toggleDisplayOnlyQaQc}
        icon={<DoneIcon />}
        component="button"
      />
      <ScrollPaper data-testid="file-browser">
        <FileBrowserNode fileSubTree={displayOnlyQaQc ? qaFileTree : fileTree} depth={0} />
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
