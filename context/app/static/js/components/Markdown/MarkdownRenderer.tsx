import React, { DetailedReactHTMLElement } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { InternalLink } from 'js/shared-styles/Links';
import { Options } from 'react-markdown';

export default function MarkdownRenderer({
  children,
  rehypePlugins = [],
  components = {},
  ...rest
}: Options) {
  return (
    <ReactMarkdown
      rehypePlugins={[
        rehypeRaw as NonNullable<Options['rehypePlugins']>[number],
        ...(rehypePlugins || []),
      ]}
      components={{
        a: ({ href, children }) => <InternalLink href={href as string}>{children}</InternalLink>,
        ...components,
      }}
      {...rest}
    >
      {children}
    </ReactMarkdown>
  );
}
