import React from 'react';
import PropTypes from 'prop-types';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisTop, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import { GridColumns } from '@visx/grid';
import Typography from '@mui/material/Typography';

import { useChartTooltip, useLongestLabelSize } from 'js/shared-styles/charts/hooks';
import { getChartDimensions } from 'js/shared-styles/charts/utils';
import StackedBar from 'js/shared-styles/charts/StackedBar';

function AssayTypeBarChart({
  parentWidth,
  parentHeight,
  visxData,
  docCountScale,
  dataTypeScale,
  colorScale,
  keys,
  margin,
  colorFacetName,
  dataTypes,
  showTooltipAndHover,
}) {
  const tickLabelSize = 11;
  const longestLabelSize = useLongestLabelSize({ labels: dataTypes, labelFontSize: tickLabelSize });
  const updatedMargin = { ...margin, left: longestLabelSize + 10 };

  const { xWidth, yHeight } = getChartDimensions(parentWidth, parentHeight, updatedMargin);

  docCountScale.rangeRound([0, xWidth]);
  dataTypeScale.rangeRound([yHeight, 0]);

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

  return (
    <>
      <svg width={parentWidth} height={parentHeight} ref={containerRef}>
        <GridColumns
          top={updatedMargin.top}
          left={updatedMargin.left}
          scale={docCountScale}
          height={yHeight}
          stroke="black"
          opacity={0.38}
        />
        <Group top={updatedMargin.top} left={updatedMargin.left}>
          <BarStackHorizontal
            data={visxData}
            keys={keys}
            height={yHeight}
            y={(d) => d.mapped_data_type}
            xScale={docCountScale}
            yScale={dataTypeScale}
            color={colorScale}
          >
            {(barStacks) => {
              return barStacks.map((barStack) =>
                barStack.bars.map(
                  (bar) =>
                    bar.width > 0 && (
                      <a
                        href={`/search?entity_type[0]=Dataset&mapped_data_types[0]=${encodeURIComponent(
                          bar.bar.data.mapped_data_type,
                        )}&${colorFacetName}[0]=${encodeURIComponent(bar.key)}`}
                        key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                        target="_parent"
                      >
                        {/* Make target explicit because html base target doesn't apply inside SVG. */}
                        <StackedBar
                          direction="horizontal"
                          bar={bar}
                          barStack={barStack}
                          hoverProps={
                            showTooltipAndHover
                              ? { onMouseEnter: handleMouseEnter(bar), onMouseLeave: handleMouseLeave }
                              : {}
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
            scale={dataTypeScale}
            stroke="black"
            numTicks={Object.keys(visxData).length}
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: tickLabelSize,
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
              fontSize: tickLabelSize,
              textAnchor: 'middle',
            })}
          />
        </Group>
      </svg>
      {showTooltipAndHover && tooltipOpen && (
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
    </>
  );
}

AssayTypeBarChart.propTypes = {
  showTooltipAndHover: PropTypes.bool,
};

AssayTypeBarChart.defaultProps = {
  showTooltipAndHover: true,
};

export default withParentSize(AssayTypeBarChart);
