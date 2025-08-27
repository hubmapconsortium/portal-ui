import React, { useEffect, useState } from 'react';
import FIGURE_1B_1 from 'assets/svg/figure/figure_1b_1.svg';
import FIGURE_1B_2 from 'assets/svg/figure/figure_1b_2.svg';
import FIGURE_1C from 'assets/svg/figure/figure_1c.svg';
import FIGURE_1D from 'assets/svg/figure/figure_1d.svg';
import FIGURE_1E from 'assets/svg/figure/figure_1e.svg';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// Fetch + inject figure 1a
function HtmlEmbed({ path }: { path: string }) {
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

  return <Box sx={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function InlineFigures() {
  const base = '/static/assets/svg/figure';

  return (
    <Grid container>
      {/* Left column: 1/3 */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={2}>
          <HtmlEmbed path={`${base}/figure_1a.html`} />
          <FIGURE_1C style={{ width: '100%', height: 'auto', display: 'block' }} />
        </Stack>
      </Grid>

      {/* Right column: 2/3 */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack>
          <Stack direction="row">
            <FIGURE_1B_1 style={{ width: '100%', height: 'auto', display: 'block' }} />
            <FIGURE_1B_2 style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Stack>
          <FIGURE_1D style={{ width: '100%', height: 'auto', display: 'block' }} />
          <FIGURE_1E style={{ width: '100%', height: 'auto', display: 'block' }} />
        </Stack>
      </Grid>
    </Grid>
  );
}
