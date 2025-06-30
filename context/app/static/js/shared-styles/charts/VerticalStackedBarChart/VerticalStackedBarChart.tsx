import React from 'react';
import { BarStack } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import Typography from '@mui/material/Typography';
import type { WithParentSizeProvidedProps } from '@visx/responsive/lib/enhancers/withParentSize';
import type { AnyD3Scale, ScaleInput } from '@visx/scale';
import type { Accessor, SeriesPoint } from '@visx/shape/lib/types';

import { type OrdinalScale, useChartTooltip, useVerticalChart } from 'js/shared-styles/charts/hooks';
import StackedBar from 'js/shared-styles/charts/StackedBar';
import VerticalChartGridRowsGroup from 'js/shared-styles/charts/VerticalChartGridRowsGroup';

import { BarStackProps } from '@visx/shape/lib/shapes/BarStack';
import { defaultXScaleRange, defaultYScaleRange, trimStringWithMiddleEllipsis } from '../utils';
import { type TooltipData, tooltipHasBarData } from '../types';
import TickComponent from '../TickComponent';
import { AXIS_LABEL_SIZE, TICK_LABEL_SIZE } from '../constants';

interface VerticalStackedBarChartProps<
  Datum,
  XAxisKey extends string,
  YAxisKey extends string,
  XAxisScale extends AnyD3Scale,
  YAxisScale extends AnyD3Scale,
> extends WithParentSizeProvidedProps {
  visxData: Datum[];
  xScale: XAxisScale;
  getXScaleRange?: (max: number) => [number, number];
  yScale: YAxisScale;
  getYScaleRange?: (max: number) => [number, number];
  colorScale: OrdinalScale;
  getX: (d: Datum) => XAxisKey;
  keys: YAxisKey[];
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  xAxisLabel: string;
  yAxisLabel: string;
  TooltipContent?: React.ComponentType<{ tooltipData: TooltipData<Datum> }>;
  xAxisTickLabels: XAxisKey[];
  // barHeight = yScale(y0(bar)) - yScale(y1(bar))
  // y = yScale(y1(bar))
  // Mainly used to support log scales, where y0 must be > 0
  y1?: Accessor<SeriesPoint<Datum>, ScaleInput<YAxisScale>>;
  y0?: Accessor<SeriesPoint<Datum>, ScaleInput<YAxisScale>>;
  getTickValues?: (yScale: YAxisScale) => number[];
  getAriaLabel?: (d: TooltipData<Datum>) => string;
  order?: BarStackProps<Datum, YAxisKey, XAxisScale, YAxisScale>['order'];
  valueAccessor?: (d: Datum, key: YAxisKey) => number;
  yTickFormat?: (value: number) => string;
}

function VerticalStackedBarChart<
  Datum,
  XAxisKey extends string,
  YAxisKey extends string,
  XAxisScale extends AnyD3Scale,
  YAxisScale extends AnyD3Scale,
>({
  parentWidth = 0,
  parentHeight = 500,
  visxData,
  yScale,
  xScale,
  getXScaleRange = defaultXScaleRange,
  getYScaleRange = defaultYScaleRange,
  colorScale,
  getX,
  keys,
  margin,
  xAxisLabel = '',
  yAxisLabel = '',
  TooltipContent,
  xAxisTickLabels,
  y0,
  y1,
  getTickValues,
  getAriaLabel,
  order,
  valueAccessor,
  yTickFormat = (value) => value.toString(),
}: VerticalStackedBarChartProps<Datum, XAxisKey, YAxisKey, XAxisScale, YAxisScale>) {
  const { xWidth, yHeight, updatedMargin, longestLabelSize } = useVerticalChart({
    margin,
    tickLabelSize: TICK_LABEL_SIZE,
    xAxisTickLabels: xAxisTickLabels.map((label) => trimStringWithMiddleEllipsis(label)),
    parentWidth,
    parentHeight,
  });

  yScale.range(getYScaleRange(yHeight));
  xScale.range(getXScaleRange(xWidth));

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    containerRef,
    TooltipInPortal,
    handleMouseEnter,
    handleMouseLeave,
  } = useChartTooltip<TooltipData<Datum>>();

  return (
    <>
      <svg width={parentWidth} height={parentHeight} ref={containerRef}>
        <VerticalChartGridRowsGroup
          getTickValues={getTickValues}
          margin={updatedMargin}
          yScale={yScale}
          xWidth={xWidth}
        >
          <>
            <BarStack
              height={yHeight}
              width={xWidth}
              data={visxData}
              keys={keys}
              x={getX}
              xScale={xScale}
              yScale={yScale}
              color={colorScale}
              y1={y1}
              y0={y0}
              order={order}
              value={valueAccessor}
            >
              {(barStacks) => {
                return barStacks.map((barStack) =>
                  barStack.bars.map(
                    (bar) =>
                      bar.width > 0 && (
                        <StackedBar
                          key={`${bar.key}-${bar.index}`}
                          direction="vertical"
                          bar={bar}
                          ariaLabelText={getAriaLabel?.(bar)}
                          hoverProps={{
                            onMouseEnter: handleMouseEnter(bar),
                            onMouseLeave: handleMouseLeave,
                          }}
                          colorScale={colorScale}
                        />
                      ),
                  ),
                );
              }}
            </BarStack>
            <AxisLeft
              scale={yScale}
              label={yAxisLabel}
              stroke="black"
              tickValues={getTickValues ? getTickValues(yScale) : undefined}
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
                dx: '-1em',
              }}
              tickFormat={yTickFormat}
            />
            <AxisBottom
              hideTicks
              top={yHeight}
              scale={xScale}
              label={xAxisLabel}
              stroke="black"
              tickStroke="black"
              labelOffset={longestLabelSize}
              tickLabelProps={() => ({
                fill: 'black',
                fontSize: TICK_LABEL_SIZE,
                textAnchor: 'end',
                angle: -90,
                fontWeight: 500,
                fontFamily: 'Inter Variable',
              })}
              tickComponent={TickComponent({ handleMouseEnter, handleMouseLeave })}
              labelProps={{
                fontSize: AXIS_LABEL_SIZE,
                color: 'black',
                fontWeight: 500,
                fontFamily: 'Inter Variable',
              }}
            />
          </>
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

// `as unknown as typeof VerticalStackedBarChart` allows us to use `withParentSize` without losing the generic types
export default withParentSize(VerticalStackedBarChart) as unknown as typeof VerticalStackedBarChart;
