import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import Histogram from 'js/shared-styles/charts/Histogram';
import CellsService from '../CellsService';

function CellExpressionHistogram({ uuid, geneName }) {
  const [geneExpressionData, setGeneExpressionData] = useState([]);
  const [diagnosticInfo, setDiagnosticInfo] = useState({});
  const theme = useTheme();

  useEffect(() => {
    async function fetchCellExpression() {
      const t0 = performance.now();

      const response = await new CellsService().getCellExpressionInDataset({
        uuid,
        geneNames: [geneName],
      });
      const t1 = performance.now();
      const timeWaiting = (t1 - t0) / 1000;
      const numCells = response.length;
      setDiagnosticInfo({ numCells, timeWaiting });
      setGeneExpressionData(response.map((d) => d.values[geneName]));
    }
    fetchCellExpression();
  }, [uuid, geneName]);

  return geneExpressionData.length ? (
    <>
      <Typography>
        {diagnosticInfo.timeWaiting.toFixed(2)} seconds to receive an API response for {diagnosticInfo.numCells} cells.
      </Typography>
      <Histogram
        parentHeight={500}
        parentWidth={500}
        visxData={geneExpressionData}
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
    <Typography>Please wait for histogram...</Typography>
  );
}

export default CellExpressionHistogram;
