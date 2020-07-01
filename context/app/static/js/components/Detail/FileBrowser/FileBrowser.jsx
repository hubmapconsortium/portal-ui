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
        if (i < levels.length - 1) {
          // eslint-disable-next-line no-param-reassign
          prev[path] = prev[path] || {};
          return prev;
        }
        if (path in prev && 'files' in prev[path]) {
          // eslint-disable-next-line no-param-reassign
          prev[path].files.push(file);
          return prev;
        }

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
