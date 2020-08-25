import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { InfoIcon, SuccessIcon } from 'js/shared-styles/icons';

const StyledTypography = styled(Typography)`
  margin: 0px ${(props) => props.theme.spacing(1)}px ${(props) => props.theme.spacing(1)}px 0px;
`;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing(2)}px;
`;

const MarginTopDiv = styled.div`
  margin-top: ${(props) => props.theme.spacing(2)}px;
`;

const Flex = styled.div`
  display: flex;
`;

const StyledInfoIcon = styled(InfoIcon)`
  color: ${(props) => props.theme.palette.error.main};
  font-size: 1.5rem;
`;

const StyledSuccessIcon = styled(SuccessIcon)`
  color: ${(props) => props.theme.palette.success.main};
  font-size: 1.5rem;
`;

export { CenteredDiv, MarginTopDiv, StyledTypography, Flex, StyledInfoIcon, StyledSuccessIcon };
