import { combine, reduce, map } from "each-once";
import { Suite } from "benchmark";

const world = function (arr_size: number) {
  console.log(`测试数组长度为：${arr_size}`);
  const data = new Array(arr_size).fill(0);

  const mf = (x: number) => x;
  const rf = (r: number, x: number) => r + x;

  const tf_ = combine(map(mf), map(mf), map(mf), map(mf), map(mf));
  const reduce_ = reduce(rf, 0, tf_);

  // add tests
  new Suite()
    .add("原生数组", function () {
      data.map(mf).map(mf).map(mf).map(mf).map(mf).reduce(rf, 0);
    })
    .add("each-once", function () {
      const tf = combine(map(mf), map(mf), map(mf), map(mf), map(mf));
      reduce(rf, 0, tf)(data);
    })
    .add("each-once 使用优化", function () {
      reduce_(data);
    })
    // add listeners
    .on("cycle", function (event: any) {
      console.log(String(event.target));
    })
    .on("complete", function (this: any) {
      console.log("Fastest is " + this.filter("fastest").map("name"));
      const base = this[0].hz;
      this.forEach((x: any) => console.log(`x/base x ${x.hz / base}`));
    })
    // run async
    .run({ async: true });
};

world(1000);
