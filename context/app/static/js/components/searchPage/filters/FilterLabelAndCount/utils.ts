interface TransformLabelTypes {
  label: string;
  labelTransformations: ((label: string) => string)[];
}

export function transformLabel({ label, labelTransformations }: TransformLabelTypes) {
  return labelTransformations.reduce((l, transformFn) => transformFn(l), label);
}
