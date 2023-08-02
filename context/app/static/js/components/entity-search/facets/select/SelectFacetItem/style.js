import styled, { css } from 'styled-components';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const iconSize = css`
  font-size: 1.2rem;
`;

const StyledCheckBoxIcon = styled(CheckBoxIcon)`
  ${iconSize}
`;

const StyledCheckBoxBlankIcon = styled(CheckBoxOutlineBlankIcon)`
  ${iconSize}
`;

const StyledCheckbox = styled(Checkbox)`
  padding: 3px;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  margin: 0px;
  width: 100%;
  span:nth-child(2) {
    flex-grow: 1;
  }
  align-items: start;
`;

export { StyledCheckBoxBlankIcon, StyledCheckBoxIcon, StyledCheckbox, StyledFormControlLabel };
