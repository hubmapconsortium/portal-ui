import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Typography, { TypographyProps } from '@mui/material/Typography';
import React from 'react';
import Divider, { DividerProps } from '@mui/material/Divider';

export const StyledDrawer = styled(Drawer)(({ theme, anchor }) => ({
  '& .MuiDrawer-paper': {
    borderRadius: anchor === 'left' ? theme.spacing(0, 2, 2, 0) : theme.spacing(2, 0, 0, 2),
    maxWidth: theme.breakpoints.values.sm,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export function DrawerTitle(props: TypographyProps) {
  return <Typography variant="h3" color="primary" {...props} />;
}

export const DrawerList = List;

export const DrawerListItem = styled(ListItem)(({ theme }) => ({
  marginY: 0,
  '&:hover': {
    backgroundColor: '#F0F3EB', // success-90 in figma
    borderRadius: theme.spacing(1),
  },
}));

export const DrawerListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  width: theme.spacing(6),
  position: 'relative',
  '& > *': {
    padding: theme.spacing(1),
    width: '100%',
    height: '100%',
  },
}));

export const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: theme.typography.fontWeightMedium,
  paddingLeft: 0,
}));

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    ...theme.typography.subtitle2,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  '& .MuiListItemText-secondary': {
    ...theme.typography.body2,
  },
}));

export function ListDivider(props: DividerProps) {
  return <Divider component="li" {...props} />;
}
