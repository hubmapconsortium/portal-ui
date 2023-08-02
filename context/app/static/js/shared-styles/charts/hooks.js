import { useMemo } from 'react';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { getStringWidth } from '@visx/text';
import { useTheme } from '@mui/material/styles';

import { getChartDimensions } from 'js/shared-styles/charts/utils';

function useChartTooltip() {
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
    debounce: 100,
  });

  const handleMouseEnter = (d) => (event) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: d,
    });
  };

  function handleMouseLeave() {
    hideTooltip();
  }

  return {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    containerRef,
    TooltipInPortal,
    handleMouseEnter,
    handleMouseLeave,
  };
}

function useLongestLabelSize({ labels, labelFontSize = 11 }) {
  const theme = useTheme();

  const longestLabelSize = useMemo(
    () =>
      Math.max(
        ...labels.map((d) =>
          getStringWidth(d, { fontSize: `${labelFontSize}px`, fontFamily: theme.typography.fontFamily }),
        ),
      ),
    [labelFontSize, labels, theme.typography.fontFamily],
  );

  return longestLabelSize;
}

function useVerticalChart({ margin, tickLabelSize, xAxisTickLabels, parentWidth, parentHeight }) {
  const longestLabelSize = useLongestLabelSize({
    labels: xAxisTickLabels,
    labelFontSize: tickLabelSize,
  });
  const updatedMargin = { ...margin, bottom: Math.max(margin.bottom, longestLabelSize + 40) };

  const { xWidth, yHeight } = getChartDimensions(parentWidth, parentHeight, updatedMargin);

  return { xWidth, yHeight, updatedMargin, longestLabelSize };
}

export { useChartTooltip, useLongestLabelSize, useVerticalChart };
