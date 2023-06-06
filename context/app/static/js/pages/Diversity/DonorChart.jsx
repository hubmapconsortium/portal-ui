import React from 'react';
import { Bar, Chart } from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import useSearchData from 'js/hooks/useSearchData';
import { ChartPaper, ChartTitle, DescriptionPaper } from './style';
import { getKeyValues, getAgeLabels, makeCompositeQuery, makeHistogramSource, makeTermSource } from './utils';

Chart.defaults.font.size = 18;

function ucFirst(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function pretty(str) {
  return str.split('_').map(ucFirst).join(' ');
}

function DonorChart({ xAxis, groups }) {
  const xSource = xAxis === 'age' ? makeHistogramSource(xAxis) : makeTermSource(xAxis);
  const ySource = groups === 'age' ? makeHistogramSource(groups) : makeTermSource(groups);
  const donorQuery = makeCompositeQuery(xSource, ySource);
  const xKey = `mapped_metadata.${xAxis}`;
  const yKey = `mapped_metadata.${groups}`;
  const colorKeysMap = {
    race: ['White', 'Black or African American', 'Hispanic'],
    sex: ['Male', 'Female'],
    blood_type: ['A', 'B', 'AB', 'O'],
  };
  const colorKeys = colorKeysMap[groups];
  const xAxisLabel = pretty(xAxis);
  const title = `${pretty(xAxis)} & ${pretty(groups)}`;
  const description = [xAxis, groups].includes('blood_type') ? <BloodTypeDescription /> : null;

  return (
    <LowLevelDonorChart
      donorQuery={donorQuery}
      xKey={xKey}
      yKey={yKey}
      colorKeys={colorKeys}
      title={title}
      xAxisLabel={xAxisLabel}
      description={description}
    />
  );
}

function BloodTypeDescription() {
  return (
    <>
      It is critical to be aware that{' '}
      <OutboundLink href="https://www.redcrossblood.org/donate-blood/blood-types.html">
        some blood types are more common than others
      </OutboundLink>{' '}
      in a racially diverse population like the United States. The blood type of an individual can{' '}
      <OutboundLink href="https://www.pennmedicine.org/updates/blogs/health-and-wellness/2019/april/blood-types">
        predispose them to different kinds of medical conditions
      </OutboundLink>
      .
    </>
  );
}

function LowLevelDonorChart({ title, donorQuery, xKey, yKey, colorKeys, description, xAxisLabel }) {
  const { palette } = useTheme();
  const colors = [palette.primary.main, palette.success.main, palette.error.main];
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

  const { buckets } = searchData?.aggregations?.composite_data ?? { buckets: [] };
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
