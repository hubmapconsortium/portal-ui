import React from 'react';
import PropTypes from 'prop-types';
import BarChartIcon from '@material-ui/icons/BarChart';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import PersonIcon from '@material-ui/icons/Person';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import DataSummaryItem from '../DataSummaryItem';
import { FlexRow } from './style';

function DataSummary(props) {
  const { summaryData } = props;
  return (
    <FlexRow>
      <DataSummaryItem Icon={BarChartIcon} label="Datasets" value={summaryData.datasetCount} />
      <DataSummaryItem Icon={BubbleChartIcon} label="Samples" value={summaryData.sampleCount} />
      <DataSummaryItem Icon={PersonIcon} label="Donors" value={summaryData.donorCount} />
      <DataSummaryItem Icon={AccountBalanceIcon} label="Centers" value={summaryData.centerCount} />
    </FlexRow>
  );
}

DataSummary.propTypes = {
  summaryData: PropTypes.exact({
    datasetCount: PropTypes.number,
    sampleCount: PropTypes.number,
    donorCount: PropTypes.number,
    centerCount: PropTypes.number,
  }).isRequired,
};

export default React.memo(DataSummary);
