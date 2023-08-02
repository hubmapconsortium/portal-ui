import styled from 'styled-components';
import Box from '@mui/material/Box';

const PaddedBox = styled(Box)`
  padding: ${(props) => (props.$pad ? '30px 40px' : '0px')};
`;

export { PaddedBox };
