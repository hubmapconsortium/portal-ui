import React, { useState } from 'react';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { GridRows } from '@visx/grid';
import { localPoint } from '@visx/event';
import Typography from '@material-ui/core/Typography';

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
}) {
  const [hoveredBarIndices, setHoveredBarIndices] = useState();

  const xWidth = parentWidth - margin.left - margin.right;
  const yHeight = parentHeight - margin.top - margin.bottom;

  yScale.rangeRound([yHeight, 0]);
  xScale.rangeRound([0, xWidth]);

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
    debounce: 100,
  });

  function handleMouseEnter(event, bar, barStackIndex) {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: bar,
    });
    setHoveredBarIndices({ barIndex: bar.index, barStackIndex });
  }

  function handleMouseLeave() {
    hideTooltip();
    setHoveredBarIndices(undefined);
  }

  const strokeWidth = 1.5;

  return (
    <>
      <svg width={parentWidth} height={parentHeight} ref={containerRef}>
        <GridRows top={margin.top + 1} left={margin.left} scale={yScale} width={xWidth} stroke="black" opacity={0.2} />
        <Group top={margin.top} left={margin.left}>
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
                      <rect
                        x={bar.x}
                        y={bar.y}
                        width={bar.width}
                        // TODO: Fix stroke overlap without shrinking bars
                        height={Math.max(bar.height - strokeWidth, 0.1)}
                        fill={bar.color}
                        stroke={
                          hoveredBarIndices &&
                          bar.index === hoveredBarIndices.barIndex &&
                          barStack.index === hoveredBarIndices.barStackIndex
                            ? 'black'
                            : bar.color
                        }
                        strokeWidth={strokeWidth}
                        onMouseEnter={(event) => handleMouseEnter(event, bar, barStack.index)}
                        onMouseLeave={handleMouseLeave}
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
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: 11,
              textAnchor: 'middle',
            })}
            labelProps={{
              fontSize: 12,
              textAnchor: 'middle',
            }}
          />
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
          <Typography>{tooltipData.key}</Typography>
          <Typography variant="h3" component="p" color="textPrimary">
            {tooltipData.bar.data[tooltipData.key]}
          </Typography>
        </TooltipInPortal>
      )}
    </>
  );
}

export default withParentSize(VerticalStackedBarChart);
