import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import theme from './theme';

interface PaletteColorProps {
  color: (typeof theme.palette)[keyof typeof theme.palette];
  name: string;
}

// Extended version of https://stackoverflow.com/a/69353003
function hex2rgb(c: string) {
  const color = c.startsWith('#') ? c.substring(1) : c;
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
    const a = (parseInt(color.slice(index), 16) / 255).toPrecision(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function rgb2hex(c: string) {
  const rgb = c.replace(/[^\d,]/g, '').split(',');
  const r = parseInt(rgb[0], 10).toString(16).padStart(2, '0');
  const g = parseInt(rgb[1], 10).toString(16).padStart(2, '0');
  const b = parseInt(rgb[2], 10).toString(16).padStart(2, '0');
  if (Number.isNaN(parseInt(rgb[3], 16))) {
    return `#${r}${g}${b}`;
  }
  const a = parseInt((parseFloat(rgb[3]) * 2.55).toFixed(0), 10)
    .toString(16)
    .padStart(2, '0');

  return `#${r}${g}${b}${a}`;
}

interface PaletteHoverColorProps {
  color: string;
  name: string;
}

function PaletteHoverColor({ color, name }: PaletteHoverColorProps) {
  return (
    <TableRow>
      <TableCell>
        <Box
          width={theme.spacing(4)}
          height={theme.spacing(4)}
          bgcolor="#fff"
          display="inline-block"
          border="1px solid black"
          flexShrink="none"
        />
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell colSpan={2}>
        <pre>{color}</pre>
      </TableCell>
    </TableRow>
  );
}

function castColor(color: unknown) {
  return color as PaletteColorProps['color'];
}

function PaletteColor({ color, name }: PaletteColorProps) {
  if (typeof color === 'string') {
    // Normalize colors for ease of comparison
    if (name.endsWith('hover')) {
      return <PaletteHoverColor color={color} name={name} />;
    }
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
      {Object.entries(color).map(([variant, variantColor]) => {
        const fullName = `${name}.${variant}`;
        const paletteColor = castColor(variantColor);
        return <PaletteColor key={variant} name={fullName} color={paletteColor} />;
      })}
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
          {Object.entries(theme.palette).map(([name, colorVariant]) => {
            if (name === 'mode') {
              return null;
            }
            const color = castColor(colorVariant);
            return <PaletteColor key={name} name={name} color={color} />;
          })}
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
