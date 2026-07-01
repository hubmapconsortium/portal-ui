import React from 'react';
import FIGURE_1B from 'assets/svg/figure/figure_1b.svg';
import FIGURE_1C from 'assets/svg/figure/figure_1c.svg';
import FIGURE_1D from 'assets/svg/figure/figure_1d.svg';
import FIGURE_1EFG from 'assets/svg/figure/figure_1efg.svg';
import FIGURE_1H from 'assets/svg/figure/figure_1h.svg';
import FIGURE_1I from 'assets/svg/figure/figure_1i.svg';
import MANIFEST from 'assets/svg/figure/manifest.json';
import Stack from '@mui/material/Stack';
import Box, { BoxProps } from '@mui/material/Box';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import Description from 'js/shared-styles/sections/Description';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

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

// Below this width each figure row scrolls horizontally instead of squishing the figures; at or
// above it the row fills the available width (up to the page's ~1232px content cap).
const FIGURE_MIN_WIDTH = 960;

export default function InlineFigures() {
  const base = '/static/assets/svg/figure';

  // Manifest date is in seconds since epoch, convert to milliseconds for JS Date
  const jsDate = new Date(MANIFEST.generated_at * 1000);

  return (
    <Stack gap={1} mb={1}>
      <PageTitle>Data Overview</PageTitle>
      <Description>
        <Box mb={1}>
          This page provides an overview of the data available in the HuBMAP Data Portal through a series of summary
          charts, including:
          <br />
          <strong>(a)</strong> Total counts of HuBMAP data entities: datasets, samples and donors.
          <br />
          <strong>(b-c)</strong> Donor demographics grouped by age range and race.
          <br />
          <strong>(d-g)</strong> Summary of organ distributions by dataset count, sample count, unique donor organ count
          and average number of samples per donor organ.
          <br />
          <strong>(h-i)</strong> Data types distributions by dataset count and by associated Vitessce visualizations.
        </Box>
        <LabelledSectionText label="Last Updated">
          {jsDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </LabelledSectionText>
      </Description>
      <hr />
      <Stack sx={{ bgcolor: 'background.paper', gap: 1 }}>
        {/* Each row is its own horizontal-scroll container: below FIGURE_MIN_WIDTH the row keeps its
            layout and scrolls sideways instead of squishing the figures. */}
        {/* Row 1: a, b, c — pr/pl + flex-grow so the row spans the same left/right edges as rows 2-3
            (c's right edge lines up with i and g). */}
        <Box sx={{ overflowX: 'auto' }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'stretch', gap: 1, height: 400, lineHeight: 0, pr: 3, pl: 3, minWidth: FIGURE_MIN_WIDTH }}
          >
            <Box sx={{ display: 'flex', height: '100%', minWidth: 0, flex: '34 1 0' }}>
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
            <Box sx={{ display: 'flex', height: '100%', minWidth: 0, flex: '31.2 1 0' }}>
              <FIGURE_1B
                preserveAspectRatio="xMinYMin meet"
                style={{ height: '100%', width: 'auto', display: 'block' }}
              />
            </Box>

            {/* C — anchor artwork to top-left */}
            <Box sx={{ display: 'flex', height: '100%', minWidth: 0, flex: '31.2 1 0' }}>
              <FIGURE_1C
                preserveAspectRatio="xMinYMin meet"
                style={{ height: '100%', width: 'auto', display: 'block' }}
              />
            </Box>
          </Stack>
        </Box>

        {/* Row 2: d, efg — two equal halves. d and efg share an aspect ratio (efg was sized to match
            d), so equal widths also give equal heights, keeping d's categorical (organ) rows aligned
            across the two panels. Each half == h's half below, so the columns line up exactly. */}
        <Box sx={{ overflowX: 'auto', mt: -23 }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'flex-start', gap: 1, lineHeight: 0, pr: 3, pl: 3, minWidth: FIGURE_MIN_WIDTH }}
          >
            <Box sx={{ minWidth: 0, flex: '1 1 0' }}>
              <FIGURE_1D style={{ width: '100%', height: 'auto', display: 'block' }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: '1 1 0' }}>
              <FIGURE_1EFG style={{ width: '100%', height: 'auto', display: 'block' }} />
            </Box>
          </Stack>
        </Box>

        {/* Row 3: h, i — two equal halves, identical flex math to row 2, so g (efg) and i share the
            same right edge and h and d share the same left edge. */}
        <Box sx={{ overflowX: 'auto' }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'flex-start', gap: 1, lineHeight: 0, pr: 3, pl: 3, minWidth: FIGURE_MIN_WIDTH }}
          >
            <Box sx={{ minWidth: 0, flex: '1 1 0' }}>
              <FIGURE_1H style={{ width: '100%', height: 'auto', display: 'block' }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: '1 1 0' }}>
              <FIGURE_1I style={{ width: '100%', height: 'auto', display: 'block' }} />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}
