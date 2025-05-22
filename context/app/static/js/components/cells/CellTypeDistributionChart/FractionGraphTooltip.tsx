import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TooltipInPortalProps } from '@visx/tooltip/lib/hooks/useTooltipInPortal';
import { CellTypeCountForTissue } from 'js/api/scfind/useCellTypeCountForTissue';
import { decimal } from 'js/helpers/number-format';
import { TooltipData } from 'js/shared-styles/charts/types';
import React from 'react';

interface FractionGraphTooltipProps {
  tooltipOpen: boolean;
  tooltipData?: TooltipData<CellTypeCountForTissue>;
  tooltipTop?: number;
  tooltipLeft?: number;
  totalCellCount: number;
  TooltipInPortal: React.FC<TooltipInPortalProps>;
}

export default function FractionGraphTooltip({
  tooltipOpen,
  tooltipData,
  tooltipTop,
  tooltipLeft,
  totalCellCount,
  TooltipInPortal,
}: FractionGraphTooltipProps) {
  if (!tooltipOpen || !tooltipData) {
    return null;
  }

  return (
    <TooltipInPortal left={tooltipLeft} top={tooltipTop} style={{ position: 'absolute', pointerEvents: 'none' }}>
      {tooltipData?.bar?.data && (
        <Box sx={{ background: 'white', padding: 2, borderRadius: 4, zIndex: 1000 }}>
          <Typography variant="subtitle1" component="p" color="textPrimary">
            {tooltipData.bar.data.index.split('.')[1]}
          </Typography>
          <Typography variant="body2" component="p" color="textSecondary">
            Cell Count: {tooltipData.bar.data.cell_count}
          </Typography>
          <Typography variant="body2" component="p" color="textSecondary">
            Percentage: {decimal.format((tooltipData.bar.data.cell_count / totalCellCount) * 100)}%
          </Typography>
        </Box>
      )}
    </TooltipInPortal>
  );
}
