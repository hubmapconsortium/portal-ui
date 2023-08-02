import styled from 'styled-components';
import Button from '@mui/material/Button';

const StyledButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing(1)};
  width: 130px;
`;

const OverflowEllipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0px;
  white-space: nowrap;
`;

const EmptyFullWidthDiv = styled.div`
  width: 100%;
`;

export { StyledButton, OverflowEllipsis, EmptyFullWidthDiv };
