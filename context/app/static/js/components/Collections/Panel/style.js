import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const PanelWrapper = styled.div`
  padding: 15px 20px;
  border-bottom: 2px solid ${(props) => props.theme.palette.collectionsDivider.main};
  display: flex;
  flex-direction: column;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Name = styled(Typography)`
  word-wrap: break-word;
`;

export { PanelWrapper, Name };
