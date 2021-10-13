import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import { GridRows } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { bin } from 'd3-array';
import Typography from '@material-ui/core/Typography';

import { TitleWrapper } from 'js/shared-styles/charts/style';

function Histogram({ parentWidth, parentHeight, visxData, margin, barColor, xAxisLabel, yAxisLabel, chartTitle }) {
  const xWidth = parentWidth - margin.left - margin.right;
  const yHeight = parentHeight - margin.top - margin.bottom;

  const binFunc = bin();
  const chartData = binFunc(visxData);

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
      <TitleWrapper $leftOffset={margin.left - margin.right}>
        {chartTitle && <Typography>{chartTitle}</Typography>}
      </TitleWrapper>
      <svg width={parentWidth} height={parentHeight}>
        <GridRows top={margin.top} left={margin.left} scale={yScale} width={xWidth} stroke="black" opacity={0.2} />
        <Group top={margin.top} left={margin.left}>
          {chartData.map((d) => {
            const barWidth = Math.max(0, xScale(d.x1) - xScale(d.x0) - 1);
            const barHeight = yScale(0) - yScale(d.length);
            const barX = xScale(d.x0) + 1;
            const barY = yScale(d.length);
            return <Bar x={barX} y={barY} width={barWidth} height={barHeight} fill={barColor} />;
          })}
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
    </div>
  );
}

export default withParentSize(Histogram);
