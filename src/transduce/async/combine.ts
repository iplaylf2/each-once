import { conj, Conj } from "./conj";
import { AsyncTransduceFunction } from "./type";

type RecurConj<T extends AsyncTransduceFunction<any, any>[]> = [...T] extends [
  infer A,
  ...infer Rest
]
  ? A extends AsyncTransduceFunction<any, any>
    ? Rest extends [infer B, ...infer Rest]
      ? B extends AsyncTransduceFunction<any, any>
        ? Rest extends AsyncTransduceFunction<any, any>[]
          ? RecurConj<[Conj<A, B>, ...Rest]>
          : never
        : never
      : A
    : never
  : never;

export function combine<T extends AsyncTransduceFunction<any, any>[]>(
  ...tfs: [...T]
): RecurConj<T> {
  return tfs.reduce((r, x) => conj(r, x)) as any;
}
