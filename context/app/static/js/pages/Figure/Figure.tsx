import React from 'react';
import FIGURE_1B_1 from 'assets/svg/figure/figure_1b_1.svg';
import FIGURE_1B_2 from 'assets/svg/figure/figure_1b_2.svg';
import FIGURE_1C from 'assets/svg/figure/figure_1c.svg';
import FIGURE_1D from 'assets/svg/figure/figure_1d.svg';
import FIGURE_1E from 'assets/svg/figure/figure_1e.svg';
import Stack from '@mui/material/Stack';

export default function InlineFigures() {
  return (
    <Stack>
      <FIGURE_1B_1 />
      <FIGURE_1B_2 />
      <FIGURE_1C />
      <FIGURE_1D />
      <FIGURE_1E />
    </Stack>
  );
}
