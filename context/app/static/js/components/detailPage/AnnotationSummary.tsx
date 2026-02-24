import React, { Fragment } from 'react';

import { OutboundLink } from 'js/shared-styles/Links';
import { mapObjectType, annotationToolLinks } from 'js/helpers/annotations';
import { Dataset } from 'js/components/types';

type CalculatedMetadata = Dataset['calculated_metadata'];

function AnnotationToolLink({ tool }: { tool: string }) {
  const href = annotationToolLinks[tool];
  if (href) {
    return <OutboundLink href={href}>{tool}</OutboundLink>;
  }
  return <>{tool}</>;
}

export default function AnnotationSummary({ calculatedMetadata }: { calculatedMetadata?: CalculatedMetadata }) {
  const objectTypes = calculatedMetadata?.object_types;
  const annotationTools = calculatedMetadata?.annotation_tools;

  if (!objectTypes?.length || !annotationTools?.length) {
    return null;
  }

  const objectTypeLabels = objectTypes.map(mapObjectType);

  return (
    <>
      {objectTypeLabels.join(', ')} annotated by{' '}
      {annotationTools.map((tool, i) => (
        <Fragment key={tool}>
          <AnnotationToolLink tool={tool} />
          {i < annotationTools.length - 1 && ', '}
        </Fragment>
      ))}
    </>
  );
}
