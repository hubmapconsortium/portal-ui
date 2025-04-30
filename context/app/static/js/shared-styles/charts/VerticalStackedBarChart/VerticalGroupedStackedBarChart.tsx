import React from 'react';
import { scaleBand, AnyD3Scale } from '@visx/scale';
import { AxisBottom, AxisLeft, AxisScale } from '@visx/axis';
import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { WithParentSizeProvidedProps } from '@visx/responsive';
import { ScaleBand, ScaleOrdinal } from 'd3';
import { AnyScaleBand } from '@visx/shape/lib/types';
import Typography from '@mui/material/Typography';
import { OrdinalScale, useChartTooltip, useVerticalChart } from '../hooks';
import { TICK_LABEL_SIZE } from '../constants';
import { defaultXScaleRange, defaultYScaleRange, trimStringWithMiddleEllipsis } from '../utils';
import { TooltipData, tooltipHasBarData } from '../types';
import VerticalChartGridRowsGroup from '../VerticalChartGridRowsGroup';
import StackedBar from '../StackedBar';

/**
 * @example const ex: BarStackValues<'a' |'b'| 'c'> = {a: 10, b: 20, c: 30}
 */
export type BarStackValues<T extends string> = Record<T, number> & {
  group?: string;
};

/**
 * @example const ex: BarStackGroup<'a' |'b'| 'c'> = {group: 'Group 1', stacks: [{a: 10, b: 20, c: 30}, {a: 15, b: 25, c: 35}]}
 */
export interface BarStackGroup<T extends string> {
  group: string;
  stacks: Partial<BarStackValues<T>>[];
}

/**
 * @example {a: 10, b: 20, c: 30, group: 'Group 1'}
 */
export type BarStackData<T extends string> = BarStackValues<T> & {
  group: string;
};

/**
 * @example {0: 20, 1: 30, 2: 30, group: 'Group 1'}
 */
type StackBarFootprint = Record<number, number> & {
  group: string;
};

export const getStackTotal = <T extends string>(datum: Partial<BarStackValues<T>>) => {
  const pointValues: Record<string, number | undefined> = datum;
  const dataKeys = Object.keys(pointValues);

  return dataKeys
    .map((key) => {
      return pointValues[key] ?? 0;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

// Footprint represents the horizontal grouping, but doesn't represent the nature of the stacks within a group
export const useBarGroupFootprint = <T extends string>(data: BarStackGroup<T>[], xScaleBandwidth: number) => {
  return React.useMemo(() => {
    if (!data || data.length === 0) {
      return {
        keys: [],
        x1Scale: scaleBand<string>({
          domain: [],
          range: [0, xScaleBandwidth],
          padding: 0.1,
        }),
        data: [],
      };
    }

    const keys = data.flatMap((d) => d.stacks.map((g) => `${d.group} ${g.group}`));

    console.log('keys', keys);

    return {
      keys,
      x1Scale: scaleBand<string>({
        domain: keys,
        range: [0, xScaleBandwidth],
        padding: 0.1,
      }),
      // Color won't be used, this is just to not cause typescript to complain when representing <BarGroup/> props
      color: () => 'grey',
      data: data.map((group) => {
        const result: StackBarFootprint = {
          group: `${group.group}`,
        };

        group.stacks.forEach((stack, index) => {
          result[index] = getStackTotal(stack);
        });

        return result;
      }),
    };
  }, [data, xScaleBandwidth]);
};

interface GroupedBarStackProps<Datum, DataKey extends Extract<keyof Datum, string>> {
  yScale: AnyD3Scale;
  xScale: ScaleBand<DataKey>;
  yMax: number;
  data: BarStackGroup<DataKey>[];
  keys: string[];
  barColorScale: ScaleOrdinal<string, string, never>;
  getX: (d: StackBarFootprint) => string;
  getAriaLabel?: (d: TooltipData<Datum>) => string;
  handleMouseEnter: (bar: TooltipData<Datum>) => (event: React.MouseEvent<SVGRectElement>) => void;
  handleMouseLeave: () => void;
}

export function GroupedBarStacks<Datum, DataKey extends Extract<keyof Datum, string>>({
  data,
  xScale,
  yScale,
  keys,
  barColorScale,
  yMax,
  getX,
  getAriaLabel,
  handleMouseEnter,
  handleMouseLeave,
}: GroupedBarStackProps<Datum, DataKey>) {
  const xScaleBandwidth = xScale.bandwidth();

  const barGroupFootprint = useBarGroupFootprint(data, xScaleBandwidth);

  return (
    <BarGroup<StackBarFootprint, string>
      x0={getX}
      x0Scale={xScale}
      yScale={yScale}
      keys={barGroupFootprint.keys}
      data={barGroupFootprint.data}
      color={barColorScale}
      height={yMax}
      x1Scale={barGroupFootprint.x1Scale}
    >
      {(barGroups) =>
        barGroups.map((barGroup, axisIndex) => {
          // const finalBar = barGroup.bars[barGroup.bars.length - 1];
          // const firstBar = barGroup.bars[0];

          // If needed for other calculations, this is the width of the group:
          // const groupWidth = finalBar.x + finalBar.width - firstBar.x;

          return (
            <Group left={barGroup.x0} key={`bar-group-${barGroup.index}-${barGroup.x0}`}>
              {barGroup.bars.map((bar, stackIndex) => {
                const dateItem = data[axisIndex];
                const stackItem = dateItem.stacks[stackIndex];
                const stacksShown = keys
                  .filter((key) => {
                    if (!stackItem || !(key in stackItem)) {
                      return false;
                    }
                    const safeKey = key as keyof typeof stackItem;
                    return stackItem[safeKey] !== undefined && stackItem[safeKey] !== 0;
                  })
                  .map((key) => ({ value: stackItem[key as keyof typeof stackItem]! ?? 0, key }));

                return stacksShown.map(({ key, value }, i) => {
                  const priorValues: number =
                    stacksShown.filter((_, j) => j < i).reduce((prev, curr) => curr.value + prev, 0) || 0;
                  const barY = yScale(priorValues) as number;
                  const barHeight = yMax - yScale(value);

                  if (!value) {
                    return null; // Skip rendering if the value is 0 or undefined
                  }

                  return (
                    <StackedBar
                      bar={bar}
                      direction="vertical"
                      key={`bar-group-bar-${key}`}
                      x={bar.x}
                      y={barY - barHeight}
                      height={barHeight}
                      width={bar.width}
                      fill={barColorScale(`${bar?.key} ${key}`)}
                      ariaLabelText={getAriaLabel?.(bar)}
                      hoverProps={{
                        onMouseEnter: handleMouseEnter(bar),
                        onMouseLeave: handleMouseLeave,
                      }}
                    />
                  );
                });
              })}
            </Group>
          );
        })
      }
    </BarGroup>
  );
}

interface GroupedBarStackChartProps<
  DataKey extends string,
  Datum extends Record<DataKey, number>,
  XAxisKey extends string,
  YAxisKey extends string,
  XAxisScale extends AnyScaleBand,
  YAxisScale extends AnyD3Scale,
> extends WithParentSizeProvidedProps {
  data: BarStackGroup<DataKey>[];
  xScale: XAxisScale;
  getXScaleRange?: (max: number) => [number, number];
  yScale: YAxisScale;
  getYScaleRange?: (max: number) => [number, number];
  colorScale: OrdinalScale;
  getX: (d: StackBarFootprint) => XAxisKey;
  keys: YAxisKey[];
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  xAxisLabel: string;
  yAxisLabel: string;
  TooltipContent?: React.ComponentType<{ tooltipData: TooltipData<Datum> }>;
  xAxisTickLabels: XAxisKey[];
  getTickValues?: (yScale: YAxisScale) => number[];
  getAriaLabel?: (d: TooltipData<Datum>) => string;
}

export function GroupedBarStackChart<
  DataKey extends string,
  Datum extends Record<string, number>,
  XAxisKey extends string,
  YAxisKey extends string,
  XAxisScale extends AnyScaleBand,
  YAxisScale extends AnyD3Scale,
>({
  parentWidth = 500,
  parentHeight = 500,
  margin,
  xAxisTickLabels,
  xScale,
  yScale,
  getXScaleRange = defaultXScaleRange,
  getYScaleRange = defaultYScaleRange,
  colorScale,
  getX,
  keys,
  xAxisLabel = '',
  yAxisLabel = '',
  TooltipContent,
  getTickValues,
  getAriaLabel,
  data,
}: GroupedBarStackChartProps<
  DataKey extends keyof Datum ? DataKey : never,
  Datum,
  XAxisKey,
  YAxisKey,
  XAxisScale,
  YAxisScale
>) {
  const { xWidth, yHeight, updatedMargin, longestLabelSize } = useVerticalChart({
    margin,
    tickLabelSize: TICK_LABEL_SIZE,
    xAxisTickLabels: xAxisTickLabels.map((label) => trimStringWithMiddleEllipsis(label)),
    parentWidth,
    parentHeight,
  });

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

  // const xMax = xWidth - margin.left - margin.right;
  const gridXMax = xWidth - margin.left - margin.right;
  const yMax = yHeight - margin.top - margin.bottom;

  yScale.range(getYScaleRange(yHeight));
  xScale.range(getXScaleRange(xWidth));

  return (
    <svg width={parentWidth} height={parentHeight} ref={containerRef}>
      <AxisLeft<AxisScale<number>>
        scale={yScale}
        top={margin.top}
        left={margin.left}
        numTicks={6}
        hideTicks
        hideAxisLine
        label={yAxisLabel}
        tickValues={getTickValues?.(yScale)}
        tickLabelProps={() => ({
          fill: 'black',
          fontSize: 11,
          textAnchor: 'end',
          dy: '0.33em',
        })}
        labelProps={{
          fontSize: 14,
          color: 'black',
          fontWeight: 500,
          fontFamily: 'Inter Variable',
        }}
      />
      <VerticalChartGridRowsGroup margin={updatedMargin} yScale={yScale} xWidth={gridXMax} />
      <GroupedBarStacks
        keys={keys}
        data={data}
        xScale={xScale}
        yScale={yScale}
        barColorScale={colorScale}
        yMax={yMax}
        getX={getX}
        getAriaLabel={getAriaLabel}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
      <AxisBottom
        top={yMax + margin.top}
        left={margin.left}
        scale={xScale}
        label={xAxisLabel}
        hideTicks
        rangePadding={margin.left - margin.left}
        labelOffset={longestLabelSize}
      />
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
    </svg>
  );
}
