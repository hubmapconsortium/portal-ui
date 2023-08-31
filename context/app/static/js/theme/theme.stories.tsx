import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import theme from './theme';

type PaletteColorProps = {
  color: (typeof theme.palette)[keyof typeof theme.palette];
  name: string;
};

function hex2rgb(c: string) {
  const color = c[0] === '#' ? c.substring(1) : c;
  // Handle shorthand hex colors; use floor to handle alpha hex values
  const interval = Math.floor(color.length / 3);
  if (interval === 0) {
    // Can't convert to rgb, return original color
    return c;
  }
  let index = 0;
  const r = parseInt(color.slice(index, (index += interval)), 16);
  const g = parseInt(color.slice(index, (index += interval)), 16);
  const b = parseInt(color.slice(index, (index += interval)), 16);
  if (index !== color.length) {
    const a = parseInt(color.slice(index, index + interval), 16);
    return `rgba(${r}, ${g}, ${b}, 0.${a})`;
  }
  return `rgba(${r}, ${g}, ${b}, 1.00)`;
}

function rgb2hex(c: string) {
  const rgb = c.replace(/[^\d,]/g, '').split(',');
  const r = parseInt(rgb[0], 10).toString(16).padStart(2, '0');
  const g = parseInt(rgb[1], 10).toString(16).padStart(2, '0');
  const b = parseInt(rgb[2], 10).toString(16).padStart(2, '0');
  if (Number.isNaN(parseInt(rgb[3], 16))) {
    return `#${r}${g}${b}ff`;
  }
  const a = parseInt(rgb[3], 10).toString(16).padStart(2, '0');

  return `#${r}${g}${b}${a}`;
}

function PaletteColor({ color, name }: PaletteColorProps) {
  if (typeof color === 'string') {
    // Normalize colors for ease of comparison
    const rgbaColor = color.startsWith('rgb') ? color : hex2rgb(color);
    const hexColor = rgb2hex(rgbaColor);
    return (
      <TableRow>
        <TableCell>
          <Box
            width={theme.spacing(4)}
            height={theme.spacing(4)}
            bgcolor={color}
            display="inline-block"
            border="1px solid black"
            flexShrink="none"
          />
        </TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>
          <pre>{hexColor}</pre>
        </TableCell>
        <TableCell>
          <pre>{rgbaColor}</pre>
        </TableCell>
      </TableRow>
    );
  }
  return (
    <>
      {Object.entries(color).map(([variant, variantColor]) => (
        <PaletteColor key={variant} name={`${name}.${variant}`} color={variantColor} />
      ))}
    </>
  );
}

function PaletteStory() {
  return (
    <>
      <Typography component="h1" variant="h1">
        HuBMAP Data Portal Palette
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Color</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Hex</TableCell>
            <TableCell>RGB(A)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(theme.palette).map(([name, color]) =>
            name !== 'mode' ? <PaletteColor key={name} name={name} color={color} /> : null,
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default {
  title: 'Theme/Palette',
  component: PaletteStory,
} satisfies Meta<typeof PaletteStory>;

export const Light: StoryObj<typeof PaletteStory> = {};
