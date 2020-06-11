import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const FlexRow = styled.div`
  display: flex;

  @media (max-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-basis: 50%;
  }
`;

const StyledTypography = styled(Typography)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
`;

export { FlexRow, StyledTypography };
