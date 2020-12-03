import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const WhiteButton = styled(Button)`
  width: 136px;
  background-color: ${(props) => props.theme.palette.white.main};
  margin-left: 10px;
  color: ${(props) => props.theme.palette.primary.main};
  text-transform: capitalize;

  &:hover {
    background-color: rgb(255, 255, 255, 0.92); // TODO: move to theme.
    box-shadow: ${(props) => props.theme.shadows[8]};
  }
`;

const TruncatedSpan = styled.span`
  text-transform: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export { WhiteButton, TruncatedSpan };
