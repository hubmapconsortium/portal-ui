import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import { GridRows } from '@visx/grid';
import { scaleBand, scaleLinear } from '@visx/scale';
import { bin } from 'd3-array';

function Histogram({ parentWidth, parentHeight, visxData, margin }) {
  const xWidth = parentWidth - margin.left - margin.right;
  const yHeight = parentHeight - margin.top - margin.bottom;

  const binner = bin();
  const bins = binner(visxData);

  const chartData = bins.map((b) => {
    const { x0, x1 } = b;
    const xLabel = `${x0}-${x1}`;
    const count = b.length - 2;
    return { xLabel, count };
  });

  const getX = (d) => d.xLabel;
  const getY = (d) => d.count;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xWidth],
        round: true,
        domain: chartData.map(getX),
        padding: 0.4,
      }),
    [chartData, xWidth],
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yHeight, 0],
        round: true,
        domain: [0, Math.max(...chartData.map(getY))],
      }),
    [chartData, yHeight],
  );

  return (
    <div>
      <svg width={parentWidth} height={parentHeight}>
        <GridRows top={margin.top + 1} left={margin.left} scale={yScale} width={xWidth} stroke="black" opacity={0.38} />
        <Group top={margin.top} left={margin.left}>
          {chartData.map((d) => {
            const x = getX(d);
            const barWidth = xScale.bandwidth();
            const barHeight = yHeight - (yScale(getY(d)) ?? 0);
            const barX = xScale(x);
            const barY = yHeight - barHeight;
            return (
              <Bar
                key={`bar-${x}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="rgba(23, 233, 217, .5)"
              />
            );
          })}
          <AxisLeft
            hideTicks
            scale={yScale}
            stroke="black"
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: 11,
              textAnchor: 'end',
              dy: '0.33em',
            })}
          />
          <AxisBottom
            hideTicks
            top={yHeight}
            scale={xScale}
            stroke="black"
            tickStroke="black"
            numTicks={Object.keys(visxData).length}
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: 11,
              textAnchor: 'middle',
            })}
          />
        </Group>
      </svg>
    </div>
  );
}

export default withParentSize(Histogram);
