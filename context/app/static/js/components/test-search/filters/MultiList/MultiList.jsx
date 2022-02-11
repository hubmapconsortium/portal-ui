import React from 'react';

function MultiList({ componentId, dataField, title, ...rest }) {
  return (
    <MultiList
      componentId={componentId}
      dataField={dataField}
      title={title}
      size={5}
      showLoadMore
      showSearch={false}
      URLParams
      {...rest}
    />
  );
}

export default MultiList;
