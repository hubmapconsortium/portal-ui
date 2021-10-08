import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import LensIcon from '@material-ui/icons/LensRounded';

const StyledButton = styled(Button)`
  background-color: #fff;
  margin-right: 4px;
  text-transform: lowercase;
  width: 100px;
`;

const VersionStatusIcon = styled(LensIcon)`
  color: ${(props) => props.theme.palette[props.$iconColor].main};
  font-size: 16px;
  margin-right: 3px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const OverflowEllipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0px;
`;

const EmptyFullWidthDiv = styled.div`
  width: 100%;
`;

export { StyledButton, VersionStatusIcon, Flex, OverflowEllipsis, EmptyFullWidthDiv };
