import React, { useContext, useMemo, useEffect, useState } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisTop, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import { useTheme } from '@material-ui/core/styles';

import { AppContext } from 'js/components/Providers';
import useSearchHits from 'js/hooks/useSearchHits';
import { formatAssayData, addSumProperty, sortBySumAscending } from './utils';

function AssayTypeBarChart({ parentWidth, parentHeight }) {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const [organTypes, setOrganTypes] = useState([]);
  const {
    palette: { success, primary, secondary, error, warning, info },
  } = useTheme();

  const colorObjects = [success, primary, secondary, error, warning, info];

  const colors = [
    ...colorObjects.map((c) => c.light),
    ...colorObjects.map((c) => c.main),
    colorObjects.map((c) => c.dark),
  ];

  useEffect(() => {
    async function getAssayTypesData() {
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          size: 0,
          aggs: {
            organ_types: { terms: { field: 'origin_sample.mapped_organ.keyword', size: 10000 } },
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error('Search API failed', response);
        return;
      }
      const data = await response.json();
      const { buckets } = data.aggregations.organ_types;
      const types = buckets.map((b) => b.key);
      setOrganTypes(types);
    }
    getAssayTypesData();
  }, [elasticsearchEndpoint]);

  const aggregationQuery = useMemo(
    () => ({
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
    }),
    [],
  );

  const { searchData } = useSearchHits(aggregationQuery, elasticsearchEndpoint, nexusToken);

  const { formattedData, maxSumDocCount } = useMemo(() => {
    if (Object.keys(searchData).length > 0) {
      const f = addSumProperty(formatAssayData(searchData));
      const m = Math.max(...f.map((d) => d.sum));
      sortBySumAscending(f);
      return { formattedData: f, maxSumDocCount: m };
    }
    return { formattedData: [], maxSumDocCount: 0 };
  }, [searchData]);

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

  const getDataType = (d) => d.mapped_data_type;

  docCountScale.rangeRound([0, xMax]);
  dataTypeScale.rangeRound([yMax, 0]);

  return (
    <div>
      <svg width={parentWidth} height={parentHeight}>
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
              fontSize: 8,
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
    </div>
  );
}

export default withParentSize(AssayTypeBarChart);
