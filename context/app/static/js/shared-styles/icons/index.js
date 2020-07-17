import styled from 'styled-components';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import PersonIcon from '@material-ui/icons/Person';
import TableChartIcon from '@material-ui/icons/TableChart';
import LaunchRoundedIcon from '@material-ui/icons/LaunchRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';

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

export { DonorIcon, SampleIcon, DatasetIcon, ExternalLinkIcon, InfoIcon, SuccessIcon };
