import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import Histogram from 'js/shared-styles/charts/Histogram';
import CellsService from '../CellsService';

function CellExpressionHistogram({ uuid, geneName }) {
  const [geneExpressionData, setGeneExpressionData] = useState([]);

  useEffect(() => {
    async function fetchCellExpression() {
      const response = await new CellsService().getCellExpressionInDataset({
        uuid,
        geneNames: [geneName],
      });
      setGeneExpressionData(response.map((d) => d.values[geneName]));
    }
    fetchCellExpression();
  }, [uuid, geneName]);

  return geneExpressionData.length ? (
    <Histogram
      parentHeight={400}
      parentWidth={800}
      visxData={geneExpressionData}
      margin={{
        top: 50,
        right: 50,
        left: 50,
        bottom: 50,
      }}
    />
  ) : (
    <Typography>Please wait for histogram...</Typography>
  );
}

export default CellExpressionHistogram;
