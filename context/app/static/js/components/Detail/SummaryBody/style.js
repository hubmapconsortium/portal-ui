import styled from 'styled-components';
import LabelledSectionDate from 'js/shared-styles/sections/LabelledSectionDate';

const Flex = styled.div`
  display: flex;
`;

const StyledCreationDate = styled(LabelledSectionDate)`
  flex-grow: 1;
`;

const StyledModificationDate = styled(LabelledSectionDate)`
  flex-grow: 3;
`;

export { Flex, StyledCreationDate, StyledModificationDate };
