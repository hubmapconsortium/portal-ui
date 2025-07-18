import React from 'react';
import { scaleBand, AnyD3Scale } from '@visx/scale';
import { AxisBottom, AxisLeft, AxisScale } from '@visx/axis';
import { Group } from '@visx/group';
import { BarGroup, BarStack } from '@visx/shape';
import { withParentSize, WithParentSizeProvidedProps } from '@visx/responsive';
import { ScaleBand, ScaleOrdinal } from 'd3';
import { AnyScaleBand } from '@visx/shape/lib/types';
import Typography from '@mui/material/Typography';
import { capitalize } from '@mui/material/utils';
import { OrdinalScale, useChartTooltip, useVerticalChart } from '../hooks';
import { TICK_LABEL_SIZE } from '../constants';
import { defaultXScaleRange, defaultYScaleRange, trimStringWithMiddleEllipsis } from '../utils';
import { TooltipData, tooltipHasBarData } from '../types';
import VerticalChartGridRowsGroup from '../VerticalChartGridRowsGroup';
import StackedBar from '../StackedBar';

/**
 * @example const ex: BarStackValues<'a' |'b'| 'c'> = {a: 10, b: 20, c: 30}
 */
export type BarStackValues<T extends string> = Record<T, number>;

/**
 * @example const ex: BarStackGroup<'matched' | 'unmatched'> = {group: 'Group 1', stacks: {a: {matched: 0, unmatched: 0}, b: {matched: 10, unmatched: 20}, c: {matched: 30, unmatched: 40}}}
 */
export interface BarStackGroup<StackKey extends string, GroupKey extends string = string> {
  group: GroupKey;
  stacks: Record<string, BarStackValues<StackKey>>;
}

/**
 * @example {a: 10, b: 20, c: 30, group: 'Group 1'}
 */
export type BarStackData<T extends string> = BarStackValues<T> & {
  group: string;
};

/**
 * @example {'Male': {matched: 20, unmatched: 30}, 'Female': {matched: 30, unmatched: 0}, group: 'Group 1'}
 */
type StackBarFootprint = Record<string, Record<string, number>> & {
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

interface BarGroupFootprint {
  x1Scale: ScaleBand<string>;
  data: StackBarFootprint[];
  color: (key: string) => string;
}

const color = () => 'grey'; // Default color, not used in this context

// Footprint represents the horizontal grouping, but doesn't represent the nature of the stacks within a group
export const useBarGroupFootprint = <T extends string>(
  data: BarStackGroup<T>[],
  xScaleBandwidth: number,
  stackKeys: string[],
) => {
  const footprint: BarGroupFootprint = React.useMemo(() => {
    if (!data || data.length === 0) {
      return {
        x1Scale: scaleBand<string>({
          domain: stackKeys,
          range: [0, xScaleBandwidth],
          padding: 0.1,
        }),
        color,
        data: [],
      };
    }

    return {
      x1Scale: scaleBand<string>({
        domain: stackKeys,
        range: [0, xScaleBandwidth],
        padding: 0.1,
      }),
      color,
      data: data.map((group) => {
        const tempResult: unknown = {
          group: group.group,
        };
        const result: StackBarFootprint = tempResult as StackBarFootprint;

        stackKeys.forEach((key) => {
          // If group.stacks[key] is undefined, set to 0
          result[key] = group.stacks[key] ?? 0;
        });

        return result;
      }),
    };
  }, [data, stackKeys, xScaleBandwidth]);

  return footprint;
};

interface GroupedBarStackProps<Datum> {
  yScale: AnyD3Scale;
  xScale: ScaleBand<string>;
  yMax: number;
  data: BarStackGroup<string>[];
  stackMemberKeys: string[];
  stackGroupKeys: string[];
  barColorScale: ScaleOrdinal<string, string, never>;
  getX: (d: StackBarFootprint) => string;
  handleMouseEnter: (bar: TooltipData<Datum>) => (event: React.MouseEvent<SVGRectElement>) => void;
  handleMouseLeave: () => void;
}

export function GroupedBarStacks<Datum>({
  data,
  xScale,
  yScale,
  stackMemberKeys,
  barColorScale,
  yMax,
  getX,
  handleMouseEnter,
  handleMouseLeave,
  stackGroupKeys,
}: GroupedBarStackProps<Datum>) {
  const xScaleBandwidth = xScale.bandwidth();

  const barGroupFootprint = useBarGroupFootprint(data, xScaleBandwidth, stackGroupKeys);

  return (
    <BarGroup<StackBarFootprint, string>
      x0={getX}
      x0Scale={xScale}
      yScale={yScale}
      keys={stackGroupKeys}
      height={yMax}
      {...barGroupFootprint}
    >
      {(barGroups) => {
        // Every bar group contains a column for each of the stackGroupKeys
        // e.g. if compareBy is sex, there are columns for "Male" and "Female".
        return barGroups.map((barGroup) => {
          // If needed for other calculations, this is the width of the group:
          // const finalBar = barGroup.bars[barGroup.bars.length - 1];
          // const firstBar = barGroup.bars[0];
          // const groupWidth = finalBar.x + finalBar.width - firstBar.x;
          const barGroupKey = `bar-group-${barGroup.index}`;
          return (
            <Group left={barGroup.x0} key={barGroupKey}>
              {barGroup.bars.map((bar) => {
                const barStackKey = bar.key;
                const barKeys = Object.keys(bar.value);
                // If the bar value is not an object, we cannot proceed
                if (typeof bar.value !== 'object' || !barKeys.length) {
                  console.warn(`Bar value is not an object or has no keys:`, bar);
                  return null;
                }
                const barValue = bar.value as unknown as Record<string, number>;

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
                    value={(d, key) => d[key]}
                    height={yMax}
                    keys={stackMemberKeys}
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
                                    // @ts-expect-error Ignore this for now, should be revisited.
                                    data: {
                                      [key]: Object.entries(barValue)
                                        .map(([k, v]) => `${capitalize(k)}: ${v}`)
                                        .join(', '),
                                    },
                                    key,
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
  DataKey extends string,
  Datum extends Record<DataKey, number>,
  XAxisKey extends string,
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
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  xAxisLabel: string;
  yAxisLabel: string;
  TooltipContent?: React.ComponentType<{ tooltipData: TooltipData<Datum> }>;
  xAxisTickLabels: XAxisKey[];
  getTickValues?: (yScale: YAxisScale) => number[];
  compareByKeys: string[];
  stackMemberKeys: string[];
  yTickFormat?: (value: number) => string;
}

function GroupedBarStackChart<
  DataKey extends string,
  Datum extends Record<string, number>,
  XAxisKey extends string,
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
  xAxisLabel = '',
  yAxisLabel = '',
  TooltipContent,
  getTickValues,
  data,
  compareByKeys,
  stackMemberKeys,
  yTickFormat,
}: GroupedBarStackChartProps<DataKey extends keyof Datum ? DataKey : never, Datum, XAxisKey, XAxisScale, YAxisScale>) {
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
        <GroupedBarStacks
          data={data}
          xScale={xScale}
          yScale={yScale}
          barColorScale={colorScale}
          yMax={yHeight}
          getX={getX}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          stackGroupKeys={compareByKeys}
          stackMemberKeys={stackMemberKeys}
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

export default withParentSize(GroupedBarStackChart);
