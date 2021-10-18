import styled from 'styled-components';
import { InfoIcon } from 'js/shared-styles/icons';

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
  font-size: 1.1rem;
  margin-bottom: ${(props) => props.theme.spacing(1)}px; // To match SectionHeader
`;

export { Flex, StyledInfoIcon };
