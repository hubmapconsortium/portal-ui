import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';

const FlexPaper = styled(Paper)`
  padding: 30px 40px;
`;

const Flex = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

const FlexRight = styled.div`
  display: flex;
  margin-left: auto;
`;

const StyledOpenInNewRoundedIcon = styled(OpenInNewRoundedIcon)`
  font-size: 1.1rem;
  vertical-align: text-bottom;
  margin-left: 0.2rem;
`;

export { FlexPaper, Flex, FlexRight, StyledOpenInNewRoundedIcon };
