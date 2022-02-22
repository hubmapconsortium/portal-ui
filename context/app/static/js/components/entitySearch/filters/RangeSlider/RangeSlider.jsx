import React from 'react';
import { RangeSlider as ReactiveSearchRangeSlider } from '@appbaseio/reactivesearch';

function RangeSlider({ dataField, range, ...props }) {
  return (
    <ReactiveSearchRangeSlider
      {...props}
      range={range}
      dataField={dataField}
      histogramQuery={() => ({
        [dataField]: {
          histogram: {
            field: dataField,
            extended_bounds: { min: range.start, max: range.end },
            interval: 3,
            min_doc_count: 0,
          },
        },
      })}
    />
  );
}

export default RangeSlider;
