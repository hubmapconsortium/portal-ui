import React, { useState, useEffect } from 'react';
import FileBrowserNode from '../FileBrowserNode';

function FileBrowser(props) {
  const { files } = props;
  const [fileTree, setFileTree] = useState({});
  useEffect(() => {
    const treePath = {};
    files.forEach((f) => {
      const levels = f.rel_path.split('/');
      const file = levels.pop();

      const fileObj = { file, fullPath: f.rel_path };

      if (levels.length === 0) {
        if ('files' in treePath) {
          treePath.files.push(fileObj);
        } else {
          treePath.files = [fileObj];
        }
        return;
      }

      levels.reduce((prev, lvl, i) => {
        const path = `${lvl}/`;
        // level is sub dir

        if (i < levels.length - 1) {
          // eslint-disable-next-line no-param-reassign
          prev[path] = prev[path] || {}; // if level exists do not change, else add empty object at level
          return prev[path];
        }

        // level is file

        // level exists and files object exists within
        if (path in prev && 'files' in prev[path]) {
          // eslint-disable-next-line no-param-reassign
          prev[path].files.push(fileObj); // push file into existing array
          return prev[path];
        }

        // level exists
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

  // eslint-disable-next-line no-console
  console.log(fileTree);
  return (
    <div>
      <FileBrowserNode fileSubTree={fileTree} />
    </div>
  );
}

export default FileBrowser;
