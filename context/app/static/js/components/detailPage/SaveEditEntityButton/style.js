import styled from 'styled-components';

import SaveEntityButton from 'js/components/savedLists/SaveEntityButton';
import EditSavedStatusButton from 'js/components/savedLists/EditSavedStatusButton';

const StyledSaveEntityButton = styled(SaveEntityButton)`
  margin-left: ${(props) => props.theme.spacing(1)};
`;

const StyledEditSavedStatusButton = styled(EditSavedStatusButton)`
  margin-left: ${(props) => props.theme.spacing(1)};
`;

export { StyledSaveEntityButton, StyledEditSavedStatusButton };
