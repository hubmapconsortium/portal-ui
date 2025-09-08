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
    fetch(path)
      .then((r) => r.text())
      .then((t) => {
        setHtml(t);
      })
      .catch(() => {
        setHtml('<div>Failed to load HTML figure.</div>');
      });
  }, [path]);

  return (
    <Box
      {...boxProps}
      sx={{
        width: '100%',
        height: '100%',
        lineHeight: 0,
        '& svg, & img, & iframe': { height: '100%', width: 'auto', display: 'block' },
        ...(sx ?? {}),
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function InlineFigures() {
  const base = '/static/assets/svg/figure';

  return (
    <Stack sx={{ bgcolor: 'background.paper', gap: 1 }}>
      {/* Row 1: a, b, c */}
      <Stack direction="row" sx={{ alignItems: 'stretch', gap: 1, height: 400, lineHeight: 0 }}>
        <Box sx={{ display: 'flex', height: '100%', minWidth: 0, flex: '0 0 34%' }}>
          <HtmlEmbed
            path={`${base}/figure_1a.html`}
            sx={{
              width: '100%',
              height: '100%',
              lineHeight: 0,
              '& svg, & img, & iframe': { height: '100%', width: 'auto', display: 'block' },
            }}
          />
        </Box>

        {/* B — anchor artwork to top-left */}
        <Box sx={{ display: 'flex', height: '100%', minWidth: 0, flex: '0 0 31.2%' }}>
          <FIGURE_1B preserveAspectRatio="xMinYMin meet" style={{ height: '100%', width: 'auto', display: 'block' }} />
        </Box>

        {/* C — anchor artwork to top-left */}
        <Box sx={{ display: 'flex', height: '100%', minWidth: 0, flex: '0 0 31.2%' }}>
          <FIGURE_1C preserveAspectRatio="xMinYMin meet" style={{ height: '100%', width: 'auto', display: 'block' }} />
        </Box>
      </Stack>

      {/* Row 2: d, efg */}
      <Stack
        direction="row"
        marginTop={-23}
        sx={{ justifyContent: 'flex-start', alignItems: 'stretch', gap: 1, height: 400, lineHeight: 0 }}
      >
        <Box sx={{ display: 'flex', height: '100%', minWidth: 0, flex: '0 0 auto' }}>
          <FIGURE_1D style={{ height: '100%', width: 'auto', display: 'block' }} />
        </Box>
        <Box sx={{ display: 'flex', height: '100%', minWidth: 0, flex: '0 0 auto' }}>
          <FIGURE_1EFG style={{ height: '100%', width: 'auto', display: 'block' }} />
        </Box>
      </Stack>

      {/* Row 3: h, i */}
      <Stack
        direction="row"
        sx={{
          justifyContent: 'flex-end',
          alignItems: 'stretch',
          gap: 1,
          height: 360,
          lineHeight: 0,
          pr: 3,
          pl: 3,
        }}
      >
        <Box sx={{ display: 'flex', height: '100%', minWidth: 0, flex: '0 1 auto', flexShrink: 1, maxWidth: '50%' }}>
          <FIGURE_1H style={{ height: '100%', width: 'auto', maxWidth: '100%', display: 'block' }} />
        </Box>
        <Box sx={{ display: 'flex', height: '100%', minWidth: 0, flex: '0 1 auto', flexShrink: 1, maxWidth: '50%' }}>
          <FIGURE_1I style={{ height: '100%', width: 'auto', maxWidth: '100%', display: 'block' }} />
        </Box>
      </Stack>
    </Stack>
  );
}
