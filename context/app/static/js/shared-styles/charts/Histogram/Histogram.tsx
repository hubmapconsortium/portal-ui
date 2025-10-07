import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';
import { bin } from 'd3-array';

import { useVerticalChart } from 'js/shared-styles/charts/hooks';

import VerticalChartGridRowsGroup from 'js/shared-styles/charts//VerticalChartGridRowsGroup';
import ChartWrapper from '../ChartWrapper';

interface HistogramProps {
  parentWidth: number;
  parentHeight: number;
  visxData: number[];
  margin: { top: number; right: number; bottom: number; left: number };
  barColor: string;
  xAxisLabel: string;
  yAxisLabel: string;
  chartTitle?: React.ReactNode;
  binMapFunction?: (d: number) => number;
}

function Histogram({
  parentWidth,
  parentHeight,
  visxData,
  margin,
  barColor,
  xAxisLabel,
  yAxisLabel,
  chartTitle,
  binMapFunction = (d) => d,
}: HistogramProps) {
  const binFunc = bin();
  const chartData = binFunc(visxData.map(binMapFunction));

  const tickLabelSize = 11;

  const { xWidth, yHeight, updatedMargin, longestLabelSize } = useVerticalChart({
    margin,
    tickLabelSize,
    xAxisTickLabels: chartData
      .map((d) => [d.x0, d.x1])
      .flat()
      .filter((d): d is number => d !== undefined)
      .map(String),
    parentWidth,
    parentHeight,
  });

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [chartData[0].x0 ?? 0, chartData[chartData.length - 1].x1 ?? 0],
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
    <ChartWrapper chartTitle={chartTitle} margin={updatedMargin}>
      <svg width={parentWidth} height={parentHeight}>
        <VerticalChartGridRowsGroup margin={updatedMargin} yScale={yScale} xWidth={xWidth}>
          <>
            {chartData.map((d, idx) => {
              const barWidth = Math.max(0, xScale(d.x1!) - xScale(d.x0!) - 1);
              const barHeight = yScale(0) - yScale(d.length);
              const barX = xScale(d.x0!) + 1;
              const barY = yScale(d.length);
              return <Bar key={idx} x={barX} y={barY} width={barWidth} height={barHeight} fill={barColor} />;
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
    </ChartWrapper>
  );
}

export default withParentSize(Histogram);
