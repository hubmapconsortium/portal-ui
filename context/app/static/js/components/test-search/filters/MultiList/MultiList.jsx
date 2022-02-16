import React from 'react';
import { MultiList as ReactiveSearchMultiList } from '@appbaseio/reactivesearch';
import { useStore } from 'js/pages/TestSearch/searchConfig/store';

function MultiList({ componentId, dataField, title, ...rest }) {
  const { filters } = useStore();

  return (
    <ReactiveSearchMultiList
      componentId={componentId}
      dataField={dataField}
      title={title}
      showSearch={false}
      URLParams
      sortBy="count"
      react={{ and: filters.filter((filter) => filter !== componentId) }}
      {...rest}
    />
  );
}

export default MultiList;
