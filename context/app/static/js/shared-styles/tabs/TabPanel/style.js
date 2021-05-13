import styled from 'styled-components';
import Box from '@material-ui/core/Box';

const PaddedBox = styled(Box)`
  padding: ${(props) => (props.$pad ? '30px 40px' : '0px')};
`;

export { PaddedBox };
