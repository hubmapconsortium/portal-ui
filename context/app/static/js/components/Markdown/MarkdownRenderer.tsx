import React, { AnchorHTMLAttributes } from 'react';
import ReactMarkdown, { Options } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { InternalLink } from 'js/shared-styles/Links';

function MarkdownLink({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <InternalLink href={href} {...rest}>
      {children}
    </InternalLink>
  );
}

export default function MarkdownRenderer({ children, rehypePlugins = [], components = {}, ...rest }: Options) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw as NonNullable<Options['rehypePlugins']>[number], ...(rehypePlugins ?? [])]}
      components={{
        a: MarkdownLink,
        ...components,
      }}
      {...rest}
    >
      {children}
    </ReactMarkdown>
  );
}
