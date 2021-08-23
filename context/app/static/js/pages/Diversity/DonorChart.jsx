import React from 'react';
import { Bar, Chart } from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';

import useSearchData from 'js/hooks/useSearchData';
import { ChartPaper, ChartTitle, DescriptionPaper } from './style';
import { getKeyValues, getAgeLabels } from './utils';

Chart.defaults.font.size = 18;

function DonorChart(props) {
  const { title, donorQuery, xKey, yKey, colorKeys, description, xAxisLabel } = props;
  const colors = ['#444A65', '#6C8938', '#DA348A'];
  const { searchData } = useSearchData(donorQuery);
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

  const { buckets } = searchData?.aggregations.composite_data;
  const labels = xKey === 'mapped_metadata.age' ? getAgeLabels(buckets, xKey) : getKeyValues(buckets, xKey);
  const graphdata = {
    labels,
    datasets: colorKeys.map((colorKey, i) => ({
      label: colorKey,
      data: getKeyValues(buckets, xKey).map((type) => getCount(buckets, type, colorKey)),
      backgroundColor: colors[i],
      barThickness: 40,
    })),
  };

  const options = {
    scales: {
      yAxes: {
        title: {
          text: '# of Donors',
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
      {description && (
        <DescriptionPaper>
          <Typography>{description}</Typography>
        </DescriptionPaper>
      )}
      <ChartPaper>
        <Bar data={graphdata} options={options} />
      </ChartPaper>
    </>
  );
}

export default DonorChart;
