import styled, { css } from 'styled-components';
import Divider from '@material-ui/core/Divider';

import { DatasetIcon, SampleIcon } from 'shared-styles/icons';
import { tileWidth } from '../EntityTile/style';

const iconStyle = css`
  font-size: 0.9rem;
  height: 18px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const StyledDatasetIcon = styled(DatasetIcon)`
  ${iconStyle};
`;

const StyledSampleIcon = styled(SampleIcon)`
  ${iconStyle};
`;

const FixedWidthFlex = styled.div`
  display: flex;
  width: ${tileWidth};
  background-color: ${(props) => props.theme.palette.primary.main};
  padding: 0 ${(props) => props.theme.spacing(1)}px;
  color: #ffffff;

  svg {
    color: #ffffff;
  }

  ${(props) =>
    props.$invertColors &&
    css`
      background-color: #ffffff;
      color: ${props.theme.palette.primary.main};

      svg {
        color: ${props.theme.palette.primary.main};
      }
    `}
`;

const StyledDivider = styled(Divider)`
  background-color: ${(props) => (props.$invertColors ? props.theme.palette.primary.main : '#ffffff')};
  margin: 0px ${(props) => props.theme.spacing(0.5)}px;
`;

export { FixedWidthFlex, StyledDivider, StyledDatasetIcon, StyledSampleIcon };
