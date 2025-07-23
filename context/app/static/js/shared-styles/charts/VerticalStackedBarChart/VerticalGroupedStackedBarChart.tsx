import React from 'react';
import { scaleBand, AnyD3Scale } from '@visx/scale';
import { AxisBottom, AxisLeft, AxisScale } from '@visx/axis';
import { Group } from '@visx/group';
import { BarGroup, BarStack } from '@visx/shape';
import { withParentSize, WithParentSizeProvidedProps } from '@visx/responsive';
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
 * In this case, StackKey is 'a' | 'b' | 'c'.
 */
export type BarStackValues<StackKey extends string> = Record<StackKey, number>;

/**
 * @example const ex: BarStackGroup<'matched' | 'unmatched'> = {group: 'Group 1', stacks: {a: {matched: 0, unmatched: 0}, b: {matched: 10, unmatched: 20}, c: {matched: 30, unmatched: 40}}}
 * In this case, StackKey is 'matched' | 'unmatched', comparebykey is 'a' | 'b' | 'c', and GroupKey is 'Group 1'.
 */
export interface BarStackGroup<
  StackKey extends string = string,
  CompareByKey extends string = string,
  GroupKey extends string = string,
> {
  group: GroupKey;
  stacks: Record<CompareByKey, BarStackValues<StackKey>>;
}

/**
 * @example {a: 10, b: 20, c: 30, group: 'Group 1'}
 */
export type BarStackData<StackKey extends string> = BarStackValues<StackKey> & {
  group: string;
};

/**
 * @example const example = {'Male': {matched: 20, unmatched: 30}, 'Female': {matched: 30, unmatched: 0}, group: 'Group 1'};
 * @description In this case, `StackKey` is 'matched' | 'unmatched', `StackMemberKey` is 'Male' | 'Female', and `XAxisKey` is 'Group 1'
 */
type StackBarFootprint<
  StackKey extends string = string,
  CompareByKey extends string = string,
  XAxisKey extends string = string,
> = Record<CompareByKey, Record<StackKey, number>> & {
  group: XAxisKey;
};

/**
 * Get the total value of a stack for a given datum.
 * @param datum - The datum to get the stack total for.
 * @returns The total value of the stack.
 */
export const getStackTotal = <StackKey extends string>(datum: Partial<BarStackValues<StackKey>>) => {
  const pointValues: Record<string, number | undefined> = datum;
  const dataKeys = Object.keys(pointValues);

  return dataKeys
    .map((key) => {
      return pointValues[key] ?? 0;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

/**
 * Generates the footprint for each group of stacked bars.
 * @param x1Scale - The scale for the x-axis within each group.
 * @param data - The data for the stacked bars.
 * @param color - A function to get the color for each stack, not used in the output and only included for compatibility.
 */
interface BarGroupFootprint<StackKey extends string = string, CompareByKey extends string = string> {
  x1Scale: ScaleBand<CompareByKey>;
  data: StackBarFootprint<StackKey, CompareByKey>[];
  color: (key: string) => string;
}

const color = () => 'grey'; // Default color, not used in this context

// Footprint represents the horizontal grouping, but doesn't represent the nature of the stacks within a group
export const useBarGroupFootprint = <StackKey extends string, CompareByKey extends string, XAxisKey extends string>(
  data: BarStackGroup<StackKey, CompareByKey, XAxisKey>[],
  xScaleBandwidth: number,
  stackKeys: StackKey[],
  compareByKeys: CompareByKey[],
) => {
  const footprint: BarGroupFootprint<StackKey, CompareByKey> = React.useMemo(() => {
    const x1Scale = scaleBand<CompareByKey>({
      domain: compareByKeys,
      range: [0, xScaleBandwidth],
      padding: 0.1,
    });

    // If data is empty, return an empty footprint
    if (!data || data.length === 0) {
      return {
        x1Scale,
        color,
        data: [],
      };
    }

    return {
      // Create a scale for the x1 axis based on the stack keys
      x1Scale,
      // placeholder for Typescript compatibility
      color,
      // Rearrange the data to match the expected format by flattening the `stacks` property to be part of the same object as the `group`
      data: data.map((group) => {
        const tempResult: unknown = {
          group: group.group,
        };
        const result: StackBarFootprint = tempResult as StackBarFootprint;

        const emptyMember = Object.fromEntries(stackKeys.map((key) => [key, 0])) as BarStackValues<StackKey>;

        compareByKeys.forEach((key) => {
          // If group.stacks[key] is undefined, set to emptyMember
          result[key] = group.stacks[key] ?? emptyMember;
        });

        return result;
      }),
    };
  }, [data, stackKeys, compareByKeys, xScaleBandwidth]);

  return footprint;
};

interface GroupedBarStackProps<StackKey extends string, CompareByKey extends string, XAxisKey extends string> {
  yScale: AnyD3Scale;
  xScale: ScaleBand<string>;
  yMax: number;
  data: BarStackGroup<StackKey, CompareByKey, XAxisKey>[];
  stackKeys: StackKey[];
  compareByKeys: CompareByKey[];
  barColorScale: ScaleOrdinal<string, string, never>;
  getX: (d: StackBarFootprint) => string;
  handleMouseEnter: (
    bar: TooltipData<BarStackValues<StackKey> & { group: string }>,
  ) => (event: React.MouseEvent<SVGRectElement>) => void;
  handleMouseLeave: () => void;
  xAxisTickLabels: string[];
}

export function GroupedBarStacks<StackKey extends string, CompareByKey extends string, XAxisKey extends string>({
  data,
  xScale,
  yScale,
  stackKeys,
  barColorScale,
  yMax,
  getX,
  handleMouseEnter,
  handleMouseLeave,
  compareByKeys,
  xAxisTickLabels,
}: GroupedBarStackProps<StackKey, CompareByKey, XAxisKey>) {
  const xScaleBandwidth = xScale.bandwidth();

  const barGroupFootprint = useBarGroupFootprint<StackKey, CompareByKey, XAxisKey>(
    data,
    xScaleBandwidth,
    stackKeys,
    compareByKeys,
  );

  return (
    <BarGroup<StackBarFootprint, string>
      x0={getX}
      x0Scale={xScale}
      yScale={yScale}
      keys={compareByKeys}
      height={yMax}
      {...barGroupFootprint}
    >
      {(barGroups) => {
        // Every bar group contains a column for each of the stackGroupKeys
        // e.g. if compareBy is sex, there are columns for "Male" and "Female".
        return barGroups.map((barGroup) => {
          const barGroupKey = `bar-group-${barGroup.index}`;
          const actualBarGroup = xAxisTickLabels[barGroup.index];

          return (
            <Group left={barGroup.x0} key={barGroupKey}>
              {barGroup.bars.map((bar) => {
                const barStackKey = bar.key as CompareByKey;
                const barKeys = Object.keys(bar.value);
                // If the bar value is not an object, we cannot proceed
                if (typeof bar.value !== 'object' || !barKeys.length) {
                  console.warn(`Bar value is not an object or has no keys:`, bar);
                  return null;
                }
                const barValue = bar.value as unknown as BarStackValues<StackKey>;

                const barStackRenderKey = `bar-stack-${barGroup.index}-${barStackKey}`;

                return (
                  <BarStack
                    key={barStackRenderKey}
                    data={[barValue]}
                    direction="vertical"
                    xScale={barGroupFootprint.x1Scale}
                    yScale={yScale}
                    color={barColorScale}
                    x={() => barStackKey}
                    height={yMax}
                    keys={stackKeys}
                  >
                    {(barStacks) =>
                      barStacks.map((barStack) => {
                        return barStack.bars.map((d) => {
                          const key = `${bar.key} ${d.key}`;
                          return (
                            <StackedBar
                              key={`${barStackRenderKey}-${d.index}`}
                              bar={{
                                ...d,
                                color: barColorScale(key),
                              }}
                              colorScale={barColorScale}
                              direction="vertical"
                              aria-label={`Stacked bar for ${key}`}
                              hoverProps={{
                                onMouseEnter: handleMouseEnter({
                                  bar: {
                                    data: {
                                      ...barValue,
                                      group: actualBarGroup as XAxisKey,
                                    },
                                  },
                                  key,
                                }),
                                onMouseLeave: handleMouseLeave,
                              }}
                            />
                          );
                        });
                      })
                    }
                  </BarStack>
                );
              })}
            </Group>
          );
        });
      }}
    </BarGroup>
  );
}

interface GroupedBarStackChartProps<
  StackKey extends string,
  CompareByKey extends string,
  XAxisKey extends string,
  XAxisScale extends AnyScaleBand,
  YAxisScale extends AnyD3Scale,
> extends WithParentSizeProvidedProps {
  data: BarStackGroup<StackKey, CompareByKey, XAxisKey>[];
  xScale: XAxisScale;
  getXScaleRange?: (max: number) => [number, number];
  yScale: YAxisScale;
  getYScaleRange?: (max: number) => [number, number];
  colorScale: OrdinalScale;
  getX: (d: StackBarFootprint) => XAxisKey;
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  TooltipContent?: React.ComponentType<{ tooltipData: TooltipData<BarStackValues<StackKey> & { group: string }> }>;
  xAxisTickLabels: XAxisKey[];
  getTickValues?: (yScale: YAxisScale) => number[];
  compareByKeys: CompareByKey[];
  stackKeys: StackKey[];
  yTickFormat?: (value: number) => string;
}

function GroupedBarStackChart<
  StackKey extends string,
  CompareByKey extends string,
  XAxisKey extends string,
  XAxisScale extends AnyScaleBand = AnyScaleBand,
  YAxisScale extends AnyD3Scale = AnyD3Scale,
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
  xAxisLabel = '',
  yAxisLabel = '',
  TooltipContent,
  getTickValues,
  data,
  compareByKeys,
  stackKeys,
  yTickFormat,
}: GroupedBarStackChartProps<StackKey, CompareByKey, XAxisKey, XAxisScale, YAxisScale>) {
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
  } = useChartTooltip<TooltipData<BarStackValues<StackKey> & { group: string }>>();

  yScale.range(getYScaleRange(yHeight));
  xScale.range(getXScaleRange(xWidth));

  return (
    <svg width={parentWidth} height={parentHeight} ref={containerRef}>
      <AxisLeft<AxisScale<number>>
        scale={yScale}
        top={updatedMargin.top}
        left={updatedMargin.left}
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
        tickFormat={yTickFormat}
      />
      <VerticalChartGridRowsGroup margin={updatedMargin} yScale={yScale} xWidth={xWidth}>
        <GroupedBarStacks<StackKey, CompareByKey, XAxisKey>
          data={data}
          xScale={xScale}
          yScale={yScale}
          barColorScale={colorScale}
          yMax={yHeight}
          getX={getX}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          compareByKeys={compareByKeys}
          stackKeys={stackKeys}
          xAxisTickLabels={xAxisTickLabels}
        />
      </VerticalChartGridRowsGroup>
      <AxisBottom
        top={parentHeight - updatedMargin.bottom}
        left={updatedMargin.left}
        scale={xScale}
        label={xAxisLabel}
        hideTicks
        rangePadding={updatedMargin.left - updatedMargin.left}
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

export default withParentSize(GroupedBarStackChart) as typeof GroupedBarStackChart;
