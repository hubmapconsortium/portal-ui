import styled from 'styled-components';
import Typography from '@mui/material/Typography';

const SpacingDiv = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(3)};
`;

const PageSpacing = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(5)};
`;

const StyledHeader = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

export { SpacingDiv, PageSpacing, StyledHeader };
