import React, { AnchorHTMLAttributes, useMemo } from 'react';
import ReactMarkdown, { Options } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
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
  const componentsWithLinks = useMemo(() => {
    const linkComponent = externalLinks ? OutboundMarkdownLink : MarkdownLink;
    return {
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
    <ReactMarkdown rehypePlugins={rehypePluginsWithRaw} components={componentsWithLinks} {...rest}>
      {children}
    </ReactMarkdown>
  );
}
