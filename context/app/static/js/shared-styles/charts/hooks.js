import { useState } from 'react';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';

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

export { useChartTooltip };
