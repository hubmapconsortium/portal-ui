import React, { Suspense } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CircularProgress from '@material-ui/core/CircularProgress';

import DataSummary from '../../components/Home/DataSummary';
import About from '../../components/Home/About';
import Workflow from '../../components/Home/Workflow';
import DataUseGuidelines from '../../components/Home/DataUseGuidelines';
import Associations from '../../components/Home/Associations';
import TwitterTimeline from '../../components/Home/TwitterTimeline';
import { OuterGrid, UpperInnerGrid, LowerInnerGrid, BarChartPlaceholder } from './style';

const BarChart = React.lazy(() => import('../../components/Home/BarChart'));

function checkPropReturnValue(prop, obj) {
  return prop in obj ? obj[prop] : 0;
}

function shapeSummaryResponse(data) {
  const searchDataBuckets = data.aggregations.entity_type.buckets;
  const searchData = searchDataBuckets.reduce((acc, d) => {
    acc[d.key] = d.doc_count;
    return acc;
  }, {});
  const uniqueCenters = data.aggregations.group_name.buckets.length;

  return {
    datasetCount: checkPropReturnValue('Dataset', searchData),
    sampleCount: checkPropReturnValue('Sample', searchData),
    donorCount: checkPropReturnValue('Donor', searchData),
    centerCount: uniqueCenters,
  };
}

function Home(props) {
  const { elasticsearchEndpoint } = props;
  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));
  const [summaryData, setSummaryData] = React.useState({
    datasetCount: '-',
    sampleCount: '-',
    donorCount: '-',
    centerCount: '-',
  });
  React.useEffect(() => {
    async function getAndSetSummaryData() {
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          size: 0,
          aggs: {
            entity_type: { terms: { field: 'entity_type.keyword' } },
            group_name: { terms: { field: 'group_name.keyword' } },
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
      setSummaryData(shapeSummaryResponse(data));
    }
    getAndSetSummaryData();
  }, [elasticsearchEndpoint]);

  return (
    <OuterGrid>
      <UpperInnerGrid maxWidth="lg">
        <DataSummary summaryData={summaryData} />
        {isLargerThanMd && (
          <Suspense
            fallback={
              <BarChartPlaceholder>
                <CircularProgress />
              </BarChartPlaceholder>
            }
          >
            <BarChart elasticsearchEndpoint={elasticsearchEndpoint} />
          </Suspense>
        )}
      </UpperInnerGrid>
      <About />
      <LowerInnerGrid maxWidth="lg">
        <Workflow />
        <DataUseGuidelines />
        <TwitterTimeline />
      </LowerInnerGrid>
      <Associations />
    </OuterGrid>
  );
}

export default Home;
