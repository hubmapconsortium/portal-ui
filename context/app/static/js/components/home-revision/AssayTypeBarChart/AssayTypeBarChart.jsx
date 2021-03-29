/* eslint-disable no-param-reassign */
import React, { useContext, useMemo, useEffect, useState } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';

import produce from 'immer';

import { AppContext } from 'js/components/Providers';
import useSearchHits from 'js/hooks/useSearchHits';

function AssayTypeBarChart() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const [organTypes, setOrganTypes] = useState([]);

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

  const formattedData = useMemo(() => {
    let a = {};
    let z = [];
    if (Object.keys(searchData).length > 0) {
      a = searchData.aggregations.mapped_data_types.buckets.reduce((acc, o) => {
        return produce(acc, (draft) => {
          const k = o.key.mapped_data_type.replace(/ /g, '_');
          if (!(k in draft)) {
            draft[k] = {};
          }
          draft[k].mapped_data_type = o.key.mapped_data_type;
          draft[k][o.key.organ_type] = o.doc_count;
        });
      }, {});

      z = Object.values(a).map((o) => {
        return Object.entries(o).reduce((acc, [k, v]) => {
          if (k !== 'mapped_data_type') {
            return acc + v;
          }
          return acc;
        }, 0);
      });
    }

    return [Object.values(a), z];
  }, [searchData]);

  const docCountScale = scaleLinear({
    domain: [0, Math.max(...formattedData[1])],
    nice: true,
  });
  const colorScale = scaleOrdinal({
    domain: organTypes,
    range: [
      '#1f77b4',
      '#ff7f0e',
      '#2ca02c',
      '#d62728',
      '#9467bd',
      '#8c564b',
      '#e377c2',
      '#7f7f7f',
      '#bcbd22',
      '#17becf',
    ],
  });

  const dataTypeScale = scaleBand({
    domain: formattedData[0].map((b) => b.mapped_data_type),
    padding: 0.2,
  });

  // eslint-disable-next-line no-console
  console.log(formattedData);

  const width = 1200;
  const height = 800;

  const margin = { top: 40, right: 50, bottom: 100, left: 300 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const purple3 = '#a44afe';
  const background = '#eaedff';

  const getDataType = (d) => d.mapped_data_type;

  docCountScale.rangeRound([0, xMax]);
  dataTypeScale.rangeRound([yMax, 0]);

  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill={background} />
        <Group top={margin.top} left={margin.left}>
          <BarStackHorizontal
            data={formattedData[0]}
            keys={organTypes}
            height={yMax}
            y={getDataType}
            xScale={docCountScale}
            yScale={dataTypeScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                  />
                )),
              )
            }
          </BarStackHorizontal>
          <AxisLeft
            hideTicks
            scale={dataTypeScale}
            stroke={purple3}
            numTicks={33}
            tickLabelProps={() => ({
              fill: purple3,
              fontSize: 8,
              textAnchor: 'end',
              dy: '0.33em',
            })}
          />
          <AxisBottom
            top={yMax}
            scale={docCountScale}
            stroke={purple3}
            tickStroke={purple3}
            tickLabelProps={() => ({
              fill: purple3,
              fontSize: 11,
              textAnchor: 'middle',
            })}
          />
        </Group>
      </svg>
    </div>
  );
}

export default AssayTypeBarChart;
