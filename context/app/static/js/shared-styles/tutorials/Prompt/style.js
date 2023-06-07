import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { InfoIcon } from 'js/shared-styles/icons';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';

const CenteredDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 48px; /* to offset for the button size */
  padding: ${(props) => props.theme.spacing(1)};
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

const StyledPaper = styled(Paper)`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing(2)};
  padding: ${(props) => props.theme.spacing(0.5)};
  border: 1px solid ${(props) => props.theme.palette.info.dark};
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-right: ${(props) => props.theme.spacing(0.5)};
  font-size: 1.5rem;
  color: ${(props) => props.theme.palette.info.dark};
`;

const StyledCloseIcon = styled(CloseRoundedIcon)`
  color: ${(props) => props.theme.palette.info.dark};
`;

const StyledButton = styled(OptDisabledButton)`
  padding: 6px 36px;
  background-color: ${(props) => props.theme.palette.info.dark};
  color: #fff;
`;

export { CenteredDiv, Flex, StyledTypography, StyledPaper, StyledInfoIcon, StyledCloseIcon, StyledButton };
