import React from 'react';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import { GridRows } from '@visx/grid';
import Typography from '@material-ui/core/Typography';
import { mergeRefs } from 'react-merge-refs';
import { Text } from '@visx/text';

import { useChartTooltip, useLongestLabelSize } from 'js/shared-styles/charts/hooks';
import { getChartDimensions } from 'js/shared-styles/charts/utils';
import StackedBar from 'js/shared-styles/charts/StackedBar';

function VerticalStackedBarChart({
  parentWidth,
  parentHeight,
  visxData,
  yScale,
  xScale,
  colorScale,
  getX,
  keys,
  margin,
  xAxisLabel,
  yAxisLabel,
  TooltipContent,
  xAxisTickLabels,
}) {
  const tickLabelSize = 11;
  const longestLabelSize = useLongestLabelSize({ labels: xAxisTickLabels, labelFontSize: tickLabelSize });
  const updatedMargin = { ...margin, bottom: Math.max(margin.bottom, 120 + 40) };

  const { xWidth, yHeight } = getChartDimensions(parentWidth, parentHeight, updatedMargin);

  yScale.rangeRound([yHeight, 0]);
  xScale.rangeRound([0, xWidth]);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    containerRef,
    TooltipInPortal,
    handleMouseEnter,
    handleMouseLeave,
  } = useChartTooltip();

  const {
    tooltipData: tickTooltipData,
    tooltipLeft: tickTooltipLeft,
    tooltipTop: tickTooltipTop,
    tooltipOpen: tickTooltipOpen,
    containerRef: tickContainerRef,
    TooltipInPortal: TickTooltipInPortal,
    handleMouseEnter: tickHandleMouseEnter,
    handleMouseLeave: tickHandleMouseLeave,
  } = useChartTooltip();

  return (
    <>
      <svg width={parentWidth} height={parentHeight} ref={mergeRefs([containerRef, tickContainerRef])}>
        <GridRows
          top={updatedMargin.top}
          left={updatedMargin.left}
          scale={yScale}
          width={xWidth}
          stroke="black"
          opacity={0.2}
        />
        <Group top={updatedMargin.top} left={updatedMargin.left}>
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
            tickComponent={({ formattedValue, x, y, ...tickProps }) => {
              return (
                <Text
                  x={x}
                  y={y}
                  onMouseEnter={tickHandleMouseEnter({ key: formattedValue })}
                  onMouseLeave={tickHandleMouseLeave}
                  {...tickProps}
                >
                  {formattedValue}
                </Text>
              );
            }}
            labelProps={{
              fontSize: 12,
              textAnchor: 'middle',
            }}
          />
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
          {TooltipContent ? (
            <TooltipContent tooltipData={tooltipData} />
          ) : (
            <>
              <Typography>{tooltipData.key}</Typography>
              <Typography variant="h6" component="p" color="textPrimary">
                {tooltipData.bar.data[tooltipData.key]}
              </Typography>
            </>
          )}
        </TooltipInPortal>
      )}
      {tickTooltipOpen && (
        <TickTooltipInPortal top={tickTooltipTop} left={tickTooltipLeft}>
          <Typography variant="h6" component="p" color="textPrimary">
            {tickTooltipData.key}
          </Typography>
        </TickTooltipInPortal>
      )}
    </>
  );
}

export default withParentSize(VerticalStackedBarChart);
