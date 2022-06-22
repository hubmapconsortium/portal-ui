import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';

const StyledPaper = styled(Paper)`
  min-width: 300px;
  margin-right: ${(props) => props.theme.spacing(1.5)}px;
  padding: 16px 16px 16px 0px;
`;

const StyledFormLabel = styled(FormLabel)`
  font-weight: ${(props) => props.theme.typography.subtitle1.fontWeight};
  font-size: ${(props) => props.theme.typography.subtitle1.fontSize};
  color: ${(props) => props.theme.palette.text.primary};
  margin-left: ${(props) => props.theme.spacing(2)}px;
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;
export { StyledPaper, StyledFormLabel };
