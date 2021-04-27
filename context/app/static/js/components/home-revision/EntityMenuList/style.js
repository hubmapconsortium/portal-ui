import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const FlexDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const FacetLabel = styled(Typography)`
  padding: 6px 16px;
`;

const FacetValue = styled(Typography)`
  padding: 6px 16px;
  text-decoration: none;
  color: ${(props) => props.theme.palette.text.primary};

  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
`;

export { FlexDiv, FacetLabel, FacetValue };
