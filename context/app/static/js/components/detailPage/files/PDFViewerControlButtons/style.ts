import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';

const CenteredFlex = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '5px',
});

const StyledPaper = styled(Paper)({
  padding: '10px',
  borderRadius: '5px',
  width: 'fit-content',
});

const FlexButtonsWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '0px',
  margin: '0px',
});

const StyledIconButton = styled(IconButton)({
  // mui uses padding for icon button sizes which causes buttons with different size icons to vary in size
  boxSizing: 'border-box',
  width: '30px',
  height: '30px',
});

export { StyledPaper, FlexButtonsWrapper, CenteredFlex, StyledIconButton };
