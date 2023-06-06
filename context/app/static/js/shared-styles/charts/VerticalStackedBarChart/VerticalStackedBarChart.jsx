import React, { useMemo } from 'react';
import { BarStack } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import Typography from '@material-ui/core/Typography';
import { Text } from '@visx/text';

import { useChartTooltip, useVerticalChart } from 'js/shared-styles/charts/hooks';
import { trimStringWithMiddleEllipsis } from 'js/shared-styles/charts/utils';
import StackedBar from 'js/shared-styles/charts/StackedBar';
import VerticalChartGridRowsGroup from 'js/shared-styles/charts//VerticalChartGridRowsGroup';

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

  const { xWidth, yHeight, updatedMargin, longestLabelSize } = useVerticalChart({
    margin,
    tickLabelSize,
    xAxisTickLabels: xAxisTickLabels.map((label) => trimStringWithMiddleEllipsis(label)),
    parentWidth,
    parentHeight,
  });

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

  const TickComponent = useMemo(
    ({ ...props }) => <Tick {...props} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />,
    [handleMouseEnter, handleMouseLeave],
  );

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
              tickComponent={TickComponent}
              labelProps={{
                fontSize: 12,
                textAnchor: 'middle',
              }}
            />
          </>
        </VerticalChartGridRowsGroup>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
          {TooltipContent ? (
            <TooltipContent tooltipData={tooltipData} />
          ) : (
            <>
              <Typography>{tooltipData.key}</Typography>
              {'bar' in tooltipData && (
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

function Tick({ formattedValue, handleMouseEnter, handleMouseLeave, ...tickProps }) {
  return (
    <Text onMouseEnter={handleMouseEnter({ key: formattedValue })} onMouseLeave={handleMouseLeave} {...tickProps}>
      {trimStringWithMiddleEllipsis(formattedValue)}
    </Text>
  );
}

export default withParentSize(VerticalStackedBarChart);
