import React from 'react';
import { MultiList as ReactiveSearchMultiList } from '@appbaseio/reactivesearch';

function MultiList({ dataField, ...rest }) {
  return <ReactiveSearchMultiList showSearch={false} dataField={`${dataField}.keyword`} sortBy="count" {...rest} />;
}

export default MultiList;
