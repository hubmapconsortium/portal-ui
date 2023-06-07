import styled from 'styled-components';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';

const StyledOpenInNewRoundedIcon = styled(OpenInNewRoundedIcon)`
  font-size: 1.1rem;
  vertical-align: text-bottom;
  margin-left: ${(props) => props.theme.spacing(0.5)};
`;

export { StyledOpenInNewRoundedIcon };
