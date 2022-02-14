import React from 'react';
import { MultiList as ReactiveSearchMultiList } from '@appbaseio/reactivesearch';

function MultiList({ componentId, dataField, title, ...rest }) {
  return (
    <ReactiveSearchMultiList
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
