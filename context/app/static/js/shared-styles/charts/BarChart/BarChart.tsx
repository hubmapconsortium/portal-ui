import { WithParentSizeProvidedProps, withParentSize } from '@visx/responsive';
import React from 'react';
import { AxisBottom, AxisLeft, AxisScale } from '@visx/axis';
import Typography from '@mui/material/Typography';
import { useBandScale, useChartTooltip, useLinearScale, useOrdinalScale, useVerticalChart } from '../hooks';
import TickComponent from '../TickComponent';
import VerticalChartGridRowsGroup from '../VerticalChartGridRowsGroup';
import { TooltipComponentType, TooltipData, tooltipHasBarData } from '../types';

interface BarChartProps<T extends { value: number }, K extends string, D extends Record<K, T>>
  extends WithParentSizeProvidedProps {
  data: D;
  highlightedKeys?: K[];
  margin?: { top: number; right: number; bottom: number; left: number };
  yAxisLabel: string;
  xAxisLabel: string;
  TooltipContent?: TooltipComponentType<T>;
}

/**
 * This component creates a Bar Chart from a passed record of string keys to number values.
 *
 */
function BarChart<T extends { value: number }, K extends string, D extends Record<K, T>>({
  data,
  highlightedKeys,
  parentWidth = 0,
  parentHeight = 500,
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  yAxisLabel,
  xAxisLabel,
  TooltipContent,
}: BarChartProps<T, K, D>) {
  const keys = (Object.keys(data) as K[]).sort((a, b) => {
    // if one of the highlighted keys is in the data, move it to the front
    if (highlightedKeys?.includes(a)) return -1;
    return a.localeCompare(b);
  });
  const values = Object.values(data).map((v) => (v as T).value);
  const tickLabelSize = 11;
  const { xWidth, yHeight, updatedMargin, longestLabelSize } = useVerticalChart({
    margin,
    tickLabelSize,
    xAxisTickLabels: keys,
    parentWidth,
    parentHeight,
  });

  const xScale = useBandScale(keys, { range: [0, xWidth] });
  const yScale = useLinearScale(values, { range: [yHeight, 0] });

  const colorScale = useOrdinalScale(['matched', 'unmatched'], { range: ['#4B5F27', '#D1DAC1'] });

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    containerRef,
    TooltipInPortal,
    handleMouseEnter,
    handleMouseLeave,
  } = useChartTooltip<TooltipData<T>>();

  return (
    <>
      <svg width={parentWidth} height={parentHeight} ref={containerRef}>
        <VerticalChartGridRowsGroup
          getTickValues={(y: typeof yScale) => y.ticks(5)}
          margin={updatedMargin}
          yScale={yScale}
          xWidth={xWidth}
        >
          {keys.map((key) => {
            const { value } = data[key];
            const barWidth = xScale.bandwidth() / 2;
            const barX = (xScale(key) ?? 0) + barWidth / 2;
            const barY = yScale(value) as number;
            const barHeight = yHeight - barY;
            const fill = colorScale(highlightedKeys?.includes(key) ? 'matched' : 'unmatched');

            return (
              <rect
                key={key}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={fill}
                onMouseEnter={handleMouseEnter({ key, bar: { data: data[key] } })}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
          <AxisLeft
            hideTicks
            scale={yScale as AxisScale}
            label={yAxisLabel}
            stroke="black"
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: 11,
              textAnchor: 'end',
              dy: '0.33em',
            })}
            labelProps={{
              fontSize: 14,
              color: 'black',
              fontWeight: 500,
              fontFamily: 'Inter Variable',
            }}
          />
          <AxisBottom
            hideTicks
            top={yHeight}
            scale={xScale}
            label={xAxisLabel}
            stroke="black"
            tickStroke="black"
            numTicks={keys.length}
            labelOffset={longestLabelSize}
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: tickLabelSize,
              textAnchor: 'end',
              angle: -90,
            })}
            tickComponent={TickComponent({ handleMouseEnter, handleMouseLeave })}
            labelProps={{
              fontSize: 14,
              color: 'black',
              fontWeight: 500,
              fontFamily: 'Inter Variable',
            }}
          />
        </VerticalChartGridRowsGroup>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
          {TooltipContent ? (
            <TooltipContent tooltipData={tooltipData} />
          ) : (
            <>
              <Typography>{tooltipData.key}</Typography>
              {tooltipHasBarData(tooltipData) && (
                <Typography variant="h6" component="p" color="textPrimary">
                  {tooltipData.bar.data[tooltipData.key]}
                </Typography>
              )}
            </>
          )}
        </TooltipInPortal>
      )}
    </>
  );
}

export default withParentSize(BarChart);
