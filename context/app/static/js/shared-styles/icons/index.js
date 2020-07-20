import styled from 'styled-components';
// NOTE: We are using the rounded icon variants consistently.
import BubbleChartIcon from '@material-ui/icons/BubbleChartRounded';
import PersonIcon from '@material-ui/icons/PersonRounded';
import TableChartIcon from '@material-ui/icons/TableChartRounded';
import AccountBalanceIcon from '@material-ui/icons/AccountBalanceRounded';
import LaunchRoundedIcon from '@material-ui/icons/LaunchRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';

const CenterIcon = styled(AccountBalanceIcon)`
  font-size: ${(props) => props.fontSize};
`;

const DonorIcon = styled(PersonIcon)`
  font-size: ${(props) => props.fontSize};
`;

const SampleIcon = styled(BubbleChartIcon)`
  font-size: ${(props) => props.fontSize};
`;

const DatasetIcon = styled(TableChartIcon)`
  font-size: ${(props) => props.fontSize};
`;

const ExternalLinkIcon = styled(LaunchRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

const InfoIcon = styled(InfoRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

const SuccessIcon = styled(CheckCircleRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

export { DonorIcon, SampleIcon, DatasetIcon, CenterIcon, ExternalLinkIcon, InfoIcon, SuccessIcon };
