import React, { useState, useEffect } from 'react';

function FileBrowser(props) {
  const { files } = props;
  const [fileTree, setFileTree] = useState({});
  useEffect(() => {
    const treePath = {};
    files.forEach((f) => {
      const levels = f.rel_path.split('/');
      const file = levels.pop();

      if (levels.length === 0) {
        if ('files' in treePath) {
          treePath.files.push(file);
        } else {
          treePath.files = [file];
        }
        return;
      }

      levels.reduce((prev, lvl, i) => {
        const path = `${lvl}/`;
        // level is sub dir

        if (i < levels.length - 1) {
          // eslint-disable-next-line no-param-reassign
          prev[path] = prev[path] || {}; // if level exists do not change, else add empty object at level
          return prev;
        }

        // level is file

        // level exists and files object exists within
        if (path in prev && 'files' in prev[path]) {
          // eslint-disable-next-line no-param-reassign
          prev[path].files.push(file); // push file into existing array
          return prev;
        }

        // level exists
        if (path in prev) {
          Object.assign(prev[path], { files: [file] });
          return prev;
        }

        // eslint-disable-next-line no-param-reassign
        prev[path] = { files: [file] };
        return prev;
      }, treePath);
    });
    setFileTree(treePath);
  }, [files]);

  // eslint-disable-next-line no-console
  console.log(fileTree);
  return <div>FileBrowser</div>;
}

export default FileBrowser;
