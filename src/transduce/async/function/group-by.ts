import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";

interface Group<T, K> {
  (x: T): K | Promise<K>;
}

interface GroupByReduce<T, Key, K> {
  (k: Key): AsyncTransduceHandler<T, K>;
}

export function groupBy<T, Key, K>(
  f: Group<T, Key>,
  gr: GroupByReduce<T, Key, K>
): AsyncTransduceFunction<T, K> {
  return (next) => {
    const groupMap = new Map<
      Key,
      { isDone: boolean; handler?: AsyncTransduceHandler<T, K> }
    >();
    const groupSort: any[] = [];
    return [
      async (x) => {
        const k = await f(x);
        let group = groupMap.get(k);
        if (!group) {
          group = { isDone: false, handler: gr(k) };
          groupMap.set(k, group);
          groupSort.push(group);
        }

        if (!group.isDone) {
          const [done, result] = await group.handler!.reduce(x);
          if (done) {
            group.isDone = true;
            group.handler = null!;
            return next(result!);
          }
        }
        return true;
      },
      async (continue_) => {
        if (!continue_) {
          return false;
        }

        for (const group of groupSort) {
          if (group.isDone) {
            continue;
          }

          const result = await group.handler.done();
          group.isDone = true;
          group.handler = null;
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
