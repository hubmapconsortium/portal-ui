import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';

function DemographicsChartVertical(props) {
  const { title, donorQuery, xKey, yKey, colorKeys, colors } = props;
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const { searchData } = useSearchData(donorQuery, elasticsearchEndpoint, nexusToken);
  if (!('aggregations' in searchData)) {
    return null;
  }

  function getCount(buckets, key1, key2) {
    const filtered = buckets.filter((b) => b.key[xKey] === key1 && b.key[yKey] === key2);
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
    indexAxis: 'y',
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
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
export default DemographicsChartVertical;
