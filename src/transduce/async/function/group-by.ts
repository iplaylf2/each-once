import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";

interface Group<T, K> {
  (x: T): K | Promise<K>;
}

interface GroupByReduce<T, Key, K> {
  (k: Key): AsyncTransduceHandler<T, K>;
}

export function groupBy<T, Key, K>(
  f: Group<T, Key>,
  grf: GroupByReduce<T, Key, K>
): AsyncTransduceFunction<T, K> {
  return (next) => {
    const groupMap = new Map<Key, AsyncTransduceHandler<T, K>>();
    const groupSort: AsyncTransduceHandler<T, K>[] = [];
    return [
      async (x) => {
        const k = await f(x);
        let group = groupMap.get(k);
        if (!group) {
          group = grf(k);
          groupMap.set(k, group);
          groupSort.push(group);
        }

        if (!group.isDone) {
          const [done, result] = await group.reduce(x);
          if (done) {
            return next(result!);
          }
        }
        return true;
      },
      async () => {
        for (const group of groupSort) {
          if (group.isDone) {
            continue;
          }

          const result = await group.done();
          const continue_ = await next(result);

          if (!continue_) {
            return false;
          }
        }
        return true;
      },
    ];
  };
}
