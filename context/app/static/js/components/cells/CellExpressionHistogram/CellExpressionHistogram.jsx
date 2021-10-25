import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@material-ui/core/styles';

import Histogram from 'js/shared-styles/charts/Histogram';
import CellsService from 'js/components/cells/CellsService';
import ChartLoader from 'js/components/cells/ChartLoader';
import { capitalizeString } from 'js/helpers/functions';

function CellExpressionHistogram({
  uuid,
  cellVariableName,
  isLoading,
  finishLoading,
  loadingKey,
  isExpanded,
  setDiagnosticInfo,
  queryType,
}) {
  const [expressionData, setExpressionData] = useState([]);
  const theme = useTheme();
  const loadedOnce = useRef(false);

  useEffect(() => {
    async function fetchCellExpression() {
      const t0 = performance.now();

      const response = await new CellsService().getCellExpressionInDataset({
        uuid,
        cellVariableNames: [cellVariableName],
      });
      const t1 = performance.now();
      const timeWaiting = (t1 - t0) / 1000;
      const numCells = response.length;
      setDiagnosticInfo({ numCells, timeWaiting });
      setExpressionData(response.map((d) => d.values[cellVariableName]));
      finishLoading(loadingKey);
    }
    if (loadedOnce.current) {
      return;
    }

    if (isExpanded) {
      fetchCellExpression();
      loadedOnce.current = true;
    }
  }, [uuid, cellVariableName, finishLoading, loadingKey, isExpanded, setDiagnosticInfo]);

  if (Object.values(isLoading).some((val) => val)) {
    return <ChartLoader />;
  }

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
