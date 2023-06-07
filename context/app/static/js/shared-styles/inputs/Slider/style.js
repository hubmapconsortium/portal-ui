import styled from 'styled-components';
import FormLabel from '@mui/material/FormLabel';

const StyledFormLabel = styled(FormLabel)`
  color: ${(props) => props.theme.palette.text.primary};
`;

export { StyledFormLabel };
