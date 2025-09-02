import React, { useEffect, useState } from 'react';
import FIGURE_1B_1 from 'assets/svg/figure/figure_1b_1.svg';
import FIGURE_1B_2 from 'assets/svg/figure/figure_1b_2.svg';
import FIGURE_1C from 'assets/svg/figure/figure_1c.svg';
import FIGURE_1D_1 from 'assets/svg/figure/figure_1d_1.svg';
import FIGURE_1D_2 from 'assets/svg/figure/figure_1d_2.svg';
import FIGURE_1E from 'assets/svg/figure/figure_1e.svg';
import Stack from '@mui/material/Stack';
import Box, { BoxProps } from '@mui/material/Box';

// Fetch + inject figure 1a
function HtmlEmbed({ path, sx, ...boxProps }: { path: string } & BoxProps) {
  const [html, setHtml] = useState<string>('');
  useEffect(() => {
    let mounted = true;
    fetch(path)
      .then((r) => r.text())
      .then((t) => {
        if (mounted) setHtml(t);
      })
      .catch(() => {
        if (mounted) setHtml('<div>Failed to load HTML figure.</div>');
      });
    return () => {
      mounted = false;
    };
  }, [path]);

  return <Box {...boxProps} sx={{ width: '100%', ...(sx ?? {}) }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function InlineFigures() {
  const base = '/static/assets/svg/figure';

  return (
    <Stack direction="row" spacing={2} sx={{ bgcolor: 'background.paper' }}>
      {/* Left column: a, b, c */}
      <Stack sx={{ flex: 0.8, minWidth: 0 }} spacing={2}>
        {/* a */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <HtmlEmbed path={`${base}/figure_1a.html`} sx={{ height: '100%' }} />
        </Box>

        {/* b (stacked b2 over b1) */}
        <Stack sx={{ flex: 1, minWidth: 0 }} spacing={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <FIGURE_1B_2 style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <FIGURE_1B_1 style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
        </Stack>

        {/* c */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FIGURE_1C style={{ width: '100%', height: 'auto', display: 'block' }} />
        </Box>
      </Stack>

      {/* Right column: d, e */}
      <Stack sx={{ flex: 1, minWidth: 0 }} spacing={2}>
        {/* d */}
        <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <FIGURE_1D_1 style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <FIGURE_1D_2 style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
        </Stack>

        {/* e */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FIGURE_1E style={{ width: '100%', height: 'auto', display: 'block' }} />
        </Box>
      </Stack>
    </Stack>
  );
}
