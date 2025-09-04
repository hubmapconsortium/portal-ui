import React from 'react';
import FIGURE_1B from 'assets/svg/figure/figure_1b.svg';
import FIGURE_1C from 'assets/svg/figure/figure_1c.svg';
import FIGURE_1D from 'assets/svg/figure/figure_1d.svg';
import FIGURE_1EFG from 'assets/svg/figure/figure_1efg.svg';
import FIGURE_1H from 'assets/svg/figure/figure_1h.svg';
import FIGURE_1I from 'assets/svg/figure/figure_1i.svg';
import Stack from '@mui/material/Stack';
import Box, { BoxProps } from '@mui/material/Box';

function HtmlEmbed({ path, sx, ...boxProps }: { path: string } & BoxProps) {
  const [html, setHtml] = React.useState<string>('');
  React.useEffect(() => {
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
    <Stack sx={{ bgcolor: 'background.paper' }}>
      {/* Row 1: a, b, and c */}
      <Stack direction="row" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ flex: 0.7, minWidth: 0, pt: 1 }}>
          <HtmlEmbed path={`${base}/figure_1a.html`} sx={{ height: '100%' }} />
        </Box>
        <Stack sx={{ flex: 1, minWidth: 0 }} spacing={1} direction="row">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <FIGURE_1B style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'flex-start' }}>
            <FIGURE_1C style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
        </Stack>
      </Stack>

      {/* Row 2: d, e, f, and g */}
      <Stack direction="row" alignItems="flex-start" sx={{ flex: 1, minWidth: 0, mt: -3 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FIGURE_1D style={{ width: '100%', height: 'auto', display: 'block' }} />
        </Box>
        <Box sx={{ flex: 0.85, minWidth: 0, mt: 5 }}>
          <FIGURE_1EFG style={{ width: '100%', height: 'auto', display: 'block' }} />
        </Box>
      </Stack>

      {/* Row 3: h and i */}
      <Stack direction="row" sx={{ flex: 1, minWidth: 0, mt: 2 }} spacing={1}>
        <Box sx={{ flex: 0.75, minWidth: 0, pt: 1.8 }}>
          <FIGURE_1H style={{ width: '100%', height: 'auto', display: 'block' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FIGURE_1I style={{ width: '100%', height: 'auto', display: 'block' }} />
        </Box>
      </Stack>
    </Stack>
  );
}
