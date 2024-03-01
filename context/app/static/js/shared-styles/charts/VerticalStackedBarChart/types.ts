import { BarGroupBar, SeriesPoint } from '@visx/shape/lib/types';

export type BarstackBar<Datum, YAxisKey> = Omit<BarGroupBar<YAxisKey>, 'key' | 'value'> & {
  bar: SeriesPoint<Datum>;
  key: YAxisKey;
};
