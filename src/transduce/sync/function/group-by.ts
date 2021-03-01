import { TransduceFunction, TransduceHandler } from "../type";

interface Group<T, K> {
  (x: T): K;
}

interface GroupByReduce<T, Key, K> {
  (k: Key): TransduceHandler<T, K>;
}

export function groupBy<T, Key, K>(
  f: Group<T, Key>,
  gr: GroupByReduce<T, Key, K>
): TransduceFunction<T, K> {
  return (next) => {
    const groupMap = new Map<Key, TransduceHandler<T, K>>();
    const groupSort: TransduceHandler<T, K>[] = [];
    return [
      (x) => {
        const k = f(x);
        let group = groupMap.get(k);
        if (!group) {
          group = gr(k);
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
