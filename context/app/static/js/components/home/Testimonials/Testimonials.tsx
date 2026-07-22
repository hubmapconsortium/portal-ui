import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { trackEvent } from 'js/helpers/trackers';
import { cdnUrl } from 'js/helpers/cdn';

interface Testimonial {
  quote: string;
  role: string;
  image: string;
  buttonLabel: string;
  href: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      '“The ability to rapidly inspect datasets provides a valuable sanity check. Without it, I’d need to download and process the full dataset before realizing it wasn’t useful. This helps prevents unnecessary work and streamlines my analysis.”',
    role: 'Bioinformatician',
    image: cdnUrl('testimonials/datasets.webp'),
    buttonLabel: 'Explore HuBMAP Datasets',
    href: '/search/datasets',
  },
  {
    quote:
      '“HuBMAP’s pipelines and Workspaces make it easy to bring in datasets and start analyzing immediately. I adapted the cell-space workflow and used Workspaces to annotate data directly for my latest project.”',
    role: 'PhD Student in Biomedical Engineering',
    image: cdnUrl('testimonials/biomarkers.webp'),
    buttonLabel: 'Explore Workspaces',
    href: '/workspaces',
  },
  {
    quote:
      '“The biological context is incredibly valuable because it reveals patterns beyond the tissue I’m actively studying. Seeing how a gene expresses itself across multiple organs gave me a much broader understanding of the data and helped me think more strategically about my experimental design. I didn’t fully appreciate these cross-organ patterns until using this tool.”',
    role: 'Instructor in Medicine',
    image: cdnUrl('testimonials/workspaces.webp'),
    buttonLabel: 'Explore Biomarker and Cell Type Search',
    href: '/search/biomarkers-cell-types',
  },
];

// 1dp elevation from the design (matches the theme's `elevated` variant shadow).
const CARD_SHADOW =
  '0px 0px 2px 0px rgba(0,0,0,0.14), 0px 2px 2px 0px rgba(0,0,0,0.12), 0px 1px 3px 0px rgba(0,0,0,0.2)';

function TestimonialCard({ quote, role, image, buttonLabel, href }: Testimonial) {
  return (
    <Paper
      sx={{
        height: '100%',
        p: 2,
        borderRadius: 2,
        boxShadow: CARD_SHADOW,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        component="img"
        src={image}
        alt=""
        sx={{ height: 198, width: '100%', objectFit: 'cover', display: 'block' }}
      />
      {/* flexGrow pushes the role + button to the bottom so cards align across the row */}
      <Typography variant="body1" sx={{ fontWeight: 300, lineHeight: 1.6, flexGrow: 1 }}>
        {quote}
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {role}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        href={href}
        onClick={() =>
          trackEvent({
            category: 'Homepage',
            action: 'Why Researchers Use the HuBMAP Data Portal',
            label: `${buttonLabel} Button`,
          })
        }
      >
        {buttonLabel}
      </Button>
    </Paper>
  );
}

function Testimonials() {
  return (
    <Grid container spacing={1.5}>
      {TESTIMONIALS.map((testimonial) => (
        <Grid key={testimonial.href} size={{ xs: 12, md: 4 }}>
          <TestimonialCard {...testimonial} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Testimonials;
