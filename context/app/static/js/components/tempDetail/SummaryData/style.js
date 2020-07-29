import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

import { FileIcon } from 'shared-styles/icons';

const Flex = styled.div`
  display: flex;
`;

const FlexRight = styled.div`
  display: flex;
  margin-left: auto;
`;

const FlexCenterAlign = styled.div`
  display: flex;
  align-items: center;
`;

const JsonButton = styled(IconButton)`
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  margin-left: auto;
`;

const StyledFileIcon = styled(FileIcon)`
  font-size: 1.2rem;
`;

export { Flex, FlexRight, FlexCenterAlign, JsonButton, StyledFileIcon };
