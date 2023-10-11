import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';
import { bin } from 'd3-array';
import Typography from '@mui/material/Typography';

import { TitleWrapper } from 'js/shared-styles/charts/style';
import { useVerticalChart } from 'js/shared-styles/charts/hooks';

import VerticalChartGridRowsGroup from 'js/shared-styles/charts//VerticalChartGridRowsGroup';

function Histogram({ parentWidth, parentHeight, visxData, margin, barColor, xAxisLabel, yAxisLabel, chartTitle }) {
  const binFunc = bin();
  const chartData = binFunc(visxData);

  const tickLabelSize = 11;

  const { xWidth, yHeight, updatedMargin, longestLabelSize } = useVerticalChart({
    margin,
    tickLabelSize,
    xAxisTickLabels: chartData.map((d) => [d.x0, d.x1]).flat(),
    parentWidth,
    parentHeight,
  });

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [chartData[0].x0, chartData[chartData.length - 1].x1],
        range: [0, xWidth],
      }),
    [chartData, xWidth],
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...chartData.map((d) => d.length))],
        nice: true,
        round: true,
        range: [yHeight, 0],
      }),
    [chartData, yHeight],
  );

  return (
    <div>
      <TitleWrapper $leftOffset={updatedMargin.left - updatedMargin.right}>
        {chartTitle && <Typography>{chartTitle}</Typography>}
      </TitleWrapper>
      <svg width={parentWidth} height={parentHeight}>
        <VerticalChartGridRowsGroup margin={updatedMargin} yScale={yScale} xWidth={xWidth}>
          <>
            {chartData.map((d) => {
              const barWidth = Math.max(0, xScale(d.x1) - xScale(d.x0) - 1);
              const barHeight = yScale(0) - yScale(d.length);
              const barX = xScale(d.x0) + 1;
              const barY = yScale(d.length);
              return <Bar key={d} x={barX} y={barY} width={barWidth} height={barHeight} fill={barColor} />;
            })}
            <AxisLeft
              hideTicks
              scale={yScale}
              label={yAxisLabel}
              stroke="black"
              tickLabelProps={() => ({
                fill: 'black',
                fontSize: tickLabelSize,
                textAnchor: 'end',
                dy: '0.33em',
              })}
              labelProps={{
                fontSize: 12,
              }}
              labelOffset={48}
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
                fontSize: tickLabelSize,
                textAnchor: 'end',
                angle: -90,
              })}
              labelProps={{
                fontSize: 12,
                textAnchor: 'middle',
              }}
            />
          </>
        </VerticalChartGridRowsGroup>
      </svg>
    </div>
  );
}

export default withParentSize(Histogram);
