import styled from 'styled-components';
import { TitleTextField, DescriptionTextField } from 'js/components/savedLists/listTextFields';

const StyledDescriptionTextField = styled(DescriptionTextField)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

const StyledTitleTextField = styled(TitleTextField)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

export { StyledTitleTextField, StyledDescriptionTextField };
