import styled, { css } from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { DatasetIcon, SampleIcon, DonorIcon } from 'shared-styles/icons';

const tileWidth = '300px';

const iconStyle = css`
  font-size: 1.3rem;
  height: 25px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const StyledDatasetIcon = styled(DatasetIcon)`
  ${iconStyle};
`;

const StyledSampleIcon = styled(SampleIcon)`
  ${iconStyle};
`;

const StyledDonorIcon = styled(DonorIcon)`
  ${iconStyle};
`;

const StyledPaper = styled(Paper)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
  box-shadow: ${(props) => props.theme.shadows[1]};

  ${(props) =>
    props.$isCurrentEntity &&
    css`
      background-color: ${props.theme.palette.primary.main};
      color: #ffffff;

      svg {
        color: #ffffff;
      }
    `}
`;

const HoverOverlay = styled.div`
  &:hover {
    box-shadow: ${(props) => props.theme.shadows[8]};
    background-color: ${(props) => props.theme.palette.whiteHoverOverlay.main};
  }

  ${(props) =>
    props.$isCurrentEntity &&
    css`
      &:hover {
        background-color: ${props.theme.palette.primaryHoverOverlay.main};
      }
    `}
`;

// Width needs to be defined in px for text-overflow to work
const FixedWidthFlex = styled.div`
  display: flex;
  width: tileWidth;
  padding: 10px 10px;
`;

const Flex = styled.div`
  display: flex;
`;

const TruncatedTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDivider = styled(Divider)`
  background-color: ${(props) => props.theme.palette.text.primary};
  margin: 0px ${(props) => props.theme.spacing(0.5)}px;
`;

const TextSection = styled.div`
  min-width: 0;
  flex-grow: 1;
`;

const BottomSection = styled.div`
  display: flex;
  width: ${tileWidth};
  background-color: ${(props) => (props.$isCurrentEntity ? '#ffffff' : props.theme.palette.primary.main)};
  padding: 0 ${(props) => props.theme.spacing(1)}px;
`;

const BottomSectionDivider = styled(Divider)`
  background-color: ${(props) => (props.$isCurrentEntity ? props.theme.palette.primary.main : '#ffffff')};
  margin: 0px ${(props) => props.theme.spacing(0.5)}px;
`;

const BottomSectionText = styled(Typography)`
  color: ${(props) => (props.$isCurrentEntity ? props.theme.palette.primary.main : '#ffffff')};
`;

export {
  StyledDatasetIcon,
  StyledSampleIcon,
  StyledDonorIcon,
  StyledPaper,
  HoverOverlay,
  FixedWidthFlex,
  Flex,
  TruncatedTypography,
  StyledDivider,
  TextSection,
  BottomSection,
  BottomSectionDivider,
  BottomSectionText,
};
