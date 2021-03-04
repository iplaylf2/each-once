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
    const group_map = new Map<
      Key,
      { isDone: boolean; handler?: TransduceHandler<T, K> }
    >();
    const group_sort: any[] = [];
    return [
      (x) => {
        const k = f(x);
        let group = group_map.get(k);
        if (!group) {
          group = { isDone: false, handler: gr(k) };
          group_map.set(k, group);
          group_sort.push(group);
        }

        if (!group.isDone) {
          const [done, result] = group.handler!.reduce(x);
          if (done) {
            group.isDone = true;
            group.handler = null!;
            return next(result!);
          }
        }
        return true;
      },
      (continue_) => {
        if (!continue_) {
          return false;
        }

        for (const group of group_sort) {
          if (group.isDone) {
            continue;
          }

          const result = group.handler.done();
          group.isDone = true;
          group.handler = null;
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
