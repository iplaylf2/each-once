# each-once 

For each item in collection once.

## feature

- Easy to use.
- Data structure is basic.
- Efficient.

## install

``` bash
npm install each-once
```

## usage

``` typescript
import { combine, map, filter, take, reduce } from "each-once";

const tf = combine(
  map((x: number) => x * 2),
  filter((x: number) => x % 4 === 0),
  take<number>(10)
);

const transduce = reduce((r, x) => r + x, 0, tf);

const s = function* () {
  let x = 0;
  while (true) {
    yield x++;
  }
};

const result = transduce(s()); // transduce([0, 1, 2...])

console.log(result); // 180

```

## benchmark

each-once is more efficient than native array method when do a series of operation to the collection.

[codesandbox](https://codesandbox.io/s/benchmark-jpxfi)