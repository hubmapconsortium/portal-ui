import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import Histogram from 'js/shared-styles/charts/Histogram';
import CellsService from 'js/components/cells/CellsService';
import { StyledSkeleton } from 'js/components/cells/CellsCharts/style';

function CellExpressionHistogram({ uuid, cellVariableName, isLoading, finishLoading, loadingKey }) {
  const [expressionData, setExpressionData] = useState([]);
  const [diagnosticInfo, setDiagnosticInfo] = useState({});
  const theme = useTheme();

  useEffect(() => {
    async function fetchCellExpression() {
      const t0 = performance.now();

      const response = await new CellsService().getCellExpressionInDataset({
        uuid,
        names: [cellVariableName],
      });
      const t1 = performance.now();
      const timeWaiting = (t1 - t0) / 1000;
      const numCells = response.length;
      setDiagnosticInfo({ numCells, timeWaiting });
      setExpressionData(response.map((d) => d.values[cellVariableName]));
      finishLoading(loadingKey);
    }
    fetchCellExpression();
  }, [uuid, cellVariableName, finishLoading, loadingKey]);

  return expressionData.length && !isLoading[loadingKey] ? (
    <>
      <Typography>
        {diagnosticInfo.timeWaiting.toFixed(2)} seconds to receive an API response for {diagnosticInfo.numCells} cells.
      </Typography>
      <Histogram
        visxData={expressionData}
        margin={{
          top: 50,
          right: 50,
          left: 50,
          bottom: 50,
        }}
        barColor={theme.palette.success.main}
      />
    </>
  ) : (
    <StyledSkeleton variant="rectangular" />
  );
}

export default CellExpressionHistogram;
