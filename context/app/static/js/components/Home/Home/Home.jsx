import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DataSummary from '../DataSummary';
import About from '../About';
import Workflow from '../Workflow';
import DataUseGuidelines from '../DataUseGuidelines';
import Associations from '../Associations';
import TwitterTimeline from '../TwitterTimeline';
import BarChart from '../BarChart';
import { OuterGrid, UpperInnerGrid, LowerInnerGrid } from './style';

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
        {isLargerThanMd && <BarChart elasticsearchEndpoint={elasticsearchEndpoint} />}
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
