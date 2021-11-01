import styled, { css } from 'styled-components';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

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
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FormLabelText = styled(Typography)`
  margin-right: 2px;
`;

export { StyledCheckBoxBlankIcon, StyledCheckBoxIcon, StyledCheckbox, StyledFormControlLabel, Flex, FormLabelText };
