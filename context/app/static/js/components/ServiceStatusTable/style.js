import styled from 'styled-components';
import LensIcon from '@mui/icons-material/LensRounded';

// Default font-size is too large, and causes vertical misalignment
// of text in this cell. 0.8rem works, but somewhat arbitrary.
// "vertical-align: sub" looks better than "baseline",
// but depends on size of circle.
const ColoredStatusIcon = styled(LensIcon)`
  color: ${(props) => props.theme.palette[props.$iconColor].main};
  font-size: 0.8rem;
  margin-right: 3px;
  vertical-align: sub;
`;

export { ColoredStatusIcon };
