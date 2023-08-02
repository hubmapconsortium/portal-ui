import React from 'react';
import { useTheme } from '@mui/material/styles';

import Histogram from 'js/shared-styles/charts/Histogram';
import { capitalizeString } from 'js/helpers/functions';
import { queryTypes } from 'js/components/cells/queryTypes';

function CellExpressionHistogram({ expressionData, queryType }) {
  const theme = useTheme();

  const queryMeasurement = queryTypes[queryType].measurement;

  return (
    <Histogram
      visxData={expressionData}
      margin={{
        top: 25,
        right: 50,
        left: 65,
        bottom: 100,
      }}
      barColor={theme.palette.success.main}
      xAxisLabel={queryMeasurement}
      yAxisLabel="Frequency"
      chartTitle={`${capitalizeString(queryType)} ${queryMeasurement} Distribution`}
    />
  );
}

export default CellExpressionHistogram;
