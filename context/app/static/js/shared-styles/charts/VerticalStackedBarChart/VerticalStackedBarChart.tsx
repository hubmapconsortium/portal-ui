import React, { useCallback } from 'react';
import { BarStack } from '@visx/shape';
import { AxisBottom, AxisLeft, TickRendererProps } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import Typography from '@mui/material/Typography';
import { Text } from '@visx/text';

import { OrdinalScale, useChartTooltip, useVerticalChart } from 'js/shared-styles/charts/hooks';
import StackedBar from 'js/shared-styles/charts/StackedBar';
import VerticalChartGridRowsGroup from 'js/shared-styles/charts/VerticalChartGridRowsGroup';
import {  PositionScale } from '@visx/shape/lib/types';
import { WithParentSizeProps, WithParentSizeProvidedProps } from '@visx/responsive/lib/enhancers/withParentSize';
import { FormattedValue, TooltipData, tooltipHasBarData } from '../types';
import { defaultXScaleRange, defaultYScaleRange, trimStringWithMiddleEllipsis } from '../utils';


interface TickComponentWithHandlersProps {
  handleMouseEnter: ({key}: {key: FormattedValue}) => React.MouseEventHandler<SVGTextElement>;
  handleMouseLeave: React.MouseEventHandler<SVGTextElement> | undefined
}

function TickComponentWithHandlers({ handleMouseEnter, handleMouseLeave }: TickComponentWithHandlersProps) {
  // use a callback to avoid creating a new component on every render
  return useCallback(
    ({ formattedValue, ...tickProps }: TickRendererProps) => {
      return (
        <Text onMouseEnter={handleMouseEnter({key: formattedValue})} onMouseLeave={handleMouseLeave} {...tickProps}>
          {trimStringWithMiddleEllipsis(formattedValue)}
        </Text>
      );
    },
    [handleMouseEnter, handleMouseLeave],
  );
}

interface VerticalStackedBarChartProps<Datum, XAxisKey extends string> extends WithParentSizeProps, WithParentSizeProvidedProps {
  visxData: Datum[];
  yScale: PositionScale;
  xScale: PositionScale;
  setXScaleRange?: (scale: PositionScale, max: number) => void;
  setYScaleRange?: (scale: PositionScale, max: number) => void;
  colorScale: OrdinalScale;
  getX: (d: Datum) => XAxisKey;
  keys: (keyof Datum extends string ? keyof Datum : never)[];
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  xAxisLabel: string;
  yAxisLabel: string;
  TooltipContent?: React.ComponentType<{tooltipData: TooltipData<Datum>}>;
  xAxisTickLabels: XAxisKey[];
}

function VerticalStackedBarChart<Datum, XAxisKey extends string = string>({
  parentWidth = 0,
  parentHeight = 0,
  visxData,
  yScale,
  xScale,
  setXScaleRange = defaultXScaleRange,
  setYScaleRange = defaultYScaleRange,
  colorScale,
  getX,
  keys,
  margin,
  xAxisLabel,
  yAxisLabel,
  TooltipContent,
  xAxisTickLabels,
}: VerticalStackedBarChartProps<Datum, XAxisKey>) {
  const tickLabelSize = 11;

  const { xWidth, yHeight, updatedMargin, longestLabelSize } = useVerticalChart({
    margin,
    tickLabelSize,
    xAxisTickLabels: xAxisTickLabels.map((label) => trimStringWithMiddleEllipsis(label)),
    parentWidth,
    parentHeight,
  });

  setXScaleRange(xScale, xWidth);
  setYScaleRange(yScale, yHeight);

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
        <VerticalChartGridRowsGroup margin={updatedMargin} yScale={yScale} xWidth={xWidth}>
          <>
            <BarStack
              data={visxData}
              keys={keys}
              height={yHeight}
              x={getX}
              xScale={xScale}
              yScale={yScale}
              color={colorScale}
            >
              {(barStacks) => {
                return barStacks.map((barStack) =>
                  barStack.bars.map(
                    (bar) =>
                      bar.width > 0 && (
                        <StackedBar
                          key={bar.key}
                          direction="vertical"
                          bar={bar}
                          hoverProps={{
                            onMouseEnter: handleMouseEnter(bar),
                            onMouseLeave: handleMouseLeave,
                          }}
                        />
                      ),
                  ),
                );
              }}
            </BarStack>
            <AxisLeft
              hideTicks
              scale={yScale}
              label={yAxisLabel}
              stroke="black"
              tickLabelProps={() => ({
                fill: 'black',
                fontSize: 11,
                textAnchor: 'end',
                dy: '0.33em',
              })}
              labelProps={{
                fontSize: 12,
              }}
            />
            <AxisBottom
              hideTicks
              top={yHeight}
              scale={xScale}
              label={xAxisLabel}
              stroke="black"
              tickStroke="black"
              numTicks={Object.keys(visxData).length}
              labelOffset={longestLabelSize}
              tickLabelProps={() => ({
                fill: 'black',
                fontSize: tickLabelSize,
                textAnchor: 'end',
                angle: -90,
              })}
              tickComponent={TickComponentWithHandlers({ handleMouseEnter, handleMouseLeave })}
              labelProps={{
                fontSize: 12,
                textAnchor: 'middle',
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

export default withParentSize(VerticalStackedBarChart);