import React from 'react';
import { MultiList as ReactiveSearchMultiList } from '@appbaseio/reactivesearch';

function MultiList({ ...props }) {
  return <ReactiveSearchMultiList showSearch={false} URLParams sortBy="count" {...props} />;
}

export default MultiList;
