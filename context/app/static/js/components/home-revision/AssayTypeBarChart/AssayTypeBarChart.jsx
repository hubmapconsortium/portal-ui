import React, { useContext, useMemo } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisTop, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import Typography from '@material-ui/core/Typography';

import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';
import { formatAssayData, addSumProperty, sortBySumAscending } from './utils';
import { useChartPalette } from './hooks';

const organTypesQuery = {
  size: 0,
  aggs: {
    organ_types: { terms: { field: 'origin_sample.mapped_organ.keyword', size: 10000 } },
  },
};

const assayTypesQuery = {
  size: 0,
  aggs: {
    mapped_data_types: {
      composite: {
        sources: [
          {
            mapped_data_type: {
              terms: {
                field: 'mapped_data_types.keyword',
              },
            },
          },
          {
            organ_type: {
              terms: {
                field: 'origin_sample.mapped_organ.keyword',
              },
            },
          },
        ],
        size: 10000,
      },
    },
  },
};

const getDataType = (d) => d.mapped_data_type;

function AssayTypeBarChart({ parentWidth, parentHeight }) {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const colors = useChartPalette();

  const { searchData: organTypesData } = useSearchData(organTypesQuery, elasticsearchEndpoint, nexusToken);

  const buckets = organTypesData?.aggregations?.organ_types?.buckets || [];
  const organTypes = buckets.map((b) => b.key);

  const { searchData: assayTypesData } = useSearchData(assayTypesQuery, elasticsearchEndpoint, nexusToken);

  const { formattedData, maxSumDocCount } = useMemo(() => {
    if (Object.keys(assayTypesData).length > 0) {
      const f = addSumProperty(formatAssayData(assayTypesData));
      sortBySumAscending(f);
      const m = Math.max(...f.map((d) => d.sum));
      return { formattedData: f, maxSumDocCount: m };
    }
    return { formattedData: [], maxSumDocCount: 0 };
  }, [assayTypesData]);

  const docCountScale = scaleLinear({
    domain: [0, maxSumDocCount],
    nice: true,
  });

  const colorScale = scaleOrdinal({
    domain: organTypes,
    range: colors,
  });

  const dataTypeScale = scaleBand({
    domain: formattedData.map((b) => b.mapped_data_type),
    padding: 0.2,
  });

  const margin = { top: 40, right: 50, bottom: 100, left: 300 };
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

  const handleMouse = (event, bar) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: bar,
    });
  };

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
                        width={bar.width}
                        height={bar.height}
                        fill={bar.color}
                        onMouseEnter={(event) => handleMouse(event, bar, barStack.index)}
                        onMouseLeave={hideTooltip}
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
          <Typography variant="subtitle2">{tooltipData.bar.data.mapped_data_type}</Typography>
          <Typography>{tooltipData.key}</Typography>
          <Typography variant="h3" component="p">
            {tooltipData.bar.data[tooltipData.key]}
          </Typography>
        </TooltipInPortal>
      )}
    </div>
  );
}

export default withParentSize(AssayTypeBarChart);
