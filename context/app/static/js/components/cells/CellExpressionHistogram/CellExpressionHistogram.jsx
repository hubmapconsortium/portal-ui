import React from 'react';
import { useTheme } from '@material-ui/core/styles';

import Histogram from 'js/shared-styles/charts/Histogram';
import { capitalizeString } from 'js/helpers/functions';

function CellExpressionHistogram({ expressionData, queryType }) {
  const theme = useTheme();

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
      xAxisLabel="Expression Level"
      yAxisLabel="Frequency"
      chartTitle={`${capitalizeString(queryType)} Expression Distribution`}
    />
  );
}

export default CellExpressionHistogram;
