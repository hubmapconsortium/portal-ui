import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Background = styled.div`
  background-color: ${(props) =>
    props.isMaintenancePage ? props.theme.palette.warning.main : props.theme.palette.error.main};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const StyledPaper = styled(Paper)`
  width: 100%;
  max-width: 880px;
  ${({ theme: { spacing } }) => `
    margin: 0 ${spacing(2)};
    padding: ${spacing(2)};
  `}
  word-break: break-all;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(props.$mb)};
`;

export { Background, StyledPaper, StyledTypography };
