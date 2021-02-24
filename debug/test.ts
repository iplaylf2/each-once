import { combine, reduce, map } from "each-once";
import { performance } from "perf_hooks";

const world = function (arr_size: number, repeat: number) {
  const data = new Array(arr_size).fill(0);

  const mf = (x: number) => {
    const now = performance.now();
    while (performance.now() - now < 10 / 5 / arr_size);
    return x;
  };
  const rf = (r: number, x: number) => r + x;

  const suit1 = function () {
    data.map(mf).map(mf).map(mf).map(mf).map(mf).reduce(rf, 0);
  };

  const suit2 = function () {
    const tf = combine(map(mf), map(mf), map(mf), map(mf), map(mf));
    reduce(rf, 0)(tf)(data);
  };

  const tf_ = combine(map(mf), map(mf), map(mf), map(mf), map(mf));
  const transduce = reduce(rf, 0)(tf_);
  const suit3 = function () {
    transduce(data);
  };

  let t1 = 0,
    t2 = 0,
    t3 = 0;
  for (let count = 0; count < repeat; count++) {
    let t = 0;
    t = performance.now();
    suit1();
    t1 += performance.now() - t;
    t = performance.now();
    suit2();
    t2 += performance.now() - t;
    t = performance.now();
    suit3();
    t3 += performance.now() - t;
  }

  console.log(t1 / repeat, t2 / repeat, t3 / repeat);
  console.log(1, t2 / t1, t3 / t1);
};

world(10000, 100);
