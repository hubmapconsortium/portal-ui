import { styled } from '@mui/material/styles';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const iconSize = {
  fontSize: '1.2rem',
} as const;

const StyledCheckBoxIcon = styled(CheckBoxIcon)(iconSize);

const StyledCheckBoxBlankIcon = styled(CheckBoxOutlineBlankIcon)(iconSize);

const StyledCheckbox = styled(Checkbox)({
  padding: '3px',
});

const StyledFormControlLabel = styled(FormControlLabel)({
  margin: 0,
  width: '100%',
  '& span:nth-child(2)': {
    flexGrow: 1,
  },
  alignItems: 'start',
});

export { StyledCheckBoxBlankIcon, StyledCheckBoxIcon, StyledCheckbox, StyledFormControlLabel };
