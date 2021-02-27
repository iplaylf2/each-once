import { TransduceFunction } from "../type";

interface Group<T, K> {
  (x: T): K;
}

export interface GroupByReduce<T, K> {
  reduce(x: T): [true, K] | [false];
  done(): K;
  isDone: boolean;
}

interface GroupByReduceFunction<T, Key, K> {
  (k: Key): GroupByReduce<T, K>;
}

export function groupBy<T, Key, K>(
  f: Group<T, Key>,
  grf: GroupByReduceFunction<T, Key, K>
): TransduceFunction<T, K> {
  return (next) => {
    const groupMap = new Map<Key, GroupByReduce<T, K>>();
    const groupSort: GroupByReduce<T, K>[] = [];
    return [
      (x) => {
        const k = f(x);
        let group = groupMap.get(k);
        if (!group) {
          group = grf(k);
          groupMap.set(k, group);
          groupSort.push(group);
        }

        if (!group.isDone) {
          const [done, result] = group.reduce(x);
          if (done) {
            return next(result!);
          }
        }
        return true;
      },
      () => {
        for (const group of groupSort) {
          if (group.isDone) {
            continue;
          }

          const result = group.done();
          const continue_ = next(result);

          if (!continue_) {
            return false;
          }
        }
        return true;
      },
    ];
  };
}
