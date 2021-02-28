import { combine, reduce, map } from "each-once";
import { Suite } from "benchmark";

const world = function (map_count: number, arr_size: number) {
  console.log(`Map ${map_count} times, length is ${arr_size}.`);
  const data = new Array(arr_size).fill(0);

  const mf = (x: number) => x + 1;
  const rf = (r: number, x: number) => r + x;

  const tf_ = combine(...new Array(map_count).fill(0).map(() => map(mf)));
  const reduce_ = reduce(rf, 0, tf_);

  // add tests
  new Suite()
    .add("array", function () {
      let d = data;
      for (let i = 0; i !== map_count; i++) {
        d = d.map(mf);
      }
      d.reduce(rf, 0);
    })
    .add("each-once", function () {
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
    .run({ async: false });
};

for (let a = 3; a <= 5; a++) {
  for (let b = 100; b <= 100000; b *= 10) {
    world(a, b);
  }
}
