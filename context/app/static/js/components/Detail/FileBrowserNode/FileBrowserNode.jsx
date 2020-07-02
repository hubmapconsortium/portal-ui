import React from 'react';

function FileBrowserNode(props) {
  const { fileSubTree } = props;
  return Object.entries(fileSubTree).map(([k, v]) => {
    if ('files' in v) {
      return (
        <div>
          <p>{k}</p>
          <FileBrowserNode fileSubTree={v} />
        </div>
      );
    }
    return (
      <>
        {v.map((file) => (
          <div>{file.file}</div>
        ))}
      </>
    );
  });
}

export default FileBrowserNode;
