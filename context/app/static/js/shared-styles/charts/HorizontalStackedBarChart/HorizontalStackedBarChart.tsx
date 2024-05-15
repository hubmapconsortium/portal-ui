import React from 'react';
import Typography from '@mui/material/Typography';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisTop, AxisLeft } from '@visx/axis';
import { WithParentSizeProvidedProps, withParentSize } from '@visx/responsive';
import { GridColumns } from '@visx/grid';
import { AnyD3Scale } from '@visx/scale';
// import type { Accessor, SeriesPoint } from '@visx/shape/lib/types';

import { OrdinalScale, useChartTooltip, useLongestLabelSize } from 'js/shared-styles/charts/hooks';
import { getChartDimensions, defaultXScaleRange, defaultYScaleRange } from 'js/shared-styles/charts/utils';
import StackedBar from 'js/shared-styles/charts/StackedBar';
import { TICK_LABEL_SIZE } from '../constants';
import { TooltipData, tooltipHasBarData } from '../types';

interface HorizontalStackedBarChartProps<
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
  getY: (d: Datum) => YAxisKey;
  keys: XAxisKey[];
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  xAxisLabel: string;
  yAxisLabel: string;
  TooltipContent?: React.ComponentType<{ tooltipData: TooltipData<Datum> }>;
  yAxisTickLabels: YAxisKey[];
  // barHeight = yScale(y0(bar)) - yScale(y1(bar))
  // x = xScale(x1(bar))
  // Mainly used to support log scales, where y0 must be > 0
  // x1?: Accessor<SeriesPoint<Datum>, ScaleInput<YAxisScale>>;
  // x0?: Accessor<SeriesPoint<Datum>, ScaleInput<YAxisScale>>;
  // getTickValues?: (yScale: YAxisScale) => number[];
  showTooltipAndHover: boolean;
  colorFacetName: string;
}

function HorizontalStackedBarChart<
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
  getY,
  keys,
  margin,
  xAxisLabel = '',
  yAxisLabel = '',
  TooltipContent,
  yAxisTickLabels,
  // x0,
  // x1,
  // getTickValues,
  showTooltipAndHover = true,
  colorFacetName, // TODO: Remove this prop
}: HorizontalStackedBarChartProps<Datum, XAxisKey, YAxisKey, XAxisScale, YAxisScale>) {
  const longestLabelSize = useLongestLabelSize({ labels: yAxisTickLabels, labelFontSize: TICK_LABEL_SIZE });
  const updatedMargin = { ...margin, left: longestLabelSize + 10 };

  const { xWidth, yHeight } = getChartDimensions(parentWidth, parentHeight, updatedMargin);

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
        <GridColumns
          top={updatedMargin.top}
          left={updatedMargin.left}
          scale={yScale}
          height={yHeight}
          stroke="black"
          opacity={0.38}
        />
        <Group top={updatedMargin.top} left={updatedMargin.left}>
          <BarStackHorizontal
            data={visxData}
            keys={keys}
            height={yHeight}
            y={getY}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}
          >
            {(barStacks) => {
              return barStacks.map((barStack) =>
                barStack.bars.map(
                  (bar) =>
                    bar.width > 0 && (
                      <a
                        href={`/search?entity_type[0]=Dataset&mapped_data_types[0]=${encodeURIComponent(
                          // @ts-expect-error mapped_data_type is not a key of Datum (TODO: fix this in the future)
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                          bar.bar.data.mapped_data_type,
                        )}&${colorFacetName}[0]=${encodeURIComponent(bar.key)}`}
                        key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                        target="_parent"
                      >
                        {/* Make target explicit because html base target doesn't apply inside SVG. */}
                        <StackedBar
                          direction="horizontal"
                          bar={bar}
                          hoverProps={
                            showTooltipAndHover
                              ? { onMouseEnter: handleMouseEnter(bar), onMouseLeave: handleMouseLeave }
                              : undefined
                          }
                        />
                      </a>
                    ),
                ),
              );
            }}
          </BarStackHorizontal>
          <AxisLeft
            hideTicks
            scale={yScale}
            stroke="black"
            numTicks={Object.keys(visxData).length}
            label={yAxisLabel}
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: TICK_LABEL_SIZE,
              textAnchor: 'end',
              dy: '0.33em',
            })}
          />
          <AxisTop
            hideTicks
            top={1}
            scale={xScale}
            stroke="black"
            tickStroke="black"
            label={xAxisLabel}
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: TICK_LABEL_SIZE,
              textAnchor: 'middle',
            })}
          />
        </Group>
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
      {/* {showTooltipAndHover && tooltipOpen && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
          <Typography variant="subtitle2" color="secondary">
            {tooltipData.bar.data.mapped_data_type}
          </Typography>
          <Typography>{tooltipData.key}</Typography>
          <Typography variant="h3" component="p" color="textPrimary">
            {tooltipData.bar.data[tooltipData.key]}
          </Typography>
        </TooltipInPortal>
      )} */}
    </>
  );
}

export default withParentSize(HorizontalStackedBarChart);
