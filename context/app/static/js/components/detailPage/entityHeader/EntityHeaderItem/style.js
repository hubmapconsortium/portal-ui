import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';

const VerticalDivider = styled(Divider)`
  margin-left: ${(props) => props.theme.spacing(2)}px;
  margin-right: ${(props) => props.theme.spacing(2)}px;
  height: 100%;
  align-self: center;
`;

const EntityName = styled(Typography)`
  max-width: 50ch;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
`;

export { VerticalDivider, EntityName };
