import React, { useContext } from 'react';
import { Bar, Chart } from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';

import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';
import { ChartPaper, ChartTitle, DescriptionPaper } from './style';

Chart.defaults.font.size = 18;

function DonorChart(props) {
  const { title, donorQuery, xKey, yKey, colorKeys, colors, description, xAxisLabel, yAxisLabel } = props;
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const { searchData } = useSearchData(donorQuery, elasticsearchEndpoint, nexusToken);
  if (!('aggregations' in searchData)) {
    return null;
  }

  function getCount(buckets, key1, key2) {
    const filtered = buckets.filter((b) => b.key[xKey] === key1 && b.key[yKey] === key2);
    if (filtered.length > 1) {
      console.warn(`Expected at most one match for ${key1} and ${key2}: Got ${filtered.length}.`);
    }
    return filtered.length ? filtered[0].doc_count : 0;
  }
  function getKeyValues(buckets, key) {
    return [...new Set(buckets.map((b) => b.key[key]))];
  }
  const { buckets } = searchData?.aggregations.composite_data;
  const labels = getKeyValues(buckets, xKey);
  const graphdata = {
    labels,
    datasets: colorKeys.map((colorKey, i) => ({
      label: colorKey,
      data: labels.map((type) => getCount(buckets, type, colorKey)),
      backgroundColor: colors[i],
      barThickness: 40,
    })),
  };

  const options = {
    scales: {
      yAxes: {
        title: {
          text: yAxisLabel,
          display: true,
        },
        ticks: {
          beginAtZero: true,
        },
      },
      xAxes: {
        title: {
          text: xAxisLabel,
          display: true,
        },
      },
    },
  };

  return (
    <>
      <ChartTitle variant="h4" component="h2">
        {title}
      </ChartTitle>
      <DescriptionPaper>
        <Typography>{description}</Typography>
      </DescriptionPaper>
      <ChartPaper>
        <Bar data={graphdata} options={options} />
      </ChartPaper>
    </>
  );
}

export default DonorChart;
