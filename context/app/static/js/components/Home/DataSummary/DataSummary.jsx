import React from 'react';
import PropTypes from 'prop-types';
import BarChartIcon from '@material-ui/icons/BarChart';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import PersonIcon from '@material-ui/icons/Person';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import DataSummaryItem from '../DataSummaryItem';
import Title from '../Title';
import { Wrapper, FlexRow } from './style';

function DataSummary(props) {
  const { summaryData } = props;
  return (
    <Wrapper>
      <FlexRow>
        <DataSummaryItem icon={BarChartIcon} label="Datasets" value={summaryData.datasetCount} />
        <DataSummaryItem icon={BubbleChartIcon} label="Samples" value={summaryData.sampleCount} />
        <DataSummaryItem icon={PersonIcon} label="Donors" value={summaryData.donorCount} />
        <DataSummaryItem icon={AccountBalanceIcon} label="Centers" value={summaryData.centerCount} />
      </FlexRow>
      <Title />
    </Wrapper>
  );
}

DataSummary.propTypes = {
  summaryData: PropTypes.exact({
    datasetCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    sampleCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    donorCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    centerCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
};

export default React.memo(DataSummary);
