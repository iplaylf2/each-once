import { TransduceFunction, TransduceHandler } from "../type";
import { OR } from "./tool";

interface Action<T> {
  (x: T): void;
}

export function foreach<T, K>(
  f: Action<OR<K, T>>,
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, void> {
  let transduce: any = (x: any) => (f(x), true),
    dispose: any;
  if (tf) {
    [transduce, dispose] = tf(transduce);
  }

  return {
    reduce(x) {
      const continue_ = transduce(x);
      if (continue_) {
        return [false];
      } else {
        dispose?.(false);

        return [true] as any;
      }
    },
    done() {
      dispose?.(true);
      return;
    },
  };
}
