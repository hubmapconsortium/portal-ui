import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const FlexContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EntityColumnTitle = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { FlexContainer, FlexColumn, EntityColumnTitle };
