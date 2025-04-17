import React from 'react';
import Typography from '@mui/material/Typography';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisTop, AxisLeft } from '@visx/axis';
import { WithParentSizeProvidedProps, withParentSize } from '@visx/responsive';
import { GridColumns } from '@visx/grid';
import { AnyD3Scale, ScaleInput } from '@visx/scale';
import { Accessor, BarGroupBar, SeriesPoint } from '@visx/shape/lib/types';

import { OrdinalScale, useChartTooltip, useHorizontalChart } from 'js/shared-styles/charts/hooks';
import { defaultXScaleRange, defaultYScaleRange, trimStringWithMiddleEllipsis } from 'js/shared-styles/charts/utils';
import StackedBar from 'js/shared-styles/charts/StackedBar';
import { TextProps } from '@visx/text';
import { TICK_LABEL_SIZE } from '../constants';
import { TooltipData, tooltipHasBarData } from '../types';

const srOnlyLabelStyles: Partial<TextProps> = {
  style: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
};

interface HorizontalStackedBarChartProps<Datum, XAxisScale extends AnyD3Scale, YAxisScale extends AnyD3Scale>
  extends WithParentSizeProvidedProps {
  visxData: Datum[];
  xScale: XAxisScale;
  getXScaleRange?: (max: number) => [number, number];
  yScale: YAxisScale;
  getYScaleRange?: (max: number) => [number, number];
  colorScale: OrdinalScale;
  getY: (d: Datum) => string;
  keys: string[];
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  xAxisLabel: string;
  yAxisLabel: string;
  srOnlyLabels?: boolean;
  TooltipContent?: React.ComponentType<{ tooltipData: TooltipData<Datum> }>;
  yAxisTickLabels: string[];
  // barHeight = yScale(y0(bar)) - yScale(y1(bar))
  // x = xScale(x1(bar))
  // Mainly used to support log scales, where x0 must be > 0
  x1?: Accessor<SeriesPoint<Datum>, ScaleInput<XAxisScale>>;
  x0?: Accessor<SeriesPoint<Datum>, ScaleInput<XAxisScale>>;
  // getTickValues?: (yScale: YAxisScale) => number[];
  showTooltipAndHover?: boolean;
  getBarHref?: (
    d: Omit<BarGroupBar<string>, 'key' | 'value'> & {
      bar: SeriesPoint<Datum>;
      key: string;
    },
  ) => string;
  onBarClick: (
    d: Omit<BarGroupBar<string>, 'key' | 'value'> & {
      bar: SeriesPoint<Datum>;
      key: string;
    },
  ) => void;
  getAriaLabel?: (d: TooltipData<Datum>) => string;
}

function HorizontalStackedBarChart<Datum, XAxisScale extends AnyD3Scale, YAxisScale extends AnyD3Scale>({
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
  x0,
  x1,
  // getTickValues,
  showTooltipAndHover = true,
  getBarHref,
  onBarClick,
  getAriaLabel,
  srOnlyLabels,
}: HorizontalStackedBarChartProps<Datum, XAxisScale, YAxisScale>) {
  const { xWidth, yHeight, updatedMargin, longestLabelSize } = useHorizontalChart({
    margin,
    tickLabelSize: TICK_LABEL_SIZE,
    yAxisTickLabels: yAxisTickLabels.map((label) => trimStringWithMiddleEllipsis(label)),
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

  if (visxData.length === 0) {
    return null;
  }

  const axisLabelProps = srOnlyLabels ? srOnlyLabelStyles : undefined;

  return (
    <>
      <svg width={parentWidth} height={parentHeight} ref={containerRef}>
        <GridColumns
          top={updatedMargin.top}
          left={updatedMargin.left}
          scale={xScale}
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
            x0={x0}
            x1={x1}
          >
            {(barStacks) => {
              return barStacks.map((barStack) =>
                barStack.bars.map(
                  (bar) =>
                    bar.width > 0 && (
                      <StackedBar
                        key={`${bar.key}-${bar.index}`}
                        direction="horizontal"
                        bar={bar}
                        onClick={() => onBarClick(bar)}
                        href={getBarHref?.(bar)}
                        ariaLabelText={getAriaLabel?.(bar)}
                        hoverProps={
                          showTooltipAndHover
                            ? { onMouseEnter: handleMouseEnter(bar), onMouseLeave: handleMouseLeave }
                            : undefined
                        }
                      />
                    ),
                ),
              );
            }}
          </BarStackHorizontal>
          <AxisLeft
            hideTicks
            scale={yScale}
            stroke="black"
            numTicks={yAxisTickLabels.length}
            label={yAxisLabel}
            labelProps={axisLabelProps}
            labelOffset={longestLabelSize + 10}
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
            labelProps={axisLabelProps}
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: TICK_LABEL_SIZE,
              textAnchor: 'middle',
            })}
          />
        </Group>
      </svg>
      {showTooltipAndHover && tooltipOpen && tooltipData && (
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

export default withParentSize(HorizontalStackedBarChart) as typeof HorizontalStackedBarChart;
