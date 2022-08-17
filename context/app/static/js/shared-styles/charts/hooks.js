import { useState, useMemo } from 'react';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { getStringWidth } from '@visx/text';
import { useTheme } from '@material-ui/core/styles';

function useChartTooltip() {
  const [hoveredBarIndices, setHoveredBarIndices] = useState();

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
    debounce: 100,
  });

  const handleMouseEnter = (bar, barStackIndex) => (event) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: bar,
    });
    setHoveredBarIndices({ barIndex: bar.index, barStackIndex });
  };

  function handleMouseLeave() {
    hideTooltip();
    setHoveredBarIndices(undefined);
  }

  return {
    hoveredBarIndices,
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

export { useChartTooltip, useLongestLabelSize };
