import React from 'react';
import PropTypes from 'prop-types';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { DatasetIcon, SampleIcon, DonorIcon } from 'shared-styles/icons';
import DataSummaryItem from '../DataSummaryItem';
import Title from '../Title';
import { Wrapper, FlexRow } from './style';

function DataSummary(props) {
  const { summaryData } = props;
  return (
    <Wrapper>
      <FlexRow>
        <DataSummaryItem
          icon={AccountBalanceIcon}
          label="Centers"
          value={summaryData.centerCount}
          href="https://hubmapconsortium.org/funded-research-tmc/"
        />
        <DataSummaryItem
          icon={DonorIcon}
          label="Donors"
          value={summaryData.donorCount}
          href="/search?entity_type[0]=Donor"
        />

        <DataSummaryItem
          icon={SampleIcon}
          label="Samples"
          value={summaryData.sampleCount}
          href="/search?entity_type[0]=Sample"
        />
        <DataSummaryItem
          icon={DatasetIcon}
          label="Datasets"
          value={summaryData.datasetCount}
          href="/search?entity_type[0]=Dataset"
        />
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
