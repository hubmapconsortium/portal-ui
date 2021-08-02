import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';

function DonorChart(props) {
  const { title, donorQuery, xKey, yKey, colorKeys, colors } = props;
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
  /* const races = getKeyValues(buckets, 'mapped_metadata.race');
   */
  const graphdata = {
    labels,
    datasets: colorKeys.map((colorKey, i) => ({
      label: colorKey,
      data: labels.map((type) => getCount(buckets, type, colorKey)),
      backgroundColor: colors[i],
    })),
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
      <div className="header">
        <h1 className="title">{title}</h1>
      </div>
      <Bar data={graphdata} options={options} />
    </>
  );
}

export default DonorChart;
