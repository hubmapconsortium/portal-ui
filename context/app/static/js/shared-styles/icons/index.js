import styled from 'styled-components';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import PersonIcon from '@material-ui/icons/Person';
import TableChartIcon from '@material-ui/icons/TableChart';
import LaunchRoundedIcon from '@material-ui/icons/LaunchRounded';

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

export { DonorIcon, SampleIcon, DatasetIcon, ExternalLinkIcon };
