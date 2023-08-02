import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const SliderLabel = styled(Typography)`
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  margin-right: ${(props) => (props.$isLeftLabel ? props.theme.spacing(0.5) : 0)}px;
  margin-left: ${(props) => (props.$isRightLabel ? props.theme.spacing(0.5) : 0)}px;
`;

export { Flex, SliderLabel };
