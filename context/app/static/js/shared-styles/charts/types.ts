import { TickRendererProps } from '@visx/axis/lib/types';

export type FormattedValue = TickRendererProps['formattedValue'];
export interface TooltipData<Datum> {
  key: FormattedValue;
  bar?: { data: Datum };
}
export function tooltipHasBarData<Datum>(
  tooltipData: TooltipData<Datum>,
): tooltipData is TooltipData<Datum> & { key: string; bar: { data: Datum & Record<string, React.ReactNode> } } {
  if (
    tooltipData.bar &&
    tooltipData.key &&
    tooltipData.bar.data &&
    typeof tooltipData.bar.data === 'object' &&
    tooltipData.key in tooltipData.bar.data
  ) {
    return true;
  }
  return false;
}

export type TooltipComponentType<T> = React.ComponentType<{ tooltipData: TooltipData<T> }>;
