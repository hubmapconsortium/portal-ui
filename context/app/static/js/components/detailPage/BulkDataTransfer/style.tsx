import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import ErrorIcon from '@mui/icons-material/Error';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { SvgIconProps } from '@mui/material/SvgIcon';

const StyledContainer = styled('div')(({ theme }) => ({
  '> div': {
    marginBottom: theme.spacing(1.25),
  },
}));

const Header = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1, 1, 0),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginLeft: theme.spacing(0.5),
  },
}));

const ContentText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1.25, 0),
}));

const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(0.5),
}));

const LinkContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const StyledLink = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  marginRight: theme.spacing(1.25),
  '& svg': {
    marginRight: theme.spacing(0.5),
  },
}));

function GreenCheckCircleIcon(props: SvgIconProps) {
  return <CheckCircleIcon color="success" {...props} />;
}

function StyledBlockIcon(props: SvgIconProps) {
  return <BlockIcon color="warning" {...props} />;
}

function StyledErrorIcon(props: SvgIconProps) {
  return <ErrorIcon color="error" {...props} />;
}

const ObliqueSpan = styled('span')({
  fontStyle: 'oblique 10deg',
});

const StyledHeader = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const StyledDiv = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

function StyledWarningIcon(props: SvgIconProps) {
  return <WarningRoundedIcon color="warning" {...props} />;
}

const IconContainer = styled('div')(({ theme }) => ({
  float: 'left',
  marginRight: theme.spacing(1),
}));

interface NoAccessContainerProps {
  $displayValue: string;
}

const NoAccessContainer = styled('div')<NoAccessContainerProps>(({ $displayValue }) => ({
  display: $displayValue,
  alignItems: 'center',
}));

export {
  StyledContainer,
  Header,
  ContentText,
  LoginButton,
  LinkContainer,
  StyledLink,
  GreenCheckCircleIcon,
  StyledBlockIcon,
  StyledErrorIcon,
  ObliqueSpan,
  StyledHeader,
  StyledDiv,
  StyledWarningIcon,
  IconContainer,
  NoAccessContainer,
};
