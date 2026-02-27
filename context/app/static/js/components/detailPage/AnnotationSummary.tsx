import React, { Fragment } from 'react';

import { annotationToolLinks, mapPluralObjectType } from 'js/helpers/annotations';
import { Dataset } from 'js/components/types';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

type CalculatedMetadata = Dataset['calculated_metadata'];

function AnnotationToolLink({ tool }: { tool: string }) {
  const href = annotationToolLinks[tool];
  if (href) {
    return <OutboundIconLink href={href}>{tool}</OutboundIconLink>;
  }
  return <>{tool}</>;
}

interface AnnotationSummaryProps {
  calculatedMetadata?: CalculatedMetadata;
}

export default function AnnotationSummary({ calculatedMetadata }: AnnotationSummaryProps) {
  if (!calculatedMetadata) {
    return null;
  }

  const { object_types: objectTypes, annotation_tools: annotationTools } = calculatedMetadata;

  if (!objectTypes?.length || !annotationTools?.length) {
    return null;
  }

  const objectTypeLabels = objectTypes.map(mapPluralObjectType);

  return (
    <LabelledSectionText label="Annotations">
      {objectTypeLabels.join(', ')} annotated by{' '}
      {annotationTools.map((tool, i) => (
        <Fragment key={tool}>
          <AnnotationToolLink tool={tool} />
          {i < annotationTools.length - 1 && ', '}
        </Fragment>
      ))}
    </LabelledSectionText>
  );
}
