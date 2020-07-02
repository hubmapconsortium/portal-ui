import React, { useState, useEffect } from 'react';
import FileBrowserNode from '../FileBrowserNode';
import { ScrollPaper } from './style';

function FileBrowser(props) {
  const { files } = props;
  const [fileTree, setFileTree] = useState({});
  useEffect(() => {
    const treePath = {};
    files.forEach((f) => {
      const dirs = f.rel_path.split('/');
      const file = dirs.pop();

      const fileObj = { file, fullPath: f.rel_path, description: f.description, edam_term: f.edam_term, size: f.size };

      if (dirs.length === 0) {
        if ('files' in treePath) {
          treePath.files.push(fileObj);
        } else {
          treePath.files = [fileObj];
        }
        return;
      }

      dirs.reduce((prev, lvl, i) => {
        const path = `${lvl}/`;
        // dir is sub dir

        if (i < dirs.length - 1) {
          // eslint-disable-next-line no-param-reassign
          prev[path] = prev[path] || {}; // if level exists do not change, else add empty object at level
          return prev[path];
        }

        // dir is leaf

        // dir already exists and files object already exists within
        if (path in prev && 'files' in prev[path]) {
          // eslint-disable-next-line no-param-reassign
          prev[path].files.push(fileObj); // push file into existing array
          return prev[path];
        }

        // dir already exists
        if (path in prev) {
          Object.assign(prev[path], { files: [fileObj] });
          return prev[path];
        }

        // eslint-disable-next-line no-param-reassign
        prev[path] = { files: [fileObj] };
        return prev[path];
      }, treePath);
    });
    setFileTree(treePath);
  }, [files]);

  return (
    <ScrollPaper>
      <FileBrowserNode fileSubTree={fileTree} depth={0} />
    </ScrollPaper>
  );
}

export default FileBrowser;
