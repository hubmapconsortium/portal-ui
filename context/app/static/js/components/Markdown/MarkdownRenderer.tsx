import React, { AnchorHTMLAttributes, useMemo } from 'react';
import ReactMarkdown, { Options } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { InternalLink, OutboundLink } from 'js/shared-styles/Links';

function MarkdownLink({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <InternalLink href={href} {...rest}>
      {children}
    </InternalLink>
  );
}

function OutboundMarkdownLink({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <OutboundLink href={href} {...rest}>
      {children}
    </OutboundLink>
  );
}

// Element overrides applied to every markdown render. Defined here (rather
// than via descendant CSS on a wrapping container) so the per-element
// styles are deterministic regardless of the cascade -- the earlier
// approach of relying on `& h1 { ... }` inside the parent's styled() block
// stopped applying after the React 19 / MUI v7 / Vite migration and the
// CHANGELOG page lost its custom heading sizes + list spacing.
const baseHeadingSx = { mt: 3, mb: 1.5, fontWeight: 300 } as const;
const baseListSx = { pl: 4, my: 1, '& li': { listStyle: 'square' } } as const;

const baseComponents: NonNullable<Options['components']> = {
  h1: ({ children }) => (
    <Typography variant="h1" component="h1" sx={{ ...baseHeadingSx, fontSize: '2.3rem', lineHeight: 1.2 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography variant="h2" component="h2" sx={{ ...baseHeadingSx, fontSize: '2rem', lineHeight: 1.167 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant="h3" component="h3" sx={{ ...baseHeadingSx, fontSize: '1.6rem', lineHeight: 1.235 }}>
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography variant="h4" component="h4" sx={{ ...baseHeadingSx, fontSize: '1.3rem', lineHeight: 1.334 }}>
      {children}
    </Typography>
  ),
  h5: ({ children }) => (
    <Typography variant="h5" component="h5" sx={{ ...baseHeadingSx, fontSize: '1rem', lineHeight: 1.6 }}>
      {children}
    </Typography>
  ),
  h6: ({ children }) => (
    <Typography variant="h6" component="h6" sx={{ ...baseHeadingSx, fontSize: '0.9rem', lineHeight: 1.6 }}>
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography variant="body1" component="p" sx={{ my: 1 }}>
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <Box component="ul" sx={baseListSx}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" sx={{ ...baseListSx, '& li': { listStyle: 'decimal' } }}>
      {children}
    </Box>
  ),
  li: ({ children }) => <li>{children}</li>,
  blockquote: ({ children }) => (
    <Box component="blockquote" sx={{ borderLeft: '4px solid grey', ml: 0, pl: 2, my: 2 }}>
      {children}
    </Box>
  ),
  img: ({ src, alt }) => <Box component="img" src={src} alt={alt} sx={{ maxWidth: '100%' }} />,
  // Defer off-screen iframes so a focus-trapping embed can't scroll the page
  // to itself on load (e.g. publication vignette embeds). Author-set `loading`
  // wins. ponytail: loading="lazy" handles the below-the-fold case; add a
  // scroll-restore wrapper only if an above-the-fold embed still jumps.
  // eslint-disable-next-line jsx-a11y/iframe-has-title
  iframe: (props) => <iframe loading="lazy" {...props} />,
  table: ({ children }) => (
    <Box
      component="table"
      sx={{
        borderSpacing: 0,
        borderCollapse: 'collapse',
        overflow: 'auto',
        display: 'block',
        my: 2,
      }}
    >
      {children}
    </Box>
  ),
  th: ({ children }) => (
    <Box component="th" sx={{ border: '1px solid grey', padding: '0.25em 0.5em' }}>
      {children}
    </Box>
  ),
  td: ({ children }) => (
    <Box component="td" sx={{ border: '1px solid grey', padding: '0.25em 0.5em' }}>
      {children}
    </Box>
  ),
  details: ({ children }) => (
    <Box component="details" sx={{ ml: '2em', '& summary': { ml: '-2em' } }}>
      {children}
    </Box>
  ),
};

interface MarkdownRendererProps extends Options {
  externalLinks?: boolean;
}

export default function MarkdownRenderer({
  children,
  rehypePlugins = [],
  components = {},
  externalLinks = false,
  ...rest
}: MarkdownRendererProps) {
  const componentsMerged = useMemo(() => {
    const linkComponent = externalLinks ? OutboundMarkdownLink : MarkdownLink;
    return {
      ...baseComponents,
      a: linkComponent,
      ...components,
    };
  }, [components, externalLinks]);

  const rehypePluginsWithRaw = useMemo(() => {
    if (rehypePlugins?.some((plugin) => plugin === rehypeRaw)) {
      return rehypePlugins;
    }
    return [rehypeRaw as NonNullable<Options['rehypePlugins']>[number], ...(rehypePlugins ?? [])];
  }, [rehypePlugins]);

  return (
    <ReactMarkdown rehypePlugins={rehypePluginsWithRaw} components={componentsMerged} {...rest}>
      {children}
    </ReactMarkdown>
  );
}
