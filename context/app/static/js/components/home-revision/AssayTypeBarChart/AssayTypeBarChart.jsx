import React, { useState } from 'react';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisTop, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import Typography from '@material-ui/core/Typography';

const getDataType = (d) => d.mapped_data_type;

function AssayTypeBarChart({
  parentWidth,
  parentHeight,
  formattedData,
  docCountScale,
  dataTypeScale,
  colorScale,
  organTypes,
  margin,
}) {
  const [hoveredBarIndices, setHoveredBarIndices] = useState();

  const xMax = parentWidth - margin.left - margin.right;
  const yMax = parentHeight - margin.top - margin.bottom;

  docCountScale.rangeRound([0, xMax]);
  dataTypeScale.rangeRound([yMax, 0]);

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
    <div>
      <svg width={parentWidth} height={parentHeight} ref={containerRef}>
        <Group top={margin.top} left={margin.left}>
          <BarStackHorizontal
            data={formattedData}
            keys={organTypes}
            height={yMax}
            y={getDataType}
            xScale={docCountScale}
            yScale={dataTypeScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map(
                  (bar) =>
                    bar.width > 0 && (
                      <rect
                        key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                        x={bar.x}
                        y={bar.y}
                        width={bar.width - strokeWidth}
                        height={bar.height}
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
              )
            }
          </BarStackHorizontal>
          <AxisLeft
            hideTicks
            scale={dataTypeScale}
            stroke="black"
            numTicks={33}
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: 11,
              textAnchor: 'end',
              dy: '0.33em',
            })}
          />
          <AxisTop
            hideTicks
            top={1}
            scale={docCountScale}
            stroke="black"
            tickStroke="black"
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: 11,
              textAnchor: 'middle',
            })}
          />
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
          <Typography variant="subtitle2" color="secondary">
            {tooltipData.bar.data.mapped_data_type}
          </Typography>
          <Typography>{tooltipData.key}</Typography>
          <Typography variant="h3" component="p" color="textPrimary">
            {tooltipData.bar.data[tooltipData.key]}
          </Typography>
        </TooltipInPortal>
      )}
    </div>
  );
}

export default withParentSize(AssayTypeBarChart);
