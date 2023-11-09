import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { InternalLink } from 'js/shared-styles/Links';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';

export default function MarkdownRenderer({
  children,
  rehypePlugins = [],
  components = {},
  ...rest
}: ReactMarkdownOptions) {
  return (
    <ReactMarkdown
      rehypePlugins={[
        rehypeRaw as NonNullable<ReactMarkdownOptions['rehypePlugins']>[number],
        ...(rehypePlugins || []),
      ]}
      components={{
        a: InternalLink,
        ...components,
      }}
      {...rest}
    >
      {children}
    </ReactMarkdown>
  );
}
