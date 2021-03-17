import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const SpacingDiv = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(3)}px;
`;

const PageSpacing = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(5)}px;
`;

const StyledHeader = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { SpacingDiv, PageSpacing, StyledHeader };
