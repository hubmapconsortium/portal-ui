import { MouseEvent, useMemo } from 'react';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { getStringWidth } from '@visx/text';
import {
  BandScaleConfig,
  LinearScaleConfig,
  LogScaleConfig,
  OrdinalScaleConfig,
  scaleBand,
  scaleLinear,
  scaleLog,
  scaleOrdinal,
} from '@visx/scale';
import { useTheme } from '@mui/material/styles';

import { getChartDimensions, trimStringWithMiddleEllipsis } from 'js/shared-styles/charts/utils';

function useChartTooltip<T>() {
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<T>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
    debounce: 100,
  });

  const handleMouseEnter = (d: T) => (event: MouseEvent) => {
    const element = event.target as SVGElement;
    const owner = element.ownerSVGElement;
    if (!owner) {
      return;
    }
    const coords = localPoint(owner, event);
    if (!coords) return;
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

function useLongestLabelSize({ labels, labelFontSize = 11 }: { labels: string[]; labelFontSize?: number }) {
  const theme = useTheme();

  const longestLabelSize = useMemo(
    () =>
      Math.max(
        ...labels.map(
          (d) =>
            getStringWidth(trimStringWithMiddleEllipsis(`${d}`), {
              fontSize: `${labelFontSize}px`,
              fontFamily: theme.typography.fontFamily,
            }) ?? 0,
        ),
      ),
    [labelFontSize, labels, theme.typography.fontFamily],
  );

  return longestLabelSize;
}

interface UseChartProps {
  margin: { top: number; right: number; bottom: number; left: number };
  tickLabelSize: number;
  parentWidth: number;
  parentHeight: number;
}
interface UseVerticalChartProps extends UseChartProps {
  xAxisTickLabels: string[];
}

function useVerticalChart({
  margin,
  tickLabelSize,
  xAxisTickLabels,
  parentWidth,
  parentHeight,
}: UseVerticalChartProps) {
  const longestLabelSize = useLongestLabelSize({
    labels: xAxisTickLabels,
    labelFontSize: tickLabelSize,
  });
  const updatedMargin = { ...margin, bottom: Math.max(margin.bottom, longestLabelSize + 40) };

  const { xWidth, yHeight } = getChartDimensions(parentWidth, parentHeight, updatedMargin);

  return { xWidth, yHeight, updatedMargin, longestLabelSize };
}

interface UseHorizontalChartProps extends UseChartProps {
  yAxisTickLabels: string[];
}

function useHorizontalChart({
  margin,
  tickLabelSize,
  yAxisTickLabels,
  parentWidth,
  parentHeight,
}: UseHorizontalChartProps) {
  const longestLabelSize = useLongestLabelSize({
    labels: yAxisTickLabels,
    labelFontSize: tickLabelSize,
  });
  const updatedMargin = { ...margin, left: Math.max(margin.left, longestLabelSize + 40) };

  const { xWidth, yHeight } = getChartDimensions(parentWidth, parentHeight, updatedMargin);

  return { xWidth, yHeight, updatedMargin, longestLabelSize };
}

function useLinearScale(data: number[], config: Omit<LinearScaleConfig, 'type'> = {}) {
  return useMemo(() => {
    const domain = [Math.min(...data, 0), Math.max(...data)];
    return scaleLinear({
      ...config,
      domain,
    });
  }, [data, config]);
}

function useLogScale(data: number[], config: Omit<LogScaleConfig<number>, 'type'> = {}) {
  return useMemo(() => {
    const domain = [Math.min(...data, 1), Math.max(...data)];
    return scaleLog<number>({
      ...config,
      domain,
    });
  }, [data, config]);
}

function useBandScale(domain: string[], config: Omit<BandScaleConfig, 'type'> = {}) {
  return useMemo(() => scaleBand({ ...config, domain }), [domain, config]);
}

function useOrdinalScale(domain: string[], config: Omit<OrdinalScaleConfig<string, string>, 'type'> = {}) {
  return useMemo(() => scaleOrdinal<string, string>({ ...config, domain }), [domain, config]);
}

export type OrdinalScale = ReturnType<typeof useOrdinalScale>;

export {
  useChartTooltip,
  useLongestLabelSize,
  useVerticalChart,
  useHorizontalChart,
  useLinearScale,
  useLogScale,
  useBandScale,
  useOrdinalScale,
};
